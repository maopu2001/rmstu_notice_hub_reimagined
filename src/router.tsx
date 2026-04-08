import {
  createRouter as createTanStackRouter,
  Link,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen.ts'
import { Button } from './components/ui/button.tsx'
import { Home } from 'lucide-react'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: () => (
      <div className="w-full h-[calc(100vh-10rem)] flex flex-col gap-5 items-center justify-center text-xl">
        404 - Page Not Found
        <Button className="w-fit" asChild>
          <Link to="/">
            <Home />
            <span>Go Home</span>
          </Link>
        </Button>
      </div>
    ),
    defaultErrorComponent: () => (
      <div className="w-full h-[calc(100vh-10rem)] flex flex-col gap-5 items-center justify-center text-xl">
        404 - Page Not Found
        <Button className="w-fit" asChild>
          <Link to="/">
            <Home />
            <span>Go Home</span>
          </Link>
        </Button>
      </div>
    ),
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
