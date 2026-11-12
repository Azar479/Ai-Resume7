import { useState, useEffect, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  RotateCcw,
  Eye,
  Code2,
  Download,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { DocumentBlueprint } from '../types';

// Configure Mozilla PDF.js worker using ESM URL
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
} catch (_e) {
  // Fallback to unpkg CDN if URL constructor fails
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

interface DocumentViewerProps {
  pdfBase64: string | null;
  fileName: string | null;
  resumeText: string;
  candidateName: string;
  candidateContact: string;
  blueprint?: DocumentBlueprint | null;
  isLoading?: boolean;
  onClearDocument?: () => void;
}

function base64ToUint8Array(base64: string): Uint8Array {
  const clean = base64.replace(/^data:application\/pdf;base64,/, '').trim();
  const binaryString = atob(clean);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function DocumentViewer({
  pdfBase64,
  fileName,
  resumeText,
  candidateName,
  candidateContact,
  blueprint,
  isLoading = false,
  onClearDocument,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState<number>(100);
  const [viewMode, setViewMode] = useState<'document' | 'text'>('document');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);
  const [pdfRenderError, setPdfRenderError] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<any>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 70));
  const handleResetZoom = () => setZoom(100);

  // 1. Load PDF Document from base64
  useEffect(() => {
    let isCancelled = false;

    if (!pdfBase64) {
      pdfDocRef.current = null;
      setNumPages(Math.max(1, Math.ceil((resumeText || '').length / 2800)));
      setPdfRenderError(null);
      return;
    }

    const loadPdf = async () => {
      try {
        setIsPdfLoading(true);
        setPdfRenderError(null);

        const pdfData = base64ToUint8Array(pdfBase64);
        const loadingTask = pdfjsLib.getDocument({
          data: pdfData,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setCurrentPage(1);
      } catch (err: any) {
        if (isCancelled) return;
        console.error('Failed to parse PDF document with PDF.js:', err);
        setPdfRenderError(err.message || 'Unable to parse PDF visually');
      } finally {
        if (!isCancelled) {
          setIsPdfLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfBase64]);

  // 2. Render Page onto Canvas whenever page, zoom, or doc changes
  useEffect(() => {
    let isCancelled = false;
    const canvas = canvasRef.current;
    const pdfDoc = pdfDocRef.current;

    if (!canvas || !pdfDoc || viewMode !== 'document') {
      return;
    }

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (_e) {
            // Task might already be completed
          }
          renderTaskRef.current = null;
        }

        const page = await pdfDoc.getPage(currentPage);
        if (isCancelled) return;

        const dpr = window.devicePixelRatio || 1;
        const scale = (zoom / 100) * 1.35;
        const viewport = page.getViewport({ scale: scale * dpr });

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
        canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;

        await task.promise;
        renderTaskRef.current = null;
      } catch (err: any) {
        if (err?.name === 'RenderingCancelledException') {
          return;
        }
        if (!isCancelled) {
          console.error('Error rendering PDF page to canvas:', err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (_e) {
          // Ignore
        }
      }
    };
  }, [currentPage, zoom, viewMode, pdfBase64]);

  const totalPages = numPages || Math.max(1, Math.ceil((resumeText || '').length / 2800));

  return (
    <div className="bg-white border border-zinc-200/90 rounded-2xl flex flex-col h-full shadow-xs overflow-hidden">
      {/* Top Document Inspection Bar */}
      <div className="px-4 py-3 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3 bg-zinc-50/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-900 flex items-center gap-2">
              <span className="truncate max-w-[200px] sm:max-w-xs">
                {fileName || `${candidateName || 'Uploaded'} Resume`}
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                <FileCheck2 className="w-3 h-3 text-emerald-600" />
                Original Document
              </span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              Page {currentPage} of {totalPages} · Zoom {zoom}%
            </div>
          </div>
        </div>

        {/* Action & Zoom Dock */}
        <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-xl p-1 shadow-2xs">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="px-2 py-1 text-[11px] font-mono font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-colors"
            title="Reset Zoom to 100%"
          >
            {zoom}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            title="Fit to Width"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-zinc-200 mx-1" />

          {/* Mode Switcher */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('document')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'document'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
              title="Rendered Document Image View"
            >
              <Eye className="w-3 h-3 text-rose-400" />
              <span>Document</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('text')}
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'text'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
              title="Extracted Text View"
            >
              <Code2 className="w-3 h-3 text-zinc-400" />
              <span>Text</span>
            </button>
          </div>

          {pdfBase64 && (
            <>
              <div className="h-4 w-px bg-zinc-200 mx-1" />
              <a
                href={pdfBase64}
                download={fileName || 'resume.pdf'}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-zinc-100 transition-colors flex items-center"
                title="Download original uploaded PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </>
          )}

          {onClearDocument && (
            <>
              <div className="h-4 w-px bg-zinc-200 mx-1" />
              <button
                type="button"
                onClick={onClearDocument}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-600 hover:bg-zinc-100 transition-colors"
                title="Change or upload different resume"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 bg-zinc-100/70 overflow-auto p-4 sm:p-6 flex items-start justify-center min-h-[460px] max-h-[640px]">
        {isLoading || isPdfLoading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3">
            <div className="w-8 h-8 border-3 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
            <div className="text-xs text-zinc-700 font-semibold">
              Rendering high-resolution document image...
            </div>
          </div>
        ) : viewMode === 'text' ? (
          <div className="w-full h-full max-w-2xl bg-white border border-zinc-200 rounded-xl p-4 font-mono text-xs text-zinc-800 whitespace-pre-wrap leading-relaxed overflow-auto shadow-xs">
            {resumeText}
          </div>
        ) : pdfBase64 && !pdfRenderError ? (
          /* Real High-Resolution Canvas Rendered by Mozilla PDF.js */
          <div className="flex flex-col items-center justify-center w-full transition-all">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-zinc-200 p-1 flex justify-center">
              <canvas
                ref={canvasRef}
                className="block max-w-full rounded shadow-xs bg-white"
              />
            </div>
          </div>
        ) : (
          /* Rendered Paper Document Sheet (For Presets, Text, or PDF Parse Fallback) */
          <div
            className="w-full flex justify-center transition-transform origin-top"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <div className="w-full max-w-2xl bg-white text-slate-900 rounded-xl shadow-lg p-8 sm:p-12 border border-slate-200 font-sans leading-relaxed">
              {pdfRenderError && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    Rendered in document sheet mode from extracted content.
                  </span>
                </div>
              )}

              {/* Header */}
              <div
                className={`pb-4 mb-4 border-b border-slate-200 ${
                  blueprint?.header_alignment === 'left' ? 'text-left' : 'text-center'
                }`}
              >
                <h2 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                  {candidateName || 'Candidate Name'}
                </h2>
                {candidateContact && (
                  <p className="text-xs text-slate-600 mt-1.5 font-sans leading-relaxed">
                    {candidateContact}
                  </p>
                )}
              </div>

              {/* Document Body Formatted Exactly */}
              <div className="text-xs text-slate-800 space-y-4 font-sans whitespace-pre-wrap leading-relaxed">
                {resumeText}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Page Navigation Footer */}
      <div className="px-4 py-2.5 border-t border-zinc-200 bg-white flex items-center justify-between text-[11px] text-zinc-500 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span className="font-medium text-zinc-700">
            {pdfBase64 && !pdfRenderError ? 'PDF Document Canvas Ready' : 'Document Image Ready'}
          </span>
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="px-2 py-0.5 rounded text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:text-zinc-600 transition-colors font-semibold"
          >
            ◀ Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="px-2 py-0.5 rounded text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:text-zinc-600 transition-colors font-semibold"
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}
