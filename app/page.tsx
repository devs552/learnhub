import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LearnHub - Master Web Development',
  description: 'Learn HTML, CSS, JavaScript, and React through interactive lessons and hands-on exercises',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 bg-card border-b border-primary/50 backdrop-blur-md">
        <div className="text-3xl font-bold neon-glow-cyan ">LearnHub</div>
        <div className="flex gap-4">
          <Link
            href="/auth/signin"
            className="px-6 py-2 text-primary font-semibold border border-primary rounded-lg hover:bg-primary/10 transition"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-6 py-2 bg-primary text-background font-semibold rounded-lg hover:glow-border-cyan transition"
          >
            Get Started
          </Link>
          
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-8 py-32 text-center">
        <h1 className="text-7xl font-bold text-primary mb-6 neon-glow-cyan animate-fade-in-up">
          Master Web Development
        </h1>
        <p className="text-xl text-foreground/80 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          Learn HTML, CSS, JavaScript, and React through interactive lessons, hands-on exercises, and earn glowing certificates.
        </p>

        <div className="flex justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <Link
            href="/auth/signup"
            className="px-8 py-4 bg-primary text-background font-semibold rounded-lg hover:neon-glow-cyan transition text-lg glow-border-cyan"
          >
            Start Learning
          </Link>
      
        </div>
      </div>

      {/* Courses Preview */}
      <div className="max-w-6xl mx-auto px-8 py-20">
        <h2 className="text-5xl font-bold text-center text-primary mb-16 neon-glow-cyan">Our Courses</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: '📝', title: 'HTML Basics', desc: 'Learn HTML fundamentals', color: 'cyan' },
            { icon: '🎨', title: 'CSS Styling', desc: 'Master CSS and design', color: 'magenta' },
            { icon: '⚡', title: 'JavaScript', desc: 'Interactive programming', color: 'lime' },
            { icon: '⚛️', title: 'React', desc: 'Modern UI frameworks', color: 'cyan' },
          ].map((course, i) => (
            <div
              key={i}
              className={`bg-card p-8 rounded-xl transition transform hover:scale-105 ${
                course.color === 'cyan' ? 'glow-border-cyan hover:neon-glow-cyan' :
                course.color === 'magenta' ? 'glow-border-magenta hover:neon-glow-magenta' :
                'border-2 border-accent'
              }`}
            >
              <div className="text-5xl mb-4">{course.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-2">{course.title}</h3>
              <p className="text-foreground/70">{course.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-card/50 border-t border-primary/30 py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-primary mb-16 neon-glow-magenta">Why Choose LearnHub?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-6 rounded-lg bg-background/50 border border-primary/30">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/50">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Comprehensive Content</h3>
              <p className="text-foreground/70">From basics to advanced topics, everything you need</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-background/50 border border-secondary/30">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-secondary/50">
                <span className="text-2xl">✏️</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Hands-on Exercises</h3>
              <p className="text-foreground/70">Practice with coding challenges and quizzes</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-background/50 border border-accent/30">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/50">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Glowing Certificates</h3>
              <p className="text-foreground/70">Earn certificates that shine and showcase your skills</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 py-20 text-center border-t border-primary/30">
        <h2 className="text-4xl font-bold mb-6 text-primary neon-glow-cyan">Ready to start?</h2>
        <p className="text-lg mb-8 text-foreground/80">Join thousands of students learning web development with style</p>
        <Link
          href="/auth/signup"
          className="inline-block px-8 py-4 bg-primary text-background font-semibold rounded-lg hover:neon-glow-cyan transition text-lg glow-border-cyan"
        >
          Sign Up for Free
        </Link>
      </div>
    </div>
  )
}
