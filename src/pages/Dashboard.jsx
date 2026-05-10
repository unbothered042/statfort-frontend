import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiRefreshCw, FiZap, FiTrash2, FiInfo, FiUpload, FiTarget, FiAward } from 'react-icons/fi';

const GAME_OPTIONS = [
    { name: 'Fortnite', slug: 'fortnite', color: '#7C3AED', glow: 'rgba(124,58,237,0.3)', border: 'rgba(124,58,237,0.5)', logo: '⚡' },
    { name: 'Apex Legends', slug: 'apex-legends', color: '#DC2626', glow: 'rgba(220,38,38,0.3)', border: 'rgba(220,38,38,0.5)', logo: '🔴' },
    { name: 'COD Mobile', slug: 'cod-mobile', color: '#16A34A', glow: 'rgba(22,163,74,0.3)', border: 'rgba(22,163,74,0.5)', logo: '🟢' },
];

const GAME_COLORS = {
    'fortnite': { color: '#7C3AED', glow: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.4)' },
    'apex-legends': { color: '#DC2626', glow: 'rgba(220,38,38,0.15)', border: 'rgba(220,38,38,0.4)' },
    'cod-mobile': { color: '#16A34A', glow: 'rgba(22,163,74,0.15)', border: 'rgba(22,163,74,0.4)' },
};

const KDBar = ({ kd, maxKd = 5 }) => {
    const pct = Math.min((kd / maxKd) * 100, 100);
    const color = kd >= 3 ? '#FFD700' : kd >= 2 ? '#16A34A' : kd >= 1 ? '#EA580C' : '#DC2626';
    return (
        <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#AAAAAA', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>K/D Ratio</span>
                <span style={{ fontSize: '0.75rem', color, fontFamily: 'Rajdhani', fontWeight: 700 }}>{kd}</span>
            </div>
            <div style={{ height: '4px', background: '#222222', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${color}, ${color}88)`, borderRadius: '2px' }}
                />
            </div>
        </div>
    );
};

const WinRateBar = ({ winRate }) => {
    const color = winRate >= 20 ? '#FFD700' : winRate >= 10 ? '#16A34A' : '#AAAAAA';
    return (
        <div style={{ marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#AAAAAA', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Win Rate</span>
                <span style={{ fontSize: '0.75rem', color, fontFamily: 'Rajdhani', fontWeight: 700 }}>{winRate}%</span>
            </div>
            <div style={{ height: '4px', background: '#222222', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(winRate, 100)}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${color}, ${color}88)`, borderRadius: '2px' }}
                />
            </div>
        </div>
    );
};

const ScannerUpload = ({ onFile, fileName }) => {
    const [scanning, setScanning] = useState(false);
    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div
                style={{
                    border: '2px dashed rgba(22,163,74,0.4)', padding: '32px 20px',
                    textAlign: 'center', cursor: 'pointer', position: 'relative',
                    background: 'rgba(22,163,74,0.03)', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(22,163,74,0.8)'; setScanning(true); }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(22,163,74,0.4)'; setScanning(false); }}
            >
                {scanning && (
                    <motion.div
                        initial={{ top: 0 }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute', left: 0, right: 0, height: '2px',
                            background: 'linear-gradient(90deg, transparent, #16A34A, transparent)',
                            boxShadow: '0 0 8px rgba(22,163,74,0.8)', pointerEvents: 'none',
                        }}
                    />
                )}
                <FiUpload size={28} style={{ color: '#16A34A', marginBottom: '10px' }} />
                <p style={{ color: '#AAAAAA', fontSize: '0.88rem', marginBottom: '4px', fontFamily: 'Rajdhani', fontWeight: 600, letterSpacing: '0.05em' }}>
                    DROP SCREENSHOT OR CLICK TO SCAN
                </p>
                <p style={{ color: '#555555', fontSize: '0.78rem', margin: 0 }}>AI verification will analyze your stats automatically</p>
                <input type="file" accept="image/*" required onChange={(e) => onFile(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                {fileName && <p style={{ color: '#16A34A', fontSize: '0.85rem', marginTop: '8px', fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 0 }}>{fileName}</p>}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const [games, setGames] = useState([]);
    const [myGames, setMyGames] = useState([]);
    const [stats, setStats] = useState([]);
    const [insights, setInsights] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState(null);
    const [gamingId, setGamingId] = useState('');
    const [addError, setAddError] = useState('');
    const [addSuccess, setAddSuccess] = useState('');
    const [addingGame, setAddingGame] = useState(false);
    const [fetchingStats, setFetchingStats] = useState({});
    const [fetchingInsight, setFetchingInsight] = useState({});
    const [codForm, setCodForm] = useState({});
    const [codLoading, setCodLoading] = useState({});
    const [codError, setCodError] = useState({});
    const [codSuccess, setCodSuccess] = useState({});
    const [platform, setPlatform] = useState({});

    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [gamesRes, myGamesRes, statsRes] = await Promise.all([
                API.get('/games/'),
                API.get('/games/my-games/'),
                API.get('/stats/my-stats/'),
            ]);
            setGames(gamesRes.data);
            setMyGames(myGamesRes.data);
            setStats(statsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGame = async (e) => {
        e.preventDefault();
        if (!selectedGame || !gamingId.trim()) return;
        setAddError('');
        setAddSuccess('');
        setAddingGame(true);
        try {
            const gameObj = games.find(g => g.slug === selectedGame.slug);
            if (!gameObj) { setAddError('Game not found.'); return; }
            await API.post('/games/my-games/', { game_id: gameObj.id, gaming_id: gamingId });
            setAddSuccess(`${selectedGame.name} added successfully.`);
            setSelectedGame(null);
            setGamingId('');
            loadAll();
        } catch (err) {
            setAddError(err.response?.data?.error || 'Failed to add game.');
        } finally {
            setAddingGame(false);
        }
    };

    const handleRemoveGame = async (id) => {
        try {
            await API.delete(`/games/my-games/${id}/`);
            loadAll();
        } catch (err) { console.error(err); }
    };

    const handleFetchStats = async (playerGameId, slug) => {
        setFetchingStats({ ...fetchingStats, [playerGameId]: true });
        try {
            if (slug === 'fortnite') {
                await API.post('/stats/fortnite/fetch/', { player_game_id: playerGameId });
            } else if (slug === 'apex-legends') {
                await API.post('/stats/apex/fetch/', { player_game_id: playerGameId, platform: platform[playerGameId] || 'PC' });
            }
            loadAll();
        } catch (err) { console.error(err); }
        finally { setFetchingStats({ ...fetchingStats, [playerGameId]: false }); }
    };

    const handleGenerateInsight = async (playerGameId) => {
        setFetchingInsight({ ...fetchingInsight, [playerGameId]: true });
        try {
            const res = await API.post(`/insights/${playerGameId}/`);
            setInsights({ ...insights, [playerGameId]: res.data.content });
        } catch (err) { console.error(err); }
        finally { setFetchingInsight({ ...fetchingInsight, [playerGameId]: false }); }
    };

    const handleCodSubmit = async (e, playerGameId) => {
        e.preventDefault();
        setCodLoading({ ...codLoading, [playerGameId]: true });
        setCodError({ ...codError, [playerGameId]: '' });
        setCodSuccess({ ...codSuccess, [playerGameId]: '' });
        try {
            const form = codForm[playerGameId] || {};
            const formData = new FormData();
            formData.append('player_game_id', playerGameId);
            formData.append('kills', form.kills || 0);
            formData.append('deaths', form.deaths || 0);
            formData.append('assists', form.assists || 0);
            formData.append('wins', form.wins || 0);
            formData.append('matches_played', form.matches_played || 1);
            formData.append('score', form.score || 0);
            formData.append('screenshot', form.screenshot);
            await API.post('/stats/cod/submit/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setCodSuccess({ ...codSuccess, [playerGameId]: 'Stats verified and approved by AI.' });
            loadAll();
        } catch (err) {
            setCodError({ ...codError, [playerGameId]: err.response?.data?.error || 'Submission failed.' });
        } finally { setCodLoading({ ...codLoading, [playerGameId]: false }); }
    };

    const updateCodForm = (playerGameId, field, value) => {
        setCodForm({ ...codForm, [playerGameId]: { ...(codForm[playerGameId] || {}), [field]: value } });
    };

    const getStatsForGame = (playerGameId) => stats.find(s => s.player_game.id === playerGameId);

    const totalWins = stats.reduce((sum, s) => sum + (s.wins || 0), 0);
    const totalKills = stats.reduce((sum, s) => sum + (s.kills || 0), 0);
    const bestKD = stats.length > 0 ? Math.max(...stats.map(s => s.kd_ratio || 0)) : 0;

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
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 16px' }}>

                {/* PLAYER PROFILE CARD */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        background: 'linear-gradient(135deg, #1A1A1A 0%, #111111 100%)',
                        border: '1px solid rgba(255,215,0,0.2)',
                        padding: '32px', marginBottom: '32px',
                        position: 'relative', overflow: 'hidden',
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #FFD700, #FFA500, transparent)' }} />
                    <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)', borderRadius: '50%' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            <motion.div
                                animate={{ boxShadow: ['0 0 20px rgba(255,215,0,0.3)', '0 0 40px rgba(255,215,0,0.6)', '0 0 20px rgba(255,215,0,0.3)'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{
                                    width: '72px', height: '72px', borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid #FFD700',
                                }}
                            >
                                <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.8rem', color: '#0A0A0A' }}>
                                    {user?.first_name?.[0]?.toUpperCase()}
                                </span>
                            </motion.div>
                            <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '14px', height: '14px', borderRadius: '50%', background: '#00CC66', border: '2px solid #0A0A0A' }} />
                        </div>

                        <div style={{ flex: 1 }}>
                            <p style={{ color: '#AAAAAA', fontSize: '0.8rem', fontFamily: 'Rajdhani', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>Player Profile</p>
                            <h1 style={{ fontSize: '2.2rem', marginBottom: '4px', fontStyle: 'italic' }}>
                                WELCOME, <span style={{ color: '#FFD700' }}>{user?.first_name?.toUpperCase()}</span>
                            </h1>
                            {user?.username && (
                                <p style={{ color: '#AAAAAA', fontSize: '0.9rem', fontFamily: 'Rajdhani', marginBottom: '8px' }}>@{user.username}</p>
                            )}
                            <div style={{ width: '60px', height: '3px', background: '#FFD700', marginBottom: '16px' }} />

                            {stats.length > 0 && (
                                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                    {[
                                        { label: 'Total Wins', value: totalWins, icon: <FiAward size={14} /> },
                                        { label: 'Total Kills', value: totalKills, icon: <FiTarget size={14} /> },
                                        { label: 'Best K/D', value: bestKD, icon: <FiZap size={14} /> },
                                    ].map((stat) => (
                                        <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: '#FFD700' }}>{stat.icon}</span>
                                            <div>
                                                <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.2rem', color: '#FFD700', margin: 0, lineHeight: 1 }}>{stat.value}</p>
                                                <p style={{ color: '#AAAAAA', fontSize: '0.75rem', margin: 0, letterSpacing: '0.05em' }}>{stat.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* MISSION SELECTOR */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.15)', padding: '32px', marginBottom: '32px' }}
                >
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', fontStyle: 'italic' }}>
                        SELECT <span style={{ color: '#FFD700' }}>GAME</span>
                    </h2>
                    <p style={{ color: '#AAAAAA', fontSize: '0.85rem', marginBottom: '24px' }}>Choose a game to add to your profile</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                        {GAME_OPTIONS.map((game) => {
                            const isSelected = selectedGame?.slug === game.slug;
                            return (
                                <motion.button
                                    key={game.slug}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setSelectedGame(isSelected ? null : game)}
                                    style={{
                                        background: isSelected ? game.glow : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${isSelected ? game.color : 'rgba(255,255,255,0.08)'}`,
                                        padding: '20px 12px', cursor: 'pointer', textAlign: 'center',
                                        transition: 'all 0.2s',
                                        boxShadow: isSelected ? `0 0 20px ${game.glow}` : 'none',
                                        position: 'relative', overflow: 'hidden',
                                    }}
                                >
                                    {isSelected && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: game.color }} />}
                                    <p style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{game.logo}</p>
                                    <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: isSelected ? game.color : '#AAAAAA', margin: 0 }}>
                                        {game.name}
                                    </p>
                                </motion.button>
                            );
                        })}
                    </div>

                    <AnimatePresence>
                        {selectedGame && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleAddGame}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{ marginBottom: '16px' }}>
                                    <label className="sf-label">Gaming ID for {selectedGame.name}</label>
                                    <input
                                        className="sf-input"
                                        placeholder={`Enter your ${selectedGame.name} username`}
                                        value={gamingId}
                                        onChange={(e) => setGamingId(e.target.value)}
                                        required
                                        style={{ boxShadow: `inset 0 0 20px ${selectedGame.glow}`, borderColor: selectedGame.border }}
                                    />
                                </div>

                                {selectedGame.slug === 'apex-legends' && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <label className="sf-label">Platform</label>
                                        <select className="sf-select" style={{ borderColor: selectedGame.border }}>
                                            <option value="PC">PC (Origin)</option>
                                            <option value="PS4">PlayStation</option>
                                            <option value="X1">Xbox</option>
                                        </select>
                                    </div>
                                )}

                                {addError && <p className="error-msg" style={{ marginBottom: '12px' }}>{addError}</p>}
                                {addSuccess && <p className="success-msg" style={{ marginBottom: '12px' }}>{addSuccess}</p>}

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={addingGame}
                                    style={{
                                        background: selectedGame.color, color: '#FFFFFF', border: 'none',
                                        padding: '12px 32px', fontFamily: 'Rajdhani', fontWeight: 700,
                                        fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                                        cursor: 'pointer', width: '100%',
                                        boxShadow: `0 4px 20px ${selectedGame.glow}`,
                                    }}
                                >
                                    {addingGame ? 'Adding...' : `Add ${selectedGame.name}`}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* MY GAMES */}
                <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', fontStyle: 'italic' }}>
                    MY <span style={{ color: '#FFD700' }}>GAMES</span>
                </h2>

                {myGames.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.1)', padding: '60px 20px', textAlign: 'center' }}
                    >
                        <p style={{ color: '#AAAAAA' }}>No games added yet. Select a mission above to get started.</p>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {myGames.map((pg, index) => {
                            const gameStats = getStatsForGame(pg.id);
                            const isApiGame = pg.game.slug === 'fortnite' || pg.game.slug === 'apex-legends';
                            const gc = GAME_COLORS[pg.game.slug] || { color: '#FFD700', glow: 'rgba(255,215,0,0.15)', border: 'rgba(255,215,0,0.3)' };

                            return (
                                <motion.div
                                    key={pg.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    style={{
                                        background: 'linear-gradient(135deg, #1A1A1A 0%, #111111 100%)',
                                        border: `1px solid ${gc.border}`,
                                        padding: '28px', position: 'relative', overflow: 'hidden',
                                    }}
                                >
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${gc.color}, transparent)` }} />
                                    <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', background: `radial-gradient(circle, ${gc.glow} 0%, transparent 70%)`, borderRadius: '50%' }} />

                                    {/* Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                    <h3 style={{ fontSize: '1.5rem', margin: 0, fontStyle: 'italic' }}>{pg.game.name}</h3>
                                                    {isApiGame && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                            <motion.div
                                                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                                style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00CC66', flexShrink: 0 }}
                                                            />
                                                            <span style={{ fontSize: '0.7rem', color: '#00CC66', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p style={{ color: gc.color, fontSize: '0.9rem', fontFamily: 'Rajdhani', margin: 0 }}>{pg.gaming_id}</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                            {pg.game.slug === 'apex-legends' && (
                                                <select
                                                    value={platform[pg.id] || 'PC'}
                                                    onChange={(e) => setPlatform({ ...platform, [pg.id]: e.target.value })}
                                                    style={{ background: '#222222', border: '1px solid rgba(255,255,255,0.1)', color: '#AAAAAA', padding: '6px 10px', fontSize: '0.8rem', fontFamily: 'Rajdhani', cursor: 'pointer' }}
                                                >
                                                    <option value="PC">PC</option>
                                                    <option value="PS4">PlayStation</option>
                                                    <option value="X1">Xbox</option>
                                                </select>
                                            )}
                                            {isApiGame && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleFetchStats(pg.id, pg.game.slug)}
                                                    disabled={fetchingStats[pg.id]}
                                                    style={{
                                                        background: 'transparent', border: `1px solid ${gc.border}`, color: gc.color,
                                                        padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px',
                                                        fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.82rem',
                                                        letterSpacing: '0.05em', cursor: 'pointer', textTransform: 'uppercase',
                                                    }}
                                                >
                                                    <FiRefreshCw size={13} />
                                                    {fetchingStats[pg.id] ? 'Syncing...' : 'Sync'}
                                                </motion.button>
                                            )}
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleRemoveGame(pg.id)}
                                                style={{
                                                    background: 'transparent', border: '1px solid rgba(255,68,68,0.3)', color: '#FF4444',
                                                    padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px',
                                                    fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.82rem',
                                                    letterSpacing: '0.05em', cursor: 'pointer', textTransform: 'uppercase',
                                                }}
                                            >
                                                <FiTrash2 size={13} /> Remove
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Public stats notice */}
                                    {isApiGame && (
                                        <div style={{
                                            display: 'flex', alignItems: 'flex-start', gap: '10px',
                                            background: gc.glow, border: `1px solid ${gc.border}`,
                                            borderLeft: `3px solid ${gc.color}`, padding: '12px 14px', marginBottom: '20px',
                                        }}>
                                            <FiInfo size={15} style={{ color: gc.color, marginTop: '2px', flexShrink: 0 }} />
                                            <div>
                                                <p style={{ color: gc.color, fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                                                    Public Stats Required
                                                </p>
                                                {pg.game.slug === 'fortnite' && (
                                                    <p style={{ color: '#AAAAAA', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
                                                        Go to <strong style={{ color: '#FFFFFF' }}>epicgames.com</strong>, sign in, open <strong style={{ color: '#FFFFFF' }}>Account Settings</strong>, click the <strong style={{ color: '#FFFFFF' }}>Fortnite</strong> tab, and set <strong style={{ color: gc.color }}>Career Leaderboard</strong> to <strong style={{ color: gc.color }}>Public</strong>.
                                                    </p>
                                                )}
                                                {pg.game.slug === 'apex-legends' && (
                                                    <p style={{ color: '#AAAAAA', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
                                                        Open <strong style={{ color: '#FFFFFF' }}>Apex Legends</strong>, go to <strong style={{ color: '#FFFFFF' }}>Settings</strong>, open the <strong style={{ color: '#FFFFFF' }}>Gameplay</strong> tab, and enable <strong style={{ color: gc.color }}>Public Profile</strong>. Your Origin/EA username must match exactly.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Stats */}
                                    {gameStats ? (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                                                {[
                                                    { label: 'Kills', value: gameStats.kills },
                                                    { label: 'Deaths', value: gameStats.deaths },
                                                    { label: 'Wins', value: gameStats.wins },
                                                    { label: 'Matches', value: gameStats.matches_played },
                                                ].map((stat) => (
                                                    <motion.div
                                                        key={stat.label}
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ duration: 0.3 }}
                                                        style={{ background: '#222222', padding: '12px', borderLeft: `2px solid ${gc.color}` }}
                                                    >
                                                        <p style={{ color: gc.color, fontFamily: 'Rajdhani', fontSize: '1.3rem', fontWeight: 700, margin: 0, lineHeight: 1 }}>{stat.value}</p>
                                                        <p style={{ color: '#AAAAAA', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{stat.label}</p>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <div style={{ marginBottom: '20px' }}>
                                                <KDBar kd={gameStats.kd_ratio} />
                                                <WinRateBar winRate={gameStats.win_rate} />
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(255,215,0,0.15)' }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleGenerateInsight(pg.id)}
                                                disabled={fetchingInsight[pg.id]}
                                                style={{
                                                    background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)',
                                                    color: '#FFD700', padding: '10px 20px', display: 'flex', alignItems: 'center',
                                                    gap: '8px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem',
                                                    letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
                                                    marginBottom: '16px', width: 'fit-content',
                                                }}
                                            >
                                                <FiZap size={14} />
                                                {fetchingInsight[pg.id] ? 'Generating Insight...' : 'Get AI Coaching Insight'}
                                            </motion.button>

                                            <AnimatePresence>
                                                {insights[pg.id] && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        style={{ background: '#222222', border: '1px solid rgba(255,215,0,0.15)', padding: '16px 20px', borderLeft: '3px solid #FFD700' }}
                                                    >
                                                        <p style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>AI Coach Insight</p>
                                                        <p style={{ color: '#AAAAAA', lineHeight: 1.7, fontSize: '0.92rem', whiteSpace: 'pre-line', margin: 0 }}>{insights[pg.id]}</p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <>
                                            {pg.game.slug === 'cod-mobile' && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                    <p style={{ color: '#AAAAAA', fontSize: '0.88rem', marginBottom: '20px' }}>
                                                        Submit your COD Mobile stats below. AI will verify your screenshot automatically.
                                                    </p>
                                                    <form onSubmit={(e) => handleCodSubmit(e, pg.id)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                            {['kills', 'deaths', 'assists', 'wins', 'matches_played', 'score'].map((field) => (
                                                                <div key={field}>
                                                                    <label className="sf-label">{field.replace('_', ' ')}</label>
                                                                    <input
                                                                        className="sf-input"
                                                                        type="number" min="0" placeholder="0"
                                                                        onChange={(e) => updateCodForm(pg.id, field, e.target.value)}
                                                                        required
                                                                        style={{ borderColor: 'rgba(22,163,74,0.3)' }}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <ScannerUpload
                                                            onFile={(file) => updateCodForm(pg.id, 'screenshot', file)}
                                                            fileName={codForm[pg.id]?.screenshot?.name}
                                                        />

                                                        {codError[pg.id] && <p className="error-msg">{codError[pg.id]}</p>}
                                                        {codSuccess[pg.id] && <p className="success-msg">{codSuccess[pg.id]}</p>}

                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            type="submit"
                                                            disabled={codLoading[pg.id]}
                                                            style={{
                                                                background: '#16A34A', color: '#FFFFFF', border: 'none',
                                                                padding: '12px 32px', fontFamily: 'Rajdhani', fontWeight: 700,
                                                                fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                                                                cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                                justifyContent: 'center', gap: '8px', width: '100%',
                                                                boxShadow: '0 4px 20px rgba(22,163,74,0.3)',
                                                            }}
                                                        >
                                                            <FiUpload size={14} />
                                                            {codLoading[pg.id] ? 'AI Verifying...' : 'Submit for AI Verification'}
                                                        </motion.button>
                                                    </form>
                                                </motion.div>
                                            )}
                                            {isApiGame && (
                                                <p style={{ color: '#AAAAAA', fontSize: '0.9rem', padding: '20px 0', margin: 0 }}>
                                                    Click <strong style={{ color: gc.color }}>Sync</strong> to fetch your {pg.game.name} stats automatically.
                                                </p>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default Dashboard;