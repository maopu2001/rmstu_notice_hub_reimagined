export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="fixed bg-foreground/10 backdrop-blur-xl z-40 bottom-0 w-full text-center text-sm text-muted-foreground py-2 border-t ">
        &copy; {year} RMSTU Notice Hub. All rights reserved. Developed by{' '}
        <a
          className="font-semibold text-primary"
          href="https://github.com/maopu2001"
          target="_blank"
          rel="noopener noreferrer"
        >
          M. Aktaruzzaman Opu.
        </a>
      </div>
    </footer>
  )
}
