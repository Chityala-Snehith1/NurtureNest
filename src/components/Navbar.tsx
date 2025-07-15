import React from 'react';
import { Link } from 'react-router-dom';
import { Baby, Heart, Home, LogIn, Menu, UserCircle } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Baby className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-semibold text-purple-600">NurtureNest</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-600 hover:text-purple-600 flex items-center">
              <Home className="h-5 w-5 mr-1" />
              Home
            </Link>
            <Link to="/articles" className="text-gray-600 hover:text-purple-600 flex items-center">
              <Heart className="h-5 w-5 mr-1" />
              Resources
            </Link>
            <Link to="/login" className="text-gray-600 hover:text-purple-600 flex items-center">
              <LogIn className="h-5 w-5 mr-1" />
              Login
            </Link>
            <Link to="/register" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center">
              <UserCircle className="h-5 w-5 mr-1" />
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-purple-600"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            >
              Home
            </Link>
            <Link
              to="/articles"
              className="block px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            >
              Resources
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block px-3 py-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}