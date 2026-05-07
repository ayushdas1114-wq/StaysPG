import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, Building2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://stayspg.onrender.com/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role })
      });

      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        navigate(data.user.role === 'owner' ? '/owner/dashboard' : '/search');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Cannot connect to server');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Join BhubaneswarStay</h2>
        <p className="auth-subtitle">Choose how you want to use the platform</p>

        {/* Role Selector */}
        <div className="role-selector">
          <div className={`role-option ${role === 'customer' ? 'selected' : ''}`} onClick={() => setRole('customer')}>
            <div className="role-icon"><Search size={24} /></div>
            <div className="role-label">Room Seeker</div>
            <div className="role-desc">Looking for a room</div>
          </div>
          <div className={`role-option ${role === 'owner' ? 'selected' : ''}`} onClick={() => setRole('owner')}>
            <div className="role-icon"><Building2 size={24} /></div>
            <div className="role-label">Room Owner</div>
            <div className="role-desc">List my property</div>
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" className="input" required value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" className="input" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input type="tel" className="input" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
            Create {role === 'owner' ? 'Owner' : 'Seeker'} Account
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
