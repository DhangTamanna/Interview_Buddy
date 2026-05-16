import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Profile from "./pages/Profile";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Layout />}>

          {/* public routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          {/* private routes */}
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="interview"
            element={
              <PrivateRoute>
                <Interview />
              </PrivateRoute>
            }
          />

          <Route path="profile" element={<Profile />} />
          <Route path="history" element={<History />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;