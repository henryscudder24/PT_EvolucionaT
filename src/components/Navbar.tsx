import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/personal/logo1.png" alt="EvolucionaT Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-white">EvolucionaT</span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-primary">
                  Mi Perfil
                </Link>
                <Link to="/survey" className="text-gray-700 hover:text-primary">
                  Encuesta
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/about" className="text-gray-700 hover:text-primary">
                  Sobre Nosotros
                </Link>
                <Link to="/services" className="text-gray-700 hover:text-primary">
                  Servicios
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-primary">
                  Contacto
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-primary">
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Social Media Links */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
              <FaXTwitter className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white hover:text-primary transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;