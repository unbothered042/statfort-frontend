import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiSend, FiCheckCircle } from 'react-icons/fi';

const SUBJECTS = [
    'Account Issue',
    'Payment Problem',
    'Stats Not Syncing',
    'AI Verification Failed',
    'Premium Membership',
    'Bug Report',
    'Feature Request',
    'Other',
];

const Contact = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: user ? `${user.first_name} ${user.last_name}` : '',
        email: user?.email || '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/users/contact/', form);
            setSuccess(true);
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
            <Navbar />
            <div className="contact-wrap" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 16px' }}>

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '48px' }}>
                    <h1 className="contact-h1" style={{ fontSize: '2.8rem', marginBottom: '8px', fontStyle: 'italic' }}>
                        SUPPORT & <span style={{ color: '#FFD700' }}>COMPLAINTS</span>
                    </h1>
                    <div style={{ width: '60px', height: '3px', background: '#FFD700', marginBottom: '12px' }} />
                    <p style={{ color: '#AAAAAA', fontSize: '1rem', lineHeight: 1.6 }}>
                        Having an issue? We respond to every message. Send us a detailed description and we will get back to you as soon as possible.
                    </p>
                </motion.div>

                <div className="contact-grid">

                    {/* Left info panel */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                        <div style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.15)', padding: '24px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
                            <FiMail size={24} style={{ color: '#FFD700', marginBottom: '12px' }} />
                            <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAAAAA', marginBottom: '8px' }}>Email Us</p>
                            <p style={{ color: '#FFD700', fontSize: '0.88rem', wordBreak: 'break-all' }}>statfort9@gmail.com</p>
                        </div>

                        <div style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.15)', padding: '24px', marginBottom: '16px' }}>
                            <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAAAAA', marginBottom: '12px' }}>Common Issues</p>
                            {[
                                'Stats not syncing — check your profile is set to public',
                                'Payment not reflecting — allow up to 5 minutes',
                                'AI verification failed — use a clearer screenshot',
                                'Forgot password — use the reset password page',
                            ].map((tip, i) => (
                                <p key={i} style={{ color: '#666666', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '8px', paddingLeft: '10px', borderLeft: '2px solid rgba(255,215,0,0.2)' }}>
                                    {tip}
                                </p>
                            ))}
                        </div>

                        <div style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.15)', padding: '24px' }}>
                            <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAAAAA', marginBottom: '8px' }}>Response Time</p>
                            <p style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.4rem', marginBottom: '4px' }}>24 Hours</p>
                            <p style={{ color: '#555555', fontSize: '0.8rem' }}>We respond to all support requests within 24 hours.</p>
                        </div>
                    </motion.div>

                    {/* Right form */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    background: 'linear-gradient(135deg, #1A1A1A, #111111)',
                                    border: '1px solid rgba(0,204,102,0.3)',
                                    padding: '48px 32px', textAlign: 'center',
                                    position: 'relative', overflow: 'hidden',
                                }}
                            >
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #00CC66, transparent)' }} />
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <FiCheckCircle size={56} style={{ color: '#00CC66', marginBottom: '20px' }} />
                                </motion.div>
                                <h2 style={{ fontFamily: 'Rajdhani', fontSize: '1.8rem', fontStyle: 'italic', marginBottom: '12px' }}>
                                    MESSAGE <span style={{ color: '#00CC66' }}>SENT</span>
                                </h2>
                                <p style={{ color: '#AAAAAA', lineHeight: 1.7, marginBottom: '24px' }}>
                                    Your message has been received. We will get back to you at <strong style={{ color: '#FFD700' }}>{user?.email || 'your email'}</strong> within 24 hours.
                                </p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    style={{
                                        background: 'transparent', border: '1px solid rgba(255,215,0,0.3)',
                                        color: '#FFD700', padding: '10px 28px', fontFamily: 'Rajdhani',
                                        fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em',
                                        textTransform: 'uppercase', cursor: 'pointer',
                                    }}
                                >
                                    Send Another
                                </button>
                            </motion.div>
                        ) : (
                            <div style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.15)', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
                                <h2 style={{ fontFamily: 'Rajdhani', fontSize: '1.3rem', fontStyle: 'italic', marginBottom: '24px' }}>
                                    SEND A <span style={{ color: '#FFD700' }}>MESSAGE</span>
                                </h2>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div className="contact-name-row">
                                        <div>
                                            <label className="sf-label">Your Name</label>
                                            <input className="sf-input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                                        </div>
                                        <div>
                                            <label className="sf-label">Email Address</label>
                                            <input className="sf-input" name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="sf-label">Subject</label>
                                        <select className="sf-select" name="subject" value={form.subject} onChange={handleChange} required>
                                            <option value="">Select a subject</option>
                                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="sf-label">Message</label>
                                        <textarea
                                            className="sf-input"
                                            name="message"
                                            placeholder="Describe your issue in detail. Include your username, the game affected and any error messages you saw."
                                            value={form.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            style={{ resize: 'vertical', minHeight: '140px' }}
                                        />
                                    </div>
                                    {error && <p className="error-msg">{error}</p>}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            background: '#FFD700', color: '#0A0A0A', border: 'none',
                                            padding: '12px 32px', fontFamily: 'Rajdhani', fontWeight: 700,
                                            fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', gap: '8px', width: '100%',
                                        }}
                                    >
                                        <FiSend size={14} />
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </motion.button>
                                </form>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <style>{`
                .contact-grid {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 32px;
                    align-items: start;
                }
                .contact-name-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                @media (max-width: 768px) {
                    .contact-grid {
                        grid-template-columns: 1fr;
                        gap: 24px;
                    }
                    .contact-wrap {
                        padding: 40px 16px !important;
                    }
                    .contact-h1 {
                        font-size: 2.1rem !important;
                    }
                }

                @media (max-width: 480px) {
                    .contact-name-row {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }
                    .contact-h1 {
                        font-size: 1.7rem !important;
                    }
                    .contact-wrap {
                        padding: 32px 12px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Contact;