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

export const Route = createFileRoute('/notices/$typeID')({
  validateSearch: (search: Record<string, unknown>) => {
    const rawPage = Number(search.page)
    const page =
      Number.isFinite(rawPage) && rawPage > 1 ? Math.floor(rawPage) : undefined

    return { page }
  },
  loaderDeps: ({ search }) => ({ pageNo: search.page }),
  loader: ({ params, deps }) =>
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
            <Card
              key={index}
              className={`relative overflow-hidden ${notice.typeID == 2 || notice.typeID == 5 ? 'h-32' : 'h-75'}`}
            >
              <CardHeader>
                <Link
                  to="/notices/$typeID/$postID"
                  params={{
                    typeID: String(notice.typeID),
                    postID: String(notice.postID),
                  }}
                  search={{ page: undefined }}
                >
                  <CardTitle
                    className={`${notice.typeID == 5 ? 'line-clamp-3' : 'line-clamp-2'} leading-relaxed -mx-0.5 px-0.5`}
                  >
                    {notice.title}
                  </CardTitle>
                </Link>
                <CardDescription>{notice.date}</CardDescription>
              </CardHeader>
              {notice.img && (
                <CardContent className="absolute bottom-0 left-0 right-0 px-0">
                  <img
                    src={notice.img}
                    alt={notice.title}
                    className="w-full aspect-video object-top object-cover"
                  />
                </CardContent>
              )}
            </Card>
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
