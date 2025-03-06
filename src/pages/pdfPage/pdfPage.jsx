import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./pdfPage.css";
import Navbar from "./Navbar";
import Button from "./Button";
import PopButton from "./PopButton";
import Chat from "./chat"; // Import Chat component

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function MyApp() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfPath, setPdfPath] = useState("/23bce1370.pdf");
  const [scale, setScale] = useState(1.5);
  const [showChat, setShowChat] = useState(false); // State to show/hide chat

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

  function toggleChat() {
    setShowChat((prev) => !prev);
  }

  return (
    <div className="app">
      <Navbar onPdfSelect={handlePdfSelect} />

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

      <div className="doc">
        <Document file={pdfPath} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
        <p className="pagenum">
          Page {pageNumber} of {numPages}
        </p>
      </div>

      {showChat && <Chat />} {/* Show Chat if showChat is true */}
      <PopButton toggleChat={toggleChat} />
    </div>
  );
}

export default MyApp;
