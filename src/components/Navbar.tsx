
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-shl">SHL Assessment Recommender</span>
        </Link>
        <div className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-shl transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-shl transition-colors">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
