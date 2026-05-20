import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiMessageSquare, FiLock, FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';

const GAME_COLORS = {
    'fortnite': '#7C3AED',
    'apex-legends': '#DC2626',
    'cod-mobile': '#16A34A',
};

const Community = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await API.get('/community/categories/');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const freeCategories = categories.filter(c => !c.is_premium);
    const premiumCategories = categories.filter(c => c.is_premium);

    if (loading) return (
        <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <p style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontSize: '1.2rem', letterSpacing: '0.2em' }}>LOADING...</p>
                </motion.div>
            </div>
        </div>
    );

    return (
        <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 16px' }}>

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.8rem', marginBottom: '8px', fontStyle: 'italic' }}>
                        STATFORT <span style={{ color: '#FFD700' }}>COMMUNITY</span>
                    </h1>
                    <div style={{ width: '60px', height: '3px', background: '#FFD700', marginBottom: '12px' }} />
                    <p style={{ color: '#AAAAAA' }}>Nigerian gaming discussions, rivalries and squad finding. All in one place.</p>
                </motion.div>

                {/* User rep card */}
                {user && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: 'linear-gradient(135deg, #1A1A1A, #111111)',
                            border: '1px solid rgba(255,215,0,0.2)',
                            padding: '20px 24px', marginBottom: '32px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            flexWrap: 'wrap', gap: '16px', position: 'relative', overflow: 'hidden',
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.4rem', color: '#0A0A0A',
                            }}>
                                {user.first_name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{user.username || user.first_name}</p>
                                    {user.is_premium && (
                                        <span style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#0A0A0A', padding: '2px 8px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.15em' }}>
                                            VERIFIED
                                        </span>
                                    )}
                                </div>
                                <p style={{ color: '#AAAAAA', fontSize: '0.82rem', margin: 0 }}>{user.state || 'Nigeria'}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.3rem', color: '#FFD700', margin: 0 }}>0</p>
                                <p style={{ color: '#AAAAAA', fontSize: '0.72rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rep</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Free categories */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '16px', color: '#AAAAAA', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Rajdhani' }}>
                        General Rooms
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {freeCategories.map((cat, index) => {
                            const gameColor = cat.game ? GAME_COLORS[cat.game] : '#FFD700';
                            return (
                                <motion.div
                                    key={cat.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Link to={`/community/${cat.slug}`} style={{ textDecoration: 'none' }}>
                                        <div style={{
                                            background: '#111111',
                                            border: '1px solid rgba(255,215,0,0.08)',
                                            padding: '16px 20px',
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                                            transition: 'all 0.2s', cursor: 'pointer',
                                            position: 'relative', overflow: 'hidden',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = `${gameColor}44`; e.currentTarget.style.background = '#1A1A1A'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.08)'; e.currentTarget.style.background = '#111111'; }}
                                        >
                                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: gameColor }} />
                                            <div style={{ paddingLeft: '12px' }}>
                                                <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.05rem', margin: 0, color: '#FFFFFF' }}>{cat.name}</p>
                                                <p style={{ color: '#AAAAAA', fontSize: '0.82rem', margin: 0, marginTop: '2px' }}>{cat.description}</p>
                                                {cat.latest_post && (
                                                    <p style={{ color: '#555555', fontSize: '0.75rem', margin: 0, marginTop: '4px' }}>
                                                        Latest: <span style={{ color: '#AAAAAA' }}>{cat.latest_post.title}</span> by <span style={{ color: gameColor }}>{cat.latest_post.author}</span>
                                                    </p>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                                                <div style={{ textAlign: 'center' }}>
                                                    <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.2rem', color: gameColor, margin: 0 }}>{cat.post_count}</p>
                                                    <p style={{ color: '#555555', fontSize: '0.7rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Posts</p>
                                                </div>
                                                <FiMessageSquare size={18} style={{ color: '#333333' }} />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Premium categories */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '1.2rem', fontStyle: 'italic', margin: 0, color: '#AAAAAA', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Rajdhani' }}>
                            Premium Rooms
                        </h2>
                        <div style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#0A0A0A', padding: '2px 10px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.15em' }}>
                            PREMIUM
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {premiumCategories.map((cat, index) => {
                            const canAccess = user?.is_premium;
                            return (
                                <motion.div
                                    key={cat.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    {canAccess ? (
                                        <Link to={`/community/${cat.slug}`} style={{ textDecoration: 'none' }}>
                                            <div style={{
                                                background: 'linear-gradient(135deg, #1A1A1A, #111111)',
                                                border: '1px solid rgba(255,215,0,0.2)',
                                                padding: '16px 20px',
                                                display: 'flex', alignItems: 'center',
                                                justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                                                transition: 'all 0.2s', cursor: 'pointer',
                                                position: 'relative', overflow: 'hidden',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.5)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; }}
                                            >
                                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'linear-gradient(to bottom, #FFD700, #FFA500)' }} />
                                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
                                                <div style={{ paddingLeft: '12px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                                        <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.05rem', margin: 0, color: '#FFD700' }}>{cat.name}</p>
                                                    </div>
                                                    <p style={{ color: '#AAAAAA', fontSize: '0.82rem', margin: 0 }}>{cat.description}</p>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.2rem', color: '#FFD700', margin: 0 }}>{cat.post_count}</p>
                                                        <p style={{ color: '#555555', fontSize: '0.7rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Posts</p>
                                                    </div>
                                                    <FiMessageSquare size={18} style={{ color: '#FFD700' }} />
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <Link to="/elite" style={{ textDecoration: 'none' }}>
                                            <div style={{
                                                background: '#0D0D0D',
                                                border: '1px solid rgba(255,215,0,0.1)',
                                                padding: '16px 20px',
                                                display: 'flex', alignItems: 'center',
                                                justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                                                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                                                opacity: 0.7,
                                            }}>
                                                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'rgba(255,215,0,0.2)' }} />
                                                <div style={{ paddingLeft: '12px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                                        <FiLock size={14} style={{ color: '#FFD700' }} />
                                                        <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.05rem', margin: 0, color: '#555555' }}>{cat.name}</p>
                                                    </div>
                                                    <p style={{ color: '#444444', fontSize: '0.82rem', margin: 0 }}>{cat.description}</p>
                                                    <p style={{ color: '#FFD700', fontSize: '0.75rem', margin: 0, marginTop: '4px', fontFamily: 'Rajdhani', fontWeight: 600 }}>Subscribe to Premium to unlock</p>
                                                </div>
                                                <FiLock size={18} style={{ color: '#333333', flexShrink: 0 }} />
                                            </div>
                                        </Link>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;