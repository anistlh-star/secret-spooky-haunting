//workspaces/codespaces-blank/mern-blog/frontend/src/components/Navbar.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import useDarkMode from "../hooks/darkMode";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  
  const [darkModeOn, toggleDarkMode] = useDarkMode();
  const [admin, setAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const tokenId = JSON.parse(atob(token.split(".")[1]));
        setAdmin(tokenId.isAdmin || false);
        setUserName(tokenId.name || "");
      } catch (error) {
        console.log("Error checking admin status:", error);
      }
    } else {
      setUserName("");
      setAdmin(false);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <h2 className="navbar-title">My Blog</h2>
          {userName && (
            <span className="user-welcome">Welcome, {userName}</span>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link 
            className={`nav-link ${isActiveLink("/")}`} 
            to="/"
          >
            Home
          </Link>
          
          {!token && (
            <>
              <Link 
                className={`nav-link ${isActiveLink("/register")}`} 
                to="/register"
              >
                Register
              </Link>
              <Link 
                className={`nav-link ${isActiveLink("/login")}`} 
                to="/login"
              >
                Login
              </Link>
            </>
          )}
          
          {token && (
            <>
              <Link 
                className={`nav-link ${isActiveLink("/create")}`} 
                to="/create"
              >
                Create Blog
              </Link>
              <Link 
                className={`nav-link ${isActiveLink("/my-blogs")}`} 
                to="/my-blogs"
              >
                My Blogs
              </Link>
              {admin && (
                <div className="admin-links">
                  <Link 
                    className={`admin-link ${isActiveLink("/admin")}`} 
                    to="/admin"
                  >
                    Admin
                  </Link>
                  <Link 
                    className={`admin-link ${isActiveLink("/adminstats")}`} 
                    to="/adminstats"
                  >
                    Stats
                  </Link>
                </div>
              )}
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
          
          <button onClick={toggleDarkMode} className="dark-toggle">
            {darkModeOn ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-content">
          <Link 
            className={`nav-link ${isActiveLink("/")}`} 
            to="/"
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          
          {!token && (
            <>
              <Link 
                className={`nav-link ${isActiveLink("/register")}`} 
                to="/register"
                onClick={closeMobileMenu}
              >
                Register
              </Link>
              <Link 
                className={`nav-link ${isActiveLink("/login")}`} 
                to="/login"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            </>
          )}
          
          {token && (
            <>
              <Link 
                className={`nav-link ${isActiveLink("/create")}`} 
                to="/create"
                onClick={closeMobileMenu}
              >
                Create Blog
              </Link>
              <Link 
                className={`nav-link ${isActiveLink("/my-blogs")}`} 
                to="/my-blogs"
                onClick={closeMobileMenu}
              >
                My Blogs
              </Link>
              {admin && (
                <>
                  <Link 
                    className={`admin-link ${isActiveLink("/admin")}`} 
                    to="/admin"
                    onClick={closeMobileMenu}
                  >
                    Admin Panel
                  </Link>
                  <Link 
                    className={`admin-link ${isActiveLink("/adminstats")}`} 
                    to="/adminstats"
                    onClick={closeMobileMenu}
                  >
                    Admin Stats
                  </Link>
                </>
              )}
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
          
          <div className="mobile-menu-actions">
            <button onClick={toggleDarkMode} className="dark-toggle">
              {darkModeOn ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            {userName && (
              <span className="user-welcome-mobile">Welcome, {userName}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;