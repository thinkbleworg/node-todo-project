import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/auth";
import { requestAPI } from '../utils/request';
import { LOGIN_URL } from '../constants/url-constants';
import { PAGES } from '../constants/constants';

const Login = ({setIsAuthenticated}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await requestAPI("POST", LOGIN_URL, {
        email,
        password,
      });

      // Save the token in localStorage or state
      const { token } = response.data;
      setToken(token); // Utility function to store token
      setIsAuthenticated(true);

      // Navigate to dashboard or tasks page
      navigate(`/${PAGES.TASKS}`);
    } catch (error) {
      setErrorMessage('Invalid credentials or server error');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
