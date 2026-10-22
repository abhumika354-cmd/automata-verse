
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Gaming from "./pages/Gaming";
import Patterns from "./pages/Patterns";
import Simulator from "./pages/Simulator";
import Learn from "./pages/Learn";
import About from "./pages/About";
import Challenge from "./pages/Challenge";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Login protection
function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/gaming"
          element={
            <ProtectedRoute>
              <Gaming />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patterns"
          element={
            <ProtectedRoute>
              <Patterns />
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulator"
          element={
            <ProtectedRoute>
              <Simulator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />

        <Route
          path="/challenge"
          element={
            <ProtectedRoute>
              <Challenge />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
