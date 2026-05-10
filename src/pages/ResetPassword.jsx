import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ email: location.state?.email || '', new_password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/users/reset-password/', form);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Reset failed. Please try again.');
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
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>RESET <span style={{ color: 'var(--gold)' }}>PASSWORD</span></h1>
                        <div className="gold-line" />
                        <p style={{ color: 'var(--text-dim)', marginTop: '12px' }}>Enter your new password</p>
                    </div>
                    <div className="card">
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email</label>
                                <input className="input-field" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>New Password</label>
                                <input className="input-field" name="new_password" type="password" placeholder="Min 6 characters" value={form.new_password} onChange={handleChange} required />
                            </div>
                            {error && <p className="error-msg">{error}</p>}
                            <button className="btn-gold" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                            <Link to="/login">Back to Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;