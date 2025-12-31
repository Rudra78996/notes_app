import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { useState, useEffect } from 'react'
import { Sun, Moon, FileText, Lock, Zap, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Safari } from '../components/ui/safari'
import { BentoCard, BentoGrid } from '../components/ui/bento-grid'

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  const features = [
    {
      Icon: FileText,
      name: 'Rich Text Editor',
      description: 'Write beautifully with our powerful editor.',
      className: 'col-span-3 lg:col-span-1',
    },
    {
      Icon: Lock,
      name: 'Secure & Private',
      description: 'Your notes are encrypted and safe.',
      className: 'col-span-3 lg:col-span-1',
    },
    {
      Icon: Zap,
      name: 'Lightning Fast',
      description: 'Instant sync across all devices.',
      className: 'col-span-3 lg:col-span-1',
    },
  ]

  return (
    <div className="relative min-h-screen">
      {isDarkMode ? (
        <div className="fixed inset-0 z-0 h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      ) : (
        <div className="fixed inset-0 z-0 h-screen w-screen bg-white">
          <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
      )}

      {/* Navbar */}
      <nav className="relative z-10 bg-transparent backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img
                src="/writing.png"
                alt="Notes logo"
                className="w-10 h-10 object-contain dark:invert"
              />
            </div>
            <h1 className="text-xl font-bold text-foreground">Notes</h1>
          </button>
          <div className="flex gap-3 items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
            </button>
            {user ? (
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Banner */}
        <div className="mb-8 flex">
          <span className="relative inline-block overflow-hidden rounded-full p-[1px]">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a9a9a9_0%,#0c0c0c_50%,#a9a9a9_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#171717_0%,#737373_50%,#171717_100%)]"></span>
            <div className="inline-flex h-full w-full cursor-pointer justify-center rounded-full bg-white px-3 py-1 text-xs font-medium leading-5 text-slate-600 backdrop-blur-xl dark:bg-black dark:text-slate-200">
              ✨ Organize your thoughts effortlessly
            </div>
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-center text-3xl font-medium text-gray-900 dark:text-gray-50 sm:text-6xl">
          Your ideas,{' '}
          <span className="inline-flex bg-gradient-to-r from-neutral-900 via-slate-500 to-neutral-500 bg-clip-text leading-tight text-transparent dark:from-neutral-100 dark:via-slate-400 dark:to-neutral-400">
            beautifully organized
          </span>
        </h2>

        {/* Subheading */}
        <p className="mt-6 text-center text-lg leading-6 text-gray-600 dark:text-gray-200">
          Create, organize, and manage your notes with a clean, distraction-free interface.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex gap-4">
          {user ? (
            <Button onClick={() => navigate('/dashboard')} className="inline-flex items-center">
              Go to Dashboard <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate('/signup')} className="inline-flex items-center">
                Get Started <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
              <Button variant="secondary" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Demo Section with Safari */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative">
          <Safari
            url="notes.app/dashboard"
            imageSrc={isDarkMode ? "/demo_dark.png" : "/demo.png"}
            className="w-full"
          />
          {/* Fade effect at bottom */}
          <div className={`absolute bottom-0 left-0 right-0 pointer-events-none z-20 bg-gradient-to-t ${isDarkMode ? 'h-56 from-neutral-950 via-neutral-950/90' : 'h-40 from-white via-white/80'} to-transparent`} />
        </div>
      </section>

      {/* Features Section with BentoGrid */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-48">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center tracking-tight">
          Everything you need
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Simple, powerful features to help you capture and organize your thoughts.
        </p>
        
        <BentoGrid className="auto-rows-[12rem]">
          {features.map((feature) => (
            <BentoCard
              key={feature.name}
              name={feature.name}
              description={feature.description}
              Icon={feature.Icon}
              className={feature.className}
              href="/signup"
              cta="Get started"
            />
          ))}
        </BentoGrid>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <img
                src="/writing.png"
                alt="Notes logo"
                className="w-8 h-8 object-contain dark:invert"
              />
              <span className="font-semibold text-foreground">Notes</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Notes App. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
