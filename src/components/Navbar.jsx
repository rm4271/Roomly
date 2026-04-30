import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hexagon, LogOut, ChevronDown, Sun, Moon, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const { dark, toggle: toggleTheme } = useTheme();
  const { savedIds } = useWishlist();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); setShowDropdown(false); navigate('/'); };
  const getInitial = () => user?.name?.charAt(0).toUpperCase() || 'U';

  const menuItem = (to, label, onClick) => (
    <Link to={to} onClick={() => { setShowDropdown(false); onClick?.(); }}
      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', color: 'var(--text-primary)', fontSize: '0.88rem', transition: 'background 0.15s', textDecoration: 'none' }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--bg-primary)'}
      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
    >{label}</Link>
  );

  return (
    <nav className="nav-container" style={{ padding: '14px 0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <Hexagon color="#10b981" size={26} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Roomly</span>
          </Link>

          {/* Right side */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link to="/listings" style={{ padding: '8px 14px', borderRadius: '100px', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.15s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Listings</Link>
            <Link to="/map" style={{ padding: '8px 14px', borderRadius: '100px', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.15s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Map</Link>

            {/* Wishlist icon */}
            <Link to="/wishlist" title="Saved Rooms" style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-light)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'border-color 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--text-secondary)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-light)'}>
              <Heart size={16} />
              {savedIds.length > 0 && (
                <div style={{ position: 'absolute', top: '-3px', right: '-3px', width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-primary)' }}>
                  {savedIds.length}
                </div>
              )}
            </Link>

            {/* Dark mode toggle */}
            <button onClick={toggleTheme} title={dark ? 'Switch to Light' : 'Switch to Dark'}
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--border-light)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'border-color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--text-secondary)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* User */}
            {isLoggedIn ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button onClick={() => setShowDropdown(!showDropdown)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid var(--border-light)', borderRadius: '100px', padding: '5px 12px 5px 5px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-primary)', transition: 'all 0.2s ease' }}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                      {getInitial()}
                    </div>
                  )}
                  <span style={{ fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} color="var(--text-secondary)" />
                </button>

                {showDropdown && (
                  <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '14px', boxShadow: 'var(--shadow-lg)', minWidth: '210px', overflow: 'hidden', zIndex: 200 }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>
                        {user?.role === 'student' ? '🎓 Student' : '🏠 Property Owner'}
                      </div>
                    </div>
                    {menuItem('/account', 'My Account')}
                    {menuItem('/wishlist', `Saved Rooms ${savedIds.length > 0 ? `(${savedIds.length})` : ''}`)}
                    {menuItem('/post-listing', 'Post a Room')}
                    <div style={{ borderTop: '1px solid var(--border-light)' }}>
                      <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', color: '#ef4444', fontSize: '0.88rem', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'background 0.15s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--bg-primary)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={15} /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.88rem' }}>Log In</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
