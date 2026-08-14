import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
    'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 'Jigawa',
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
    'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '',
        username: '', state: '', password: '',
    });
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
            const errors = err.response?.data;
            if (errors && typeof errors === 'object') {
                const first = Object.values(errors)[0];
                setError(Array.isArray(first) ? first[0] : first);
            } else {
                setError('Registration failed. Please try again.');
            }
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
                    style={{ width: '100%', maxWidth: '520px' }}
                >
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', fontStyle: 'italic' }}>
                            CREATE <span style={{ color: '#FFD700' }}>ACCOUNT</span>
                        </h1>
                        <div style={{ width: '60px', height: '3px', background: '#FFD700', marginBottom: '12px' }} />
                        <p style={{ color: '#AAAAAA' }}>Join the Nigerian gaming leaderboard</p>
                    </div>

                    <div style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.15)', padding: '32px' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label className="sf-label">First Name</label>
                                    <input className="sf-input" name="first_name" placeholder="John" value={form.first_name} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="sf-label">Last Name</label>
                                    <input className="sf-input" name="last_name" placeholder="Doe" value={form.last_name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div>
                                <label className="sf-label">Email</label>
                                <input className="sf-input" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="sf-label">Username</label>
                                <input className="sf-input" name="username" placeholder="ShadowKing_NG" value={form.username} onChange={handleChange} required />
                                <p style={{ color: '#555555', fontSize: '0.78rem', marginTop: '4px' }}>Your public display name on the leaderboard</p>
                            </div>
                            <div>
                                <label className="sf-label">State</label>
                                <select className="sf-select" name="state" value={form.state} onChange={handleChange} required>
                                    <option value="">Select your state</option>
                                    {NIGERIAN_STATES.map(s => (
                                        <option key={s} value={s}>{s === 'FCT' ? 'FCT - Abuja' : s}</option>
                                    ))}
                                </select>
                                <p style={{ color: '#555555', fontSize: '0.78rem', marginTop: '4px' }}>Shown on the leaderboard to represent your state</p>
                            </div>
                            <div>
                                <label className="sf-label">Password</label>
                                <input className="sf-input" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
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
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </motion.button>
                        </form>
                        <p style={{ textAlign: 'center', marginTop: '24px', color: '#AAAAAA', fontSize: '0.9rem' }}>
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;