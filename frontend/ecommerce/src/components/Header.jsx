import { Link } from "react-router-dom";
import "./Header.css";

function Header({ cartCount }) {
  return (
    <header className="header">
      {/* Logo / Brand */}
      <div className="logo">
        <Link to="/" className="logo-link">🛍️ NepalEcom</Link>
      </div>

      {/* Navigation Links */}
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
         <Link to="/about" className="nav-link">About</Link>
         <Link to="/service" className="nav-link">Service</Link>
        <Link to="/contact" className="nav-link">Contact</Link>

        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>

        <Link to="/admin" className="nav-link">Admin</Link>
        <Link to="/add" className="nav-link">Add Product</Link>
      </nav>

      {/* Cart */}
      <div className="cart">
        <Link to="/cart" className="cart-link">
          🛒 {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
    </header>
  );
}

export default Header;
