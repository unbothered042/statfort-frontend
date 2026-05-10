import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
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
            <Container style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>WELCOME <span style={{ color: '#FFD700' }}>BACK</span></h1>
                        <div className="gold-line" />
                        <p className="text-dim mt-2">Login to your StatFort account</p>
                    </div>
                    <div className="sf-card">
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label className="sf-label">Email</label>
                                <input className="sf-input" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="sf-label">Password</label>
                                <input className="sf-input" name="password" type="password" placeholder="Your password" value={form.password} onChange={handleChange} required />
                            </div>
                            <div className="text-end">
                                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#AAAAAA' }}>Forgot password?</Link>
                            </div>
                            {error && <p className="error-msg">{error}</p>}
                            <button className="btn-gold" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        <p className="text-center mt-4 text-dim" style={{ fontSize: '0.9rem' }}>
                            No account yet? <Link to="/register">Create one</Link>
                        </p>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Login;