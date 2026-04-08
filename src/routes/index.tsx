import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { noticeTitle, noticeTitles } from '#/lib/noticeTitle'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72" />

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-14 pt-12 sm:px-6 xl:grid-cols-2 lg:px-8 lg:pt-20">
        <div className="animate-in fade-in duration-300 flex flex-col justify-center items-center">
          <div>
            <img
              src="/logo512.webp"
              alt="RMSTU Notice Board Logo"
              className="mx-auto h-60 sm:h-80 w-auto"
            />
          </div>

          <h1 className="mt-2 font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-6xl">
            RMSTU Notice Hub
          </h1>

          <p className=" max-w-2xl text-base text-muted-foreground sm:text-lg">
            Stay updated with every important RMSTU notice.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link
                to="/notices/$typeID"
                params={{ typeID: '1' }}
                search={{ page: undefined }}
              >
                Explore Latest News
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <a
                href="https://rmstu.ac.bd"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit RMSTU Website
              </a>
            </Button>
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <Card className="animate-in fade-in duration-300 lg:mt-4 h-fit w-80 sm:w-120">
            <CardHeader>
              <CardTitle className="text-xl">Quick Access</CardTitle>
              <CardDescription>
                Jump directly to the notice stream you are looking for.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {noticeTitles.map((t) => {
                const Icon = t.icon
                return (
                  <Link
                    key={t.i}
                    to="/notices/$typeID"
                    params={{ typeID: String(t.i) }}
                    search={{ page: undefined }}
                    className="group flex items-center justify-between rounded-lg border bg-background px-3 py-3 transition hover:border-primary/40 hover:bg-accent/40"
                  >
                    <span className="inline-flex items-center gap-2 text-sm font-medium">
                      <Icon className="size-4 text-primary" />
                      {noticeTitle(t.i)}
                    </span>
                    <ArrowRight className="size-4 text-muted-foreground transition group-hover:text-primary" />
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
