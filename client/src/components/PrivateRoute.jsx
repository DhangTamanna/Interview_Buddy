import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {

  const token = localStorage.getItem("token");

  // if not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // if logged in
  return children;
}

export default PrivateRoute;