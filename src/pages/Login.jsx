import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/users/login/', form);
            login(res.data.user, res.data.access, res.data.refresh);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>WELCOME <span style={{ color: 'var(--gold)' }}>BACK</span></h1>
                        <div className="gold-line" />
                        <p style={{ color: 'var(--text-dim)', marginTop: '12px' }}>Login to your StatFort account</p>
                    </div>
                    <div className="card">
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email</label>
                                <input className="input-field" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Password</label>
                                <input className="input-field" name="password" type="password" placeholder="Your password" value={form.password} onChange={handleChange} required />
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Forgot password?</Link>
                            </div>
                            {error && <p className="error-msg">{error}</p>}
                            <button className="btn-gold" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                            No account yet? <Link to="/register">Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;