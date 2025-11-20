import { Link } from "react-router-dom";
import "./HomePage.css";
import image1 from "../assets/image1.png";

export default function Home() {
  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="navbar">
        <h1 className="logo">Mini CRM</h1>
        <nav className="nav-links">
          <Link to="/login" className="nav-button">
            Log In
          </Link>
          <Link to="/register" className="nav-button">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Floating pastel circles */}
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>

      {/* Main Content */}
      <main className="main-content">
        <div className="main-wrapper">
          <h1 className="main-title fade-in">Welcome to Mini CRM</h1>
          <p className="main-subtitle fade-in delay-200">
            Manage your clients, projects, and tasks all in one place.
          </p>
          <div className="buttons fade-in delay-400">
            <Link to="/login" className="main-button">
              Log In
            </Link>
            <Link to="/register" className="main-button">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Right side image */}

        <img
          src={image1}
          alt="CRM Illustration"
          className="main-image fade-in delay-400"
        />
      </main>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} Mini CRM. All rights reserved.
      </footer>
    </div>
  );
}
