import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/users/forgot-password/', { email });
            navigate('/reset-password', { state: { email } });
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
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
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>FORGOT <span style={{ color: '#FFD700' }}>PASSWORD</span></h1>
                        <div className="gold-line" />
                        <p className="text-dim mt-2">Enter your email to reset your password</p>
                    </div>
                    <div className="sf-card">
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label className="sf-label">Email</label>
                                <input className="sf-input" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            {error && <p className="error-msg">{error}</p>}
                            <button className="btn-gold" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
                                {loading ? 'Checking...' : 'Continue'}
                            </button>
                        </form>
                        <p className="text-center mt-4 text-dim" style={{ fontSize: '0.9rem' }}>
                            Remembered it? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ForgotPassword;