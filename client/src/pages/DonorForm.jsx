import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { BLOOD_GROUPS, label } from '../utils.js';

const empty = { name: '', bloodGroup: '', location: '', contact: '', available: true, lastDonated: '' };

export default function DonorForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api(`/donors/${id}`)
      .then((d) =>
        setForm({
          name: d.name,
          bloodGroup: d.bloodGroup,
          location: d.location,
          contact: d.contact,
          available: d.available,
          lastDonated: d.lastDonated ? d.lastDonated.slice(0, 10) : '',
        })
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api(editing ? `/donors/${id}` : '/donors', {
        method: editing ? 'PUT' : 'POST',
        body: { ...form, lastDonated: form.lastDonated || null },
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="page-note">Loading donor…</p>;

  return (
    <section className="page narrow">
      <h1>{editing ? 'Edit donor' : 'Add a donor'}</h1>
      <form className="card form" onSubmit={submit}>
        {error && <p className="msg msg-error">{error}</p>}

        <label className="field">
          <span>Full name</span>
          <input value={form.name} onChange={set('name')} required maxLength={80} />
        </label>

        <label className="field">
          <span>Blood group</span>
          <select value={form.bloodGroup} onChange={set('bloodGroup')} required>
            <option value="">Choose a blood group</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>
                {label(g)}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>City or area</span>
          <input value={form.location} onChange={set('location')} required maxLength={120} />
        </label>

        <label className="field">
          <span>Phone number</span>
          <input value={form.contact} onChange={set('contact')} required inputMode="tel" placeholder="9876543210" />
        </label>

        <label className="field">
          <span>Last donated (optional)</span>
          <input type="date" value={form.lastDonated} onChange={set('lastDonated')} max={new Date().toISOString().slice(0, 10)} />
        </label>

        <label className="check">
          <input type="checkbox" checked={form.available} onChange={set('available')} />
          Available to donate now
        </label>

        <div className="row-actions">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Save changes' : 'Add donor'}
          </button>
          <button type="button" className="btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
