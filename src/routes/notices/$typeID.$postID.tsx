import PdfViewer from '#/components/PDFViewer'
import { Loading } from '#/components/Loading'
import { getNotice } from '#/server/notices'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notices/$typeID/$postID')({
  loader: async ({ params }) => {
    const typeID = Number(params.typeID)
    const postID = Number(params.postID)

    const notice = await getNotice({ data: { typeID, postID } })

    return {
      typeID,
      postID,
      notice,
    }
  },
  pendingComponent: Loading,
  component: NoticePage,
})

function NoticePage() {
  const { notice } = Route.useLoaderData()

  return (
    <main className="p-4 max-w-300 w-9/10 mx-auto space-y-2">
      <h1 className="text-center text-xl font-semibold">{notice.title}</h1>
      <p className="text-center text-muted-foreground">
        Published on: {notice.date}
      </p>

      {notice.img && (
        <img
          src={notice.img}
          alt={notice.title}
          className="w-full object-top object-cover py-4 mx-auto"
        />
      )}

      {notice.text.length > 0 && (
        <div className="prose max-w-none mt-4 text-foreground">
          {notice.text.map((para, i) => (
            <p key={i} className="indent-4">
              {para}
            </p>
          ))}
        </div>
      )}

      {notice.pdf && <PdfViewer pdfUrl={notice.pdf} />}
    </main>
  )
}
