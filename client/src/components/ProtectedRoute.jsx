import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Redirects guests to the login page; optionally limits the page to certain roles.
export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="page-note">Loading your account…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) {
    return (
      <section className="page narrow">
        <h1>Access denied</h1>
        <p className="lead">This page is only for administrators.</p>
      </section>
    );
  }
  return children;
}
