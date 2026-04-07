import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'RMSTU Notice Hub',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

const queryClient = new QueryClient()

const THEME_INIT_SCRIPT = `(function () {
  try {
    var stored = window.localStorage.getItem('theme')
    var mode =
      stored === 'light' || stored === 'dark' || stored === 'auto'
        ? stored
        : 'auto'
    var resolved =
      mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : mode === 'auto'
          ? 'light'
          : mode
    var root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)
    root.style.colorScheme = resolved

    if (mode === 'auto') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', mode)
    }
  } catch (error) {
    // Ignore failures and fall back to default theme.
  }
})()`

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere min-h-svh bg-linear-to-b from-primary/20 via-accent/10 to-transparent">
        <QueryClientProvider client={queryClient}>
          <Header />
          <div className="pt-20 pb-15">{children}</div>
          <Footer />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
