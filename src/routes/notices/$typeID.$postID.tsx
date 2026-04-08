import PdfViewer from '#/components/PDFViewer'
import { Loading } from '#/components/Loading'
import { getNotice } from '#/server/notices'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Home } from 'lucide-react'

export const Route = createFileRoute('/notices/$typeID/$postID')({
  loader: async ({ params }) => {
    const typeID = Number(params.typeID)
    const postID = Number(params.postID)
    const notice = await getNotice({ data: { typeID, postID } })
    return notice
  },
  pendingComponent: Loading,
  component: NoticePage,
})

function NoticePage() {
  const data = Route.useLoaderData()

  if (!data.title) {
    return (
      <div className="w-full h-[calc(100vh-10rem)] flex flex-col gap-5 items-center justify-center text-xl">
        <span className="text-center font-semibold">
          This notice could not be found.
        </span>
        <span>Status Code: 404</span>

        <Button className="w-fit" asChild>
          <Link to="/">
            <Home />
            <span>Go Home</span>
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="p-4 max-w-300 w-9/10 mx-auto space-y-2">
      <h1 className="text-center text-xl font-semibold">{data?.title}</h1>
      <p className="text-center text-muted-foreground">
        Published on: {data?.date}
      </p>

      {data?.img && (
        <img
          src={data.img}
          alt={data.title}
          className="w-full object-top object-cover py-4 mx-auto"
        />
      )}

      {(data?.text as string[]).length > 0 && (
        <div className="prose max-w-none mt-4 text-foreground">
          {data?.text.map((para, i) => (
            <p key={i} className="indent-4">
              {para}
            </p>
          ))}
        </div>
      )}

      {data?.pdf && <PdfViewer pdfUrl={data.pdf} />}
    </main>
  )
}
