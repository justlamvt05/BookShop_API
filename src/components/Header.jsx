// components/Header.jsx
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const roles = localStorage.getItem("role");
  const isAuthenticated = roles && roles.length > 0;

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
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
        {isAuthenticated && (
          <div className="header-right">
            {/* View Cart - only for ROLE_CUSTOMER */}
            {roles === "ROLE_CUSTOMER" && (
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
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
