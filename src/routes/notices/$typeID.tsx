import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '#/components/ui/pagination'
import { Loading } from '#/components/Loading'
import { getAllNotices } from '#/server/notices'
import {
  Link,
  Outlet,
  createFileRoute,
  useRouterState,
} from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Home } from 'lucide-react'

export const Route = createFileRoute('/notices/$typeID')({
  validateSearch: (search: Record<string, unknown>) => {
    const rawPage = Number(search.page)
    const page =
      Number.isFinite(rawPage) && rawPage > 1 ? Math.floor(rawPage) : undefined

    return { page }
  },
  loaderDeps: ({ search }) => ({ pageNo: search.page }),
  loader: async ({ params, deps }) =>
    getAllNotices({
      data: {
        typeID: Number(params.typeID),
        pageNo: deps.pageNo,
      },
    }),
  pendingComponent: Loading,
  component: NoticesPage,
})

function NoticesPage() {
  const data = Route.useLoaderData()

  if (data?.error) {
    return (
      <div className="w-full h-[calc(100vh-10rem)] flex flex-col gap-5 items-center justify-center text-xl">
        <span className="text-center font-semibold">
          {data.error || 'An unexpected error occurred.'}
        </span>
        <span>Status Code: {data.status}</span>

        <Button className="w-fit" asChild>
          <Link to="/">
            <Home />
            <span>Go Home</span>
          </Link>
        </Button>
      </div>
    )
  }
  const search = Route.useSearch()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isDetailPage = pathname.split('/').filter(Boolean).length > 2
  const currentPage = search.page ?? 1

  if (isDetailPage) {
    return <Outlet />
  }

  const pageHref = (page: number) =>
    page > 1 ? `?page=${page}` : `/notices/${data.typeID}`

  return (
    <main className="p-4">
      <h1 className="text-center text-3xl font-semibold">
        {data?.noticeTitle}
      </h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
        {(data.noticeSummaries.length === 0 && (
          <p className="text-center col-span-full">
            No {data?.noticeTitle || 'Notices'} found.
          </p>
        )) ||
          data?.noticeSummaries.map((notice, index) => (
            <Link
              key={index}
              to="/notices/$typeID/$postID"
              params={{
                typeID: String(notice.typeID),
                postID: String(notice.postID),
              }}
              search={{ page: undefined }}
            >
              <Card
                className={`relative overflow-hidden pb-0 ${notice.typeID == 2 || notice.typeID == 5 ? 'h-32' : 'h-fit'}`}
              >
                <CardHeader>
                  <CardTitle
                    className={`${notice.typeID == 5 ? 'line-clamp-3' : 'line-clamp-2'} leading-relaxed -mx-0.5 px-0.5`}
                  >
                    {notice.title}
                  </CardTitle>

                  <CardDescription>{notice.date}</CardDescription>
                </CardHeader>
                {notice.img && (
                  <CardContent className="px-0">
                    <img
                      src={notice.img}
                      alt={notice.title}
                      className="w-full aspect-video object-top object-cover"
                    />
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
      </div>

      <Pagination className="mt-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={pageHref(currentPage - 1)}
              disabled={currentPage <= 1}
            />
          </PaginationItem>

          {Array.from({ length: data.totalPage }, (_, i) => (
            <PaginationItem key={i + 1} className="hidden lg:block">
              <PaginationLink
                href={pageHref(i + 1)}
                isActive={i + 1 === currentPage}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {Array.from({ length: data.totalPage }, (_, i) => i + 1)
            .filter((page) => {
              const start = Math.max(1, currentPage - 2)
              const end = Math.min(data.totalPage, currentPage + 2)
              let finalStart = start
              let finalEnd = end
              if (currentPage <= 3) finalEnd = Math.min(5, data.totalPage)
              else if (currentPage > data.totalPage - 2)
                finalStart = Math.max(1, data.totalPage - 4)

              return page >= finalStart && page <= finalEnd
            })
            .map((page) => (
              <PaginationItem key={page} className="block lg:hidden">
                <PaginationLink
                  href={pageHref(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

          <PaginationItem>
            <PaginationNext
              href={pageHref(currentPage + 1)}
              disabled={currentPage >= data.totalPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  )
}
