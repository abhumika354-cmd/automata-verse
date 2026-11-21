import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import WorkspaceLayout from "./components/WorkspaceLayout";
import { recordLearningSeconds } from "./learningProgress";

import Home from "./pages/Home";
import Gaming from "./pages/Gaming";
import Patterns from "./pages/Patterns";
import Simulator from "./pages/Simulator";
import Learn from "./pages/Learn";
import About from "./pages/About";
import Challenge from "./pages/Challenge";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
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

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const learningPaths = ["/learn", "/patterns", "/simulator", "/challenge"];

    if (!learningPaths.includes(location.pathname)) {
      return undefined;
    }

    let active = document.visibilityState === "visible";
    let lastTick = Date.now();
    let accumulatedSeconds = 0;

    const trackTime = () => {
      const now = Date.now();

      if (active) {
        accumulatedSeconds += (now - lastTick) / 1000;
      }

      lastTick = now;

      if (accumulatedSeconds >= 15) {
        const elapsed = Math.floor(accumulatedSeconds);
        accumulatedSeconds -= elapsed;
        recordLearningSeconds(elapsed);
      }
    };

    const handleVisibilityChange = () => {
      trackTime();
      active = document.visibilityState === "visible";
      lastTick = Date.now();
    };

    const intervalId = window.setInterval(trackTime, 15000);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      trackTime();
      window.clearInterval(intervalId);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [location.pathname]);

  return (
    <>
      {location.pathname !== "/register" &&
        location.pathname !== "/login" &&
        location.pathname !== "/learn" &&
        location.pathname !== "/patterns" &&
        location.pathname !== "/simulator" &&
        location.pathname !== "/challenge" &&
        location.pathname !== "/about" &&
        location.pathname !== "/settings" &&
        location.pathname !== "/notifications" &&
        location.pathname !== "/gaming" &&
        location.pathname !== "/" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/gaming"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Gaming />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/patterns"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Patterns />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulator"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Simulator />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/learn"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Learn />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <About />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Settings />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <WorkspaceLayout>
              <Notifications />
            </WorkspaceLayout>
          }
        />

        <Route
          path="/challenge"
          element={
            <ProtectedRoute>
              <WorkspaceLayout>
                <Challenge />
              </WorkspaceLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
