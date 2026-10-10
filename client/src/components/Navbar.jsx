import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true" />
          Blood Donor Finder
        </Link>
        <nav className="nav-links" aria-label="Main">
          <NavLink to="/donors">Find donors</NavLink>
          <NavLink to="/about">About</NavLink>
          {user && <NavLink to="/dashboard">My donors</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user">{user.name}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">
                Log in
              </Link>
              <Link className="btn btn-primary" to="/register">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
