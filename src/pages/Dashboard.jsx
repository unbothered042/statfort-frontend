import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiRefreshCw, FiZap, FiTrash2, FiInfo, FiUpload, FiTarget, FiAward, FiLock, FiUsers } from 'react-icons/fi';

const GAME_OPTIONS = [
    { name: 'Fortnite', slug: 'fortnite', color: '#7C3AED', glow: 'rgba(124,58,237,0.3)', border: 'rgba(124,58,237,0.5)', image: '/fortnite.jpg' },
    { name: 'Apex Legends', slug: 'apex-legends', color: '#DC2626', glow: 'rgba(220,38,38,0.3)', border: 'rgba(220,38,38,0.5)', image: '/apex.jpg' },
    { name: 'COD Mobile', slug: 'cod-mobile', color: '#16A34A', glow: 'rgba(22,163,74,0.3)', border: 'rgba(22,163,74,0.5)', image: '/cod.jpg' },
    { name: 'eFootball', slug: 'efootball', color: '#0EA5E9', glow: 'rgba(14,165,233,0.3)', border: 'rgba(14,165,233,0.5)', image: '/efootball.jpg' },
];

const GAME_COLORS = {
    'fortnite': { color: '#7C3AED', glow: 'rgba(124,58,237,0.15)', border: 'rgba(124,58,237,0.4)' },
    'apex-legends': { color: '#DC2626', glow: 'rgba(220,38,38,0.15)', border: 'rgba(220,38,38,0.4)' },
    'cod-mobile': { color: '#16A34A', glow: 'rgba(22,163,74,0.15)', border: 'rgba(22,163,74,0.4)' },
    'efootball': { color: '#0EA5E9', glow: 'rgba(14,165,233,0.15)', border: 'rgba(14,165,233,0.4)' },
};

// Must match backend PLAYER_TYPE_CHOICES in stats/models.py
const PLAYER_TYPE_OPTIONS = [
    { value: 'destroyer', label: 'Destroyer' },
    { value: 'anchor_man', label: 'Anchor Man' },
    { value: 'extra_frame', label: 'Extra Frame' },
    { value: 'catalyst', label: 'Catalyst' },
    { value: 'long_ball_expert', label: 'Long Ball Expert' },
    { value: 'aerial_threat', label: 'Aerial Threat' },
    { value: 'box_to_box', label: 'Box-to-Box' },
    { value: 'deep_lying_playmaker', label: 'Deep-Lying Playmaker' },
    { value: 'the_incisive_run', label: 'The Incisive Run' },
    { value: 'prolific_winger', label: 'Prolific Winger' },
    { value: 'cross_specialist', label: 'Cross Specialist' },
    { value: 'speedster', label: 'Speedster' },
    { value: 'goal_poacher', label: 'Goal Poacher' },
    { value: 'target_man', label: 'Target Man' },
    { value: 'dummy_runner', label: 'Dummy Runner' },
];

const SQUAD_SLOTS = [
    { field: 'gk_type', label: 'GK' },
    { field: 'cb1_type', label: 'CB' },
    { field: 'cb2_type', label: 'CB' },
    { field: 'cdm_type', label: 'CDM' },
    { field: 'lw_type', label: 'LW' },
    { field: 'rw_type', label: 'RW' },
    { field: 'st_type', label: 'ST' },
];

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

const ScannerUpload = ({ onFile, fileName, accentColor = '#16A34A' }) => {
    const [scanning, setScanning] = useState(false);
    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div
                style={{
                    border: `2px dashed ${accentColor}66`, padding: '32px 20px',
                    textAlign: 'center', cursor: 'pointer', position: 'relative',
                    background: `${accentColor}08`, transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${accentColor}CC`; setScanning(true); }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${accentColor}66`; setScanning(false); }}
            >
                {scanning && (
                    <motion.div
                        initial={{ top: 0 }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute', left: 0, right: 0, height: '2px',
                            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                            boxShadow: `0 0 8px ${accentColor}CC`, pointerEvents: 'none',
                        }}
                    />
                )}
                <FiUpload size={28} style={{ color: accentColor, marginBottom: '10px' }} />
                <p style={{ color: '#AAAAAA', fontSize: '0.88rem', marginBottom: '4px', fontFamily: 'Rajdhani', fontWeight: 600, letterSpacing: '0.05em' }}>
                    DROP SCREENSHOT OR CLICK TO SCAN
                </p>
                <p style={{ color: '#555555', fontSize: '0.78rem', margin: 0 }}>AI verification will analyze your stats automatically</p>
                <input type="file" accept="image/*" required onChange={(e) => onFile(e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                {fileName && <p style={{ color: accentColor, fontSize: '0.85rem', marginTop: '8px', fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 0 }}>{fileName}</p>}
            </div>
        </div>
    );
};

const AILimitBanner = ({ error, isPremium }) => {
    if (!error) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: 'rgba(255,68,68,0.06)',
                border: '1px solid rgba(255,68,68,0.3)',
                borderLeft: '3px solid #FF4444',
                padding: '14px 16px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
            }}
        >
            <FiLock size={16} style={{ color: '#FF4444', marginTop: '2px', flexShrink: 0 }} />
            <div>
                <p style={{ color: '#FF4444', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Daily AI Limit Reached
                </p>
                <p style={{ color: '#AAAAAA', fontSize: '0.83rem', margin: 0, lineHeight: 1.5 }}>
                    {error} {!isPremium && <span style={{ color: '#FFD700' }}>Upgrade to Premium for 20 uses per day.</span>}
                </p>
            </div>
        </motion.div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const [games, setGames] = useState([]);
    const [myGames, setMyGames] = useState([]);
    const [stats, setStats] = useState([]);
    const [insights, setInsights] = useState({});
    const [insightError, setInsightError] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState(null);
    const [gamingId, setGamingId] = useState('');
    const [addError, setAddError] = useState('');
    const [addSuccess, setAddSuccess] = useState('');
    const [addingGame, setAddingGame] = useState(false);
    const [fetchingStats, setFetchingStats] = useState({});
    const [fetchingInsight, setFetchingInsight] = useState({});
    const [aiUsage, setAiUsage] = useState({ count: user?.ai_insight_count || 0, limit: user?.ai_limit || 5 });
    const [codForm, setCodForm] = useState({});
    const [codLoading, setCodLoading] = useState({});
    const [codError, setCodError] = useState({});
    const [codSuccess, setCodSuccess] = useState({});
    const [efForm, setEfForm] = useState({});
    const [efLoading, setEfLoading] = useState({});
    const [efError, setEfError] = useState({});
    const [efSuccess, setEfSuccess] = useState({});
    const [platform, setPlatform] = useState({});

    // Squad Setup (eFootball Elite pairing analysis)
    const [squads, setSquads] = useState({});
    const [squadForm, setSquadForm] = useState({});
    const [squadLoading, setSquadLoading] = useState({});
    const [squadError, setSquadError] = useState({});
    const [squadSuccess, setSquadSuccess] = useState({});

    // eFootball screenshot upload limit (3/day)
    const [efUploadStatus, setEfUploadStatus] = useState({});


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

            // Load any existing squad setups for eFootball games
            const efGames = myGamesRes.data.filter(pg => pg.game.slug === 'efootball');
            if (efGames.length > 0) {
                const squadResults = await Promise.allSettled(
                    efGames.map(pg => API.get(`/stats/efootball/squad/?player_game_id=${pg.id}`))
                );
                const squadMap = {};
                const formMap = {};
                efGames.forEach((pg, i) => {
                    const result = squadResults[i];
                    if (result.status === 'fulfilled') {
                        squadMap[pg.id] = result.value.data;
                        formMap[pg.id] = result.value.data;
                    }
                });
                setSquads(squadMap);
                setSquadForm(prev => ({ ...formMap, ...prev }));

                // Upload status is per-user (not per-game), fetch once
                try {
                    const statusRes = await API.get('/stats/efootball/upload-status/');
                    const statusMap = {};
                    efGames.forEach(pg => { statusMap[pg.id] = statusRes.data; });
                    setEfUploadStatus(statusMap);
                } catch (err) { console.error(err); }
            }
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
        setInsightError({ ...insightError, [playerGameId]: '' });
        try {
            const res = await API.post(`/insights/${playerGameId}/`);
            setInsights({ ...insights, [playerGameId]: res.data.content });
            setAiUsage({ count: res.data.ai_insight_count, limit: res.data.ai_limit });
        } catch (err) {
            if (err.response?.status === 429) {
                setInsightError({ ...insightError, [playerGameId]: err.response.data.error });
            } else {
                console.error(err);
            }
        } finally {
            setFetchingInsight({ ...fetchingInsight, [playerGameId]: false });
        }
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

    const handleEfSubmit = async (e, playerGameId) => {
        e.preventDefault();
        setEfLoading({ ...efLoading, [playerGameId]: true });
        setEfError({ ...efError, [playerGameId]: '' });
        setEfSuccess({ ...efSuccess, [playerGameId]: '' });
        try {
            const form = efForm[playerGameId] || {};
            const formData = new FormData();
            formData.append('player_game_id', playerGameId);
            formData.append('wins', form.wins || 0);
            formData.append('draws', form.draws || 0);
            formData.append('losses', form.losses || 0);
            formData.append('screenshot', form.screenshot);
            const res = await API.post('/stats/efootball/submit/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setEfSuccess({ ...efSuccess, [playerGameId]: 'Stats verified and approved by AI.' });
            if (res.data.uploads_remaining !== undefined) {
                setEfUploadStatus({ ...efUploadStatus, [playerGameId]: { uploads_remaining: res.data.uploads_remaining, daily_limit: 3, uploads_used: 3 - res.data.uploads_remaining } });
            }
            loadAll();
        } catch (err) {
            setEfError({ ...efError, [playerGameId]: err.response?.data?.error || 'Submission failed.' });
            if (err.response?.data?.uploads_remaining !== undefined) {
                setEfUploadStatus({ ...efUploadStatus, [playerGameId]: { uploads_remaining: err.response.data.uploads_remaining, daily_limit: 3, uploads_used: 3 - err.response.data.uploads_remaining } });
            }
        } finally { setEfLoading({ ...efLoading, [playerGameId]: false }); }
    };

    const updateEfForm = (playerGameId, field, value) => {
        setEfForm({ ...efForm, [playerGameId]: { ...(efForm[playerGameId] || {}), [field]: value } });
    };

    const updateSquadForm = (playerGameId, field, value) => {
        setSquadForm({ ...squadForm, [playerGameId]: { ...(squadForm[playerGameId] || {}), [field]: value } });
    };

    const handleSquadSubmit = async (e, playerGameId) => {
        e.preventDefault();
        const form = squadForm[playerGameId] || {};
        const missing = SQUAD_SLOTS.some(({ field }) => !form[field]);
        if (missing) {
            setSquadError({ ...squadError, [playerGameId]: 'Select a player type for all 7 positions.' });
            return;
        }
        setSquadLoading({ ...squadLoading, [playerGameId]: true });
        setSquadError({ ...squadError, [playerGameId]: '' });
        setSquadSuccess({ ...squadSuccess, [playerGameId]: '' });
        try {
            const payload = { player_game_id: playerGameId };
            SQUAD_SLOTS.forEach(({ field }) => { payload[field] = form[field]; });
            const res = await API.post('/stats/efootball/squad/', payload);
            setSquads({ ...squads, [playerGameId]: res.data });
            setSquadSuccess({ ...squadSuccess, [playerGameId]: 'Squad saved. Ready for Squad Synergy analysis in Elite Tier.' });
        } catch (err) {
            setSquadError({ ...squadError, [playerGameId]: err.response?.data?.error || 'Failed to save squad.' });
        } finally {
            setSquadLoading({ ...squadLoading, [playerGameId]: false });
        }
    };

    const getStatsForGame = (playerGameId) => stats.find(s => s.player_game.id === playerGameId);

    const totalWins = stats.reduce((sum, s) => sum + (s.wins || 0), 0);
    const totalKills = stats.reduce((sum, s) => sum + (s.kills || 0), 0);
    const bestKD = stats.length > 0 ? Math.max(...stats.map(s => s.kd_ratio || 0)) : 0;
    const isPremium = user?.is_premium;

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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                <p style={{ color: '#AAAAAA', fontSize: '0.8rem', fontFamily: 'Rajdhani', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Player Profile</p>
                                {isPremium && (
                                    <span style={{
                                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                        color: '#0A0A0A', padding: '2px 10px',
                                        fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.7rem',
                                        letterSpacing: '0.15em', textTransform: 'uppercase',
                                    }}>
                                        PREMIUM
                                    </span>
                                )}
                            </div>
                            <h1 style={{ fontSize: '2.2rem', marginBottom: '4px', fontStyle: 'italic' }}>
                                WELCOME, <span style={{ color: '#FFD700' }}>{user?.first_name?.toUpperCase()}</span>
                            </h1>
                            {user?.username && (
                                <p style={{ color: '#AAAAAA', fontSize: '0.9rem', fontFamily: 'Rajdhani', marginBottom: '8px' }}>@{user.username}</p>
                            )}
                            <div style={{ width: '60px', height: '3px', background: '#FFD700', marginBottom: '16px' }} />

                            {/* AI Usage indicator */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: stats.length > 0 ? '16px' : '0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FiZap size={13} style={{ color: '#FFD700' }} />
                                    <span style={{ color: '#AAAAAA', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
                                        AI Insights: <span style={{ color: aiUsage.count >= aiUsage.limit ? '#FF4444' : '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700 }}>
                                            {aiUsage.count}/{aiUsage.limit}
                                        </span> today
                                    </span>
                                </div>
                                {!isPremium && (
                                    <a href="/elite" style={{ color: '#FFD700', fontSize: '0.75rem', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid rgba(255,215,0,0.3)' }}>
                                        Upgrade for 20/day
                                    </a>
                                )}
                            </div>

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
                                        background: 'transparent',
                                        border: `1px solid ${isSelected ? game.color : 'rgba(255,255,255,0.08)'}`,
                                        padding: '0', cursor: 'pointer', textAlign: 'center',
                                        transition: 'all 0.2s',
                                        boxShadow: isSelected ? `0 0 20px ${game.glow}` : 'none',
                                        position: 'relative', overflow: 'hidden', height: '140px',
                                    }}
                                >
                                    {isSelected && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: game.color, zIndex: 2 }} />}
                                    <img
                                        src={game.image}
                                        alt={game.name}
                                        style={{
                                            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                                            filter: isSelected ? 'brightness(0.7)' : 'brightness(0.4)',
                                            transition: 'filter 0.3s',
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                                        padding: '12px',
                                        background: isSelected ? `linear-gradient(to top, ${game.color}88, transparent)` : 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                    }}>
                                        <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isSelected ? game.color : '#FFFFFF', margin: 0 }}>
                                            {game.name}
                                        </p>
                                    </div>
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
                            const isEfootball = pg.game.slug === 'efootball';
                            const gc = GAME_COLORS[pg.game.slug] || { color: '#FFD700', glow: 'rgba(255,215,0,0.15)', border: 'rgba(255,215,0,0.3)' };
                            const gameOption = GAME_OPTIONS.find(g => g.slug === pg.game.slug);

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
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            {gameOption && (
                                                <div style={{ width: '56px', height: '56px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: `1px solid ${gc.border}` }}>
                                                    <img src={gameOption.image} alt={pg.game.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                            )}
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

                                    {/* eFootball Squad Setup (drives Elite Squad Synergy analysis) */}
                                    {isEfootball && (
                                        <div style={{
                                            background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.25)',
                                            padding: '20px', marginBottom: '20px',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <FiUsers size={15} style={{ color: '#0EA5E9' }} />
                                                <p style={{ color: '#0EA5E9', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                                                    Elite Squad Setup
                                                </p>
                                            </div>
                                            <p style={{ color: '#AAAAAA', fontSize: '0.82rem', marginBottom: '16px', lineHeight: 1.6 }}>
                                                Set the pack player type for each key position. This powers your Squad Synergy pairing analysis in Elite Tier.
                                            </p>
                                            <form onSubmit={(e) => handleSquadSubmit(e, pg.id)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                                                    {SQUAD_SLOTS.map(({ field, label }, i) => (
                                                        <div key={`${field}-${i}`}>
                                                            <label className="sf-label">{label}</label>
                                                            <select
                                                                className="sf-select"
                                                                value={(squadForm[pg.id] || {})[field] || ''}
                                                                onChange={(e) => updateSquadForm(pg.id, field, e.target.value)}
                                                                required
                                                                style={{ borderColor: 'rgba(14,165,233,0.3)', width: '100%' }}
                                                            >
                                                                <option value="" disabled>Select type</option>
                                                                {PLAYER_TYPE_OPTIONS.map(opt => (
                                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ))}
                                                </div>

                                                {squadError[pg.id] && <p className="error-msg">{squadError[pg.id]}</p>}
                                                {squadSuccess[pg.id] && <p className="success-msg">{squadSuccess[pg.id]}</p>}

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    type="submit"
                                                    disabled={squadLoading[pg.id]}
                                                    style={{
                                                        background: 'transparent', border: '1px solid rgba(14,165,233,0.4)', color: '#0EA5E9',
                                                        padding: '10px 24px', fontFamily: 'Rajdhani', fontWeight: 700,
                                                        fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                                                        cursor: 'pointer', width: 'fit-content',
                                                    }}
                                                >
                                                    {squadLoading[pg.id] ? 'Saving...' : squads[pg.id] ? 'Update Squad' : 'Save Squad'}
                                                </motion.button>
                                            </form>
                                        </div>
                                    )}

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
                                                {(isEfootball ? [
                                                    { label: 'Wins', value: gameStats.wins },
                                                    { label: 'Draws', value: gameStats.draws },
                                                    { label: 'Losses', value: gameStats.matches_played - gameStats.wins - gameStats.draws },
                                                    { label: 'Matches', value: gameStats.matches_played },
                                                ] : [
                                                    { label: 'Kills', value: gameStats.kills },
                                                    { label: 'Deaths', value: gameStats.deaths },
                                                    { label: 'Wins', value: gameStats.wins },
                                                    { label: 'Matches', value: gameStats.matches_played },
                                                ]).map((stat) => (
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
                                                {!isEfootball && <KDBar kd={gameStats.kd_ratio} />}
                                                <WinRateBar winRate={gameStats.win_rate} />
                                            </div>

                                            {/* AI Limit banner */}
                                            <AILimitBanner error={insightError[pg.id]} isPremium={isPremium} />

                                            {/* AI Insight button */}
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
                                                        Submit your COD Mobile stats below. Our AI will verify your stats automatically through your screenshot.
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
                                                            accentColor="#16A34A"
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

                                    {/* eFootball match record submit/update — always available so users can log new results */}
                                    {isEfootball && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: gameStats ? '24px' : 0, paddingTop: gameStats ? '24px' : 0, borderTop: gameStats ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                                            <p style={{ color: '#AAAAAA', fontSize: '0.88rem', marginBottom: '4px' }}>
                                                {gameStats ? 'Got a new result? Update your eFootball Division 1 record below.' : 'Submit your eFootball Division 1 match record below.'} Our AI will verify your stats automatically through your screenshot.
                                            </p>
                                            {efUploadStatus[pg.id] && (
                                                <p style={{ color: efUploadStatus[pg.id].uploads_remaining === 0 ? '#FF4444' : '#0EA5E9', fontSize: '0.78rem', marginBottom: '16px', fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: '0.05em' }}>
                                                    {efUploadStatus[pg.id].uploads_remaining} of {efUploadStatus[pg.id].daily_limit} screenshot verifications left today
                                                </p>
                                            )}
                                            <form onSubmit={(e) => handleEfSubmit(e, pg.id)} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: efUploadStatus[pg.id] ? 0 : '16px' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                                    {['wins', 'draws', 'losses'].map((field) => (
                                                        <div key={field}>
                                                            <label className="sf-label">{field}</label>
                                                            <input
                                                                className="sf-input"
                                                                type="number" min="0" placeholder="0"
                                                                onChange={(e) => updateEfForm(pg.id, field, e.target.value)}
                                                                required
                                                                style={{ borderColor: 'rgba(14,165,233,0.3)' }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <ScannerUpload
                                                    onFile={(file) => updateEfForm(pg.id, 'screenshot', file)}
                                                    fileName={efForm[pg.id]?.screenshot?.name}
                                                    accentColor="#0EA5E9"
                                                />

                                                {efError[pg.id] && <p className="error-msg">{efError[pg.id]}</p>}
                                                {efSuccess[pg.id] && <p className="success-msg">{efSuccess[pg.id]}</p>}

                                                <motion.button
                                                    whileHover={{ scale: efUploadStatus[pg.id]?.uploads_remaining === 0 ? 1 : 1.02 }}
                                                    whileTap={{ scale: efUploadStatus[pg.id]?.uploads_remaining === 0 ? 1 : 0.98 }}
                                                    type="submit"
                                                    disabled={efLoading[pg.id] || efUploadStatus[pg.id]?.uploads_remaining === 0}
                                                    style={{
                                                        background: efUploadStatus[pg.id]?.uploads_remaining === 0 ? '#333333' : '#0EA5E9',
                                                        color: '#FFFFFF', border: 'none',
                                                        padding: '12px 32px', fontFamily: 'Rajdhani', fontWeight: 700,
                                                        fontSize: '0.95rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                                                        cursor: efUploadStatus[pg.id]?.uploads_remaining === 0 ? 'not-allowed' : 'pointer',
                                                        display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center', gap: '8px', width: '100%',
                                                        boxShadow: efUploadStatus[pg.id]?.uploads_remaining === 0 ? 'none' : '0 4px 20px rgba(14,165,233,0.3)',
                                                    }}
                                                >
                                                    <FiUpload size={14} />
                                                    {efLoading[pg.id]
                                                        ? 'AI Verifying...'
                                                        : efUploadStatus[pg.id]?.uploads_remaining === 0
                                                            ? 'Daily Limit Reached'
                                                            : 'Submit for AI Verification'}
                                                </motion.button>
                                            </form>
                                        </motion.div>
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