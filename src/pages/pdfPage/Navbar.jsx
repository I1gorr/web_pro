import React from "react";
import styled from "styled-components";

const Navbar = ({ onPdfSelect }) => {
  const pdfFiles = [
    { name: "23bce1370", path: "/23bce1370.pdf" },
    { name: "OS Module 1", path: "/os_1.pdf" },
    { name: "Module 3", path: "/os_3.pdf" },
    { name: "AI Notes", path: "/ai.pdf" },
    { name: "Document 5", path: "/document5.pdf" },
  ];

  return (
    <NavWrapper>
      <h2 className="title">PDF Documents</h2>
      <div className="nav-buttons">
        {pdfFiles.map((pdf, index) => (
          <button key={index} className="nav-button" onClick={() => onPdfSelect(pdf.path)}>
            {pdf.name}
          </button>
        ))}
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
`;

export default Navbar;
