import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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

    const handleFetchStats = async (playerGameId, slug) => {
        setFetchingStats({ ...fetchingStats, [playerGameId]: true });
        try {
            if (slug === 'fortnite') {
                await API.post('/stats/fortnite/fetch/', { player_game_id: playerGameId });
            } else if (slug === 'apex-legends') {
                await API.post('/stats/apex/fetch/', { player_game_id: playerGameId, platform: platform[playerGameId] || 'PC' });
            }
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
            await API.post('/stats/cod/submit/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setCodSuccess({ ...codSuccess, [playerGameId]: 'Stats verified and submitted successfully.' });
            loadAll();
        } catch (err) {
            setCodError({ ...codError, [playerGameId]: err.response?.data?.error || 'Submission failed.' });
        } finally {
            setCodLoading({ ...codLoading, [playerGameId]: false });
        }
    };

    const updateCodForm = (playerGameId, field, value) => {
        setCodForm({ ...codForm, [playerGameId]: { ...(codForm[playerGameId] || {}), [field]: value } });
    };

    const getStatsForGame = (playerGameId) => stats.find(s => s.player_game.id === playerGameId);

    if (loading) return (
        <div className="page-container">
            <Navbar />
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <p className="text-dim">Loading...</p>
            </div>
        </div>
    );

    return (
        <div className="page-container">
            <Navbar />
            <Container style={{ padding: '40px 16px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
                        WELCOME, <span style={{ color: '#FFD700' }}>{user?.first_name?.toUpperCase()}</span>
                    </h1>
                    <div className="gold-line" />
                </div>

                {/* Add Game */}
                <div className="sf-card mb-4">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>ADD <span style={{ color: '#FFD700' }}>GAME</span></h2>
                    <form onSubmit={handleAddGame} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Row className="g-3">
                            <Col md={5}>
                                <label className="sf-label">Game</label>
                                <select className="sf-select" value={addForm.game_id} onChange={(e) => setAddForm({ ...addForm, game_id: e.target.value })} required>
                                    <option value="">Select game</option>
                                    {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                </select>
                            </Col>
                            <Col md={5}>
                                <label className="sf-label">Gaming ID</label>
                                <input className="sf-input" placeholder="Your in-game username" value={addForm.gaming_id} onChange={(e) => setAddForm({ ...addForm, gaming_id: e.target.value })} required />
                            </Col>
                            <Col md={2} className="d-flex align-items-end">
                                <button className="btn-gold w-100" type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                                    <FiPlus size={16} /> Add
                                </button>
                            </Col>
                        </Row>
                    </form>
                    {addError && <p className="error-msg mt-2">{addError}</p>}
                    {addSuccess && <p className="success-msg mt-2">{addSuccess}</p>}
                </div>

                {/* My Games */}
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>MY <span style={{ color: '#FFD700' }}>GAMES</span></h2>

                {myGames.length === 0 ? (
                    <div className="sf-card text-center py-5">
                        <p className="text-dim">No games added yet. Add your first game above.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {myGames.map((pg) => {
                            const gameStats = getStatsForGame(pg.id);
                            const isApiGame = pg.game.slug === 'fortnite' || pg.game.slug === 'apex-legends';

                            return (
                                <div key={pg.id} className="sf-card">
                                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                                        <div>
                                            <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{pg.game.name}</h3>
                                            <p style={{ color: '#FFD700', fontSize: '0.9rem', fontFamily: 'Rajdhani', margin: 0 }}>{pg.gaming_id}</p>
                                        </div>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {isApiGame && (
                                                <>
                                                    {pg.game.slug === 'apex-legends' && (
                                                        <select
                                                            value={platform[pg.id] || 'PC'}
                                                            onChange={(e) => setPlatform({ ...platform, [pg.id]: e.target.value })}
                                                            style={{
                                                                background: '#1A1A1A', border: '1px solid rgba(255,215,0,0.2)',
                                                                color: '#AAAAAA', padding: '6px 10px', fontSize: '0.85rem',
                                                                fontFamily: 'Rajdhani', cursor: 'pointer', borderRadius: 0,
                                                            }}
                                                        >
                                                            <option value="PC">PC</option>
                                                            <option value="PS4">PlayStation</option>
                                                            <option value="X1">Xbox</option>
                                                        </select>
                                                    )}
                                                    <button onClick={() => handleFetchStats(pg.id, pg.game.slug)} disabled={fetchingStats[pg.id]} style={{
                                                        background: 'transparent', border: '1px solid rgba(255,215,0,0.2)', color: '#AAAAAA',
                                                        padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px',
                                                        fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', borderRadius: 0,
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFD700'; e.currentTarget.style.color = '#FFD700'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; e.currentTarget.style.color = '#AAAAAA'; }}
                                                    >
                                                        <FiRefreshCw size={14} /> {fetchingStats[pg.id] ? 'Fetching...' : 'Sync Stats'}
                                                    </button>
                                                </>
                                            )}
                                            <button onClick={() => handleRemoveGame(pg.id)} style={{
                                                background: 'transparent', border: '1px solid rgba(255,215,0,0.2)', color: '#AAAAAA',
                                                padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px',
                                                fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', borderRadius: 0,
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF4444'; e.currentTarget.style.color = '#FF4444'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; e.currentTarget.style.color = '#AAAAAA'; }}
                                            >
                                                <FiTrash2 size={14} /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    {isApiGame && (
                                        <div className="sf-notice d-flex align-items-start gap-2 mb-3">
                                            <FiInfo size={16} style={{ color: '#FFD700', marginTop: '2px', flexShrink: 0 }} />
                                            <p style={{ color: '#AAAAAA', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                                                Your <strong style={{ color: '#FFD700' }}>{pg.game.name}</strong> account must have <strong style={{ color: '#FFD700' }}>public stats</strong> enabled for the sync to work.
                                            </p>
                                        </div>
                                    )}

                                    {gameStats ? (
                                        <>
                                            <Row className="g-2 mb-3">
                                                {[
                                                    { label: 'Kills', value: gameStats.kills },
                                                    { label: 'Deaths', value: gameStats.deaths },
                                                    { label: 'Wins', value: gameStats.wins },
                                                    { label: 'K/D', value: gameStats.kd_ratio },
                                                    { label: 'Win Rate', value: `${gameStats.win_rate}%` },
                                                    { label: 'Matches', value: gameStats.matches_played },
                                                ].map((stat) => (
                                                    <Col key={stat.label} xs={6} sm={4} md={2}>
                                                        <div className="sf-stat-box">
                                                            <p style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{stat.value}</p>
                                                            <p style={{ color: '#AAAAAA', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{stat.label}</p>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>

                                            <button onClick={() => handleGenerateInsight(pg.id)} disabled={fetchingInsight[pg.id]} style={{
                                                background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700',
                                                padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px',
                                                fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em',
                                                textTransform: 'uppercase', cursor: 'pointer', marginBottom: '16px', transition: 'all 0.2s', borderRadius: 0,
                                            }}>
                                                <FiZap size={14} /> {fetchingInsight[pg.id] ? 'Generating...' : 'Get AI Insight'}
                                            </button>

                                            {insights[pg.id] && (
                                                <div className="sf-insight-box">
                                                    <p style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>AI Coach Insight</p>
                                                    <p style={{ color: '#AAAAAA', lineHeight: 1.7, fontSize: '0.92rem', whiteSpace: 'pre-line', margin: 0 }}>{insights[pg.id]}</p>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {pg.game.slug === 'cod-mobile' && (
                                                <div style={{ marginTop: '8px' }}>
                                                    <p style={{ color: '#AAAAAA', fontSize: '0.88rem', marginBottom: '16px' }}>
                                                        Submit your COD Mobile stats below. Our AI will verify your screenshot automatically.
                                                    </p>
                                                    <form onSubmit={(e) => handleCodSubmit(e, pg.id)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                        <Row className="g-2">
                                                            {['kills', 'deaths', 'assists', 'wins', 'matches_played', 'score'].map((field) => (
                                                                <Col key={field} xs={6} md={4}>
                                                                    <label className="sf-label">{field.replace('_', ' ')}</label>
                                                                    <input className="sf-input" type="number" min="0" placeholder="0" onChange={(e) => updateCodForm(pg.id, field, e.target.value)} required />
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                        <div>
                                                            <label className="sf-label">Stats Screenshot</label>
                                                            <div style={{ border: '1px dashed rgba(255,215,0,0.2)', padding: '20px', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
                                                                <FiUpload size={24} style={{ color: '#FFD700', marginBottom: '8px' }} />
                                                                <p style={{ color: '#AAAAAA', fontSize: '0.88rem', margin: 0 }}>Click to upload your stats screenshot</p>
                                                                <input type="file" accept="image/*" required onChange={(e) => updateCodForm(pg.id, 'screenshot', e.target.files[0])} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                                                {codForm[pg.id]?.screenshot && (
                                                                    <p style={{ color: '#FFD700', fontSize: '0.85rem', marginTop: '8px', marginBottom: 0 }}>{codForm[pg.id].screenshot.name}</p>
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
                                            {isApiGame && (
                                                <p style={{ color: '#AAAAAA', fontSize: '0.9rem', padding: '20px 0', margin: 0 }}>Click Sync Stats to fetch your {pg.game.name} stats.</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Dashboard;