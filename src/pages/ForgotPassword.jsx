import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await API.post('/users/forgot-password/', { email });
            setSuccess('Password reset code sent to your email.');
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
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
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>FORGOT <span style={{ color: 'var(--gold)' }}>PASSWORD</span></h1>
                        <div className="gold-line" />
                        <p style={{ color: 'var(--text-dim)', marginTop: '12px' }}>Enter your email to receive a reset code</p>
                    </div>
                    <div className="card">
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email</label>
                                <input className="input-field" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            {error && <p className="error-msg">{error}</p>}
                            {success && <p className="success-msg">{success}</p>}
                            <button className="btn-gold" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
                                {loading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>
                        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                            Remembered it? <Link to="/login">Login</Link>
                        </p>
                        {success && (
                            <p style={{ textAlign: 'center', marginTop: '12px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                <Link to="/reset-password">Enter reset code</Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;