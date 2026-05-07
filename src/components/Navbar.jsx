import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiAward, FiSettings } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{
            background: 'var(--dark)',
            borderBottom: '1px solid var(--border)',
            padding: '0 40px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <Link to="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
            }}>
                <img src="/statfort-logo.png" alt="StatFort" style={{ height: '38px', width: '38px', objectFit: 'contain' }} />
                <span style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    color: 'var(--gold)',
                    letterSpacing: '0.1em',
                }}>
                    STAT<span style={{ color: 'var(--text)' }}>FORT</span>
                </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <Link to="/leaderboard" style={{
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
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                >
                    <FiAward size={16} /> Leaderboard
                </Link>

                {user ? (
                    <>
                        <Link to="/dashboard" style={{
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
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                        >
                            <FiUser size={16} /> {user.first_name}
                        </Link>

                        {user.is_superuser && (
                            <Link to="/admin" style={{
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
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                            >
                                <FiSettings size={16} /> Admin
                            </Link>
                        )}

                        <button onClick={handleLogout} style={{
                            background: 'transparent',
                            border: '1px solid var(--border)',
                            color: 'var(--text-dim)',
                            padding: '6px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontFamily: 'Rajdhani, sans-serif',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--error)'; e.currentTarget.style.color = 'var(--error)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
                        >
                            <FiLogOut size={14} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{
                            color: 'var(--text-dim)',
                            fontFamily: 'Rajdhani, sans-serif',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            fontSize: '0.95rem',
                            transition: 'color 0.2s',
                        }}
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
        </nav>
    );
};

export default Navbar;