import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Empregar</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/criar" className="nav-link btn-primary">Novo Currículo</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

