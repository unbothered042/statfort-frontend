import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
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
            } catch {
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [activeGame]);

    const games = [
        { slug: 'fortnite', name: 'Fortnite' },
        { slug: 'apex-legends', name: 'Apex Legends' },
        { slug: 'cod-mobile', name: 'COD Mobile' },
    ];

    return (
        <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '40px' }}
                >
                    <h1 style={{ fontSize: '3rem', marginBottom: '8px', fontStyle: 'italic' }}>
                        <span style={{ color: '#FFD700' }}>LEADER</span>BOARD
                    </h1>
                    <div style={{ width: '60px', height: '3px', background: '#FFD700', marginBottom: '12px' }} />
                    <p style={{ color: '#AAAAAA' }}>Top Nigerian players ranked by score</p>
                </motion.div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
                    {games.map((game) => (
                        <button key={game.slug} onClick={() => setActiveGame(game.slug)} style={{
                            padding: '10px 28px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                            fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                            background: activeGame === game.slug ? '#FFD700' : 'transparent',
                            color: activeGame === game.slug ? '#0A0A0A' : '#AAAAAA',
                            border: '1px solid', borderColor: activeGame === game.slug ? '#FFD700' : 'rgba(255,215,0,0.2)',
                            cursor: 'pointer', transition: 'all 0.2s', borderRadius: 0,
                        }}>
                            {game.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <p style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontSize: '1.1rem', letterSpacing: '0.2em', textAlign: 'center', padding: '60px 0' }}>LOADING...</p>
                    </motion.div>
                ) : data.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <FiTrendingUp size={48} style={{ color: 'rgba(255,215,0,0.2)', marginBottom: '16px' }} />
                        <p style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>No players on the leaderboard yet.</p>
                        <p style={{ color: '#555555', fontSize: '0.9rem', marginTop: '8px' }}>Be the first to submit your stats.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {data.map((player, index) => (
                            <motion.div
                                key={player.rank}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.04 }}
                                style={{
                                    background: player.rank <= 3 ? 'linear-gradient(135deg, #1A1A1A, #111111)' : '#111111',
                                    border: `1px solid ${player.rank === 1 ? 'rgba(255,215,0,0.4)' : player.rank === 2 ? 'rgba(192,192,192,0.3)' : player.rank === 3 ? 'rgba(205,127,50,0.3)' : 'rgba(255,215,0,0.08)'}`,
                                    padding: '16px 20px',
                                    display: 'grid',
                                    gridTemplateColumns: '60px 1fr repeat(4, auto)',
                                    alignItems: 'center',
                                    gap: '16px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'border-color 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = player.rank === 1 ? 'rgba(255,215,0,0.4)' : player.rank === 2 ? 'rgba(192,192,192,0.3)' : player.rank === 3 ? 'rgba(205,127,50,0.3)' : 'rgba(255,215,0,0.08)'}
                            >
                                {player.rank <= 3 && (
                                    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px', background: player.rank === 1 ? '#FFD700' : player.rank === 2 ? '#C0C0C0' : '#CD7F32' }} />
                                )}

                                <div style={{
                                    fontFamily: 'Rajdhani, sans-serif',
                                    fontSize: player.rank <= 3 ? '1.5rem' : '1.1rem',
                                    fontWeight: 700,
                                    fontStyle: 'italic',
                                    color: player.rank === 1 ? '#FFD700' : player.rank === 2 ? '#C0C0C0' : player.rank === 3 ? '#CD7F32' : '#555555',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                }}>
                                    {player.rank <= 3 && <FiAward size={14} />}
                                    #{player.rank}
                                </div>

                                <div>
                                    <p style={{ fontFamily: 'Rajdhani', fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>{player.username}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                                        <p style={{ fontSize: '0.8rem', color: '#AAAAAA', margin: 0 }}>{player.game}</p>
                                        {player.state && (
                                            <>
                                                <span style={{ color: '#333333', fontSize: '0.75rem' }}>•</span>
                                                <p style={{ fontSize: '0.8rem', color: '#FFD700', margin: 0, fontFamily: 'Rajdhani', fontWeight: 600 }}>{player.state}</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{player.kd_ratio}</p>
                                    <p style={{ fontSize: '0.72rem', color: '#555555', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>K/D</p>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{player.wins}</p>
                                    <p style={{ fontSize: '0.72rem', color: '#555555', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wins</p>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{player.kills}</p>
                                    <p style={{ fontSize: '0.72rem', color: '#555555', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kills</p>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{player.score?.toLocaleString()}</p>
                                    <p style={{ fontSize: '0.72rem', color: '#555555', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;