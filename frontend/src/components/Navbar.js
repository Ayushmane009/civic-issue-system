import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search, Bell, Menu, X, LogOut, User,
  LayoutDashboard, PlusCircle, MapPin, List, Globe
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Report', path: '/report', icon: PlusCircle },
    { name: 'Issues', path: '/issues', icon: Globe },
    { name: 'Map', path: '/map', icon: MapPin },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '1.5rem',
          fontWeight: 900,
          textDecoration: 'none',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'var(--gradient-primary)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MapPin size={20} color="white" />
          </div>
          <span className="text-gradient">NAGAR-SATHI</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }} className="desktop-nav">
          {user && navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive(item.path) ? 'white' : 'var(--gray-light)',
                background: isActive(item.path) ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                transition: 'var(--transition)',
                textDecoration: 'none',
              }}
            >
              <item.icon size={16} />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="desktop-nav">
          {user ? (
            <>
              {/* Notifications */}
              <button style={{
                position: 'relative',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                color: 'var(--gray-light)',
                borderRadius: '10px',
                transition: 'var(--transition)',
              }}>
                <Bell size={20} />
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '16px',
                  height: '16px',
                  background: 'var(--danger)',
                  borderRadius: '50%',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}>3</span>
              </button>

              {/* Profile Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 12px 6px 6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    color: 'var(--light)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'var(--gradient-pink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                  }}>
                    {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {user?.name || user?.email?.split('@')[0] || 'User'}
                  </span>
                </button>

                {showDropdown && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '220px',
                    background: 'var(--dark-lighter)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    padding: '8px',
                    animation: 'slideDown 0.2s ease-out',
                    zIndex: 200,
                  }}>
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        color: 'var(--light)',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        transition: 'var(--transition)',
                      }}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      to="/my-issues"
                      onClick={() => setShowDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        color: 'var(--light)',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        transition: 'var(--transition)',
                      }}
                    >
                      <List size={16} />
                      My Issues
                    </Link>
                    <div style={{
                      height: '1px',
                      background: 'var(--glass-border)',
                      margin: '4px 0',
                    }} />
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        color: 'var(--danger)',
                        fontSize: '0.9rem',
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                      }}
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" style={{
                padding: '8px 20px',
                color: 'var(--gray-light)',
                fontWeight: 500,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'none',
            padding: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--light)',
            cursor: 'pointer',
          }}
          className="mobile-toggle"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          padding: '12px 16px 20px',
          borderTop: '1px solid var(--glass-border)',
          animation: 'slideDown 0.3s ease-out',
        }} className="mobile-menu">
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--gray)',
            }} />
            <input
              type="text"
              placeholder="Search issues..."
              className="input-dark"
              style={{ paddingLeft: '40px' }}
            />
          </div>

          {/* Nav Links */}
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '12px',
                color: isActive(item.path) ? 'white' : 'var(--gray-light)',
                background: isActive(item.path) ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'var(--transition)',
              }}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}

          {user && (
            <>
              <div style={{ height: '1px', background: 'var(--glass-border)', margin: '8px 0' }} />
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: 'var(--gray-light)',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                <User size={18} />
                Profile
              </Link>
              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: 'var(--danger)',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  width: '100%',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                <LogOut size={18} />
                Log out
              </button>
            </>
          )}

          {!user && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-secondary"
                style={{ flex: 1, textDecoration: 'none' }}
              >Login</Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-primary"
                style={{ flex: 1, textDecoration: 'none' }}
              >Sign Up</Link>
            </div>
          )}
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
