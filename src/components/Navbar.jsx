import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiAward, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import { Navbar, Nav, Container } from 'react-bootstrap';

const StatFortNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setExpanded(false);
    };

    return (
        <Navbar expanded={expanded} expand="lg" style={{
            background: '#111111',
            borderBottom: '1px solid rgba(255,215,0,0.2)',
            padding: '0 0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            minHeight: '64px',
        }}>
            <Container fluid className="px-4">
                <Navbar.Brand as={Link} to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <img src="/statfort-logo.png" alt="StatFort" style={{ height: '38px', width: '38px', objectFit: 'contain' }} />
                    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.8rem', fontWeight: 700, color: '#FFD700', letterSpacing: '0.1em' }}>
                        STAT<span style={{ color: '#FFFFFF' }}>FORT</span>
                    </span>
                </Navbar.Brand>

                <Navbar.Toggle
                    onClick={() => setExpanded(!expanded)}
                    style={{ border: 'none', background: 'transparent', color: '#FFD700' }}
                    aria-controls="sf-navbar"
                >
                    {expanded ? <FiX size={24} color="#FFD700" /> : <FiMenu size={24} color="#FFD700" />}
                </Navbar.Toggle>

                <Navbar.Collapse id="sf-navbar" style={{ background: expanded ? '#111111' : 'transparent' }}>
                    <Nav className="ms-auto align-items-lg-center gap-lg-3 py-3 py-lg-0 px-3 px-lg-0">
                        <Nav.Link as={Link} to="/leaderboard" onClick={() => setExpanded(false)} style={{
                            color: '#AAAAAA', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600,
                            letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.95rem',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
                        onMouseLeave={e => e.currentTarget.style.color = '#AAAAAA'}
                        >
                            <FiAward size={16} /> Leaderboard
                        </Nav.Link>

                        {user ? (
                            <>
                                <Nav.Link as={Link} to="/dashboard" onClick={() => setExpanded(false)} style={{
                                    color: '#AAAAAA', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600,
                                    letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.95rem',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
                                onMouseLeave={e => e.currentTarget.style.color = '#AAAAAA'}
                                >
                                    <FiUser size={16} /> {user.first_name}
                                </Nav.Link>

                                {user.is_superuser && (
                                    <Nav.Link as={Link} to="/admin" onClick={() => setExpanded(false)} style={{
                                        color: '#AAAAAA', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600,
                                        letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.95rem',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#AAAAAA'}
                                    >
                                        <FiSettings size={16} /> Admin
                                    </Nav.Link>
                                )}

                                <button onClick={handleLogout} style={{
                                    background: 'transparent', border: '1px solid rgba(255,215,0,0.2)',
                                    color: '#AAAAAA', padding: '6px 16px', display: 'flex', alignItems: 'center',
                                    gap: '6px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600,
                                    letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.85rem',
                                    transition: 'all 0.2s', cursor: 'pointer',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF4444'; e.currentTarget.style.color = '#FF4444'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; e.currentTarget.style.color = '#AAAAAA'; }}
                                >
                                    <FiLogOut size={14} /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" onClick={() => setExpanded(false)} style={{
                                    color: '#AAAAAA', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600,
                                    letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.95rem',
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
                                onMouseLeave={e => e.currentTarget.style.color = '#AAAAAA'}
                                >
                                    Login
                                </Nav.Link>
                                <Link to="/register" onClick={() => setExpanded(false)}>
                                    <button className="btn-gold" style={{ padding: '8px 24px', fontSize: '0.85rem' }}>
                                        Get Started
                                    </button>
                                </Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default StatFortNavbar;