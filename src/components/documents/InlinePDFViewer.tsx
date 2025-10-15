import React, { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
// Vite-friendly worker import
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker

interface InlinePDFViewerProps {
  fileUrl: string
  className?: string
}

const InlinePDFViewer: React.FC<InlinePDFViewerProps> = ({ fileUrl, className }) => {
  const [numPages, setNumPages] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState<number>(800)

  useEffect(() => {
    const updateWidth = () => {
      const w = containerRef.current?.clientWidth || 800
      setWidth(Math.min(w, 1000))
    }
    updateWidth()
    const ro = new ResizeObserver(updateWidth)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={className}>
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages)
          setError(null)
        }}
        onLoadError={(e) => setError((e as Error).message)}
        loading={<p className="text-center text-muted-foreground py-6">Loading NDA…</p>}
        error={<p className="text-center text-destructive py-6">Failed to load the NDA.</p>}
      >
        {Array.from(new Array(numPages), (_el, index) => (
          <div key={`page_${index + 1}`} className="mb-4 flex justify-center">
            <Page pageNumber={index + 1} width={Math.floor(width)} renderAnnotationLayer renderTextLayer />
          </div>
        ))}
      </Document>
      {error && (
        <p className="text-center text-destructive text-sm">{error}</p>
      )}
    </div>
  )
}

export default InlinePDFViewer
