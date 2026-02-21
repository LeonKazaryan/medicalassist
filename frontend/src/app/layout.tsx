import type { ReactNode } from 'react'
import { ThemeToggle } from '@/components/common/ThemeToggle'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background grid pattern */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      
      {/* Subtle organic blob */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <svg
          className="absolute top-0 right-0 w-[800px] h-[800px]"
          viewBox="0 0 800 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" className="text-primary" />
              <stop offset="100%" stopColor="currentColor" className="text-violet-500" />
            </linearGradient>
          </defs>
          <path
            fill="url(#blob-gradient)"
            d="M424.5,362.5Q362,475,249.5,458Q137,441,112.5,324Q88,207,200.5,159Q313,111,405,185.5Q497,260,424.5,362.5Z"
          />
        </svg>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="font-semibold text-lg">Медицинский Ассистент</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto max-w-5xl px-4 py-8 md:py-12 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-24">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>
            Медицинский AI-ассистент для диагностики на основе протоколов Казахстана
          </p>
        </div>
      </footer>
    </div>
  )
}
