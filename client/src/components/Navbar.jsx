import { Link } from "react-router-dom";

function Navbar() {

  // check login
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");

    // refresh app
    window.location.href = "/login";
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
      }}
    >
      <h2>InterviewBuddy</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <Link to="/">Home</Link>
        {token && (
          <Link to= "/dashboard">
            Dashboard
          </Link>
        )}

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
      <button onClick={handleLogout}>
           Logout
      </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;