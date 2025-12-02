import "boxicons/css/boxicons.min.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const isHomePage = location.pathname === '/';
  const isCameraPage = location.pathname === '/camera';

  const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.remove('hidden');
    } else {
      mobileMenu.classList.add('hidden');
    }
  };

  return (
    <header 
      className="flex justify-between items-center py-4 px-4 lg:px-20 shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #1E3C72, #2A5298)'
      }}
    >
      <Link to="/" className="text-3xl md:text-4xl lg:text-5xl font-light m-0 text-white hover:text-blue-200 transition-colors">
        MoodFlix
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-12">
        {/* Navigation removed as requested */}
      </nav>

      <div className="hidden md:flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <Link 
              to="/login"
              className="bg-white text-gray-800 py-2 px-6 rounded-xl font-medium transition-all duration-300 hover:bg-gray-100 cursor-pointer z-50 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Login
            </Link>
            <Link 
              to="/signup"
              className="bg-[#a7a7a7] text-black py-3 px-8 rounded-full border-none 
        font-medium transition-all duration-500 hover:bg-white cursor-pointer z-50"
            >
              SignUp
            </Link>
          </>
        ) : (
          <>
            {!isCameraPage && (
              <Link
                to="/camera"
                className="text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer z-50 border-2 border-white/30 hover:border-white/60 shadow-lg hover:shadow-xl hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.8), rgba(42, 82, 152, 0.8))',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 255, 255, 0.1)'
                }}
              >
                Recommendation
              </Link>
            )}
            {!isHomePage && (
              <Link
                to="/"
                className="text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 cursor-pointer z-50 border-2 border-white/30 hover:border-white/60 shadow-lg hover:shadow-xl hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.8), rgba(42, 82, 152, 0.8))',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 255, 255, 0.1)'
                }}
              >
                Home
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-white py-3 px-8 rounded-xl font-medium transition-all duration-300 cursor-pointer z-50 border-2 border-white/30 hover:border-white/60 shadow-lg hover:shadow-xl hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.8), rgba(42, 82, 152, 0.8))',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 255, 255, 0.1)'
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button onClick={toggleMobileMenu} className="md:hidden text-3xl p-2 z-50 text-white">
        <i className="bx bx-menu"></i>
      </button>
    </header>
  );
};

export default Header;
