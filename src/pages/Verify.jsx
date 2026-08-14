import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const RESEND_COOLDOWN = 30;

const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/users/verify-email/', { email, code });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0 || !email) return;
        setResending(true);
        setError('');
        setResendMessage('');
        try {
            const res = await API.post('/users/resend-otp/', { email });
            setResendMessage(res.data.message || 'A new code has been sent.');
            setCooldown(RESEND_COOLDOWN);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend code. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>VERIFY <span style={{ color: 'var(--gold)' }}>EMAIL</span></h1>
                        <div className="gold-line" />
                        <p style={{ color: 'var(--text-dim)', marginTop: '12px' }}>Enter the 6-digit code sent to <span style={{ color: 'var(--gold)' }}>{email}</span></p>
                    </div>
                    <div className="card">
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Verification Code</label>
                                <input className="input-field" placeholder="Enter 6-digit code" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} required style={{ fontSize: '1.5rem', letterSpacing: '0.3em', textAlign: 'center' }} />
                            </div>
                            {error && <p className="error-msg">{error}</p>}
                            {resendMessage && <p style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>{resendMessage}</p>}
                            <button className="btn-gold" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
                                {loading ? 'Verifying...' : 'Verify Email'}
                            </button>
                        </form>
                        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                            Didn't get a code?{' '}
                            <button
                                onClick={handleResend}
                                disabled={resending || cooldown > 0 || !email}
                                style={{
                                    background: 'none', border: 'none', padding: 0,
                                    color: cooldown > 0 ? 'var(--text-dim)' : 'var(--gold)',
                                    cursor: cooldown > 0 || resending ? 'not-allowed' : 'pointer',
                                    fontSize: '0.85rem', fontWeight: 700, textDecoration: 'underline',
                                }}
                            >
                                {resending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verify;