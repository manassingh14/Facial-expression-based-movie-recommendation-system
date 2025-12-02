import 'boxicons/css/boxicons.min.css';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const Footer = ({ isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Footer */}
          <motion.footer
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white text-gray-800 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #1E3C72, #2A5298)',
              color: 'white'
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                {/* About Us */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">About Us</h3>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    MoodFlix is an innovative platform that uses facial expression recognition 
                    to recommend movies that match your current mood. Discover personalized 
                    entertainment tailored to how you feel.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link 
                        to="/" 
                        onClick={onClose}
                        className="text-sm text-blue-100 hover:text-white transition-colors duration-200"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/signup" 
                        onClick={onClose}
                        className="text-sm text-blue-100 hover:text-white transition-colors duration-200"
                      >
                        Sign Up
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/login" 
                        onClick={onClose}
                        className="text-sm text-blue-100 hover:text-white transition-colors duration-200"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/camera" 
                        onClick={onClose}
                        className="text-sm text-blue-100 hover:text-white transition-colors duration-200"
                      >
                        Recommendations
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
                  <ul className="space-y-2">
                    <li>
                      <a 
                        href="#" 
                        className="text-sm text-blue-100 hover:text-white transition-colors duration-200"
                      >
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#" 
                        className="text-sm text-blue-100 hover:text-white transition-colors duration-200"
                      >
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#" 
                        className="text-sm text-blue-100 hover:text-white transition-colors duration-200"
                      >
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#" 
                        className="text-sm text-blue-100 hover:text-white transition-colors duration-200"
                      >
                        Terms of Service
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      aria-label="Facebook"
                    >
                      <i className="bx bxl-facebook text-white text-xl"></i>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      aria-label="Twitter"
                    >
                      <i className="bx bxl-twitter text-white text-xl"></i>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      aria-label="Instagram"
                    >
                      <i className="bx bxl-instagram text-white text-xl"></i>
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <i className="bx bxl-linkedin text-white text-xl"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Copyright Bar */}
              <div className="border-t border-white/20 pt-6 mt-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                  <p className="text-sm text-blue-100 text-center md:text-left">
                    © {new Date().getFullYear()} MoodFlix. All rights reserved.
                  </p>
                  <div className="flex space-x-4 text-sm text-blue-100">
                    <a href="#" className="hover:text-white transition-colors duration-200">
                      Privacy
                    </a>
                    <span>|</span>
                    <a href="#" className="hover:text-white transition-colors duration-200">
                      Terms
                    </a>
                    <span>|</span>
                    <a href="#" className="hover:text-white transition-colors duration-200">
                      Cookies
                    </a>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Close footer"
              >
                <i className="bx bx-x text-white text-2xl"></i>
              </button>
            </div>
          </motion.footer>
        </>
      )}
    </AnimatePresence>
  );
};

export default Footer;

