import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiHelpCircle, FiX, FiMail, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';

const HelpButton = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const options = [
        { icon: <FiAlertCircle size={16} />, label: 'Report a Problem', action: () => { navigate('/contact?subject=Bug+Report'); setOpen(false); } },
        { icon: <FiMail size={16} />, label: 'Contact Support', action: () => { navigate('/contact'); setOpen(false); } },
        { icon: <FiMessageSquare size={16} />, label: 'Community Forum', action: () => { navigate('/community'); setOpen(false); } },
    ];

    return (
        <div style={{ position: 'fixed', bottom: '28px', right: '24px', zIndex: 200 }}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute', bottom: '64px', right: 0,
                            background: '#111111', border: '1px solid rgba(255,215,0,0.2)',
                            minWidth: '200px', overflow: 'hidden',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        }}
                    >
                        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,215,0,0.1)' }}>
                            <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FFD700', margin: 0 }}>
                                How can we help?
                            </p>
                        </div>
                        {options.map((opt) => (
                            <button
                                key={opt.label}
                                onClick={opt.action}
                                style={{
                                    width: '100%', background: 'transparent',
                                    border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
                                    color: '#AAAAAA', padding: '12px 16px',
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.9rem',
                                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#1A1A1A'; e.currentTarget.style.color = '#FFD700'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#AAAAAA'; }}
                            >
                                <span style={{ color: '#FFD700' }}>{opt.icon}</span>
                                {opt.label}
                            </button>
                        ))}
                        <div style={{ padding: '10px 16px' }}>
                            <p style={{ color: '#444444', fontSize: '0.75rem', margin: 0, textAlign: 'center' }}>
                                statfort9@gmail.com
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(!open)}
                style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: open ? '#FFD700' : 'linear-gradient(135deg, #FFD700, #FFA500)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(255,215,0,0.4)',
                    color: '#0A0A0A',
                }}
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                            <FiX size={22} />
                        </motion.span>
                    ) : (
                        <motion.span key="help" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                            <FiHelpCircle size={22} />
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default HelpButton;