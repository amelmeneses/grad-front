import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <ul className="flex justify-center space-x-4">
        <li>
          <Link to="/" className="text-white hover:text-gray-200">Home</Link>
        </li>
        <li>
          <Link to="/login" className="text-white hover:text-gray-200">Login</Link>
        </li>
        <li>
          <Link to="/signup" className="text-white hover:text-gray-200">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
