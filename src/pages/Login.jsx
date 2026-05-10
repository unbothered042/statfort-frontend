import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ identifier: '', password: '' });
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
        <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', maxWidth: '440px' }}
                >
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontStyle: 'italic' }}>
                            WELCOME <span style={{ color: '#FFD700' }}>BACK</span>
                        </h1>
                        <div style={{ width: '60px', height: '3px', background: '#FFD700', marginBottom: '12px' }} />
                        <p style={{ color: '#AAAAAA' }}>Login with your email or username</p>
                    </div>

                    <div style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.15)', padding: '32px' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label className="sf-label">Email or Username</label>
                                <input className="sf-input" name="identifier" placeholder="john@example.com or ShadowKing_NG" value={form.identifier} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="sf-label">Password</label>
                                <input className="sf-input" name="password" type="password" placeholder="Your password" value={form.password} onChange={handleChange} required />
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#AAAAAA' }}>Forgot password?</Link>
                            </div>
                            {error && <p className="error-msg">{error}</p>}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-gold"
                                type="submit"
                                disabled={loading}
                                style={{ marginTop: '8px', width: '100%' }}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </motion.button>
                        </form>
                        <p style={{ textAlign: 'center', marginTop: '24px', color: '#AAAAAA', fontSize: '0.9rem' }}>
                            No account yet? <Link to="/register">Create one</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;