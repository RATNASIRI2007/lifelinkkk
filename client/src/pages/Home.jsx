import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { BLOOD_GROUPS, label } from '../utils.js';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/donors/stats').then(setStats).catch((e) => setError(e.message));
  }, []);

  const countFor = (g) => stats?.find((s) => s.bloodGroup === g);

  return (
    <section className="page">
      <div className="hero">
        <h1>Find a blood donor by blood group</h1>
        <p className="lead">
          Pick the blood group you need. You will see donors who are available now, with their city and, once you log
          in, their phone number.
        </p>
      </div>

      {error && <p className="msg msg-error">{error}</p>}

      <div className="tiles" role="list">
        {BLOOD_GROUPS.map((g) => {
          const s = countFor(g);
          return (
            <Link
              role="listitem"
              key={g}
              className="tile"
              to={{ pathname: '/donors', search: '?' + new URLSearchParams({ bloodGroup: g }).toString() }}
            >
              <span className="tile-group">{label(g)}</span>
              <span className="tile-count">
                {s ? `${s.available} available` : 'Loading…'}
                {s && s.total > s.available ? ` of ${s.total}` : ''}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="cta-band">
        <div>
          <h2>Willing to donate?</h2>
          <p>Create a free account and add your details so people in need can reach you.</p>
        </div>
        <Link className="btn btn-primary" to="/donors/new">
          Add a donor
        </Link>
      </div>
    </section>
  );
}
