import { noticeTitles } from '#/lib/noticeTitle'
import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { Button } from './ui/button'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="flex items-center justify-between border-b border-foreground/20 w-full h-20 px-4 lg:px-10 fixed top-0 bg-background/70 backdrop-blur-lg z-41">
      <Link to="/" className="font-bold text-2xl flex items-center gap-2">
        <img
          src="/logo512.webp"
          alt="RMSTU Notice Board Logo"
          className="size-10"
        />
        <span>RMSTU Notice Hub</span>
      </Link>

      {/* for PC */}
      <div className="hidden lg:flex items-center space-x-2">
        {noticeTitles.map((t, i) => (
          <Button asChild key={i}>
            <Link
              to="/notices/$typeID"
              params={{ typeID: String(t.i) }}
              search={{ page: undefined }}
            >
              {t.title}
            </Link>
          </Button>
        ))}
        <div className="">
          <ThemeToggle />
        </div>
      </div>
      {/* for Mobile */}
      <div className="flex lg:hidden">
        <Button
          variant="ghost"
          className="text-primary"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <PanelRightOpen
            className={`size-6 ${isMenuOpen ? 'hidden' : 'block'}`}
          />
        </Button>
        {/* Panel */}
        <div
          className={`fixed z-50 top-0 right-0 w-4/5 max-w-100 h-svh bg-black backdrop-blur-2xl px-8 py-8 flex flex-col items-start gap-4 transition-transform duration-300 ease-in-out transform-gpu origin-top-right lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <Button
            variant="ghost"
            className="text-primary size-8"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <PanelRightClose className={`size-6`} />
          </Button>

          {noticeTitles.map((t, i) => (
            <Button
              asChild
              key={i}
              variant="ghost"
              className="text-white px-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Link
                to="/notices/$typeID"
                params={{ typeID: String(t.i) }}
                search={{ page: undefined }}
              >
                {t.title}
              </Link>
            </Button>
          ))}
          <div className="absolute bottom-10 text-white font-semibold space-x-2 flex items-center">
            <span>Toggle Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
