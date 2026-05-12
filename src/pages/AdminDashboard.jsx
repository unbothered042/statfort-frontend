import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table } from 'react-bootstrap';
import { motion } from 'framer-motion';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiTrash2, FiUsers, FiActivity } from 'react-icons/fi';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const [usersRes, statsRes] = await Promise.all([
                API.get('/users/admin/users/'),
                API.get('/stats/admin/all/'),
            ]);
            setUsers(usersRes.data);
            setStats(statsRes.data);
        } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 401) {
                setError('Access denied. Admins only.');
            } else {
                setError('Failed to load data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user? This cannot be undone.')) return;
        try {
            await API.delete(`/users/admin/users/${id}/`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

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

    if (error) return (
        <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: '16px' }}>
                <p style={{ color: '#FF4444', fontFamily: 'Rajdhani', fontSize: '1.1rem' }}>{error}</p>
                <button
                    onClick={() => { navigate('/login'); }}
                    className="btn-gold"
                    style={{ padding: '10px 32px', fontSize: '0.9rem' }}
                >
                    Login Again
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' }}>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '40px' }}
                >
                    <h1 style={{ fontSize: '2.8rem', marginBottom: '8px', fontStyle: 'italic' }}>
                        ADMIN <span style={{ color: '#FFD700' }}>DASHBOARD</span>
                    </h1>
                    <div style={{ width: '60px', height: '3px', background: '#FFD700' }} />
                </motion.div>

                {/* Stats cards */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
                    {[
                        { label: 'Total Users', value: users.length, icon: <FiUsers size={20} /> },
                        { label: 'Total Stats', value: stats.length, icon: <FiActivity size={20} /> },
                        { label: 'Approved Stats', value: stats.filter(s => s.status === 'approved').length, icon: <FiActivity size={20} /> },
                    ].map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            style={{
                                background: '#111111', border: '1px solid rgba(255,215,0,0.2)',
                                padding: '24px', display: 'flex', alignItems: 'center', gap: '16px',
                                minWidth: '180px', position: 'relative', overflow: 'hidden',
                            }}
                        >
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #FFD700, transparent)' }} />
                            <div style={{ color: '#FFD700' }}>{card.icon}</div>
                            <div>
                                <p style={{ fontFamily: 'Rajdhani', fontSize: '1.8rem', fontWeight: 700, color: '#FFD700', margin: 0, lineHeight: 1 }}>{card.value}</p>
                                <p style={{ color: '#AAAAAA', fontSize: '0.85rem', margin: 0 }}>{card.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                    {[
                        { key: 'users', label: 'Users', icon: <FiUsers size={14} /> },
                        { key: 'stats', label: 'Stats', icon: <FiActivity size={14} /> },
                    ].map((tab) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                            padding: '10px 28px', fontFamily: 'Rajdhani', fontWeight: 700,
                            fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                            background: activeTab === tab.key ? '#FFD700' : 'transparent',
                            color: activeTab === tab.key ? '#0A0A0A' : '#AAAAAA',
                            border: '1px solid', borderColor: activeTab === tab.key ? '#FFD700' : 'rgba(255,215,0,0.2)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'all 0.2s',
                        }}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Users Table */}
                {activeTab === 'users' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,215,0,0.2)' }}>
                                        {['Name', 'Email', 'Username', 'State', 'Status', 'Joined', 'Actions'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'Rajdhani', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAAAAA' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,215,0,0.08)', transition: 'background 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#111111'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '14px 16px', fontFamily: 'Rajdhani', fontWeight: 600, color: '#FFFFFF' }}>{u.first_name} {u.last_name}</td>
                                            <td style={{ padding: '14px 16px', color: '#AAAAAA', fontSize: '0.9rem' }}>{u.email}</td>
                                            <td style={{ padding: '14px 16px', color: '#FFD700', fontSize: '0.9rem', fontFamily: 'Rajdhani' }}>{u.username || '-'}</td>
                                            <td style={{ padding: '14px 16px' }}>
                                            <td style={{ padding: '14px 16px', color: '#FFD700', fontSize: '0.9rem', fontFamily: 'Rajdhani' }}>{u.state || '-'}</td>
                                                <span className={u.is_verified ? 'badge-verified' : 'badge-unverified'}>
                                                    {u.is_verified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px', color: '#AAAAAA', fontSize: '0.85rem' }}>
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    style={{
                                                        background: 'transparent', border: '1px solid rgba(255,68,68,0.3)',
                                                        color: '#FF4444', padding: '5px 12px', display: 'flex',
                                                        alignItems: 'center', gap: '5px', fontFamily: 'Rajdhani',
                                                        fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                                                    }}
                                                >
                                                    <FiTrash2 size={12} /> Delete
                                                </motion.button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.length === 0 && <p style={{ color: '#AAAAAA', textAlign: 'center', padding: '40px' }}>No users found.</p>}
                        </div>
                    </motion.div>
                )}

                {/* Stats Table */}
                {activeTab === 'stats' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,215,0,0.2)' }}>
                                        {['Player', 'Game', 'Kills', 'Deaths', 'Wins', 'K/D', 'Status'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'Rajdhani', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#AAAAAA' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.map((s) => (
                                        <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,215,0,0.08)', transition: 'background 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#111111'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '14px 16px', fontFamily: 'Rajdhani', fontWeight: 600, color: '#FFFFFF' }}>{s.player_game?.gaming_id}</td>
                                            <td style={{ padding: '14px 16px', color: '#AAAAAA' }}>{s.player_game?.game?.name}</td>
                                            <td style={{ padding: '14px 16px', color: '#FFFFFF' }}>{s.kills}</td>
                                            <td style={{ padding: '14px 16px', color: '#FFFFFF' }}>{s.deaths}</td>
                                            <td style={{ padding: '14px 16px', color: '#FFFFFF' }}>{s.wins}</td>
                                            <td style={{ padding: '14px 16px', color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700 }}>{s.kd_ratio}</td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span className={s.status === 'approved' ? 'badge-approved' : 'badge-pending'}>{s.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {stats.length === 0 && <p style={{ color: '#AAAAAA', textAlign: 'center', padding: '40px' }}>No stats found.</p>}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;