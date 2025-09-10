import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Aponta para o worker local do pacote pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc =
  "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


// Configuração do worker do pdf.js
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfPreviewProps {
    fileUrl: string; // pode ser URL (http://) ou blob/base64
    onClose: () => void;
}

export default function PdfPreview({ fileUrl, onClose }: PdfPreviewProps) {
    const [numPages, setNumPages] = useState<number>(0);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-4/5 h-4/5 p-4 overflow-auto relative shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 px-3 py-1 rounded bg-red-600 text-white"
                >
                    Fechar
                </button>

                <Document
                    file={fileUrl}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                >
                    {Array.from(new Array(numPages), (_, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            className="mb-4 flex justify-center"
                        />
                    ))}
                </Document>
            </div>
        </div>
    );
}
