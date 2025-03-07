import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./pdfPage.css";
import Navbar from "./Navbar";
import Chat from "./chat";
import Button from "./Button";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function MyApp() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfPath, setPdfPath] = useState("/23bce1370.pdf");
  const [scale, setScale] = useState(1.5);
  const [showNavbar, setShowNavbar] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function goToNextPage() {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  }

  function goToPreviousPage() {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  }

  function handlePdfSelect(path) {
    setPdfPath(path);
    setPageNumber(1);
  }

  function zoomIn() {
    setScale(scale + 0.2);
  }

  function zoomOut() {
    if (scale > 0.6) {
      setScale(scale - 0.2);
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
        <div className="pdf-viewer">
          <div className="doc">
            <Document file={pdfPath} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} scale={scale} />
            </Document>
            <p className="pagenum">
              Page {pageNumber} of {numPages}
            </p>
          </div>
          <div className="controls">
            <Button onClick={goToPreviousPage} disabled={pageNumber <= 1}>
              ←
            </Button>
            <Button onClick={goToNextPage} disabled={pageNumber >= numPages}>
              →
            </Button>
            <Button onClick={zoomOut} disabled={scale <= 0.6}>
              ➖
            </Button>
            <Button onClick={zoomIn}>
              ➕
            </Button>
          </div>
        </div>
        
        <div className="chat-box">
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default MyApp;