import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { SignupFormDemo } from "./components/SignUp";
import { LoginForm } from "./components/Login";
import CameraPage from "./components/CameraPage";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <main className="min-h-screen"
          style={{
            background: 'linear-gradient(135deg, #1E3C72, #2A5298)'
          }}
        >
          <Header />

          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/signup" element={<SignupFormDemo />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/camera" element={<CameraPage />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}
