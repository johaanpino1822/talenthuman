import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configuración del worker de PDF.js para Vercel
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFDocument {
  id: string;
  title: string;
  url: string;
  description?: string;
  size?: string;
}

interface PDFViewerProps {
  documents: PDFDocument[];
}

const PDFViewer: React.FC<PDFViewerProps> = ({ documents }) => {
  const [selectedDocument, setSelectedDocument] = useState<PDFDocument | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isClient, setIsClient] = useState(false);

  // Solución para hidratación en Vercel
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => (prevPageNumber || 1) + offset);
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const handleDownload = async (url: string, title: string) => {
    try {
      // Para Vercel, convertimos a URL absoluta
      const absoluteUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
      
      const response = await fetch(absoluteUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = title.endsWith('.pdf') ? title : `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Limpieza
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('Error al descargar el documento:', error);
      alert('Error al descargar el documento. Por favor intente nuevamente.');
    }
  };

  // Función para obtener la URL del documento compatible con Vercel
  const getDocumentUrl = (url: string) => {
    if (!isClient) return null;
    return url.startsWith('http') ? url : `${window.location.origin}${url}`;
  };

  if (!isClient) {
    return <div className="pdf-viewer-container">Cargando visor de PDF...</div>;
  }

  return (
    <div className="pdf-viewer-container">
      <div className="document-list">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Documentos Disponibles</h2>
        <ul className="space-y-4">
          {documents.map(doc => (
            <li key={doc.id} className="document-item bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="document-info">
                <h3 className="text-xl font-semibold text-gray-800">{doc.title}</h3>
                {doc.description && <p className="text-gray-600 mt-1">{doc.description}</p>}
                {doc.size && <p className="text-sm text-gray-500 mt-2">Tamaño: {doc.size}</p>}
              </div>
              <div className="document-actions mt-4 flex gap-3">
                <button 
                  onClick={() => setSelectedDocument(doc)}
                  className="view-button bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Ver Documento
                </button>
                <button 
                  onClick={() => handleDownload(doc.url, doc.title)}
                  className="download-button bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Descargar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedDocument && (
        <div className="pdf-preview fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="pdf-preview-header p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">{selectedDocument.title}</h2>
              <button 
                onClick={() => setSelectedDocument(null)}
                className="close-button text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="pdf-container p-4 overflow-auto flex-1">
              <Document
                file={getDocumentUrl(selectedDocument.url)}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="text-center py-8">Cargando documento...</div>}
                error={<div className="text-center py-8 text-red-500">Error al cargar el documento.</div>}
              >
                <Page 
                  pageNumber={pageNumber} 
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="border"
                />
              </Document>
            </div>

            <div className="pdf-navigation p-4 border-t flex items-center justify-center gap-4">
              <button 
                onClick={previousPage} 
                disabled={pageNumber <= 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Anterior
              </button>
              <span className="text-gray-700">
                Página {pageNumber} de {numPages || '--'}
              </span>
              <button 
                onClick={nextPage} 
                disabled={!!numPages && pageNumber >= numPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;