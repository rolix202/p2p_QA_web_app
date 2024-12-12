import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Branding */}
        <Link to="/" className="text-2xl font-bold hover:text-yellow-300">
        AskMe3MTT
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-yellow-300">
            Home
          </Link>
          <Link to="/questions" className="hover:text-yellow-300">
            Questions
          </Link>
          <Link to="/add-question" className="hover:text-yellow-300">
            Ask a Question
          </Link>
          <Link to="/explore" className="hover:text-yellow-300">
            Explore
          </Link>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
