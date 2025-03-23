import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Used for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check static credentials
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true); // ✅ Set login state to true
      setError("");
      navigate("/home"); // Redirect to Home after successful login
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="login-title">Admin Login</h1>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <label htmlFor="username" className="input-label">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
