// components/Footer.jsx
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">© 2026 Bookshop</p>

        <div className="footer-links">
          <a
            href="https://github.com/justlamvt05"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            title="Visit GitHub Profile"
          >
            GitHub Profile
          </a>

          <span className="footer-separator">•</span>

          <a
            href="https://github.com/justlamvt05/bookshop_api"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            title="Visit Backend Repository"
          >
            Backend Project
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
