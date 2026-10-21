import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/gaming" element={<Gaming />} />
        <Route path="/patterns" element={<Patterns />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/about" element={<About />} />
        <Route path="/challenge" element={<Challenge />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;