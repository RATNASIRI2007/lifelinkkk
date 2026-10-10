import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import DonorCard from '../components/DonorCard.jsx';
import { BLOOD_GROUPS, label } from '../utils.js';

export default function Donors() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const bloodGroup = params.get('bloodGroup') || '';
  const location = params.get('location') || '';
  const available = params.get('available') === 'true';
  const page = Number(params.get('page') || 1);

  const [locInput, setLocInput] = useState(location);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api('/donors', {
      params: { bloodGroup, location, available: available ? 'true' : '', page, limit: 9 },
    })
      .then((d) => {
        if (!alive) return;
        setData(d);
        setError('');
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [bloodGroup, location, available, page, user?.id, reload]);

  // Keep filters in the URL so results can be bookmarked and shared.
  const update = (patch) => {
    const next = { ...Object.fromEntries(params), page: '1', ...patch };
    Object.keys(next).forEach((k) => (next[k] === '' || next[k] === false) && delete next[k]);
    setParams(next);
  };

  const handleDelete = async (donor) => {
    if (!window.confirm(`Delete ${donor.name}?`)) return;
    try {
      await api(`/donors/${donor._id}`, { method: 'DELETE' });
      setReload((n) => n + 1);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="page">
      <h1>Find donors</h1>

      <div className="filters">
        <div className="chips" role="group" aria-label="Blood group">
          <button className={`chip ${bloodGroup === '' ? 'chip-on' : ''}`} onClick={() => update({ bloodGroup: '' })}>
            Any group
          </button>
          {BLOOD_GROUPS.map((g) => (
            <button
              key={g}
              className={`chip ${bloodGroup === g ? 'chip-on' : ''}`}
              aria-pressed={bloodGroup === g}
              onClick={() => update({ bloodGroup: g })}
            >
              {label(g)}
            </button>
          ))}
        </div>

        <form
          className="filter-row"
          onSubmit={(e) => {
            e.preventDefault();
            update({ location: locInput.trim() });
          }}
        >
          <label className="field grow">
            <span>City or area</span>
            <input value={locInput} onChange={(e) => setLocInput(e.target.value)} placeholder="For example, Hyderabad" />
          </label>
          <label className="check">
            <input type="checkbox" checked={available} onChange={(e) => update({ available: e.target.checked })} />
            Available only
          </label>
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>
      </div>

      {error && <p className="msg msg-error">{error}</p>}
      {loading && !data && <p className="page-note">Searching…</p>}

      {data && (
        <>
          <p className="result-count" aria-live="polite">
            {data.total} {data.total === 1 ? 'donor' : 'donors'} found
            {bloodGroup ? ` for ${label(bloodGroup)}` : ''}
            {location ? ` in “${location}”` : ''}
          </p>

          {!data.contactVisible && data.total > 0 && (
            <p className="msg msg-info">
              <Link to="/login">Log in</Link> or <Link to="/register">create an account</Link> to see donors’ phone
              numbers.
            </p>
          )}

          {data.donors.length === 0 ? (
            <div className="empty">
              <h3>No donors match these filters</h3>
              <p>Try another blood group, clear the city, or turn off “Available only”.</p>
            </div>
          ) : (
            <div className="grid">
              {data.donors.map((d) => (
                <DonorCard key={d._id} donor={d} user={user} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {data.pages > 1 && (
            <div className="pager">
              <button className="btn" disabled={page <= 1} onClick={() => update({ page: String(page - 1) })}>
                Previous
              </button>
              <span>
                Page {data.page} of {data.pages}
              </span>
              <button className="btn" disabled={page >= data.pages} onClick={() => update({ page: String(page + 1) })}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
