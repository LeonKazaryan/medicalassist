import { useEffect, useState } from 'react'
import { Map as MapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

function isMapPath(pathname: string) {
  return pathname.startsWith('/map') || pathname.startsWith('/nearby')
}

export function MapNavButton() {
  const [path, setPath] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '',
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPath(window.location.pathname)
    }
  }, [])

  const active = isMapPath(path)

  return (
    <Button
      asChild
      variant={active ? 'secondary' : 'outline'}
      className="group gap-2 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
      aria-current={active ? 'page' : undefined}
    >
      <a href="/map" className="flex items-center gap-2">
        <MapIcon className="h-5 w-5 transition-transform duration-150 group-hover:-rotate-3" />
        <span className="hidden md:inline font-medium">Карта</span>
      </a>
    </Button>
  )
}
