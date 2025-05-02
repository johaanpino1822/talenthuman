import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configuración del worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => (prevPageNumber || 1) + offset);
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const handleDownload = (url: string, title: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title.endsWith('.pdf') ? title : `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pdf-viewer-container">
      <div className="document-list">
        <h2>Documentos Disponibles</h2>
        <ul>
          {documents.map(doc => (
            <li key={doc.id} className="document-item">
              <div className="document-info">
                <h3>{doc.title}</h3>
                {doc.description && <p>{doc.description}</p>}
                {doc.size && <p className="document-size">Tamaño: {doc.size}</p>}
              </div>
              <div className="document-actions">
                <button 
                  onClick={() => setSelectedDocument(doc)}
                  className="view-button"
                >
                  Ver Documento
                </button>
                <button 
                  onClick={() => handleDownload(doc.url, doc.title)}
                  className="download-button"
                >
                  Descargar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedDocument && (
        <div className="pdf-preview">
          <div className="pdf-preview-header">
            <h2>{selectedDocument.title}</h2>
            <button 
              onClick={() => setSelectedDocument(null)}
              className="close-button"
            >
              Cerrar
            </button>
          </div>
          
          <div className="pdf-container">
            <Document
              file={selectedDocument.url}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div>Cargando documento...</div>}
              error={<div>Error al cargar el documento.</div>}
            >
              <Page 
                pageNumber={pageNumber} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>

          <div className="pdf-navigation">
            <button 
              onClick={previousPage} 
              disabled={pageNumber <= 1}
            >
              Anterior
            </button>
            <span>
              Página {pageNumber} de {numPages}
            </span>
            <button 
              onClick={nextPage} 
              disabled={!!numPages && pageNumber >= numPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;