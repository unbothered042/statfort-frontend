import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
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
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Navbar />
            <Container style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                <div style={{ width: '100%', maxWidth: '520px' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>CREATE <span style={{ color: '#FFD700' }}>ACCOUNT</span></h1>
                        <div className="gold-line" />
                        <p className="text-dim mt-2">Join the Nigerian gaming leaderboard</p>
                    </div>
                    <div className="sf-card">
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <Row className="g-3">
                                <Col sm={6}>
                                    <label className="sf-label">First Name</label>
                                    <input className="sf-input" name="first_name" placeholder="John" value={form.first_name} onChange={handleChange} required />
                                </Col>
                                <Col sm={6}>
                                    <label className="sf-label">Last Name</label>
                                    <input className="sf-input" name="last_name" placeholder="Doe" value={form.last_name} onChange={handleChange} required />
                                </Col>
                            </Row>
                            <div>
                                <label className="sf-label">Email</label>
                                <input className="sf-input" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="sf-label">Phone</label>
                                <input className="sf-input" name="phone" placeholder="08012345678" value={form.phone} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="sf-label">Password</label>
                                <input className="sf-input" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
                            </div>
                            {error && <p className="error-msg">{error}</p>}
                            <button className="btn-gold" type="submit" disabled={loading} style={{ marginTop: '8px', width: '100%' }}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                        <p className="text-center mt-4 text-dim" style={{ fontSize: '0.9rem' }}>
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Register;