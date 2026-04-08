export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="fixed bottom-0 z-40 bg-background/70 backdrop-blur-xl  w-full text-center text-sm text-muted-foreground py-2 border-t">
      &copy; {year} RMSTU Notice Hub. All rights reserved.{' '}
      <br className="block sm:hidden" />
      Developed by{' '}
      <a
        className="font-semibold text-primary"
        href="https://github.com/maopu2001"
        target="_blank"
        rel="noopener noreferrer"
      >
        M. Aktaruzzaman Opu.
      </a>
    </footer>
  )
}
