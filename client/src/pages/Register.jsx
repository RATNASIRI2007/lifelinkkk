import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page narrow">
      <h1>Create an account</h1>
      <form className="card form" onSubmit={submit}>
        {error && <p className="msg msg-error">{error}</p>}
        <label className="field">
          <span>Full name</span>
          <input value={form.name} onChange={set('name')} required autoComplete="name" />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
        </label>
        <label className="field">
          <span>Password (at least 6 characters)</span>
          <input type="password" value={form.password} onChange={set('password')} required minLength={6} autoComplete="new-password" />
        </label>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
        <p className="form-foot">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </form>
    </section>
  );
}
