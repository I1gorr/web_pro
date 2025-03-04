import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const SignInPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ⬅️ Add this for navigation

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (location.state?.register !== undefined) {
      setIsRegister(location.state.register);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password, username } = formData;

    if (!email || !password || (isRegister && !username)) {
      alert("Please fill in all fields!");
      return;
    }

    console.log("Navigating to /forum..."); // Debugging
    navigate("/forum"); // ⬅️ Navigate after successful input
  };

  return (
    <StyledWrapper>
      <div className="card">
        <div className="head">{isRegister ? "Register" : "Login"}</div>
        <div className="content">
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input"
                value={formData.username}
                onChange={handleChange}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="button">
              {isRegister ? "Register" : "Login"}
            </button>
          </form>
          <button className="switch" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Switch to Login" : "Switch to Register"}
          </button>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: #2e1a62;

  .card {
    font-family: Montserrat, sans-serif;
    width: 320px;
    padding: 20px;
    background: #f1b400;
    border: 3px solid #e57c00;
    box-shadow: 12px 12px 0 #ff5700;
    text-align: center;
  }

  .head {
    font-size: 18px;
    font-weight: 900;
    background: #e57c00;
    color: #ffffff;
    padding: 10px;
    border-bottom: 3px solid #e57c00;
  }

  .content {
    padding: 15px;
  }

  .input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 3px solid #ffb400;
    font-size: 14px;
    background: #645dd7;
    color: #ffffff;
  }

  .button, .switch {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: 3px solid #645dd7;
    background: #ffb400;
    color: #000000;
    cursor: pointer;
    font-weight: 750;
    transition: all 0.3s ease;
  }

  .button:hover, .switch:hover {
    background: #4d47c3;
    color: #ffffff;
  }
`;

export default SignInPage;