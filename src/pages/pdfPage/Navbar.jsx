import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Navbar = ({ onPdfSelect }) => {
  const [pdfFiles, setPdfFiles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/list-pdfs") // Fetch the available PDFs
      .then((res) => res.json())
      .then((data) => setPdfFiles(data))
      .catch((error) => console.error("Error fetching PDFs:", error));
  }, []);

  return (
    <NavWrapper>
      <h2 className="title">Available PDFs</h2>
      <div className="nav-buttons">
        {pdfFiles.length > 0 ? (
          pdfFiles.map((pdf, index) => (
            <button
              key={index}
              className="nav-button"
              onClick={() => onPdfSelect(`http://localhost:5000/pdfs/${pdf}`)}
            >
              {pdf}
            </button>
          ))
        ) : (
          <p className="no-files">No PDFs found</p>
        )}
      </div>
    </NavWrapper>
  );
};

const NavWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  background: #393088;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  font-family: Helvetica, sans-serif;

  .title {
    text-align: center;
    color: #FDFEFE;
    letter-spacing: 2px;
    margin-bottom: 15px;
  }

  .nav-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .nav-button {
    background: #8988E1;
    color: #FDFEFE;
    border: none;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease-in-out;
  }

  .nav-button:hover {
    background: #F7BA6F;
    transform: scale(1.05);
  }

  .nav-button:active {
    background: #F38701;
  }

  .no-files {
    color: #ffcccb;
    text-align: center;
    font-size: 14px;
  }
`;

export default Navbar;
