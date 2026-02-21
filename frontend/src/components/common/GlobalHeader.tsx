import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Compass, Map as MapIcon } from 'lucide-react'
import { motion } from 'framer-motion'

function usePathname() {
  const [path, setPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/',
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handle = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handle)
    return () => window.removeEventListener('popstate', handle)
  }, [])

  return path
}

export function GlobalHeader() {
  const path = usePathname()
  const isMap = path.startsWith('/map') || path.startsWith('/nearby')
  const isHome = !isMap

  const navButton = (
    href: string,
    label: string,
    Icon: typeof MapIcon,
    active: boolean,
  ) => (
    <Button
      asChild
      variant={active ? 'secondary' : 'outline'}
      className="group gap-2 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
      aria-current={active ? 'page' : undefined}
    >
      <motion.a
        href={href}
        className="flex items-center gap-2"
        whileHover={{ scale: 1.02, rotate: -1 }}
        transition={{ duration: 0.12 }}
      >
        <Icon className="h-5 w-5" />
        <span className="hidden md:inline font-medium">{label}</span>
      </motion.a>
    </Button>
  )

  return (
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

        <div className="flex items-center gap-2">
          {navButton('/', 'Главная', Compass, isHome)}
          {navButton('/map', 'Карта', MapIcon, isMap)}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
