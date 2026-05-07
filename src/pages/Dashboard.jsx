import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiRefreshCw, FiZap, FiTrash2, FiInfo, FiUpload } from 'react-icons/fi';

const Dashboard = () => {
    const { user } = useAuth();
    const [games, setGames] = useState([]);
    const [myGames, setMyGames] = useState([]);
    const [stats, setStats] = useState([]);
    const [insights, setInsights] = useState({});
    const [loading, setLoading] = useState(true);
    const [addForm, setAddForm] = useState({ game_id: '', gaming_id: '' });
    const [addError, setAddError] = useState('');
    const [addSuccess, setAddSuccess] = useState('');
    const [fetchingStats, setFetchingStats] = useState({});
    const [fetchingInsight, setFetchingInsight] = useState({});
    const [codForm, setCodForm] = useState({});
    const [codLoading, setCodLoading] = useState({});
    const [codError, setCodError] = useState({});
    const [codSuccess, setCodSuccess] = useState({});

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
        setAddError('');
        setAddSuccess('');
        try {
            await API.post('/games/my-games/', addForm);
            setAddSuccess('Game added successfully.');
            setAddForm({ game_id: '', gaming_id: '' });
            loadAll();
        } catch (err) {
            setAddError(err.response?.data?.error || 'Failed to add game.');
        }
    };

    const handleRemoveGame = async (id) => {
        try {
            await API.delete(`/games/my-games/${id}/`);
            loadAll();
        } catch (err) {
            console.error(err);
        }
    };

    const handleFetchStats = async (playerGameId) => {
        setFetchingStats({ ...fetchingStats, [playerGameId]: true });
        try {
            await API.post('/stats/fortnite/fetch/', { player_game_id: playerGameId });
            loadAll();
        } catch (err) {
            console.error(err);
        } finally {
            setFetchingStats({ ...fetchingStats, [playerGameId]: false });
        }
    };

    const handleGenerateInsight = async (playerGameId) => {
        setFetchingInsight({ ...fetchingInsight, [playerGameId]: true });
        try {
            const res = await API.post(`/insights/${playerGameId}/`);
            setInsights({ ...insights, [playerGameId]: res.data.content });
        } catch (err) {
            console.error(err);
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
            await API.post('/stats/cod/submit/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCodSuccess({ ...codSuccess, [playerGameId]: 'Stats verified and submitted successfully.' });
            loadAll();
        } catch (err) {
            setCodError({ ...codError, [playerGameId]: err.response?.data?.error || 'Submission failed.' });
        } finally {
            setCodLoading({ ...codLoading, [playerGameId]: false });
        }
    };

    const updateCodForm = (playerGameId, field, value) => {
        setCodForm({
            ...codForm,
            [playerGameId]: { ...(codForm[playerGameId] || {}), [field]: value }
        });
    };

    const getStatsForGame = (playerGameId) => stats.find(s => s.player_game.id === playerGameId);

    if (loading) return (
        <div className="page-container">
            <Navbar />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <p style={{ color: 'var(--text-dim)' }}>Loading...</p>
            </div>
        </div>
    );

    return (
        <div className="page-container">
            <Navbar />
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 16px' }}>

                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
                        WELCOME, <span style={{ color: 'var(--gold)' }}>{user?.first_name?.toUpperCase()}</span>
                    </h1>
                    <div className="gold-line" />
                </div>

                <div className="card" style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>ADD <span style={{ color: 'var(--gold)' }}>GAME</span></h2>
                    <form onSubmit={handleAddGame} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Game</label>
                            <select className="input-field" value={addForm.game_id} onChange={(e) => setAddForm({ ...addForm, game_id: e.target.value })} required style={{ background: 'var(--dark-2)', cursor: 'pointer' }}>
                                <option value="">Select game</option>
                                {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Gaming ID</label>
                            <input className="input-field" placeholder="Your in-game username" value={addForm.gaming_id} onChange={(e) => setAddForm({ ...addForm, gaming_id: e.target.value })} required />
                        </div>
                        <button className="btn-gold" type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                            <FiPlus size={16} /> Add Game
                        </button>
                    </form>
                    {addError && <p className="error-msg" style={{ marginTop: '12px' }}>{addError}</p>}
                    {addSuccess && <p className="success-msg" style={{ marginTop: '12px' }}>{addSuccess}</p>}
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>MY <span style={{ color: 'var(--gold)' }}>GAMES</span></h2>
                </div>

                {myGames.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <p style={{ color: 'var(--text-dim)' }}>No games added yet. Add your first game above.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {myGames.map((pg) => {
                            const gameStats = getStatsForGame(pg.id);
                            return (
                                <div key={pg.id} className="card" style={{ position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{pg.game.name}</h3>
                                            <p style={{ color: 'var(--gold)', fontSize: '0.9rem', fontFamily: 'Rajdhani', letterSpacing: '0.05em' }}>{pg.gaming_id}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {pg.game.slug === 'fortnite' && (
                                                <button onClick={() => handleFetchStats(pg.id)} disabled={fetchingStats[pg.id]} style={{
                                                    background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-dim)',
                                                    padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px',
                                                    fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
                                                >
                                                    <FiRefreshCw size={14} /> {fetchingStats[pg.id] ? 'Fetching...' : 'Sync Stats'}
                                                </button>
                                            )}
                                            <button onClick={() => handleRemoveGame(pg.id)} style={{
                                                background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-dim)',
                                                padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px',
                                                fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--error)'; e.currentTarget.style.color = 'var(--error)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
                                            >
                                                <FiTrash2 size={14} /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    {pg.game.slug === 'fortnite' && (
                                        <div style={{
                                            background: 'rgba(255,215,0,0.05)',
                                            border: '1px solid var(--border)',
                                            borderLeft: '3px solid var(--gold)',
                                            padding: '12px 16px',
                                            marginBottom: '20px',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '10px',
                                        }}>
                                            <FiInfo size={16} style={{ color: 'var(--gold)', marginTop: '2px', flexShrink: 0 }} />
                                            <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                                                Your Fortnite account must have <span style={{ color: 'var(--gold)', fontWeight: 600 }}>public stats</span> enabled. Go to your Epic Games account settings, open the Fortnite tab, and set your career stats to public. Otherwise the sync will fail.
                                            </p>
                                        </div>
                                    )}

                                    {gameStats ? (
                                        <>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                                                {[
                                                    { label: 'Kills', value: gameStats.kills },
                                                    { label: 'Deaths', value: gameStats.deaths },
                                                    { label: 'Wins', value: gameStats.wins },
                                                    { label: 'K/D', value: gameStats.kd_ratio },
                                                    { label: 'Win Rate', value: `${gameStats.win_rate}%` },
                                                    { label: 'Matches', value: gameStats.matches_played },
                                                ].map((stat) => (
                                                    <div key={stat.label} style={{ background: 'var(--dark-3)', padding: '12px', borderLeft: '2px solid var(--gold)' }}>
                                                        <p style={{ color: 'var(--gold)', fontFamily: 'Rajdhani', fontSize: '1.2rem', fontWeight: 700 }}>{stat.value}</p>
                                                        <p style={{ color: 'var(--text-dim)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div>
                                                <button onClick={() => handleGenerateInsight(pg.id)} disabled={fetchingInsight[pg.id]} style={{
                                                    background: 'var(--gold-glow)', border: '1px solid var(--border)', color: 'var(--gold)',
                                                    padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px',
                                                    fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em',
                                                    textTransform: 'uppercase', cursor: 'pointer', marginBottom: '16px', transition: 'all 0.2s',
                                                }}>
                                                    <FiZap size={14} /> {fetchingInsight[pg.id] ? 'Generating...' : 'Get AI Insight'}
                                                </button>

                                                {insights[pg.id] && (
                                                    <div style={{ background: 'var(--dark-3)', border: '1px solid var(--border)', padding: '16px 20px', borderLeft: '3px solid var(--gold)' }}>
                                                        <p style={{ color: 'var(--gold)', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>AI Coach Insight</p>
                                                        <p style={{ color: 'var(--text-dim)', lineHeight: 1.7, fontSize: '0.92rem', whiteSpace: 'pre-line' }}>{insights[pg.id]}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {pg.game.slug === 'cod-mobile' && (
                                                <div style={{ marginTop: '8px' }}>
                                                    <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginBottom: '16px' }}>
                                                        Submit your COD Mobile stats below. Our AI will verify your screenshot automatically.
                                                    </p>
                                                    <form onSubmit={(e) => handleCodSubmit(e, pg.id)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                                                            {['kills', 'deaths', 'assists', 'wins', 'matches_played', 'score'].map((field) => (
                                                                <div key={field}>
                                                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{field.replace('_', ' ')}</label>
                                                                    <input className="input-field" type="number" min="0" placeholder="0"
                                                                        onChange={(e) => updateCodForm(pg.id, field, e.target.value)} required />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div>
                                                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'Rajdhani', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Stats Screenshot</label>
                                                            <div style={{ border: '1px dashed var(--border)', padding: '20px', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                                                                <FiUpload size={24} style={{ color: 'var(--gold)', marginBottom: '8px' }} />
                                                                <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem' }}>Click to upload your stats screenshot</p>
                                                                <input type="file" accept="image/*" required onChange={(e) => updateCodForm(pg.id, 'screenshot', e.target.files[0])}
                                                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                                                {codForm[pg.id]?.screenshot && (
                                                                    <p style={{ color: 'var(--gold)', fontSize: '0.85rem', marginTop: '8px' }}>{codForm[pg.id].screenshot.name}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {codError[pg.id] && <p className="error-msg">{codError[pg.id]}</p>}
                                                        {codSuccess[pg.id] && <p className="success-msg">{codSuccess[pg.id]}</p>}
                                                        <button className="btn-gold" type="submit" disabled={codLoading[pg.id]} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                                                            <FiUpload size={14} /> {codLoading[pg.id] ? 'Verifying with AI...' : 'Submit Stats'}
                                                        </button>
                                                    </form>
                                                </div>
                                            )}
                                            {pg.game.slug === 'fortnite' && (
                                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', padding: '20px 0' }}>Click Sync Stats to fetch your Fortnite stats.</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;