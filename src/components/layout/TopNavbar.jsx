import { Link, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ThemeSelector from './ThemeSelector';
import './TopNavbar.css';

export default function TopNavbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analyze', path: '/analyze' },
    { name: 'Compare', path: '/compare' },
    { name: 'Algorithm Lab', path: '/algorithms' },
    { name: 'Performance', path: '/performance' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <header className={`top-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Logo />
          <span className="navbar-descriptor">Algorithmic Text Intelligence</span>
        </Link>

        <nav className="desktop-nav">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions">
          {/* Theme Selector Popover */}
          <ThemeSelector />

          <div className="engine-status">
            <span className="status-dot"></span>
            UI PREVIEW
          </div>
          <Link to="/analyze" className="btn-accent launch-btn">
            Launch Analyzer
          </Link>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav-dropdown">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
