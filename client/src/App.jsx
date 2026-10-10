import { Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Donors from './pages/Donors.jsx';
import DonorForm from './pages/DonorForm.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import About from './pages/About.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/donors/new" element={<ProtectedRoute><DonorForm /></ProtectedRoute>} />
          <Route path="/donors/:id/edit" element={<ProtectedRoute><DonorForm /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
          <Route
            path="*"
            element={
              <section className="page narrow">
                <h1>Page not found</h1>
                <p className="lead">
                  The page you asked for does not exist. <Link to="/">Go to the home page</Link>.
                </p>
              </section>
            }
          />
        </Routes>
      </main>
      <footer className="footer">Blood Donor Finder · MERN stack project</footer>
    </>
  );
}
