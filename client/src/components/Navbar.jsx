
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../tempUtils/auth";

function Navbar() {

  const [token, setToken] =
    useState(getToken());

  const [user, setUser] =
    useState(null);

  const navigate = useNavigate();


  useEffect(() => {

    const handleStorageChange = () => {

      setToken(getToken());

      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {

        setUser(
          JSON.parse(storedUser)
        );

      } else {

        setUser(null);
      }
    };

    handleStorageChange();

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    window.addEventListener(
      "authChange",
      handleStorageChange
    );

    return () => {

      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "authChange",
        handleStorageChange
      );
    };

  }, []);


  // ================= LOGOUT =================

  const handleLogout = () => {

    removeToken();

    localStorage.removeItem("user");

    setToken(null);

    setUser(null);

    navigate("/login");
  };


  return (

    <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 z-50">

      {/* LOGO */}
      <h1 className="text-2xl font-bold text-blue-400">

        InterviewBuddy

      </h1>


      {/* NAV LINKS */}
      <div className="flex items-center gap-6 text-sm font-medium">

        {/* ALWAYS VISIBLE */}
        <Link
          to="/"
          className="hover:text-blue-400 transition"
        >

          Home

        </Link>


        {token ? (

          <>

            <Link
              to="/dashboard"
              className="hover:text-blue-400 transition"
            >

              Dashboard

            </Link>

            <Link
              to="/history"
              className="hover:text-blue-400 transition"
            >

              History

            </Link>


            {/* ✅ CLICKABLE USER PROFILE */}
            {user && (

              <Link
                to="/profile"
                className="flex items-center gap-3 hover:opacity-80 transition"
              >

                {/* AVATAR */}
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">

                  {user.name?.charAt(0)
                    .toUpperCase()}

                </div>

                {/* NAME */}
                <div className="text-white">

                  {user.name}

                </div>

              </Link>
            )}


            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
            >

              Logout

            </button>

          </>

        ) : (

          <>

            <Link
              to="/login"
              className="hover:text-blue-400 transition"
            >

              Login

            </Link>

            <Link
              to="/signup"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition"
            >

              Signup

            </Link>

          </>

        )}

      </div>

    </nav>
  );
}

export default Navbar;

