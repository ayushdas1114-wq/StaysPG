import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, LogOut, Search, LayoutDashboard, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isOwner } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <Home size={20} />
          </div>
          <span>BhubaneswarStay</span>
        </Link>

        <div className="nav-links">
          <Link to="/search" className={isActive('/search')}>
            <Search size={16} style={{ marginRight: '0.3rem', verticalAlign: '-2px' }} />
            Explore
          </Link>

          {user ? (
            <>
              {isOwner && (
                <Link to="/owner/dashboard" className={isActive('/owner/dashboard')}>
                  <LayoutDashboard size={16} style={{ marginRight: '0.3rem', verticalAlign: '-2px' }} />
                  My Listings
                </Link>
              )}

              <div className="user-badge">
                <User size={14} />
                {user.name.split(' ')[0]}
                <span className="role-tag">{user.role}</span>
              </div>

              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
