import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const Verify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
                            <button className="btn-gold" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
                                {loading ? 'Verifying...' : 'Verify Email'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verify;