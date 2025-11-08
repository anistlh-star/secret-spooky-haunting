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
      console.log("🔍 DEBUG: Token exists:", token);
      
      // Method 1: Get from localStorage userData
      const userData = localStorage.getItem("userData");
      console.log("🔍 DEBUG: userData from localStorage:", userData);
      
      if (userData) {
        const user = JSON.parse(userData);
        console.log("🔍 DEBUG: Parsed user data:", user);
        console.log("🔍 DEBUG: isAdmin value:", user.isAdmin);
        console.log("🔍 DEBUG: Type of isAdmin:", typeof user.isAdmin);
        
        setAdmin(user.isAdmin || false);
        setUserName(user.name || "");
      } else {
        // Method 2: Fallback to token decoding
        console.log("🔍 DEBUG: No userData in localStorage, checking token...");
        const tokenPayload = JSON.parse(atob(token.split(".")[1]));
        console.log("🔍 DEBUG: Token payload:", tokenPayload);
        console.log("🔍 DEBUG: Token isAdmin:", tokenPayload.isAdmin);
        
        setAdmin(tokenPayload.isAdmin || false);
        setUserName(tokenPayload.name || "");
      }
      
      console.log("🔍 DEBUG: Final admin state will be:", admin);
    } catch (error) {
      console.log("❌ Error checking user status:", error);
    }
  } else {
    console.log("🔍 DEBUG: No token found");
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
                className={`nav-link ${isActiveLink("/myblogs")}`} 
                to="/myblogs"
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
                className={`nav-link ${isActiveLink("/myblogs")}`} 
                to="/myblogs"
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