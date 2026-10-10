import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import DonorCard from '../components/DonorCard.jsx';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [donors, setDonors] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/donors/mine').then(setDonors).catch((e) => setError(e.message));
  }, []);

  const handleDelete = async (donor) => {
    if (!window.confirm(`Delete ${donor.name}?`)) return;
    try {
      await api(`/donors/${donor._id}`, { method: 'DELETE' });
      setDonors((list) => list.filter((d) => d._id !== donor._id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>My donors</h1>
          <p className="lead">
            Signed in as {user.name} ({isAdmin ? 'administrator' : 'user'}). These are the donor records you added.
          </p>
        </div>
        <Link className="btn btn-primary" to="/donors/new">
          Add a donor
        </Link>
      </div>

      {error && <p className="msg msg-error">{error}</p>}
      {!donors && !error && <p className="page-note">Loading…</p>}

      {donors && donors.length === 0 && (
        <div className="empty">
          <h3>You have not added any donors yet</h3>
          <p>Add yourself or someone who has agreed to donate.</p>
          <Link className="btn btn-primary" to="/donors/new">
            Add a donor
          </Link>
        </div>
      )}

      {donors && donors.length > 0 && (
        <div className="grid">
          {donors.map((d) => (
            <DonorCard key={d._id} donor={d} user={user} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
