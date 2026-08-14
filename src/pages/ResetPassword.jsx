import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ email: location.state?.email || '', code: '', new_password: '' });
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
            <Container style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>RESET <span style={{ color: '#FFD700' }}>PASSWORD</span></h1>
                        <div className="gold-line" />
                        <p className="text-dim mt-2">Enter the code sent to your email and choose a new password</p>
                    </div>
                    <div className="sf-card">
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label className="sf-label">Email</label>
                                <input className="sf-input" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="sf-label">Reset Code</label>
                                <input
                                    className="sf-input"
                                    name="code"
                                    placeholder="Enter 6-digit code"
                                    value={form.code}
                                    onChange={handleChange}
                                    maxLength={6}
                                    required
                                    style={{ fontSize: '1.3rem', letterSpacing: '0.25em', textAlign: 'center' }}
                                />
                            </div>
                            <div>
                                <label className="sf-label">New Password</label>
                                <input className="sf-input" name="new_password" type="password" placeholder="Min 6 characters" value={form.new_password} onChange={handleChange} required />
                            </div>
                            {error && <p className="error-msg">{error}</p>}
                            <button className="btn-gold" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                        <p className="text-center mt-4 text-dim" style={{ fontSize: '0.9rem' }}>
                            <Link to="/login">Back to Login</Link>
                        </p>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ResetPassword;