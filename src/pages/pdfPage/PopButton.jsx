import React from "react";
import styled from "styled-components";

const PopButton = ({ toggleChat }) => {
  return (
    <StyledWrapper>
      <div className="button">
        <button type="button" onClick={toggleChat} />
        <span />
        <span />
        <span />
        <span />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;

  .button {
    --primary-bg: #292524; /* Dark background */
    --primary-hover: #3f3a36; /* Slightly lighter hover */
    --accent-yellow: #facc15; /* Bright yellow */
    --accent-yellow-light: #fde047;
    --border-dark: #eab308;
    --shadow-dark: rgba(0, 0, 0, 0.25);

    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    cursor: pointer;
    border-radius: 50%;
    background: var(--primary-bg);
    box-shadow: 0 4px 10px var(--shadow-dark);
    transition: background 0.3s ease, transform 0.2s ease;

    &:hover {
      background: var(--primary-hover);
      transform: scale(1.05);
    }

    & > button {
      cursor: pointer;
      display: inline-block;
      height: 100%;
      width: 100%;
      appearance: none;
      border: 2px solid var(--border-dark);
      border-radius: 50%;
      background-color: var(--accent-yellow);
      outline: 2px solid transparent;
      outline-offset: 2px;
      transition: background-color 0.3s ease, transform 0.2s ease;

      &:hover {
        background-color: var(--accent-yellow-light);
      }
    }

    &::after {
      content: "+";
      font-size: 2rem;
      color: var(--primary-bg);
      font-weight: bold;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export default PopButton;
