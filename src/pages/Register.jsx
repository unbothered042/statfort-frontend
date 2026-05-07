import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/users/register/', form);
            navigate('/verify', { state: { email: form.email } });
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                <div style={{ width: '100%', maxWidth: '480px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>CREATE <span style={{ color: 'var(--gold)' }}>ACCOUNT</span></h1>
                        <div className="gold-line" />
                        <p style={{ color: 'var(--text-dim)', marginTop: '12px' }}>Join the Nigerian gaming leaderboard</p>
                    </div>
                    <div className="card">
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>First Name</label>
                                    <input className="input-field" name="first_name" placeholder="John" value={form.first_name} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Last Name</label>
                                    <input className="input-field" name="last_name" placeholder="Doe" value={form.last_name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email</label>
                                <input className="input-field" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Phone</label>
                                <input className="input-field" name="phone" placeholder="08012345678" value={form.phone} onChange={handleChange} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Password</label>
                                <input className="input-field" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
                            </div>
                            {error && <p className="error-msg">{error}</p>}
                            <button className="btn-gold" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;