import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Button } from './ui/button'

type ReactPdfModule = typeof import('react-pdf')
type ReactPdfComponents = Pick<ReactPdfModule, 'Document' | 'Page'>

export default function PdfViewer({ pdfUrl }: { pdfUrl: string }) {
  const [reactPdf, setReactPdf] = useState<ReactPdfComponents | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [loadError, setLoadError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState<number>()

  useEffect(() => {
    if (!reactPdf) {
      return
    }

    const container = containerRef.current

    if (!container) {
      return
    }

    const resize = () => {
      const nextWidth = Math.floor(container.offsetWidth)
      setWidth((prevWidth) => (prevWidth !== nextWidth ? nextWidth : prevWidth))
    }

    resize()
    const frameId = window.requestAnimationFrame(resize)
    window.addEventListener('resize', resize)

    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(resize)
      observer.observe(container)
    }

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      observer?.disconnect()
    }
  }, [reactPdf])

  useEffect(() => {
    let isActive = true

    const loadReactPdf = async () => {
      const module = await import('react-pdf')
      module.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${module.pdfjs.version}/build/pdf.worker.min.mjs`

      if (isActive) {
        setReactPdf({
          Document: module.Document,
          Page: module.Page,
        })
      }
    }

    loadReactPdf().catch((error) => {
      setLoadError('Failed to initialize PDF viewer. Please try again.')
      console.error('Error initializing PDF viewer:', error)
    })

    return () => {
      isActive = false
    }
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
    setLoadError(null)
  }

  function onDocumentLoadError(error: Error) {
    setLoadError('Failed to load this PDF. Please try again.')
    console.error('Error loading PDF:', error)
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1))

  if (!reactPdf && !loadError) {
    return <div className="p-4 text-center">Loading PDF viewer...</div>
  }

  const Document = reactPdf?.Document
  const Page = reactPdf?.Page

  return (
    <div className="flex flex-col items-center p-4">
      {loadError ? (
        <div className="p-6 text-center space-y-3 max-w-150">
          <p className="text-destructive font-semibold border px-10 py-4 border-destructive flex flex-col items-center gap-2">
            <span>PDF Not Found</span>
            <span className="text-sm font-normal">Error Code: 404</span>
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-4">
            <Button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="rounded-full size-8"
              size="icon"
            >
              <ArrowLeft />
            </Button>
            <p>
              Page {pageNumber} of {numPages || '--'}
            </p>
            <Button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="rounded-full size-8"
              size="icon"
            >
              <ArrowRight />
            </Button>
          </div>
          <div
            ref={containerRef}
            className="w-full max-w-150 h-full border border-gray-300 shadow-lg inline-block"
          >
            {Document && Page ? (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<div className="p-4 text-center">Loading PDF...</div>}
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  width={
                    typeof width === 'number' ? Math.min(width, 600) : undefined
                  }
                />
              </Document>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
