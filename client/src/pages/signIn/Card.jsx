import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const SignInPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ⬅️ Navigation hook

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
      <div id="auth-card">
        <div id="auth-header">{isRegister ? "Register" : "Login"}</div>
        <div id="auth-content">
          <form id="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <input
                type="text"
                id="username-input"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            )}
            <input
              type="email"
              id="email-input"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              id="password-input"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" id="submit-btn">
              {isRegister ? "Register" : "Login"}
            </button>
          </form>
          <button id="toggle-auth-btn" onClick={() => setIsRegister(!isRegister)}>
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

  #auth-card {
    font-family: Montserrat, sans-serif;
    width: 320px;
    padding: 20px;
    background: #f1b400;
    border: 3px solid #e57c00;
    box-shadow: 12px 12px 0 #ff5700;
    text-align: center;
  }

  #auth-header {
    font-size: 18px;
    font-weight: 900;
    background: #e57c00;
    color: #ffffff;
    padding: 10px;
    border-bottom: 3px solid #e57c00;
  }

  #auth-content {
    padding: 15px;
  }

  #username-input,
  #email-input,
  #password-input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 3px solid #ffb400;
    font-size: 14px;
    background: #645dd7;
    color: #ffffff;
  }

  #submit-btn {
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

  #submit-btn:hover {
    background: #4d47c3;
    color: #ffffff;
  }

  #toggle-auth-btn {
    width: auto;
    display: inline-block;
    padding: 10px 15px;
    margin-top: 10px;
    border: 3px solid #645dd7;
    background: #ffb400;
    color: #000000;
    cursor: pointer;
    font-weight: 750;
    transition: all 0.3s ease;
    text-align: center;
  }

  #toggle-auth-btn:hover {
    background: #4d47c3;
    color: #ffffff;
  }
`;

export default SignInPage;
