import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { fmtDate, label } from '../utils.js';

export default function AdminPanel() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [s, u, d] = await Promise.all([api('/admin/summary'), api('/admin/users'), api('/admin/donors')]);
      setSummary(s);
      setUsers(u);
      setDonors(d);
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeRole = async (u, role) => {
    try {
      await api(`/admin/users/${u.id}/role`, { method: 'PATCH', body: { role } });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const removeUser = async (u) => {
    if (!window.confirm(`Delete ${u.name} and the ${u.donorCount} donor record(s) they added?`)) return;
    try {
      await api(`/admin/users/${u.id}`, { method: 'DELETE' });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const removeDonor = async (d) => {
    if (!window.confirm(`Delete donor ${d.name}?`)) return;
    try {
      await api(`/donors/${d._id}`, { method: 'DELETE' });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="page">
      <h1>Admin panel</h1>
      {error && <p className="msg msg-error">{error}</p>}

      {summary && (
        <dl className="summary">
          <div>
            <dt>Registered users</dt>
            <dd>{summary.users}</dd>
          </div>
          <div>
            <dt>Donor records</dt>
            <dd>{summary.donors}</dd>
          </div>
          <div>
            <dt>Available donors</dt>
            <dd>{summary.availableDonors}</dd>
          </div>
        </dl>
      )}

      <h2>Users</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Donors added</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === user.id;
              return (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      aria-label={`Role for ${u.name}`}
                      value={u.role}
                      disabled={isSelf}
                      onChange={(e) => changeRole(u, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{u.donorCount}</td>
                  <td>
                    <button className="btn btn-small btn-danger" disabled={isSelf} onClick={() => removeUser(u)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2>All donor records</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Group</th>
              <th>Location</th>
              <th>Contact</th>
              <th>Available</th>
              <th>Last donated</th>
              <th>Added by</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {donors.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>
                  <strong>{label(d.bloodGroup)}</strong>
                </td>
                <td>{d.location}</td>
                <td>{d.contact}</td>
                <td>{d.available ? 'Yes' : 'No'}</td>
                <td>{fmtDate(d.lastDonated)}</td>
                <td>{d.createdBy?.name || 'Deleted user'}</td>
                <td className="nowrap">
                  <Link className="btn btn-small" to={`/donors/${d._id}/edit`}>
                    Edit
                  </Link>{' '}
                  <button className="btn btn-small btn-danger" onClick={() => removeDonor(d)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
