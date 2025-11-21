import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar" data-testid="navbar">
      <div className="nav-brand">
        <Link to="/dashboard">Testing Demo App</Link>
      </div>

      {isAuthenticated && (
        <div className="nav-links">
          <Link to="/dashboard" data-testid="nav-dashboard">
            Dashboard
          </Link>
          <Link to="/products" data-testid="nav-products">
            Products
          </Link>
          <button
            onClick={handleLogout}
            className="logout-button"
            data-testid="logout-button"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};
