import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getToken, removeToken } from "../utils/auth";

function Navbar() {
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    const interval = setInterval(() => {
      setToken(getToken());
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    removeToken();
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between" }}>
      <h2>InterviewBuddy</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <Link to="/">Home</Link>

        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/history">History</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;