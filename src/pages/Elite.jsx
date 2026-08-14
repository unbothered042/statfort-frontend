import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiZap, FiLock, FiTrendingUp, FiTarget, FiShield, FiAward, FiBarChart2, FiUsers } from 'react-icons/fi';

const ELITE_FEATURES = [
    { icon: <FiBarChart2 size={20} />, title: 'Performance Volatility', desc: 'Discover if you are a streaky player or a consistent anchor across all your matches.' },
    { icon: <FiTarget size={20} />, title: 'Skill Gap Analysis', desc: 'See exactly how you rank against Nigerian top players and what to fix first.' },
    { icon: <FiShield size={20} />, title: 'Clutch Factor / Squad Synergy', desc: 'Your success rate under pressure — or, for eFootball, whether your pack players are paired correctly.' },
    { icon: <FiZap size={20} />, title: 'Loadout / Tactical Efficiency', desc: 'Which playstyle, weapon type, or squad shape is yielding your highest win percentages.' },
    { icon: <FiTrendingUp size={20} />, title: 'AI Growth Projection', desc: 'Where your rank will be in 30 days if you maintain your current improvement rate.' },
];

const EliteCard = ({ data, icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
            background: 'linear-gradient(135deg, #1A1A1A, #111111)',
            border: `1px solid ${color}33`,
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
        }}
    >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${color}, transparent)` }} />
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`, borderRadius: '50%' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ color, padding: '8px', background: `${color}15`, borderRadius: '4px' }}>{icon}</div>
            <h3 style={{ fontFamily: 'Rajdhani', fontSize: '1.1rem', fontWeight: 700, margin: 0, letterSpacing: '0.05em' }}>{data.title}</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            {data.rating && (
                <span style={{ background: `${color}20`, border: `1px solid ${color}50`, color, padding: '3px 12px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {data.rating}
                </span>
            )}
            {data.score && (
                <span style={{ background: `${color}20`, border: `1px solid ${color}50`, color, padding: '3px 12px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.1em' }}>
                    {data.score}/10
                </span>
            )}
            {data.percentile && (
                <span style={{ background: `${color}20`, border: `1px solid ${color}50`, color, padding: '3px 12px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.1em' }}>
                    Top {100 - parseInt(data.percentile) + 1}%
                </span>
            )}
            {data.projected_rank && (
                <span style={{ background: `${color}20`, border: `1px solid ${color}50`, color, padding: '3px 12px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.1em' }}>
                    {data.projected_rank}
                </span>
            )}
        </div>

        <p style={{ color: '#AAAAAA', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{data.analysis}</p>
    </motion.div>
);

// Default (FPS-style games): performance_volatility, skill_gap, clutch_factor, weapon_efficiency, growth_projection
const DEFAULT_CARD_KEYS = [
    { key: 'performance_volatility', color: '#FFD700', icon: <FiBarChart2 size={20} /> },
    { key: 'skill_gap', color: '#7C3AED', icon: <FiTarget size={20} /> },
    { key: 'clutch_factor', color: '#DC2626', icon: <FiShield size={20} /> },
    { key: 'weapon_efficiency', color: '#16A34A', icon: <FiZap size={20} /> },
    { key: 'growth_projection', color: '#EA580C', icon: <FiTrendingUp size={20} /> },
];

// eFootball: performance_volatility, skill_gap, squad_synergy, tactical_efficiency, growth_projection
const EFOOTBALL_CARD_KEYS = [
    { key: 'performance_volatility', color: '#FFD700', icon: <FiBarChart2 size={20} /> },
    { key: 'skill_gap', color: '#7C3AED', icon: <FiTarget size={20} /> },
    { key: 'squad_synergy', color: '#0EA5E9', icon: <FiUsers size={20} /> },
    { key: 'tactical_efficiency', color: '#16A34A', icon: <FiZap size={20} /> },
    { key: 'growth_projection', color: '#EA580C', icon: <FiTrendingUp size={20} /> },
];

const Elite = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [myGames, setMyGames] = useState([]);
    const [stats, setStats] = useState([]);
    const [selectedGameId, setSelectedGameId] = useState(null);
    const [eliteData, setEliteData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        loadData();

        // Handle payment return
        const params = new URLSearchParams(location.search);
        const paymentStatus = params.get('payment');
        const reference = params.get('trxref') || params.get('reference');

        if (paymentStatus === 'success' && reference) {
            verifyPayment(reference);
        }
    }, []);

    const loadData = async () => {
        setPageLoading(true);
        try {
            const [myGamesRes, statsRes] = await Promise.all([
                API.get('/games/my-games/'),
                API.get('/stats/my-stats/'),
            ]);
            setMyGames(myGamesRes.data);
            setStats(statsRes.data);
            if (myGamesRes.data.length > 0) {
                setSelectedGameId(myGamesRes.data[0].id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setPageLoading(false);
        }
    };

    const verifyPayment = async (reference) => {
        setVerifying(true);
        try {
            const res = await API.post('/users/payment/verify/', { reference });
            if (res.data.is_premium) {
                const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                storedUser.is_premium = true;
                localStorage.setItem('user', JSON.stringify(storedUser));
                window.location.href = '/elite';
            }
        } catch (err) {
            console.error(err);
        } finally {
            setVerifying(false);
        }
    };

    const handleSubscribe = async () => {
        setPaymentLoading(true);
        try {
            const res = await API.post('/users/payment/initialize/');
            window.location.href = res.data.authorization_url;
        } catch (err) {
            console.error(err);
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!selectedGameId) return;
        setLoading(true);
        setError('');
        setEliteData(null);
        try {
            const res = await API.post(`/insights/${selectedGameId}/elite/`);
            setEliteData(res.data.elite_insights);
        } catch (err) {
            if (err.response?.data?.requires_premium) {
                setError('premium_required');
            } else if (err.response?.data?.requires_squad_setup) {
                setError('squad_required');
            } else {
                setError(err.response?.data?.error || 'Failed to generate. Make sure you have approved stats first.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatsForGame = (playerGameId) => stats.find(s => s.player_game.id === playerGameId);
    const isPremium = user?.is_premium;

    const selectedGame = myGames.find(pg => pg.id === selectedGameId);
    const isEfootballSelected = selectedGame?.game?.slug === 'efootball';
    const CARD_KEYS = isEfootballSelected ? EFOOTBALL_CARD_KEYS : DEFAULT_CARD_KEYS;

    if (verifying) return (
        <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: '16px' }}>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <p style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontSize: '1.2rem', letterSpacing: '0.2em' }}>VERIFYING PAYMENT...</p>
                </motion.div>
            </div>
        </div>
    );

    if (pageLoading) return (
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
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 16px' }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '40px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h1 style={{ fontSize: '2.8rem', fontStyle: 'italic', margin: 0 }}>
                            ELITE <span style={{ color: '#FFD700' }}>TIER STATS</span>
                        </h1>
                        <div style={{
                            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                            color: '#0A0A0A', padding: '4px 12px',
                            fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.75rem',
                            letterSpacing: '0.15em', textTransform: 'uppercase',
                        }}>
                            {isPremium ? 'PREMIUM' : 'FREE ACCESS'}
                        </div>
                    </div>
                    <div style={{ width: '60px', height: '3px', background: '#FFD700', marginBottom: '12px' }} />
                    <p style={{ color: '#AAAAAA' }}>Advanced analytics that separate elite players from the rest.</p>
                </motion.div>

                {/* Premium paywall - shown even for free access with a notice */}
                {!isPremium && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: 'linear-gradient(135deg, #1A1A1A, #111111)',
                            border: '1px solid rgba(255,215,0,0.3)',
                            padding: '32px', marginBottom: '40px',
                            position: 'relative', overflow: 'hidden', textAlign: 'center',
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }} />
                        <FiLock size={40} style={{ color: '#FFD700', marginBottom: '16px' }} />
                        <h2 style={{ fontSize: '1.8rem', fontStyle: 'italic', marginBottom: '8px' }}>
                            UNLOCK <span style={{ color: '#FFD700' }}>PREMIUM</span>
                        </h2>
                        <p style={{ color: '#AAAAAA', marginBottom: '8px', maxWidth: '500px', margin: '0 auto 24px' }}>
                            Get full access to all 5 Elite Tier analyses, AI Growth Projection and advanced performance tracking for just
                        </p>
                        <div style={{ marginBottom: '24px' }}>
                            <span style={{ fontFamily: 'Rajdhani', fontSize: '3rem', fontWeight: 700, color: '#FFD700', fontStyle: 'italic' }}>₦1,000</span>
                            <span style={{ color: '#AAAAAA', fontSize: '1rem' }}>/month</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '32px', textAlign: 'left' }}>
                            {ELITE_FEATURES.map((f) => (
                                <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <div style={{ color: '#FFD700', flexShrink: 0, marginTop: '2px' }}>{f.icon}</div>
                                    <div>
                                        <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem', margin: 0, color: '#FFFFFF' }}>{f.title}</p>
                                        <p style={{ color: '#AAAAAA', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubscribe}
                            disabled={paymentLoading}
                            style={{
                                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                color: '#0A0A0A', border: 'none',
                                padding: '14px 48px', fontFamily: 'Rajdhani', fontWeight: 700,
                                fontSize: '1.1rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                                cursor: 'pointer', boxShadow: '0 8px 32px rgba(255,215,0,0.3)',
                            }}
                        >
                            {paymentLoading ? 'Redirecting to Paystack...' : 'Subscribe Now - ₦1,000/month'}
                        </motion.button>

                        <p style={{ color: '#555555', fontSize: '0.8rem', marginTop: '16px' }}>
                            Secure payment via Paystack. Cancel anytime.
                        </p>
                    </motion.div>
                )}

                {/* Elite content - accessible for all right now */}
                {myGames.length === 0 ? (
                    <div style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.1)', padding: '60px 20px', textAlign: 'center' }}>
                        <p style={{ color: '#AAAAAA', marginBottom: '16px' }}>You need to add a game and sync your stats first.</p>
                        <Link to="/dashboard">
                            <button className="btn-gold" style={{ padding: '10px 32px', fontSize: '0.9rem' }}>Go to Dashboard</button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Game selector */}
                        <div style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.15)', padding: '24px', marginBottom: '24px' }}>
                            <p className="sf-label" style={{ marginBottom: '12px' }}>Select Game to Analyze</p>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {myGames.map((pg) => {
                                    const hasStats = getStatsForGame(pg.id);
                                    return (
                                        <button
                                            key={pg.id}
                                            onClick={() => { setSelectedGameId(pg.id); setEliteData(null); setError(''); }}
                                            disabled={!hasStats}
                                            style={{
                                                padding: '10px 24px', fontFamily: 'Rajdhani', fontWeight: 700,
                                                fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                                                background: selectedGameId === pg.id ? '#FFD700' : 'transparent',
                                                color: selectedGameId === pg.id ? '#0A0A0A' : hasStats ? '#AAAAAA' : '#333333',
                                                border: '1px solid', borderColor: selectedGameId === pg.id ? '#FFD700' : hasStats ? 'rgba(255,215,0,0.2)' : '#222222',
                                                cursor: hasStats ? 'pointer' : 'not-allowed', transition: 'all 0.2s', borderRadius: 0,
                                            }}
                                        >
                                            {pg.game.name} {!hasStats && '(no stats)'}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Generate button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGenerate}
                            disabled={loading || !selectedGameId}
                            style={{
                                background: loading ? '#222222' : 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))',
                                border: '1px solid rgba(255,215,0,0.3)',
                                color: '#FFD700', padding: '14px 32px',
                                display: 'flex', alignItems: 'center', gap: '10px',
                                fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1rem',
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                cursor: loading ? 'wait' : 'pointer', marginBottom: '32px',
                                width: '100%', justifyContent: 'center',
                            }}
                        >
                            {loading ? (
                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                                    <FiZap size={18} />
                                </motion.span>
                            ) : (
                                <FiZap size={18} />
                            )}
                            {loading ? 'Generating Elite Analysis...' : 'Generate Elite Tier Analysis'}
                        </motion.button>

                        {error === 'squad_required' && (
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                                background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.3)',
                                borderLeft: '3px solid #0EA5E9', padding: '14px 16px', marginBottom: '24px',
                            }}>
                                <p style={{ color: '#AAAAAA', fontSize: '0.88rem', margin: 0 }}>
                                    Set up your squad (GK, CB, CB, CDM, LW, RW, ST) in the Dashboard first — this powers your Squad Synergy analysis.
                                </p>
                                <Link to="/dashboard">
                                    <button className="btn-gold" style={{ padding: '8px 20px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>Go to Dashboard</button>
                                </Link>
                            </div>
                        )}

                        {error && error !== 'premium_required' && error !== 'squad_required' && (
                            <p className="error-msg" style={{ marginBottom: '24px' }}>{error}</p>
                        )}

                        {/* Elite results */}
                        <AnimatePresence>
                            {eliteData && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                                >
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '12px 20px', background: 'rgba(255,215,0,0.05)',
                                        border: '1px solid rgba(255,215,0,0.2)', marginBottom: '8px',
                                    }}>
                                        <FiAward size={16} style={{ color: '#FFD700' }} />
                                        <p style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                                            Elite Tier Analysis Complete
                                        </p>
                                    </div>

                                    {CARD_KEYS.map(({ key, color, icon }, i) => (
                                        eliteData[key] && (
                                            <motion.div
                                                key={key}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                            >
                                                <EliteCard data={eliteData[key]} icon={icon} color={color} />
                                            </motion.div>
                                        )
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
};

export default Elite;