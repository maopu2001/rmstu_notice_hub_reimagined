import { LoaderCircle, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark' | 'auto'

function getSystemMode(): Exclude<ThemeMode, 'auto'> {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto')
    return stored
  return 'auto'
}

function applyThemeMode(mode: ThemeMode): Exclude<ThemeMode, 'auto'> {
  const resolved = mode === 'auto' ? getSystemMode() : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)
  document.documentElement.style.colorScheme = resolved

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  return resolved
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')
  const [resolvedMode, setResolvedMode] =
    useState<Exclude<ThemeMode, 'auto'>>('light')
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    setResolvedMode(applyThemeMode(initialMode))
    setIsInitializing(false)
  }, [])

  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setResolvedMode(applyThemeMode('auto'))

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function toggleMode() {
    const currentMode = mode === 'auto' ? resolvedMode : mode
    const nextMode: ThemeMode = currentMode === 'dark' ? 'light' : 'dark'

    setMode(nextMode)
    setResolvedMode(applyThemeMode(nextMode))
    window.localStorage.setItem('theme', nextMode)
  }

  const label =
    mode === 'auto'
      ? `Theme mode: auto (system ${resolvedMode}). Click to switch to ${resolvedMode === 'dark' ? 'light' : 'dark'} mode.`
      : `Theme mode: ${mode}. Click to switch mode.`

  if (isInitializing) {
    return (
      <button
        type="button"
        aria-label="Loading theme preference"
        title="Loading theme preference"
        aria-busy="true"
        disabled
        className="relative inline-flex h-8 w-16 items-center justify-center rounded-full border border-border bg-background px-1 shadow-sm"
      >
        <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="relative inline-flex h-8 w-16 items-center rounded-full border border-border bg-background px-1 shadow-sm transition hover:bg-accent"
    >
      <span
        className={`absolute size-6.5 rounded-full bg-primary transition-transform duration-200 ${resolvedMode === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}
      />
      <span className="relative z-10 grid gap-1 w-full grid-cols-2 place-content-center *:mx-auto">
        <span
          className={
            resolvedMode === 'light'
              ? 'text-primary-foreground'
              : 'text-muted-foreground'
          }
        >
          <Sun className="size-4" />
        </span>
        <span
          className={
            resolvedMode === 'dark'
              ? 'text-primary-foreground'
              : 'text-muted-foreground'
          }
        >
          <Moon className="size-4" />
        </span>
      </span>
    </button>
  )
}
