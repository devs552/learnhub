import { connectDB } from '@/lib/db'
import Course from '@/lib/models/Course'
import Exercise from '@/lib/models/Exercise'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    // Clear existing data
    await Course.deleteMany({})
    await Exercise.deleteMany({})

    // ---------------------------------------------------------------------
    // COURSE DATA (20 lessons each)
    // ---------------------------------------------------------------------
    const coursesData = [
      {
        title: 'HTML Basics',
        description: 'Learn the fundamentals of HTML and create your first web pages',
        icon: '📝',
        level: 'beginner',
        lessons: [
          {
            title: 'Introduction to HTML',
            description: 'What is HTML and why do we use it?',
            content: `HTML (HyperText Markup Language) is the standard markup language for creating web pages.

Key Points:
- HTML is not a programming language, it's a markup language
- HTML uses tags to describe content
- Tags are enclosed in angle brackets < >
- Most tags have opening and closing parts

Example:
<div>
  <h1>Hello World</h1>
  <p>This is a paragraph</p>
</div>

The above code creates a heading and a paragraph inside a container.`,
            order: 1,
          },
          {
            title: 'HTML Document Structure',
            description: 'The skeleton every HTML page needs',
            content: `Every HTML document follows a basic structure:

<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <h1>Content goes here</h1>
  </body>
</html>

- <!DOCTYPE html>: Tells the browser this is HTML5
- <html>: Root element of the page
- <head>: Metadata, title, links to CSS/JS (not visible on page)
- <body>: All visible content lives here

Browsers read this structure top to bottom to render your page.`,
            order: 2,
          },
          {
            title: 'HTML Tags and Elements',
            description: 'Understand tags, elements, and attributes',
            content: `HTML Tags are the building blocks of HTML. They tell the browser how to display content.

Common Tags:
- <h1> to <h6>: Headings (h1 is the largest)
- <p>: Paragraph
- <div>: Container/Division
- <span>: Inline container
- <a>: Anchor/Link
- <img>: Image
- <ul>/<ol>: Unordered/Ordered lists
- <li>: List item

An element is a tag plus its content: <p>Hello</p> is a paragraph element.`,
            order: 3,
          },
          {
            title: 'Headings and Paragraphs',
            description: 'Structuring text content correctly',
            content: `Headings create hierarchy in your content.

<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>

Rules:
- Use only one <h1> per page (the main title)
- Don't skip heading levels for styling reasons
- Use <p> for paragraphs of text

<p>This is a paragraph of text. Browsers automatically add space above and below paragraphs.</p>

Good heading structure helps both readers and search engines understand your page.`,
            order: 4,
          },
          {
            title: 'Text Formatting Tags',
            description: 'Emphasize and format inline text',
            content: `HTML provides tags to format text inline.

- <strong>: Important text (bold)
- <em>: Emphasized text (italic)
- <b>: Bold (visual only)
- <i>: Italic (visual only)
- <mark>: Highlighted text
- <small>: Smaller text
- <br>: Line break
- <hr>: Horizontal rule

Example:
<p>This is <strong>very important</strong> and this is <em>emphasized</em>.</p>

Prefer <strong> and <em> over <b> and <i> since they carry semantic meaning.`,
            order: 5,
          },
          {
            title: 'Links and Anchors',
            description: 'Connecting pages with the anchor tag',
            content: `The <a> tag creates hyperlinks.

<a href="https://example.com">Visit Example</a>
<a href="/about">About Us</a>
<a href="#section2">Jump to Section 2</a>
<a href="mailto:hello@site.com">Email Us</a>

Useful attributes:
- href: Destination URL
- target="_blank": Opens in new tab
- rel="noopener noreferrer": Security best practice with target="_blank"

Example:
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Open in new tab</a>`,
            order: 6,
          },
          {
            title: 'Images and Alt Text',
            description: 'Adding and describing images',
            content: `The <img> tag embeds images. It is a self-closing (void) element.

<img src="photo.jpg" alt="A sunset over the ocean" width="400" height="300">

Attributes:
- src: Path to the image file
- alt: Text description (crucial for accessibility and SEO)
- width/height: Reserve space to avoid layout shift

Always write meaningful alt text. Screen readers announce it, and it displays if the image fails to load.`,
            order: 7,
          },
          {
            title: 'Lists: Ordered and Unordered',
            description: 'Grouping related items',
            content: `Unordered List (bullets):
<ul>
  <li>Apples</li>
  <li>Bananas</li>
</ul>

Ordered List (numbers):
<ol>
  <li>Step one</li>
  <li>Step two</li>
</ol>

Nested Lists:
<ul>
  <li>Fruits
    <ul>
      <li>Apple</li>
      <li>Banana</li>
    </ul>
  </li>
</ul>

Lists are great for menus, steps, and any grouped content.`,
            order: 8,
          },
          {
            title: 'Tables',
            description: 'Displaying tabular data',
            content: `Tables organize data into rows and columns.

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>25</td>
    </tr>
  </tbody>
</table>

- <table>: Wraps the whole table
- <tr>: Table row
- <th>: Header cell
- <td>: Data cell

Use tables for actual tabular data, not page layout.`,
            order: 9,
          },
          {
            title: 'Forms Basics',
            description: 'Collecting user input',
            content: `Forms let users submit data to a server.

<form action="/submit" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name">
  <button type="submit">Submit</button>
</form>

- action: Where the data is sent
- method: GET or POST
- <label for="..."> links to the input's id for accessibility

Always pair inputs with labels so users (and screen readers) know what to enter.`,
            order: 10,
          },
          {
            title: 'Form Input Types',
            description: 'Different ways to collect data',
            content: `HTML5 provides many input types:

<input type="text">
<input type="email">
<input type="password">
<input type="number">
<input type="checkbox">
<input type="radio">
<input type="date">
<input type="file">
<textarea></textarea>
<select>
  <option value="1">Option 1</option>
</select>

Using the right type gives built-in validation and better mobile keyboards (e.g. type="email" shows an @ key).`,
            order: 11,
          },
          {
            title: 'Semantic HTML',
            description: 'Write meaningful and accessible HTML',
            content: `Semantic HTML means using the right tags for the right purpose.

Semantic Tags:
- <header>: Header/Top section
- <nav>: Navigation
- <main>: Main content
- <article>: Independent article
- <section>: Section of content
- <aside>: Sidebar/supplementary content
- <footer>: Footer

Why Semantic HTML?
1. Better for SEO
2. More accessible for screen readers
3. Easier to maintain
4. Helps organize code logically`,
            order: 12,
          },
          {
            title: 'Div and Span',
            description: 'Generic containers for grouping content',
            content: `<div> and <span> have no semantic meaning by themselves — they're generic containers.

<div>: Block-level container, used to group larger sections
<span>: Inline container, used to wrap small pieces of text

Example:
<div class="card">
  <p>Price: <span class="highlight">$20</span></p>
</div>

Use semantic tags (header, section, article) when a meaning exists; fall back to div/span when it doesn't.`,
            order: 13,
          },
          {
            title: 'HTML Attributes',
            description: 'Adding extra information to elements',
            content: `Attributes provide additional information about elements and always go in the opening tag.

<a href="https://example.com">Click here</a>
<img src="image.jpg" alt="Description">
<input type="text" placeholder="Enter name" disabled>

Global attributes work on almost any element:
- id: Unique identifier
- class: For CSS/JS targeting
- style: Inline CSS
- data-*: Custom data attributes

Example: <div data-user-id="42" class="profile"></div>`,
            order: 14,
          },
          {
            title: 'Comments in HTML',
            description: 'Leaving notes in your code',
            content: `Comments are not rendered by the browser and help document your code.

<!-- This is a comment -->
<p>Visible text</p>
<!-- 
  Multi-line
  comment
-->

Use comments to:
- Explain complex sections
- Temporarily disable code while testing
- Leave TODO notes for yourself or teammates

Keep comments relevant — outdated comments can be more confusing than none at all.`,
            order: 15,
          },
          {
            title: 'Audio and Video Elements',
            description: 'Embedding media natively',
            content: `HTML5 supports native audio and video without plugins.

<video controls width="400">
  <source src="movie.mp4" type="video/mp4">
  Your browser does not support video.
</video>

<audio controls>
  <source src="song.mp3" type="audio/mpeg">
</audio>

Attributes:
- controls: Shows play/pause UI
- autoplay, loop, muted: Playback behavior
- Multiple <source> tags allow fallback formats.`,
            order: 16,
          },
          {
            title: 'Iframes',
            description: 'Embedding external content',
            content: `<iframe> embeds another HTML page inside the current page.

<iframe 
  src="https://example.com" 
  width="600" 
  height="400" 
  title="Embedded content">
</iframe>

Common uses:
- Embedding YouTube videos or maps
- Sandboxing third-party widgets

Security note: only embed trusted sources, and use the sandbox attribute to restrict permissions when needed.`,
            order: 17,
          },
          {
            title: 'HTML5 New Elements',
            description: 'Modern elements introduced in HTML5',
            content: `HTML5 added many elements beyond the semantic tags:

- <figure> / <figcaption>: Image with a caption
- <progress>: Progress bar
- <meter>: Gauge within a range
- <details> / <summary>: Collapsible content
- <time>: Machine-readable dates

Example:
<details>
  <summary>Click to expand</summary>
  <p>Hidden content revealed here.</p>
</details>

These reduce the need for custom JavaScript widgets.`,
            order: 18,
          },
          {
            title: 'Meta Tags and SEO Basics',
            description: 'Helping search engines and browsers understand your page',
            content: `Meta tags live in the <head> and provide metadata.

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="A short summary of the page">
<title>My Page Title</title>

- charset: Character encoding (always UTF-8)
- viewport: Makes pages responsive on mobile
- description: Shown in search engine results

Good meta tags improve accessibility, SEO, and how your page previews when shared.`,
            order: 19,
          },
          {
            title: 'Accessibility in HTML',
            description: 'Building pages usable by everyone',
            content: `Accessibility (a11y) ensures your site works for people using assistive technology.

Best practices:
- Use semantic tags instead of divs for everything
- Always provide alt text for images
- Use labels for form inputs
- Ensure sufficient color contrast
- Use ARIA attributes only when native HTML can't do the job

Example:
<button aria-label="Close menu">✕</button>

Accessible HTML is better HTML — it also improves SEO and usability for all users.`,
            order: 20,
          },
        ],
      },
      {
        title: 'CSS Styling',
        description: 'Master CSS to style your HTML pages beautifully',
        icon: '🎨',
        level: 'beginner',
        lessons: [
          {
            title: 'CSS Basics and Syntax',
            description: 'Introduction to Cascading Style Sheets',
            content: `CSS (Cascading Style Sheets) is used to style and layout web pages.

CSS Syntax:
selector { property: value; }

Example:
p { color: blue; font-size: 16px; }

This selects all <p> elements and makes text blue with a 16px font size.

Common Properties:
- color: Text color
- background-color: Background color
- font-size: Size of text
- padding / margin: Spacing`,
            order: 1,
          },
          {
            title: 'Including CSS in HTML',
            description: 'Inline, internal, and external stylesheets',
            content: `There are three ways to include CSS:

1. Inline: <p style="color: red;">Text</p>
2. Internal: 
<style>
  p { color: red; }
</style>
3. External (recommended):
<link rel="stylesheet" href="style.css">

External stylesheets are best practice — they separate content from presentation and can be reused across pages.`,
            order: 2,
          },
          {
            title: 'CSS Selectors Basics',
            description: 'Targeting the right elements',
            content: `Selectors determine which elements a rule applies to.

- Element selector: p { }
- Universal selector: * { }
- Descendant selector: div p { }
- Child selector: div > p { }
- Grouping: h1, h2, h3 { }

Example:
nav ul li { display: inline-block; }

This targets list items inside a ul inside a nav.`,
            order: 3,
          },
          {
            title: 'Class and ID Selectors',
            description: 'Reusable and unique styling hooks',
            content: `Class Selector (reusable, can appear many times):
.button { padding: 10px; }
<button class="button">Click</button>

ID Selector (must be unique per page):
#header { background: black; }
<div id="header"></div>

Specificity: ID (100) > Class (10) > Element (1). More specific selectors override less specific ones. Prefer classes for styling; reserve IDs for JS hooks or anchors.`,
            order: 4,
          },
          {
            title: 'Colors and Backgrounds',
            description: 'Styling with color',
            content: `Colors can be specified several ways:

color: red;
color: #ff0000;
color: rgb(255, 0, 0);
color: rgba(255, 0, 0, 0.5);
color: hsl(0, 100%, 50%);

Backgrounds:
background-color: #f0f0f0;
background-image: url('bg.jpg');
background-size: cover;
background-repeat: no-repeat;

rgba/hsl with an alpha channel let you control transparency directly.`,
            order: 5,
          },
          {
            title: 'Typography and Fonts',
            description: 'Controlling how text looks',
            content: `font-family: 'Helvetica', Arial, sans-serif;
font-size: 18px;
font-weight: bold; /* or 400, 700 */
font-style: italic;
line-height: 1.5;
text-align: center;
text-decoration: underline;
text-transform: uppercase;
letter-spacing: 1px;

Always provide fallback fonts in font-family in case the first choice isn't available on the user's device.`,
            order: 6,
          },
          {
            title: 'The Box Model',
            description: 'How every element is sized',
            content: `Every element has: Content → Padding → Border → Margin

.box {
  width: 200px;
  padding: 10px;
  border: 2px solid black;
  margin: 20px;
}

box-sizing: content-box; /* default, width excludes padding/border */
box-sizing: border-box;  /* width includes padding/border (easier) */

Most developers set box-sizing: border-box globally for predictable sizing.`,
            order: 7,
          },
          {
            title: 'Margin and Padding',
            description: 'Controlling space around and inside elements',
            content: `Margin: space OUTSIDE the border (between elements)
Padding: space INSIDE the border (around content)

margin: 10px;              /* all sides */
margin: 10px 20px;         /* vertical horizontal */
margin: 10px 20px 5px 15px; /* top right bottom left */

padding: 15px;
margin: 0 auto; /* common trick to horizontally center a block element with a set width */

Margins between block elements can collapse — the browser uses the larger of the two adjoining margins.`,
            order: 8,
          },
          {
            title: 'Borders and Box Shadow',
            description: 'Adding edges and depth',
            content: `border: 2px solid black;
border-radius: 8px; /* rounded corners */
border-top: 1px dashed gray;

box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
/* offset-x offset-y blur-radius color */

Example — a card:
.card {
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}`,
            order: 9,
          },
          {
            title: 'The Display Property',
            description: 'Controlling how elements flow',
            content: `display: block;        /* takes full width, new line */
display: inline;       /* only needed width, no width/height */
display: inline-block; /* inline but can set width/height */
display: none;         /* removed from layout entirely */
display: flex;         /* flexible box layout */
display: grid;         /* grid layout */

Understanding display is the foundation for every layout technique in CSS.`,
            order: 10,
          },
          {
            title: 'The Position Property',
            description: 'Taking elements out of normal flow',
            content: `position: static;   /* default */
position: relative; /* offset from its normal position */
position: absolute; /* positioned relative to nearest positioned ancestor */
position: fixed;    /* positioned relative to the viewport, stays on scroll */
position: sticky;   /* toggles between relative and fixed on scroll */

Example:
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`,
            order: 11,
          },
          {
            title: 'Flexbox Basics',
            description: 'Create flexible one-dimensional layouts',
            content: `Flexbox makes it easy to design flexible layouts along one axis.

.container {
  display: flex;
  flex-direction: row; /* row, column, row-reverse, column-reverse */
  gap: 10px;
}

Item properties:
flex: 1;        /* grow to fill space equally */
flex-grow: 2;   /* grow ratio */
flex-basis: 200px; /* starting size */

Flexbox shines for navbars, toolbars, and any single-row/column layout.`,
            order: 12,
          },
          {
            title: 'Flexbox Alignment',
            description: 'Aligning items within a flex container',
            content: `justify-content: aligns items along the main axis
  flex-start | center | flex-end | space-between | space-around

align-items: aligns items along the cross axis
  stretch | flex-start | center | flex-end

Example:
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

This creates a row with items spaced evenly and vertically centered.`,
            order: 13,
          },
          {
            title: 'CSS Grid Basics',
            description: 'Two-dimensional layouts made simple',
            content: `Grid lets you control rows and columns simultaneously.

.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
}

.item {
  grid-column: span 2;
}

fr units divide available space proportionally. Grid is ideal for full page layouts, image galleries, and dashboards.`,
            order: 14,
          },
          {
            title: 'Grid Template Areas',
            description: 'Naming layout regions for clarity',
            content: `Grid template areas let you visually name layout sections.

.container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
  grid-template-columns: 200px 1fr;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }

This makes complex page layouts easy to read at a glance.`,
            order: 15,
          },
          {
            title: 'Responsive Design and Media Queries',
            description: 'Adapting layouts to different screen sizes',
            content: `Media queries apply CSS conditionally based on screen size.

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
}

Mobile-first approach: write base styles for mobile, then add min-width media queries for larger screens.`,
            order: 16,
          },
          {
            title: 'Pseudo-classes and Pseudo-elements',
            description: 'Styling states and virtual elements',
            content: `Pseudo-classes target element states:
a:hover { color: red; }
input:focus { border-color: blue; }
li:first-child { font-weight: bold; }
li:nth-child(2n) { background: #eee; }

Pseudo-elements target parts of an element:
p::first-line { font-weight: bold; }
.quote::before { content: '"'; }

Note the single colon for pseudo-classes and double colon for pseudo-elements (modern syntax).`,
            order: 17,
          },
          {
            title: 'CSS Transitions',
            description: 'Smoothly animating property changes',
            content: `Transitions animate a property change over time.

.button {
  background-color: blue;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: darkblue;
}

Syntax: transition: property duration timing-function delay;

You can transition multiple properties:
transition: transform 0.3s ease, opacity 0.2s linear;`,
            order: 18,
          },
          {
            title: 'CSS Animations',
            description: 'Creating keyframe-based animations',
            content: `@keyframes defines multi-step animations.

@keyframes bounce {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-20px); }
  100% { transform: translateY(0); }
}

.ball {
  animation: bounce 1s ease-in-out infinite;
}

Unlike transitions, animations can have multiple steps and loop with the infinite keyword.`,
            order: 19,
          },
          {
            title: 'CSS Variables (Custom Properties)',
            description: 'Reusable values across your stylesheet',
            content: `CSS variables make stylesheets easier to maintain.

:root {
  --primary-color: #3b82f6;
  --spacing: 16px;
}

.button {
  background-color: var(--primary-color);
  padding: var(--spacing);
}

Variables can be overridden in specific scopes and even updated with JavaScript, making them great for theming (like dark mode).`,
            order: 20,
          },
        ],
      },
      {
        title: 'JavaScript Essentials',
        description: 'Learn JavaScript fundamentals and DOM manipulation',
        icon: '⚡',
        level: 'beginner',
        lessons: [
          {
            title: 'Introduction to JavaScript',
            description: 'What JavaScript is and how it runs',
            content: `JavaScript is the programming language of the web. It runs in the browser and lets you make pages interactive.

<script>
  console.log("Hello, World!");
</script>

You can also link an external file:
<script src="app.js"></script>

JavaScript can react to clicks, update content without reloading the page, fetch data from servers, and much more.`,
            order: 1,
          },
          {
            title: 'Variables and Data Types',
            description: 'Storing and typing values',
            content: `let name = "John";       /* Block scoped, can change */
const email = "a@b.com"; /* Cannot be reassigned */
var age = 25;             /* Old way, avoid */

Data Types:
- String: "Hello"
- Number: 42, 3.14
- Boolean: true, false
- Array: [1, 2, 3]
- Object: { name: "John", age: 25 }
- null, undefined

Use const by default, let when a value needs to change, and avoid var.`,
            order: 2,
          },
          {
            title: 'Operators',
            description: 'Arithmetic, comparison, and logical operators',
            content: `Arithmetic: + - * / % **
Comparison: == != === !== > < >= <=
Logical: && || !
Assignment: = += -= *= /=

Example:
let x = 10;
let y = 20;
let sum = x + y; // 30
console.log(sum === 30); // true

Always prefer === and !== (strict equality) over == and != to avoid unexpected type coercion.`,
            order: 3,
          },
          {
            title: 'Conditionals (if/else)',
            description: 'Making decisions in code',
            content: `if (condition) {
  // runs if true
} else if (otherCondition) {
  // runs if otherCondition true
} else {
  // runs otherwise
}

Example:
let age = 18;
if (age >= 18) {
  console.log("You can vote");
} else {
  console.log("Not old enough yet");
}

Ternary shorthand:
let message = age >= 18 ? "Adult" : "Minor";`,
            order: 4,
          },
          {
            title: 'Switch Statements',
            description: 'Handling multiple discrete cases',
            content: `switch (day) {
  case "Mon":
    console.log("Start of week");
    break;
  case "Fri":
    console.log("Almost weekend");
    break;
  default:
    console.log("Regular day");
}

Don't forget break; without it, execution "falls through" to the next case. Switch is often cleaner than long if/else chains for a fixed set of values.`,
            order: 5,
          },
          {
            title: 'Loops: for and while',
            description: 'Repeating actions',
            content: `for (let i = 0; i < 5; i++) {
  console.log(i);
}

let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

do {
  console.log(i);
  i++;
} while (i < 10);

for...of iterates over array values:
for (const item of [1, 2, 3]) {
  console.log(item);
}`,
            order: 6,
          },
          {
            title: 'Arrays',
            description: 'Storing ordered collections of data',
            content: `const fruits = ["apple", "banana", "cherry"];

fruits[0];          // "apple"
fruits.length;      // 3
fruits.push("date"); // add to end
fruits.pop();        // remove from end
fruits[1] = "kiwi";  // update

Arrays are zero-indexed and can hold mixed types, though it's best practice to keep them consistent.`,
            order: 7,
          },
          {
            title: 'Array Methods',
            description: 'Transforming and searching arrays',
            content: `const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);        // [2,4,6,8,10]
nums.filter(n => n % 2 === 0); // [2,4]
nums.reduce((acc, n) => acc + n, 0); // 15
nums.find(n => n > 3);       // 4
nums.includes(3);            // true
nums.forEach(n => console.log(n));

These methods don't mutate the original array (except forEach's callback side effects) and are core to modern JS.`,
            order: 8,
          },
          {
            title: 'Objects',
            description: 'Storing key-value data',
            content: `const person = {
  name: "Alice",
  age: 30,
  greet() {
    return "Hi, I'm " + this.name;
  }
};

person.name;       // dot notation
person["age"];     // bracket notation
person.greet();    // "Hi, I'm Alice"

Object.keys(person);   // ["name", "age", "greet"]
Object.values(person);
Object.entries(person);`,
            order: 9,
          },
          {
            title: 'Functions',
            description: 'Reusable blocks of code',
            content: `function greet(name) {
  return "Hello, " + name;
}

function add(a, b = 0) { // default parameter
  return a + b;
}

greet("Alice"); // "Hello, Alice"

Functions can be stored in variables, passed as arguments, and returned from other functions — this makes JS very flexible.`,
            order: 10,
          },
          {
            title: 'Arrow Functions',
            description: 'A concise function syntax',
            content: `const greet = (name) => {
  return "Hello, " + name;
};

const square = n => n * n; // implicit return, single param
const add = (a, b) => a + b;

Key difference: arrow functions don't have their own 'this' — they inherit it from the surrounding scope, which is very useful inside callbacks.`,
            order: 11,
          },
          {
            title: 'Scope and Closures',
            description: 'Understanding variable visibility',
            content: `function outer() {
  let count = 0;
  function inner() {
    count++;
    return count;
  }
  return inner;
}

const counter = outer();
counter(); // 1
counter(); // 2

'inner' forms a closure — it remembers the variables from where it was created, even after 'outer' has finished running.`,
            order: 12,
          },
          {
            title: 'The DOM',
            description: "JavaScript's interface to HTML",
            content: `The DOM (Document Object Model) represents your HTML as a tree of objects that JavaScript can manipulate.

document.getElementById("id");
document.querySelector(".class");
document.querySelectorAll("p");

Each HTML element becomes a node you can read, change, or remove using JavaScript — this is how pages become interactive.`,
            order: 13,
          },
          {
            title: 'DOM Manipulation',
            description: 'Changing content, attributes, and styles',
            content: `const el = document.querySelector("#title");

el.textContent = "New text";
el.innerHTML = "<b>Bold</b>";
el.setAttribute("class", "highlight");
el.style.color = "red";
el.classList.add("active");
el.classList.toggle("active");

const div = document.createElement("div");
div.textContent = "New element";
document.body.appendChild(div);`,
            order: 14,
          },
          {
            title: 'Events and Event Listeners',
            description: 'Responding to user interaction',
            content: `const button = document.getElementById("myButton");

button.addEventListener("click", function(event) {
  console.log("Button clicked!", event.target);
});

Common events: click, mouseover, keydown, submit, change, input

Example:
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault(); // stop page reload
});`,
            order: 15,
          },
          {
            title: 'Template Literals and String Methods',
            description: 'Modern string handling',
            content: `const name = "Alice";
const greeting = \`Hello, \${name}! You are \${20 + 5} years old.\`;

Multi-line strings:
const text = \`Line one
Line two\`;

String methods:
"hello".toUpperCase();
"  hi  ".trim();
"hello world".split(" ");
"hello".includes("ell");
"hello".slice(1, 3);`,
            order: 16,
          },
          {
            title: 'Destructuring and Spread',
            description: 'Extracting and combining data concisely',
            content: `Array destructuring:
const [first, second] = [1, 2];

Object destructuring:
const { name, age } = { name: "Alice", age: 30 };

Spread operator:
const arr2 = [...arr1, 4, 5];
const obj2 = { ...obj1, extra: true };

Rest parameter:
function sum(...nums) {
  return nums.reduce((a, b) => a + b);
}`,
            order: 17,
          },
          {
            title: 'Asynchronous JS: Callbacks',
            description: 'Handling code that takes time',
            content: `JavaScript is single-threaded but handles slow operations (timers, network requests) asynchronously using callbacks.

setTimeout(() => {
  console.log("Runs after 2 seconds");
}, 2000);

function fetchData(callback) {
  setTimeout(() => {
    callback("data loaded");
  }, 1000);
}

fetchData((result) => console.log(result));

Deeply nested callbacks lead to "callback hell", which Promises help solve.`,
            order: 18,
          },
          {
            title: 'Promises',
            description: 'A cleaner way to handle async code',
            content: `const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) resolve("Done!");
  else reject("Error!");
});

promise
  .then(result => console.log(result))
  .catch(error => console.log(error));

Promise.all([p1, p2]).then(([r1, r2]) => {
  console.log(r1, r2);
});

A Promise represents a value that will be available now, later, or never (if it fails).`,
            order: 19,
          },
          {
            title: 'Async/Await and Fetch',
            description: 'Writing async code that reads like sync code',
            content: `async function getData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Error:", error);
  }
}

getData();

async functions always return a Promise. await pauses execution until the Promise resolves, making async code far more readable than chained .then() calls.`,
            order: 20,
          },
        ],
      },
      {
        title: 'React Fundamentals',
        description: 'Build interactive UIs with React',
        icon: '⚛️',
        level: 'intermediate',
        lessons: [
          {
            title: 'Introduction to React',
            description: 'What React is and why we use it',
            content: `React is a JavaScript library for building user interfaces using reusable components.

Why React?
- Component-based: build encapsulated pieces of UI
- Declarative: describe what the UI should look like, React handles the DOM updates
- Virtual DOM makes updates efficient

A minimal component:
function App() {
  return <h1>Hello, React!</h1>;
}`,
            order: 1,
          },
          {
            title: 'JSX Basics',
            description: 'Writing HTML-like syntax in JavaScript',
            content: `JSX looks like HTML but is actually JavaScript.

const name = "World";
const element = <h1>Hello, {name}!</h1>;

Rules:
- Must return a single root element (or a Fragment <>...</>)
- Use className instead of class
- Curly braces {} embed JavaScript expressions
- Self-closing tags need a slash: <img />`,
            order: 2,
          },
          {
            title: 'Components and Props',
            description: 'Building blocks and passing data',
            content: `function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

<Welcome name="Alice" />
<Welcome name="Bob" />

Props are read-only arguments passed to a component. Destructuring is common:

function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}`,
            order: 3,
          },
          {
            title: 'Component Composition',
            description: 'Combining components to build UIs',
            content: `function App() {
  return (
    <div>
      <Header />
      <Welcome name="Alice" />
      <Footer />
    </div>
  );
}

Components can also receive other components as children:

function Card({ children }) {
  return <div className="card">{children}</div>;
}

<Card><p>Inside the card</p></Card>`,
            order: 4,
          },
          {
            title: 'Conditional Rendering',
            description: 'Showing UI based on state',
            content: `function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign in</h1>;
}

Inline with ternary:
{isLoggedIn ? <p>Welcome</p> : <p>Please log in</p>}

Inline with &&:
{unreadCount > 0 && <span>{unreadCount} new messages</span>}`,
            order: 5,
          },
          {
            title: 'Lists and Keys',
            description: 'Rendering collections of data',
            content: `const items = ["Apple", "Banana", "Cherry"];

function List() {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

Keys help React identify which items changed. Prefer a stable unique id over the array index when the list can reorder.`,
            order: 6,
          },
          {
            title: 'useState Hook',
            description: 'Managing local component state',
            content: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

useState returns a pair: the current value and a function to update it, which triggers a re-render.`,
            order: 7,
          },
          {
            title: 'Handling Events in React',
            description: 'Responding to user interaction',
            content: `function Button() {
  const handleClick = (e) => {
    console.log("Clicked!", e.target);
  };

  return <button onClick={handleClick}>Click me</button>;
}

Event props use camelCase (onClick, onChange, onSubmit). Handlers receive a SyntheticEvent, React's cross-browser wrapper around the native event.`,
            order: 8,
          },
          {
            title: 'Forms and Controlled Components',
            description: 'Managing form input with state',
            content: `function LoginForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

The input's value is always driven by state — this is a "controlled component".`,
            order: 9,
          },
          {
            title: 'useEffect Hook',
            description: 'Running side effects after render',
            content: `import { useEffect } from 'react';

useEffect(() => {
  console.log("Component mounted or updated");

  return () => {
    console.log("Cleanup before next effect or unmount");
  };
}, [dependency]);

Dependency Array:
- []: Runs once on mount
- [variable]: Runs when variable changes
- No array: Runs every render (usually avoid)`,
            order: 10,
          },
          {
            title: 'Fetching Data with useEffect',
            description: 'Loading data when a component mounts',
            content: `function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}`,
            order: 11,
          },
          {
            title: 'Lifting State Up',
            description: 'Sharing state between components',
            content: `When two components need the same data, move the state to their closest common parent and pass it down via props.

function Parent() {
  const [value, setValue] = useState("");
  return (
    <>
      <Input value={value} onChange={setValue} />
      <Display value={value} />
    </>
  );
}

This keeps a single source of truth instead of duplicating state.`,
            order: 12,
          },
          {
            title: 'Context API',
            description: 'Avoiding prop drilling',
            content: `const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Toolbar</div>;
}

Context lets deeply nested components access data without passing props through every level.`,
            order: 13,
          },
          {
            title: 'useRef Hook',
            description: 'Accessing DOM nodes and persisting values',
            content: `import { useRef } from 'react';

function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}

Unlike state, updating a ref does not trigger a re-render — useful for timers, DOM access, and storing mutable values.`,
            order: 14,
          },
          {
            title: 'useReducer Hook',
            description: 'Managing complex state logic',
            content: `function reducer(state, action) {
  switch (action.type) {
    case "increment": return { count: state.count + 1 };
    case "decrement": return { count: state.count - 1 };
    default: return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <button onClick={() => dispatch({ type: "increment" })}>
      {state.count}
    </button>
  );
}

useReducer is preferred when state logic is complex or involves multiple sub-values.`,
            order: 15,
          },
          {
            title: 'Custom Hooks',
            description: 'Extracting reusable stateful logic',
            content: `function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  return { count, increment, decrement };
}

function Counter() {
  const { count, increment } = useCounter(0);
  return <button onClick={increment}>{count}</button>;
}

Custom hooks (functions starting with "use") let you share logic between components without duplicating code.`,
            order: 16,
          },
          {
            title: 'React Router Basics',
            description: 'Navigating between pages',
            content: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Link to="/about">About</Link>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

React Router enables client-side navigation without full page reloads, keeping the app feeling fast.`,
            order: 17,
          },
          {
            title: 'Component Styling Approaches',
            description: 'Ways to style React components',
            content: `1. CSS files: import './App.css';
2. Inline styles: <div style={{ color: 'red', fontSize: 20 }} />
3. CSS Modules: import styles from './App.module.css'; <div className={styles.title} />
4. CSS-in-JS libraries (styled-components, emotion)
5. Utility frameworks like Tailwind CSS

Each approach has trade-offs between scoping, performance, and developer ergonomics — pick based on team and project needs.`,
            order: 18,
          },
          {
            title: 'Performance: useMemo and useCallback',
            description: 'Avoiding unnecessary recalculations and re-renders',
            content: `const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

useMemo memoizes a computed value; useCallback memoizes a function reference. Both only recompute when their dependencies change — useful when passing props to memoized children.`,
            order: 19,
          },
          {
            title: 'Error Boundaries',
            description: 'Gracefully handling component errors',
            content: `class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>

Error boundaries catch JavaScript errors in their child tree and display a fallback UI instead of crashing the whole app.`,
            order: 20,
          },
        ],
      },
    ]

    const createdCourses = await Course.insertMany(coursesData)

    // ---------------------------------------------------------------------
    // EXERCISE DATA
    // All four courses now use fill-in-the-blank / code-syntax multiple
    // choice exercises (one per lesson). Code-challenge exercises (which
    // ran user code through a VM sandbox) have been removed — sandboxed
    // React-hook and async/callback grading was unreliable, so lessons
    // that used to be code-challenges are now MCQs where the options are
    // real code syntax (the correct token plus plausible near-miss
    // syntax), rather than plain-English answer choices.
    // ---------------------------------------------------------------------

    const mcqBanks: Record<string, { question: string; options: string[]; correctAnswerIndex: number; explanation: string }[]> = {
      'HTML Basics': [
        { question: 'What does HTML stand for?', options: ['HyperText Markup Language', 'HighText Machine Language', 'HyperTransfer Markup Language', 'Home Tool Markup Language'], correctAnswerIndex: 0, explanation: 'HTML stands for HyperText Markup Language, the standard language for creating web pages.' },
        { question: 'Which tag holds content that is NOT visible on the page?', options: ['<body>', '<head>', '<main>', '<footer>'], correctAnswerIndex: 1, explanation: 'The <head> contains metadata like the title and links, which are not rendered directly on the page.' },
        { question: 'Which tag creates the largest heading?', options: ['<h6>', '<heading>', '<h1>', '<head>'], correctAnswerIndex: 2, explanation: '<h1> represents the largest and most important heading level.' },
        { question: 'How many <h1> tags should a well-structured page typically have?', options: ['As many as needed', 'Exactly one', 'Zero', 'At least three'], correctAnswerIndex: 1, explanation: 'Best practice is one <h1> per page representing the main title.' },
        { question: 'Which tag is semantically correct for important text?', options: ['<b>', '<strong>', '<i>', '<mark>'], correctAnswerIndex: 1, explanation: '<strong> conveys semantic importance, unlike <b> which is purely visual.' },
        { question: 'Which attribute specifies a link\'s destination?', options: ['src', 'href', 'link', 'target'], correctAnswerIndex: 1, explanation: 'The href attribute on an <a> tag specifies the destination URL.' },
        { question: 'Which attribute provides alternative text for images?', options: ['title', 'alt', 'src', 'caption'], correctAnswerIndex: 1, explanation: 'The alt attribute describes an image for accessibility and SEO.' },
        { question: 'Which tag creates a numbered list?', options: ['<ul>', '<list>', '<ol>', '<li>'], correctAnswerIndex: 2, explanation: '<ol> creates an ordered (numbered) list; <ul> creates an unordered (bulleted) one.' },
        { question: 'Which tag defines a table header cell?', options: ['<td>', '<th>', '<tr>', '<head>'], correctAnswerIndex: 1, explanation: '<th> defines a header cell within a table, typically bold and centered by default.' },
        { question: 'Which attribute specifies where form data is sent?', options: ['method', 'action', 'target', 'destination'], correctAnswerIndex: 1, explanation: 'The action attribute on a <form> specifies the URL the data is submitted to.' },
        { question: 'Which input type shows a mobile-friendly "@" keyboard?', options: ['type="text"', 'type="email"', 'type="url"', 'type="search"'], correctAnswerIndex: 1, explanation: 'type="email" triggers an appropriate keyboard on mobile devices and adds basic validation.' },
        { question: 'Which tag is used for a page\'s main navigation menu?', options: ['<menu>', '<nav>', '<links>', '<header>'], correctAnswerIndex: 1, explanation: 'The <nav> tag semantically represents a section of navigation links.' },
        { question: 'What is the key difference between <div> and <span>?', options: ['div is inline, span is block', 'div is block, span is inline', 'They are identical', 'span cannot hold text'], correctAnswerIndex: 1, explanation: '<div> is a block-level container while <span> is an inline container.' },
        { question: 'Which attribute is used to uniquely identify a single element?', options: ['class', 'id', 'name', 'data'], correctAnswerIndex: 1, explanation: 'The id attribute should be unique within the page, unlike class which can repeat.' },
        { question: 'How do you write an HTML comment?', options: ['// comment', '<!-- comment -->', '/* comment */', '# comment'], correctAnswerIndex: 1, explanation: 'HTML comments are written as <!-- comment --> and are not rendered by the browser.' },
        { question: 'Which attribute displays playback controls on a <video> element?', options: ['play', 'controls', 'autoplay', 'display'], correctAnswerIndex: 1, explanation: 'The controls attribute shows the play/pause/volume UI for video and audio elements.' },
        { question: 'What does an <iframe> embed?', options: ['A JavaScript file', 'Another HTML page', 'A CSS stylesheet', 'A database'], correctAnswerIndex: 1, explanation: 'An <iframe> embeds another full HTML document within the current page.' },
        { question: 'Which HTML5 element creates collapsible content without JavaScript?', options: ['<collapse>', '<details>', '<accordion>', '<toggle>'], correctAnswerIndex: 1, explanation: '<details> paired with <summary> creates native collapsible content.' },
        { question: 'Which meta tag makes a page responsive on mobile devices?', options: ['<meta name="mobile">', '<meta name="viewport" content="width=device-width, initial-scale=1.0">', '<meta charset="UTF-8">', '<meta name="responsive">'], correctAnswerIndex: 1, explanation: 'The viewport meta tag controls how a page scales on mobile devices.' },
        { question: 'Which of these best improves accessibility for a screen reader user?', options: ['Using only <div> and <span>', 'Using semantic tags and meaningful alt text', 'Avoiding labels on form inputs', 'Using color alone to convey meaning'], correctAnswerIndex: 1, explanation: 'Semantic HTML and descriptive alt text give screen readers meaningful structure and context.' },
      ],
      'CSS Styling': [
        { question: 'What is the correct CSS syntax structure?', options: ['selector { property: value; }', 'selector: property { value }', '{ selector: property: value }', 'property { selector: value }'], correctAnswerIndex: 0, explanation: 'CSS rules follow the pattern selector { property: value; }.' },
        { question: 'Which method of including CSS is generally best practice?', options: ['Inline styles', 'Internal <style> tag', 'External stylesheet', 'JavaScript-injected styles'], correctAnswerIndex: 2, explanation: 'External stylesheets separate content and presentation and can be reused across pages.' },
        { question: 'Which selector targets only direct children?', options: ['div p', 'div > p', 'div ~ p', 'div + p'], correctAnswerIndex: 1, explanation: 'The > combinator selects only direct children of an element.' },
        { question: 'Which selector has the highest specificity?', options: ['Element selector', 'Class selector', 'ID selector', 'Universal selector'], correctAnswerIndex: 2, explanation: 'ID selectors have higher specificity (100) than classes (10) or elements (1).' },
        { question: 'Which color format includes transparency control?', options: ['rgb()', 'hex (#fff)', 'rgba()', 'named colors'], correctAnswerIndex: 2, explanation: 'rgba() includes an alpha channel to control opacity.' },
        { question: 'Which property sets the space between lines of text?', options: ['letter-spacing', 'line-height', 'text-spacing', 'font-height'], correctAnswerIndex: 1, explanation: 'line-height controls the vertical spacing between lines of text.' },
        { question: 'In the box model, what order surrounds the content?', options: ['Margin, Border, Padding', 'Padding, Border, Margin', 'Border, Padding, Margin', 'Padding, Margin, Border'], correctAnswerIndex: 1, explanation: 'From the inside out: Content → Padding → Border → Margin.' },
        { question: 'Which value makes width include padding and border?', options: ['box-sizing: content-box', 'box-sizing: border-box', 'box-sizing: padding-box', 'box-sizing: full'], correctAnswerIndex: 1, explanation: 'border-box includes padding and border inside the specified width, making sizing more predictable.' },
        { question: 'Which property adds rounded corners?', options: ['corner-radius', 'border-radius', 'box-radius', 'round-corners'], correctAnswerIndex: 1, explanation: 'border-radius rounds the corners of an element\'s border box.' },
        { question: 'Which display value removes an element from the page entirely?', options: ['display: hidden', 'display: none', 'visibility: hidden', 'opacity: 0'], correctAnswerIndex: 1, explanation: 'display: none removes the element from the layout completely, unlike visibility: hidden which keeps its space.' },
        { question: 'Which position value keeps an element fixed to the viewport on scroll?', options: ['relative', 'absolute', 'fixed', 'static'], correctAnswerIndex: 2, explanation: 'position: fixed positions an element relative to the viewport, so it stays in place when scrolling.' },
        { question: 'Which property enables flexbox on a container?', options: ['flex: true', 'display: flex', 'layout: flex', 'flex-direction: row'], correctAnswerIndex: 1, explanation: 'display: flex turns an element into a flex container.' },
        { question: 'Which property centers flex items along the main axis?', options: ['align-items', 'justify-content', 'text-align', 'flex-align'], correctAnswerIndex: 1, explanation: 'justify-content controls alignment along the main axis of a flex container.' },
        { question: 'Which unit divides available space proportionally in CSS Grid?', options: ['px', '%', 'fr', 'em'], correctAnswerIndex: 2, explanation: 'The fr unit represents a fraction of the available space in a grid container.' },
        { question: 'What does grid-template-areas let you do?', options: ['Set colors for grid cells', 'Name and visually lay out grid regions', 'Add animations to grid items', 'Set the number of columns only'], correctAnswerIndex: 1, explanation: 'grid-template-areas lets you assign readable names to layout regions for clarity.' },
        { question: 'What is a media query used for?', options: ['Playing audio files', 'Applying CSS conditionally based on screen size', 'Loading external fonts', 'Compressing images'], correctAnswerIndex: 1, explanation: 'Media queries apply styles conditionally, commonly based on viewport width, enabling responsive design.' },
        { question: 'Which selects an element on hover?', options: ['a:hover', 'a::hover', 'a.hover', 'a[hover]'], correctAnswerIndex: 0, explanation: 'Pseudo-classes like :hover use a single colon and target element states.' },
        { question: 'Which property animates a smooth change between two states?', options: ['animation', 'transition', 'transform', 'keyframes'], correctAnswerIndex: 1, explanation: 'transition smoothly animates a property change over a specified duration.' },
        { question: 'What keyword makes a CSS animation repeat forever?', options: ['repeat: true', 'loop', 'infinite', 'forever'], correctAnswerIndex: 2, explanation: 'animation: name duration infinite; makes the animation loop indefinitely.' },
        { question: 'How do you define a reusable CSS variable?', options: ['$primary: blue;', '--primary: blue; inside :root', '@primary: blue;', 'var primary = blue;'], correctAnswerIndex: 1, explanation: 'CSS custom properties are declared with -- and typically defined in :root for global scope.' },
      ],
      'JavaScript Essentials': [
        { question: 'Fill in the blank to log a message to the console:\n\nconsole.____("Hello, World!");', options: ['log', 'print', 'write', 'output'], correctAnswerIndex: 0, explanation: 'console.log() is the standard way to print output in JavaScript.' },
        { question: 'Fill in the blank to declare a value that cannot be reassigned:\n\n____ email = "a@b.com";', options: ['const', 'let', 'var', 'final'], correctAnswerIndex: 0, explanation: 'const declares a block-scoped variable that cannot be reassigned.' },
        { question: 'Fill in the blank for a strict equality check that avoids type coercion:\n\nif (sum ____ 30) { console.log("equal"); }', options: ['===', '==', '=', '!=='], correctAnswerIndex: 0, explanation: '=== checks both value and type, avoiding the surprises of == coercion.' },
        { question: 'Fill in the blank:\n\nif (age >= 18) {\n  console.log("You can vote");\n} ____ {\n  console.log("Not old enough yet");\n}', options: ['else', 'elseif', 'elif', 'otherwise'], correctAnswerIndex: 0, explanation: 'else runs when the preceding if condition is false.' },
        { question: 'Fill in the blank to stop a switch case from falling through to the next one:\n\ncase "Mon":\n  console.log("Start of week");\n  ____;', options: ['break', 'continue', 'stop', 'exit'], correctAnswerIndex: 0, explanation: 'break exits the switch statement; without it, execution falls through to the next case.' },
        { question: 'Fill in the blank to increment i each loop iteration:\n\nfor (let i = 0; i < 5; i____) {\n  console.log(i);\n}', options: ['++', '--', '+1', '**'], correctAnswerIndex: 0, explanation: 'i++ increments i by 1 after each pass through the loop.' },
        { question: 'Fill in the blank to add "date" to the end of the array:\n\nfruits.____("date");', options: ['push', 'pop', 'shift', 'append'], correctAnswerIndex: 0, explanation: 'push() adds one or more elements to the end of an array.' },
        { question: 'Fill in the blank to keep only the even numbers:\n\nconst evens = nums.____(n => n % 2 === 0);', options: ['filter', 'map', 'reduce', 'find'], correctAnswerIndex: 0, explanation: 'filter() returns a new array containing only elements that pass the test.' },
        { question: 'Fill in the blank to access age using bracket notation:\n\nperson____;', options: ['["age"]', '.age()', '->age', '{age}'], correctAnswerIndex: 0, explanation: 'Bracket notation uses a string key: person["age"].' },
        { question: 'Fill in the blank to give parameter b a default value of 0:\n\nfunction add(a, b ____ 0) {\n  return a + b;\n}', options: ['=', '==', '::', ':'], correctAnswerIndex: 0, explanation: 'Default parameters use a single = sign: b = 0.' },
        { question: 'Fill in the blank to write square as an arrow function:\n\nconst square = n ____ n * n;', options: ['=>', '->', '=', '::'], correctAnswerIndex: 0, explanation: 'Arrow functions use => between the parameter list and the body.' },
        { question: 'Fill in the blank so outer() returns the closure that remembers count:\n\nfunction outer() {\n  let count = 0;\n  function inner() {\n    count++;\n    return count;\n  }\n  return ____;\n}', options: ['inner', 'inner()', 'count', 'this.inner'], correctAnswerIndex: 0, explanation: 'Returning inner (not inner()) returns the function itself, preserving the closure over count.' },
        { question: 'Fill in the blank to select an element by its id:\n\ndocument.____("title");', options: ['getElementById', 'querySelectorId', 'getById', 'selectElementById'], correctAnswerIndex: 0, explanation: 'getElementById looks up a single element by its id attribute.' },
        { question: 'Fill in the blank to change the visible text inside an element:\n\nel.____ = "New text";', options: ['textContent', 'innerText2', 'value', 'content'], correctAnswerIndex: 0, explanation: 'textContent sets or gets the text content of a node.' },
        { question: 'Fill in the blank to listen for clicks on a button:\n\nbutton.____("click", handleClick);', options: ['addEventListener', 'onEvent', 'listen', 'bindEvent'], correctAnswerIndex: 0, explanation: 'addEventListener registers a callback for a given event type.' },
        { question: 'Which syntax correctly creates a template literal?', options: ['`Hello, ${name}!`', "'Hello, ${name}!'", '"Hello, ${name}!"', '(Hello, ${name}!)'], correctAnswerIndex: 0, explanation: 'Template literals use backticks and ${} to interpolate expressions.' },
        { question: 'Fill in the blank to destructure the first two values of an array:\n\nconst [first, second] = ____;', options: ['[1, 2]', '{1, 2}', '(1, 2)', '<1, 2>'], correctAnswerIndex: 0, explanation: 'Array destructuring pulls values out of an actual array literal like [1, 2].' },
        { question: 'Fill in the blank to run the callback after 2 seconds:\n\nsetTimeout(() => {\n  console.log("Hi");\n}, ____);', options: ['2000', '2000ms', '"2000"', '2s'], correctAnswerIndex: 0, explanation: 'setTimeout expects the delay in milliseconds as a plain number.' },
        { question: 'Fill in the blank to handle a resolved Promise:\n\npromise\n  .____(result => console.log(result))\n  .catch(error => console.log(error));', options: ['then', 'catch', 'resolve', 'await'], correctAnswerIndex: 0, explanation: 'then() runs a callback when the Promise resolves successfully.' },
        { question: 'Fill in the blank so getData pauses until fetch resolves:\n\nasync function getData() {\n  const response = ____ fetch(url);\n  const data = await response.json();\n}', options: ['await', 'async', 'yield', 'then'], correctAnswerIndex: 0, explanation: 'await pauses execution inside an async function until the Promise settles.' },
      ],
      'React Fundamentals': [
        { question: 'Which snippet correctly returns JSX from a component?', options: ['function App() {\n  return <h1>Hello, React!</h1>;\n}', 'function App() {\n  return "<h1>Hello, React!</h1>";\n}', 'function App() {\n  render <h1>Hello, React!</h1>;\n}', 'function App() {\n  return html(<h1>Hello, React!</h1>);\n}'], correctAnswerIndex: 0, explanation: 'JSX is returned directly, without quotes or a render() wrapper.' },
        { question: 'Fill in the blank to embed the name variable inside JSX:\n\nconst element = <h1>Hello, ____!</h1>;', options: ['{name}', '(name)', '$name', 'name'], correctAnswerIndex: 0, explanation: 'Curly braces {} embed a JavaScript expression inside JSX.' },
        { question: 'Fill in the blank to render the name prop:\n\nfunction Welcome(props) {\n  return <h1>Hello, ____</h1>;\n}', options: ['{props.name}', '{props->name}', '{props[name]}', '{this.props.name}'], correctAnswerIndex: 0, explanation: 'In a function component, props are accessed directly as props.name (no "this").' },
        { question: 'Fill in the blank to render the Header component:\n\nfunction App() {\n  return (\n    <div>\n      ____\n      <Footer />\n    </div>\n  );\n}', options: ['<Header />', '<header />', '{Header}', '<Header></Header;>'], correctAnswerIndex: 0, explanation: 'Custom components must be capitalized and self-closed with a slash: <Header />.' },
        { question: 'Fill in the blank for a ternary that renders one of two elements:\n\n{isLoggedIn ____ <p>Welcome</p> : <p>Please log in</p>}', options: ['?', '&&', '||', '=>'], correctAnswerIndex: 0, explanation: 'A ternary uses condition ? valueIfTrue : valueIfFalse.' },
        { question: 'Fill in the blank with the prop React uses to track list items:\n\n{items.map((item, index) => (\n  <li ____={index}>{item}</li>\n))}', options: ['key', 'id', 'index', 'ref'], correctAnswerIndex: 0, explanation: 'The special key prop helps React identify which list items changed.' },
        { question: 'Fill in the blank to create state:\n\nconst [count, setCount] = ____(0);', options: ['useState', 'useCount', 'state', 'React.state'], correctAnswerIndex: 0, explanation: 'useState(initialValue) returns a [value, setter] pair.' },
        { question: 'Fill in the blank to attach a click handler:\n\n<button ____={handleClick}>Click me</button>', options: ['onClick', 'onclick', 'on-click', 'click'], correctAnswerIndex: 0, explanation: 'React event props use camelCase, e.g. onClick, not lowercase HTML-style attributes.' },
        { question: 'Fill in the blank to make the input update state as the user types:\n\n<input\n  value={email}\n  ____={(e) => setEmail(e.target.value)}\n/>', options: ['onChange', 'onInput', 'onValue', 'bind'], correctAnswerIndex: 0, explanation: 'onChange fires on every keystroke for a controlled input.' },
        { question: 'Fill in the blank so the effect runs only once, on mount:\n\nuseEffect(() => {\n  console.log("mounted");\n}, ____);', options: ['[]', '()', '{}', 'null'], correctAnswerIndex: 0, explanation: 'An empty dependency array [] means the effect runs once after the first render.' },
        { question: 'Fill in the blank to parse the fetch response as JSON:\n\nfetch("/api/users")\n  .then(res => res.____())\n  .then(setUsers);', options: ['json', 'text', 'data', 'parse'], correctAnswerIndex: 0, explanation: 'response.json() parses the response body as JSON, returning a Promise.' },
        { question: 'Where should state live when two sibling components both need to read and update it?', options: ['In their closest common parent component', 'In each child component separately', 'Only in the browser\'s localStorage', 'It cannot be shared between components'], correctAnswerIndex: 0, explanation: 'Lifting state up to the nearest shared parent gives both children a single source of truth.' },
        { question: 'Fill in the blank to read a value from context:\n\nconst theme = ____(ThemeContext);', options: ['useContext', 'useTheme', 'getContext', 'React.context'], correctAnswerIndex: 0, explanation: 'useContext(SomeContext) reads the nearest matching Provider\'s value.' },
        { question: 'Fill in the blank to focus the input via its ref:\n\n____.current.focus();', options: ['inputRef', 'inputRef.value', 'inputRef()', 'ref.input'], correctAnswerIndex: 0, explanation: 'A ref object exposes the underlying DOM node through its .current property.' },
        { question: 'Fill in the blank to manage state with a reducer:\n\nconst [state, dispatch] = ____(reducer, { count: 0 });', options: ['useReducer', 'useState', 'useDispatch', 'useAction'], correctAnswerIndex: 0, explanation: 'useReducer(reducer, initialState) returns the current state and a dispatch function.' },
        { question: 'Which is a correctly named custom hook?', options: ['useCounter', 'hookCounter', 'CounterHook', 'counter_hook'], correctAnswerIndex: 0, explanation: 'Custom hooks must start with "use" so React can apply the Rules of Hooks correctly.' },
        { question: 'Fill in the blank to render the About component for this route:\n\n<Route path="/about" ____={<About />} />', options: ['element', 'component', 'render', 'page'], correctAnswerIndex: 0, explanation: 'In modern react-router-dom, Route takes an element prop holding JSX.' },
        { question: 'Fill in the blank to apply a CSS Module class:\n\nimport styles from "./App.module.css";\n\n<h1 className={styles.____}>Title</h1>', options: ['title', '"title"', '#title', '.title'], correctAnswerIndex: 0, explanation: 'CSS Module class names are accessed as plain object properties, e.g. styles.title.' },
        { question: 'Fill in the blank to memoize an expensive computed value:\n\nconst value = ____(() => computeExpensiveValue(a, b), [a, b]);', options: ['useMemo', 'useCallback', 'useEffect', 'memo'], correctAnswerIndex: 0, explanation: 'useMemo caches a computed value and only recalculates when its dependencies change.' },
        { question: 'Fill in the blank so the error boundary flags that an error occurred:\n\nstatic ____(error) {\n  return { hasError: true };\n}', options: ['getDerivedStateFromError', 'componentDidCatch', 'catchError', 'onError'], correctAnswerIndex: 0, explanation: 'getDerivedStateFromError is the static lifecycle method used to update state after a descendant throws.' },
      ],
    }

    // Create one quiz exercise per lesson, matched by lesson order.
    for (const course of createdCourses) {
      const sortedLessons = [...course.lessons].sort((a: any, b: any) => a.order - b.order)
      const bank = mcqBanks[course.title]

      for (let i = 0; i < sortedLessons.length; i++) {
        const lesson = sortedLessons[i]
        const entry = bank[i]

        await Exercise.create({
          courseId: course._id,
          lessonId: lesson._id,
          title: `Quiz: ${lesson.title}`,
          content: {
            type: 'multiple-choice',
            question: entry.question,
            options: entry.options,
            correctAnswerIndex: entry.correctAnswerIndex,
            explanation: entry.explanation,
          },
          order: 1,
        })
      }
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      coursesCreated: createdCourses.length,
      lessonsPerCourse: 20,
      exercisesPerCourse: 20,
    })
  } catch (error) {
    console.error('[v0] Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}