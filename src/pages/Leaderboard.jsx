import { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
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
        <div className="page-container">
            <Navbar />
            <Container style={{ padding: '60px 20px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '8px' }}>
                        <span style={{ color: '#FFD700' }}>LEADER</span>BOARD
                    </h1>
                    <div className="gold-line" />
                    <p className="text-dim mt-2">Top Nigerian players ranked by score</p>
                </div>

                <div className="d-flex gap-2 flex-wrap mb-4">
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
                    <p className="text-dim text-center py-5">Loading...</p>
                ) : data.length === 0 ? (
                    <div className="text-center py-5">
                        <FiTrendingUp size={48} style={{ color: 'rgba(255,215,0,0.2)', marginBottom: '16px' }} />
                        <p className="text-dim">No players on the leaderboard yet. Be the first to submit your stats.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <Table className="sf-table" style={{ background: 'transparent' }}>
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Player</th>
                                    <th>K/D</th>
                                    <th>Wins</th>
                                    <th>Kills</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((player) => (
                                    <tr key={player.rank}>
                                        <td>
                                            <span style={{
                                                fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                                                fontSize: player.rank <= 3 ? '1.3rem' : '1rem',
                                                color: player.rank === 1 ? '#FFD700' : player.rank === 2 ? '#C0C0C0' : player.rank === 3 ? '#CD7F32' : '#AAAAAA',
                                                display: 'flex', alignItems: 'center', gap: '4px',
                                            }}>
                                                {player.rank <= 3 && <FiAward size={14} />} #{player.rank}
                                            </span>
                                        </td>
                                        <td>
                                            <p style={{ fontFamily: 'Rajdhani', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{player.username}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#AAAAAA', margin: 0 }}>{player.game}</p>
                                        </td>
                                        <td style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700 }}>{player.kd_ratio}</td>
                                        <td style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>{player.wins}</td>
                                        <td style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>{player.kills}</td>
                                        <td style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700 }}>{player.score?.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Leaderboard;