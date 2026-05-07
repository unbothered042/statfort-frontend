import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { FiAward, FiTrendingUp } from 'react-icons/fi';

const Leaderboard = () => {
    const [activeGame, setActiveGame] = useState('fortnite');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await API.get(`/leaderboard/${activeGame}/`);
                setData(res.data);
            } catch (err) {
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [activeGame]);

    return (
        <div className="page-container">
            <Navbar />
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '8px' }}>
                        <span style={{ color: 'var(--gold)' }}>LEADER</span>BOARD
                    </h1>
                    <div className="gold-line" />
                    <p style={{ color: 'var(--text-dim)', marginTop: '12px' }}>Top Nigerian players ranked by score</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '40px' }}>
                    {['fortnite', 'cod-mobile'].map((game) => (
                        <button key={game} onClick={() => setActiveGame(game)} style={{
                            padding: '10px 28px',
                            fontFamily: 'Rajdhani, sans-serif',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            background: activeGame === game ? 'var(--gold)' : 'transparent',
                            color: activeGame === game ? 'var(--black)' : 'var(--text-dim)',
                            border: '1px solid',
                            borderColor: activeGame === game ? 'var(--gold)' : 'var(--border)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}>
                            {game === 'fortnite' ? 'Fortnite' : 'COD Mobile'}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '60px 0' }}>Loading...</p>
                ) : data.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <FiTrendingUp size={48} style={{ color: 'var(--border)', marginBottom: '16px' }} />
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>No players on the leaderboard yet.</p>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '8px' }}>Be the first to submit your stats.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {data.map((player) => (
                            <div key={player.rank} className="card" style={{
                                display: 'grid',
                                gridTemplateColumns: '60px 1fr repeat(4, auto)',
                                alignItems: 'center',
                                gap: '24px',
                                padding: '16px 24px',
                                borderColor: player.rank <= 3 ? 'var(--gold)' : 'var(--border)',
                                transition: 'border-color 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = player.rank <= 3 ? 'var(--gold)' : 'var(--border)'}
                            >
                                <div style={{
                                    fontFamily: 'Rajdhani, sans-serif',
                                    fontSize: player.rank <= 3 ? '1.5rem' : '1.2rem',
                                    fontWeight: 700,
                                    color: player.rank === 1 ? 'var(--gold)' : player.rank === 2 ? '#C0C0C0' : player.rank === 3 ? '#CD7F32' : 'var(--text-dim)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}>
                                    {player.rank <= 3 && <FiAward size={16} />}
                                    #{player.rank}
                                </div>
                                <div>
                                    <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem', fontWeight: 700 }}>{player.username}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{player.game}</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ color: 'var(--gold)', fontFamily: 'Rajdhani', fontWeight: 700 }}>{player.kd_ratio}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>K/D</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>{player.wins}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Wins</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>{player.kills}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Kills</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ color: 'var(--gold)', fontFamily: 'Rajdhani', fontWeight: 700 }}>{player.score.toLocaleString()}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Score</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;