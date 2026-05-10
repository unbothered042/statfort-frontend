import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table } from 'react-bootstrap';
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
        try {
            const [usersRes, statsRes] = await Promise.all([
                API.get('/users/admin/users/'),
                API.get('/stats/admin/all/'),
            ]);
            setUsers(usersRes.data);
            setStats(statsRes.data);
        } catch {
            setError('Access denied. Admins only.');
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
        <div className="page-container">
            <Navbar />
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <p className="text-dim">Loading...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="page-container">
            <Navbar />
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <p style={{ color: '#FF4444' }}>{error}</p>
            </div>
        </div>
    );

    return (
        <div className="page-container">
            <Navbar />
            <Container style={{ padding: '60px 20px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.8rem', marginBottom: '8px' }}>
                        ADMIN <span style={{ color: '#FFD700' }}>DASHBOARD</span>
                    </h1>
                    <div className="gold-line" />
                </div>

                <div className="d-flex gap-3 flex-wrap mb-4">
                    {[
                        { label: 'Total Users', value: users.length, icon: <FiUsers size={20} /> },
                        { label: 'Total Stats', value: stats.length, icon: <FiActivity size={20} /> },
                        { label: 'Approved Stats', value: stats.filter(s => s.status === 'approved').length, icon: <FiActivity size={20} /> },
                    ].map((card) => (
                        <div key={card.label} className="sf-card d-flex align-items-center gap-3" style={{ minWidth: '180px' }}>
                            <div style={{ color: '#FFD700' }}>{card.icon}</div>
                            <div>
                                <p style={{ fontFamily: 'Rajdhani', fontSize: '1.8rem', fontWeight: 700, color: '#FFD700', margin: 0 }}>{card.value}</p>
                                <p style={{ color: '#AAAAAA', fontSize: '0.85rem', margin: 0 }}>{card.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="d-flex gap-2 mb-4">
                    {[
                        { key: 'users', label: 'Users', icon: <FiUsers size={14} /> },
                        { key: 'stats', label: 'Stats', icon: <FiActivity size={14} /> },
                    ].map((tab) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                            padding: '10px 28px', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                            fontSize: '0.95rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                            background: activeTab === tab.key ? '#FFD700' : 'transparent',
                            color: activeTab === tab.key ? '#0A0A0A' : '#AAAAAA',
                            border: '1px solid', borderColor: activeTab === tab.key ? '#FFD700' : 'rgba(255,215,0,0.2)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'all 0.2s', borderRadius: 0,
                        }}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'users' && (
                    <div style={{ overflowX: 'auto' }}>
                        <Table className="sf-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td style={{ fontFamily: 'Rajdhani', fontWeight: 600 }}>{u.first_name} {u.last_name}</td>
                                        <td style={{ color: '#AAAAAA', fontSize: '0.9rem' }}>{u.email}</td>
                                        <td style={{ color: '#AAAAAA', fontSize: '0.9rem' }}>{u.phone || '-'}</td>
                                        <td><span className={u.is_verified ? 'badge-verified' : 'badge-unverified'}>{u.is_verified ? 'Verified' : 'Unverified'}</span></td>
                                        <td style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => handleDeleteUser(u.id)} style={{
                                                background: 'transparent', border: '1px solid rgba(255,215,0,0.2)', color: '#AAAAAA',
                                                padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px',
                                                fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                                                transition: 'all 0.2s', borderRadius: 0,
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF4444'; e.currentTarget.style.color = '#FF4444'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; e.currentTarget.style.color = '#AAAAAA'; }}
                                            >
                                                <FiTrash2 size={12} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {users.length === 0 && <p className="text-dim text-center py-4">No users found.</p>}
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div style={{ overflowX: 'auto' }}>
                        <Table className="sf-table">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Game</th>
                                    <th>Kills</th>
                                    <th>Deaths</th>
                                    <th>Wins</th>
                                    <th>K/D</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.map((s) => (
                                    <tr key={s.id}>
                                        <td style={{ fontFamily: 'Rajdhani', fontWeight: 600 }}>{s.player_game?.gaming_id}</td>
                                        <td style={{ color: '#AAAAAA' }}>{s.player_game?.game?.name}</td>
                                        <td>{s.kills}</td>
                                        <td>{s.deaths}</td>
                                        <td>{s.wins}</td>
                                        <td style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700 }}>{s.kd_ratio}</td>
                                        <td><span className={s.status === 'approved' ? 'badge-approved' : 'badge-pending'}>{s.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {stats.length === 0 && <p className="text-dim text-center py-4">No stats found.</p>}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default AdminDashboard;