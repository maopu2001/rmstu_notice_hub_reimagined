import { noticeTitles } from '#/lib/noticeTitle'
import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { Button } from './ui/button'

export default function Header() {
  return (
    <header className="border-b border-foreground/20 w-full h-20 flex items-center justify-between px-10 fixed top-0 bg-foreground/10 backdrop-blur-lg z-40">
      <Link to="/" className="font-bold text-2xl flex items-center gap-2">
        <img
          src="/logo512.webp"
          alt="RMSTU Notice Board Logo"
          className="size-10"
        />
        <span>RMSTU Notice Hub</span>
      </Link>
      <div className="space-x-2 flex items-center">
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
    </header>
  )
}
