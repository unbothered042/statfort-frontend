import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiAward, FiSettings, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    const linkStyle = {
        color: 'var(--text-dim)',
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'color 0.2s',
        textDecoration: 'none',
    };

    return (
        <>
            <nav style={{
                background: 'var(--dark)',
                borderBottom: '1px solid var(--border)',
                padding: '0 24px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <img src="/statfort-logo.png" alt="StatFort" style={{ height: '38px', width: '38px', objectFit: 'contain' }} />
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em' }}>
                        STAT<span style={{ color: 'var(--text)' }}>FORT</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="desktop-nav">
                    <Link to="/leaderboard" style={linkStyle}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                    >
                        <FiAward size={16} /> Leaderboard
                    </Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" style={linkStyle}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                            >
                                <FiUser size={16} /> {user.first_name}
                            </Link>

                            {user.is_superuser && (
                                <Link to="/admin" style={linkStyle}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                                >
                                    <FiSettings size={16} /> Admin
                                </Link>
                            )}

                            <button onClick={handleLogout} style={{
                                background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-dim)',
                                padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '6px',
                                fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: '0.08em',
                                textTransform: 'uppercase', fontSize: '0.85rem', transition: 'all 0.2s', cursor: 'pointer',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--error)'; e.currentTarget.style.color = 'var(--error)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
                            >
                                <FiLogOut size={14} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={linkStyle}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                            >
                                Login
                            </Link>
                            <Link to="/register">
                                <button className="btn-gold" style={{ padding: '8px 24px', fontSize: '0.85rem' }}>
                                    Get Started
                                </button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-nav-toggle" style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--gold)',
                    cursor: 'pointer',
                    display: 'none',
                    padding: '4px',
                }}>
                    {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </nav>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div style={{
                    position: 'fixed',
                    top: '64px',
                    left: 0,
                    right: 0,
                    background: 'var(--dark)',
                    borderBottom: '1px solid var(--border)',
                    padding: '16px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    zIndex: 99,
                }}>
                    <Link to="/leaderboard" style={linkStyle} onClick={() => setMenuOpen(false)}>
                        <FiAward size={16} /> Leaderboard
                    </Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" style={linkStyle} onClick={() => setMenuOpen(false)}>
                                <FiUser size={16} /> {user.first_name}
                            </Link>

                            {user.is_superuser && (
                                <Link to="/admin" style={linkStyle} onClick={() => setMenuOpen(false)}>
                                    <FiSettings size={16} /> Admin
                                </Link>
                            )}

                            <button onClick={handleLogout} style={{
                                background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-dim)',
                                padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px',
                                fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: '0.08em',
                                textTransform: 'uppercase', fontSize: '0.9rem', cursor: 'pointer', width: 'fit-content',
                            }}>
                                <FiLogOut size={14} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={linkStyle} onClick={() => setMenuOpen(false)}>
                                Login
                            </Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)}>
                                <button className="btn-gold" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
                                    Get Started
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .mobile-nav-toggle { display: block !important; }
                }
            `}</style>
        </>
    );
};

export default Navbar;