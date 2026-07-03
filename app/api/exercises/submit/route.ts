import { connectDB } from '@/lib/db'
import Exercise from '@/lib/models/Exercise'
import { getCurrentUser } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import vm from 'node:vm'
import * as Babel from '@babel/standalone'
import * as React from 'react'

interface TestCase {
  input: string
  expectedOutput: string
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    const exerciseId = body?.exerciseId
    const answer = body?.answer

    if (!exerciseId || answer === undefined || answer === null) {
      return NextResponse.json({ error: 'exerciseId and answer are required' }, { status: 400 })
    }

    await connectDB()
    const exercise = await Exercise.findById(exerciseId).lean<any>()

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
    }

    let score = 0
    let isCorrect = false
    let feedback = ''
    let results: Array<{ passed: boolean; message: string }> = []

    if (exercise.content.type === 'multiple-choice') {
      const selectedIndex = Number(answer)
      isCorrect = Number.isInteger(selectedIndex) && selectedIndex === exercise.content.correctAnswerIndex
      score = isCorrect ? 100 : 0
      feedback = isCorrect ? 'Correct answer!' : exercise.content.explanation
    } else if (exercise.content.type === 'code-challenge') {
      const testCases: TestCase[] = exercise.content.testCases || []
      const result = await runCodeChallenge(answer, testCases)

      isCorrect = result.total > 0 && result.passed === result.total
      score = result.total > 0 ? Math.round((result.passed / result.total) * 100) : 0
      feedback = result.summary
      results = result.results
    } else {
      return NextResponse.json({ error: 'Unsupported exercise type' }, { status: 400 })
    }

    return NextResponse.json({
      isCorrect,
      score,
      feedback,
      results,
    })
  } catch (error) {
    console.error('[v0] Exercise submission error:', error)
    return NextResponse.json({ error: 'Failed to submit exercise' }, { status: 500 })
  }
}

/**
 * Transpiles JSX/imports down to plain JS the `vm` module can execute.
 *
 * Strips top-level `import ... from '...'` statements before handing off
 * to Babel — vm.Script runs in a plain script (non-module) context, so ES
 * module syntax throws a SyntaxError otherwise. Anything a solution would
 * plausibly import (react, hooks, a CSS module) is already provided as a
 * sandbox global (see buildSandbox), so stripping the import line is safe:
 * the imported name still resolves, just via the global instead.
 */
function transpile(code: string): string {
  const withoutImports = code.replace(/^\s*import\s+.*?from\s+['"].*?['"];?\s*$/gm, '')

  const output = Babel.transform(withoutImports, {
    presets: [['react', { runtime: 'classic' }]],
    filename: 'challenge.jsx',
  }).code

  return output || ''
}

/**
 * Transpiles a TEST EXPRESSION (which may contain a bare `return`, e.g.
 * from buildCallExpression) by wrapping it in an async IIFE *before*
 * handing it to Babel. Babel's parser rejects a top-level `return` — it's
 * only legal inside a function — so the wrapping must happen before
 * transformation, not after. The returned string is a complete,
 * ready-to-run async IIFE; do not wrap it again.
 */
function transpileExpression(code: string): string {
  const wrapped = `(async () => {\n${code}\n})()`
  return transpile(wrapped)
}

/**
 * Builds the executable body for a test case's `input`.
 *
 * Three shapes are supported:
 *   1. A single call/JSX expression, e.g. "solution(2, 3)" or "<solution />".
 *   2. A bare JSON value/array of args, e.g. "5" or "[2, 3]" -> solution(5) / solution(2, 3).
 *   3. Multiple `;`-separated statements, e.g. "const c = solution(); c(); c()".
 *      The final segment is treated as the return value unless it already
 *      starts with return/throw — this lets multi-step setup (closures,
 *      repeated calls) work without every test author having to write an
 *      explicit `return`.
 */
function buildCallExpression(input: string): string {
  const trimmed = (input ?? '').trim()

  if (!trimmed) return 'return (solution())'

  // Multi-statement input: contains a `;` before the very end.
  const withoutTrailingSemicolon = trimmed.replace(/;\s*$/, '')
  if (withoutTrailingSemicolon.includes(';')) {
    const segments = withoutTrailingSemicolon
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)

    if (segments.length > 1) {
      const last = segments.pop() as string
      const finalSegment = /^\s*(return|throw)\b/.test(last) ? last : `return (${last})`
      return `${segments.join(';\n')};\n${finalSegment};`
    }
  }

  if (/\bsolution\b/.test(trimmed)) return `return (${trimmed})`

  try {
    const parsed = JSON.parse(trimmed)
    const args = Array.isArray(parsed) ? parsed : [parsed]
    return `return (solution(${args.map((a) => JSON.stringify(a)).join(', ')}))`
  } catch {
    return `return (solution(${JSON.stringify(trimmed)}))`
  }
}

/**
 * Default globals available to every submitted solution and every test
 * case expression, beyond React itself. These cover the common patterns
 * seeded exercises rely on (DOM-ish mocks, fetch, CSS module imports,
 * placeholder child components) without needing a real browser/jsdom.
 *
 * `logs` is a shared array that console.log pushes onto instead of
 * discarding — see runCodeChallenge's console-capture fallback below.
 */
function buildSandbox(logs: string[]) {
  const stubComponent = (label: string) => () => React.createElement('div', null, label)

  return {
    console: {
      log: (...args: any[]) => {
        logs.push(args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '))
      },
      error: () => {},
      warn: () => {},
      info: () => {},
    },
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    Promise,

    React,
    Fragment: React.Fragment,
    useState: React.useState,
    useEffect: React.useEffect,
    useContext: React.useContext,
    useRef: React.useRef,
    useReducer: React.useReducer,
    useMemo: React.useMemo,
    useCallback: React.useCallback,
    createContext: React.createContext,

    // A minimal, generic DOM-node mock: enough for tests that read an id
    // off a queried element, or set/read simple properties.
    mockDoc: {
      querySelector: (selector: string) => ({
        id: selector.replace(/^#/, ''),
        className: selector.replace(/^\./, ''),
      }),
    },
    el: (() => {
      const node: Record<string, any> = { textContent: '' }
      return node
    })(),

    // A mutable counter object for tests that mutate shared state.
    counter: { value: 0 },

    // A default `fetch` mock (used both as a bare global and as an
    // injectable `mockFetch` argument), returning a fixed JSON payload.
    fetch: async () => ({ json: async () => [{ id: 1, name: 'Al' }] }),
    mockFetch: async () => ({ json: async () => ({ data: 'ok' }) }),

    // Identity-style callback: if a solution calls cb(value), the sandbox
    // records it so callback-based (non-returning) solutions can still be
    // asserted on via `logs` or by wrapping the call in a Promise in the
    // test's own input (e.g. `new Promise(resolve => solution(resolve))`).
    cb: (value: any) => {
      logs.push(typeof value === 'string' ? value : JSON.stringify(value))
      return value
    },

    // CSS Modules import stub: any property access returns the property
    // name itself, e.g. styles.title -> "title" — good enough to assert a
    // class name was applied without a real bundler.
    styles: new Proxy({}, { get: (_target, prop) => String(prop) }),

    // Placeholder components commonly referenced by composition exercises.
    Header: stubComponent('Header'),
    Footer: stubComponent('Footer'),
    Home: stubComponent('Home'),
    About: stubComponent('About'),
    ThrowingChild: () => {
      throw new Error('Simulated error')
    },
  }
}

/**
 * Runs the user's submitted code against each test case in a sandboxed VM
 * context with a timeout, and compares actual vs expected output.
 */
async function runCodeChallenge(userCode: string, testCases: TestCase[]) {
  if (!userCode || !userCode.trim()) {
    return {
      passed: 0,
      total: testCases.length,
      summary: 'No code submitted.',
      results: testCases.map((tc) => ({
        passed: false,
        message: `Input: ${tc.input} → Expected: ${tc.expectedOutput}`,
      })),
    }
  }

  const logs: string[] = []
  const sandbox: Record<string, any> = buildSandbox(logs)
  const context = vm.createContext(sandbox)

  let transpiledUserCode: string
  try {
    transpiledUserCode = transpile(userCode)
  } catch (err: any) {
    const message = `Your code has a syntax error: ${err.message}`
    return {
      passed: 0,
      total: testCases.length,
      summary: message,
      results: testCases.map((tc) => ({
        passed: false,
        message: `Input: ${tc.input} → Error: ${err.message}`,
      })),
    }
  }

  // Step 1: compile & run the user's (transpiled) code once to define `solution`.
  try {
    new vm.Script(transpiledUserCode, { filename: 'user-code.js' }).runInContext(context, { timeout: 1000 })
  } catch (err: any) {
    const message = `Your code failed to run: ${err.message}`
    return {
      passed: 0,
      total: testCases.length,
      summary: message,
      results: testCases.map((tc) => ({
        passed: false,
        message: `Input: ${tc.input} → Error: ${err.message}`,
      })),
    }
  }

  let solutionExists = false
  try {
    new vm.Script('__solution_type__ = typeof solution', { filename: 'check-solution.js' }).runInContext(context, {
      timeout: 1000,
    })
    solutionExists = sandbox.__solution_type__ === 'function' || sandbox.__solution_type__ === 'object'
  } catch {
    solutionExists = false
  }

  if (!solutionExists) {
    const message =
      'No "solution" was found. Define it as `function solution(...) { ... }`, `const solution = (...) => { ... }`, or `class solution extends React.Component { ... }`.'
    return {
      passed: 0,
      total: testCases.length,
      summary: message,
      results: testCases.map((tc) => ({
        passed: false,
        message: `Input: ${tc.input} → Error: solution is not defined`,
      })),
    }
  }

  // JSX treats a lowercase-starting tag name as a literal HTML tag rather
  // than a component reference — alias `solution` to a capitalized
  // identifier so JSX like <solution /> resolves as the actual component.
  sandbox.Solution = sandbox.solution

  const results: Array<{ passed: boolean; message: string }> = []
  let passed = 0

  for (const testCase of testCases) {
    // Each test case gets a fresh log buffer so one test's console output
    // can't leak into another's comparison.
    logs.length = 0

    try {
      const rawExpression = buildCallExpression(testCase.input)
      const jsxSafeExpression = rawExpression.replace(/<(\/?)solution\b/g, '<$1Solution')
      const transpiledExpression = transpileExpression(jsxSafeExpression).trim()

      const script = new vm.Script(transpiledExpression, {
        filename: 'test-case.js',
      })

      const rawResult = await Promise.race([
        script.runInContext(context, { timeout: 1000 }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Test execution timed out')), 1500)),
      ])

      // If the expression itself returned nothing (undefined/null) but the
      // solution logged something via console.log, fall back to the most
      // recent log entry — covers callback/side-effect style solutions
      // that communicate their result by logging rather than returning.
      const effectiveRaw = rawResult === undefined || rawResult === null
        ? (logs.length > 0 ? logs[logs.length - 1] : rawResult)
        : rawResult

      const actual = await normalizeResult(effectiveRaw)
      const expected = normalize(testCase.expectedOutput)
      let casePassed = actual === expected

      // Fallback: if the exact string match failed, evaluate expectedOutput
      // itself as a live JS expression in the SAME context (so it can see
      // any state `input` already mutated, e.g. a shared `counter` object).
      // This accepts two authoring styles beyond plain value equality:
      //   - Assertion style: "counter.value === 1" -> must evaluate to
      //     strictly `true` to pass (never accepted just for being truthy,
      //     so an accidental non-boolean expression can't false-pass).
      //   - Loose literal style: "{ textContent: 'Hi' }" (a real JS object
      //     literal, not strict JSON) -> evaluated, then compared via the
      //     same normalize() used for the actual result, so unquoted keys
      //     or single quotes don't cause spurious mismatches.
      if (!casePassed) {
        try {
          const expectedExpr = transpileExpression(`return (${testCase.expectedOutput})`).trim()
          const expectedScript = new vm.Script(expectedExpr, { filename: 'expected-fallback.js' })
          const expectedRawValue = await expectedScript.runInContext(context, { timeout: 1000 })

          if (expectedRawValue === true) {
            casePassed = true
          } else {
            const expectedAsValue = normalize(expectedRawValue)
            if (expectedAsValue === actual) casePassed = true
          }
        } catch {
          // expectedOutput isn't valid/evaluable JS (e.g. it's genuinely
          // just a plain string like "success") — that's fine, it just
          // means the fallback doesn't apply and the original comparison
          // result stands.
        }
      }

      if (casePassed) passed++

      results.push({
        passed: casePassed,
        message: casePassed
          ? `Input: ${testCase.input} → Output: ${actual} ✓`
          : `Input: ${testCase.input} → Expected: ${expected}, Got: ${actual}`,
      })
    } catch (err: any) {
      // Classes can't be called as plain functions — retry as a React
      // component render instead of failing outright.
      if (/class constructor.*cannot be invoked without ['"]new['"]/i.test(err.message)) {
        try {
          const retryResult = await retryAsComponent(testCase, sandbox, context)
          results.push(retryResult)
          if (retryResult.passed) passed++
          continue
        } catch {
          // fall through to normal error reporting below
        }
      }

      results.push({
        passed: false,
        message: `Input: ${testCase.input} → Error: ${err.message}`,
      })
    }
  }

  const total = testCases.length
  const summary =
    total === 0
      ? 'No test cases configured for this challenge.'
      : passed === total
        ? 'All test cases passed! 🎉'
        : `${passed}/${total} test case(s) passed.`

  return { passed, total, summary, results }
}

/** Retries a test case by rendering `solution` as a JSX component rather than calling it as a function. */
async function retryAsComponent(
  testCase: TestCase,
  sandbox: Record<string, any>,
  context: vm.Context
): Promise<{ passed: boolean; message: string }> {
  const jsxInput = /<solution/.test(testCase.input) ? testCase.input : '<solution />'
  const jsxSafeExpression = jsxInput.replace(/<(\/?)solution\b/g, '<$1Solution')
  const transpiledExpression = transpileExpression(`return (${jsxSafeExpression})`).trim()

  const script = new vm.Script(transpiledExpression, { filename: 'retry-component.js' })
  const rawResult = await script.runInContext(context, { timeout: 1000 })

  const actual = await normalizeResult(rawResult)
  const expected = normalize(testCase.expectedOutput)
  const casePassed = actual === expected

  return {
    passed: casePassed,
    message: casePassed
      ? `Input: ${testCase.input} → Output: ${actual} ✓`
      : `Input: ${testCase.input} → Expected: ${expected}, Got: ${actual}`,
  }
}

/**
 * If the result is a React element, render it to static HTML for
 * comparison against an expected HTML string. Otherwise falls back to
 * plain value normalization.
 */
async function normalizeResult(value: unknown): Promise<string> {
  if (React.isValidElement(value)) {
    try {
      const ReactDOMServer = await import('react-dom/server')
      return ReactDOMServer.renderToStaticMarkup(value as any)
    } catch (err: any) {
      return `[render error: ${err.message}]`
    }
  }
  return normalize(value)
}

/** Normalizes values for comparison so 42 (number) === "42" (string), etc. */
function normalize(value: unknown): string {
  if (value === undefined || value === null) return String(value)
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value).trim()
}