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
        color: '#AAAAAA',
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontSize: '0.95rem',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        textDecoration: 'none',
        transition: 'color 0.2s',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
    };

    return (
        <>
            <nav style={{
                background: '#111111',
                borderBottom: '1px solid rgba(255,215,0,0.2)',
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
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#FFD700', letterSpacing: '0.1em' }}>
                        STAT<span style={{ color: '#FFFFFF' }}>FORT</span>
                    </span>
                </Link>

                {/* Desktop menu */}
                <div className="sf-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <Link to="/leaderboard" style={linkStyle}
                        onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
                        onMouseLeave={e => e.currentTarget.style.color = '#AAAAAA'}
                    >
                        <FiAward size={16} /> Leaderboard
                    </Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" style={linkStyle}
                                onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
                                onMouseLeave={e => e.currentTarget.style.color = '#AAAAAA'}
                            >
                                <FiUser size={16} /> {user.first_name}
                            </Link>

                            {user.is_superuser && (
                                <Link to="/admin" style={linkStyle}
                                    onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#AAAAAA'}
                                >
                                    <FiSettings size={16} /> Admin
                                </Link>
                            )}

                            <button onClick={handleLogout} style={{
                                ...linkStyle,
                                border: '1px solid rgba(255,215,0,0.2)',
                                padding: '6px 16px',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF4444'; e.currentTarget.style.color = '#FF4444'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; e.currentTarget.style.color = '#AAAAAA'; }}
                            >
                                <FiLogOut size={14} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={linkStyle}
                                onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
                                onMouseLeave={e => e.currentTarget.style.color = '#AAAAAA'}
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

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="sf-mobile-toggle"
                    style={{ background: 'transparent', border: 'none', color: '#FFD700', cursor: 'pointer', padding: '4px', display: 'none' }}
                >
                    {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </nav>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div style={{
                    position: 'fixed', top: '64px', left: 0, right: 0,
                    background: '#111111', borderBottom: '1px solid rgba(255,215,0,0.2)',
                    padding: '16px 24px', display: 'flex', flexDirection: 'column',
                    gap: '16px', zIndex: 99,
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
                            <button onClick={handleLogout} style={{ ...linkStyle, width: 'fit-content' }}>
                                <FiLogOut size={14} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={linkStyle} onClick={() => setMenuOpen(false)}>Login</Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)}>
                                <button className="btn-gold" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>Get Started</button>
                            </Link>
                        </>
                    )}
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .sf-desktop-nav { display: none !important; }
                    .sf-mobile-toggle { display: block !important; }
                }
            `}</style>
        </>
    );
};

export default Navbar;