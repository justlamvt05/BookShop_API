// components/Header.jsx
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
  const isAuthenticated = userRole && userRole.length > 0;

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("roles");
    localStorage.removeItem("user");

    // Redirect to home
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo/Title */}
        <div className="header-logo">
          <h1 onClick={handleLogoClick} className="bookshop-title">
            BOOKSHOP
          </h1>
        </div>

        {/* Right Section - Cart, Profile & Logout */}
        <div className="header-right">
          {isAuthenticated ? (
            <>
              {/* View Cart - only for ROLE_CUSTOMER */}
              {userRole === "ROLE_CUSTOMER" && (
                <button
                  className="header-link"
                  onClick={() => navigate("/user/cart")}
                  title="View Cart"
                  style={{ backgroundColor: "whitesmoke", color: "black" }}
                >
                  🛒 Cart
                </button>
              )}
              <button
                className="header-link"
                onClick={() => navigate("/user/profile")}
                title="View Profile"
                style={{ backgroundColor: "whitesmoke", color: "black" }}
              >
                👤 Profile
              </button>
              <button className="btn btn-danger btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <div>
              <button
                className="header-link login-btn"
                onClick={() => navigate("/login")}
                title="Login"
                style={{ backgroundColor: "whitesmoke", color: "black" }}
              >
                Login
              </button>
              <button
                className="header-link register-btn"
                onClick={() => navigate("/register")}
                title="Register"
                style={{ backgroundColor: "whitesmoke", color: "black", marginLeft: "10px" }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
