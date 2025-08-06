import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Omnify Blog
          </Link>
          
          <nav className="nav">
            <Link to="/blogs" className="nav-link">
              All Blogs
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/create-blog" className="nav-link">
                  Write Blog
                </Link>
                <Link to="/my-blogs" className="nav-link">
                  My Blogs
                </Link>
                <span className="nav-link">
                  Hello, {user?.name}
                </span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/signup" className="btn">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;