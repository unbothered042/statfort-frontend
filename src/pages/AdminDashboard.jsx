import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        } catch (err) {
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <p style={{ color: 'var(--text-dim)' }}>Loading...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="page-container">
            <Navbar />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <p style={{ color: 'var(--error)' }}>{error}</p>
            </div>
        </div>
    );

    return (
        <div className="page-container">
            <Navbar />
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.8rem', marginBottom: '8px' }}>
                        ADMIN <span style={{ color: 'var(--gold)' }}>DASHBOARD</span>
                    </h1>
                    <div className="gold-line" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
                    {[
                        { label: 'Total Users', value: users.length, icon: <FiUsers size={20} /> },
                        { label: 'Total Stats', value: stats.length, icon: <FiActivity size={20} /> },
                        { label: 'Verified Stats', value: stats.filter(s => s.status === 'approved').length, icon: <FiActivity size={20} /> },
                    ].map((card) => (
                        <div key={card.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ color: 'var(--gold)' }}>{card.icon}</div>
                            <div>
                                <p style={{ fontFamily: 'Rajdhani', fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold)' }}>{card.value}</p>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{card.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                    {[
                        { key: 'users', label: 'Users', icon: <FiUsers size={14} /> },
                        { key: 'stats', label: 'Stats', icon: <FiActivity size={14} /> },
                    ].map((tab) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                            padding: '10px 28px',
                            fontFamily: 'Rajdhani, sans-serif',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            background: activeTab === tab.key ? 'var(--gold)' : 'transparent',
                            color: activeTab === tab.key ? 'var(--black)' : 'var(--text-dim)',
                            border: '1px solid',
                            borderColor: activeTab === tab.key ? 'var(--gold)' : 'var(--border)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                        }}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'users' && (
                    <div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        {['Name', 'Email', 'Phone', 'Verified', 'Joined', 'Actions'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'Rajdhani', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--dark-2)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '14px 16px', fontFamily: 'Rajdhani', fontWeight: 600 }}>{u.first_name} {u.last_name}</td>
                                            <td style={{ padding: '14px 16px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>{u.email}</td>
                                            <td style={{ padding: '14px 16px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>{u.phone || '-'}</td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{
                                                    padding: '3px 10px',
                                                    fontSize: '0.75rem',
                                                    fontFamily: 'Rajdhani',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.08em',
                                                    background: u.is_verified ? 'rgba(0,204,102,0.1)' : 'rgba(255,68,68,0.1)',
                                                    color: u.is_verified ? 'var(--success)' : 'var(--error)',
                                                    border: `1px solid ${u.is_verified ? 'var(--success)' : 'var(--error)'}`,
                                                }}>
                                                    {u.is_verified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <button onClick={() => handleDeleteUser(u.id)} style={{
                                                    background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-dim)',
                                                    padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px',
                                                    fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--error)'; e.currentTarget.style.color = 'var(--error)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
                                                >
                                                    <FiTrash2 size={12} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.length === 0 && (
                                <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '40px' }}>No users found.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        {['Player', 'Game', 'Kills', 'Deaths', 'Wins', 'K/D', 'Status'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'Rajdhani', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.map((s) => (
                                        <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--dark-2)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '14px 16px', fontFamily: 'Rajdhani', fontWeight: 600 }}>{s.player_game?.gaming_id}</td>
                                            <td style={{ padding: '14px 16px', color: 'var(--text-dim)' }}>{s.player_game?.game?.name}</td>
                                            <td style={{ padding: '14px 16px' }}>{s.kills}</td>
                                            <td style={{ padding: '14px 16px' }}>{s.deaths}</td>
                                            <td style={{ padding: '14px 16px' }}>{s.wins}</td>
                                            <td style={{ padding: '14px 16px', color: 'var(--gold)', fontFamily: 'Rajdhani', fontWeight: 700 }}>{s.kd_ratio}</td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{
                                                    padding: '3px 10px',
                                                    fontSize: '0.75rem',
                                                    fontFamily: 'Rajdhani',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.08em',
                                                    background: s.status === 'approved' ? 'rgba(0,204,102,0.1)' : 'rgba(255,68,68,0.1)',
                                                    color: s.status === 'approved' ? 'var(--success)' : 'var(--error)',
                                                    border: `1px solid ${s.status === 'approved' ? 'var(--success)' : 'var(--error)'}`,
                                                }}>
                                                    {s.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {stats.length === 0 && (
                                <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '40px' }}>No stats found.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;