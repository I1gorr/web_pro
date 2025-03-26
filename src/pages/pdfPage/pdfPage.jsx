import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./pdfPage.css";
import Navbar from "./Navbar";
import Chat from "./chat";
import Button from "./Button";

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function MyApp() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfPath, setPdfPath] = useState(null);
  const [scale, setScale] = useState(1.5);
  const [showNavbar, setShowNavbar] = useState(false);

  // Log state updates
  useEffect(() => {
    console.log(`📄 PDF Loaded: ${pdfPath}, Pages: ${numPages}, Current Page: ${pageNumber}`);
  }, [pdfPath, numPages, pageNumber]);

  function onDocumentLoadSuccess({ numPages }) {
    console.log("✅ PDF Loaded Successfully! Total Pages:", numPages);
    setNumPages(numPages);
    setPageNumber(1);
  }

  function goToNextPage() {
    if (pageNumber < numPages) {
      setPageNumber((prevPage) => prevPage + 1);
    }
  }

  function goToPreviousPage() {
    if (pageNumber > 1) {
      setPageNumber((prevPage) => prevPage - 1);
    }
  }

  function handlePdfSelect(path) {
    console.log("📂 New PDF Selected:", path);
    setPdfPath(path);
    setNumPages(null);
    setPageNumber(1);
  }

  function zoomIn() {
    setScale((prevScale) => prevScale + 0.2);
  }

  function zoomOut() {
    if (scale > 0.6) {
      setScale((prevScale) => prevScale - 0.2);
    }
  }

  function toggleNavbar() {
    setShowNavbar((prev) => !prev);
  }

  return (
    <div className="app">
      <button className="nav-toggle" onClick={toggleNavbar}>
        ☰
      </button>
      <div className={`navbar ${showNavbar ? "open" : "closed"}`}>
        <Navbar onPdfSelect={handlePdfSelect} />
      </div>

      <div className="content">
        {/* PDF Viewer Section */}
        <div className="pdf-viewer">
          <div className="doc">
            {pdfPath ? (
              <Document
                file={pdfPath}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<p>Loading PDF...</p>}
              >
                <Page pageNumber={pageNumber} scale={scale} />
              </Document>
            ) : (
              <p className="no-pdf">No PDF selected</p>
            )}
          </div>

          {/* Controls */}
          {numPages && (
            <div className="controls">
              <Button onClick={goToPreviousPage} disabled={pageNumber <= 1}>
                ←
              </Button>

              {/* Page Number Indicator */}
              <span className="pagenum">
                {pageNumber} / {numPages}
              </span>

              <Button onClick={goToNextPage} disabled={pageNumber >= numPages}>
                →
              </Button>

              <Button onClick={zoomOut} disabled={scale <= 0.6}>
                ➖
              </Button>
              <Button onClick={zoomIn}>➕</Button>
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="chat-box">
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default MyApp;
