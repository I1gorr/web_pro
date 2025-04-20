import styled from 'styled-components';

const Button = ({ onClick, disabled, children, className }) => {
  return (
    <StyledWrapper>
      <button className={`button ${className}`} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    display: inline-block;
    padding: 0;
    border: unset;
    border-radius: 15px;
    color: #212121;
    z-index: 1;
    background: #e8e8e8;
    position: relative;
    font-weight: 1000;
    font-size: 17px;
    -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
    box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
    transition: all 250ms;
    overflow: hidden;
    height: 50px; /* Fixed height */
    width: 100px; /* Fixed width */
    line-height: 50px; /* Center text vertically */
    text-align: center; /* Center text horizontally */
  }

  .button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    border-radius: 15px;
    background-color: #212121;
    z-index: -1;
    -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
    box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
    transition: all 250ms;
  }

  .button:hover {
    color: #e8e8e8;
  }

  .button:hover::before {
    width: 100%;
  }
`;

export default Button;