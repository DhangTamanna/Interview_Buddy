import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Interview from "./pages/Interview";

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
        <Route
        path="/dashboard"
        element={
       <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>
<Route
  path="/interview"
  element={
    <PrivateRoute>
      <Interview/>
    </PrivateRoute>
  }
/>
    </Routes>

    </BrowserRouter>
  );
}

export default App;