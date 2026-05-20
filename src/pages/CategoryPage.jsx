import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiMessageSquare, FiHeart, FiEye, FiPlus, FiX, FiArrowLeft } from 'react-icons/fi';

const CategoryPage = () => {
    const { categorySlug } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', content: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPosts();
    }, [categorySlug]);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/community/categories/${categorySlug}/`);
            setCategory(res.data.category);
            setPosts(res.data.posts);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }
        setSubmitting(true);
        setError('');
        try {
            const res = await API.post(`/community/categories/${categorySlug}/`, form);
            setPosts([res.data, ...posts]);
            setForm({ title: '', content: '' });
            setShowForm(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to post.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
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

    return (
        <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 16px' }}>

                {/* Back link */}
                <Link to="/community" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#AAAAAA', textDecoration: 'none', fontFamily: 'Rajdhani', fontSize: '0.9rem', marginBottom: '24px' }}>
                    <FiArrowLeft size={14} /> Back to Community
                </Link>

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', fontStyle: 'italic' }}>
                                <span style={{ color: '#FFD700' }}>{category?.name}</span>
                            </h1>
                            <div style={{ width: '60px', height: '3px', background: '#FFD700', marginBottom: '8px' }} />
                            <p style={{ color: '#AAAAAA', fontSize: '0.9rem' }}>{category?.description}</p>
                        </div>
                        {user && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowForm(!showForm)}
                                style={{
                                    background: showForm ? 'transparent' : '#FFD700',
                                    color: showForm ? '#AAAAAA' : '#0A0A0A',
                                    border: showForm ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                    padding: '10px 24px', fontFamily: 'Rajdhani', fontWeight: 700,
                                    fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                }}
                            >
                                {showForm ? <><FiX size={14} /> Cancel</> : <><FiPlus size={14} /> New Post</>}
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Post form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden', marginBottom: '24px' }}
                        >
                            <div style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.2)', padding: '24px' }}>
                                <h3 style={{ fontFamily: 'Rajdhani', fontSize: '1.1rem', marginBottom: '16px', fontStyle: 'italic' }}>
                                    CREATE <span style={{ color: '#FFD700' }}>POST</span>
                                </h3>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div>
                                        <label className="sf-label">Title</label>
                                        <input
                                            className="sf-input"
                                            placeholder="What's on your mind?"
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            required
                                            maxLength={200}
                                        />
                                    </div>
                                    <div>
                                        <label className="sf-label">Content</label>
                                        <textarea
                                            className="sf-input"
                                            placeholder="Write your post here..."
                                            value={form.content}
                                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                                            required
                                            rows={5}
                                            style={{ resize: 'vertical', minHeight: '120px' }}
                                        />
                                    </div>
                                    {error && <p className="error-msg">{error}</p>}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-gold"
                                        style={{ width: 'fit-content', padding: '10px 32px' }}
                                    >
                                        {submitting ? 'Posting...' : 'Post'}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Posts */}
                {posts.length === 0 ? (
                    <div style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.08)', padding: '60px 20px', textAlign: 'center' }}>
                        <FiMessageSquare size={40} style={{ color: 'rgba(255,215,0,0.2)', marginBottom: '16px' }} />
                        <p style={{ color: '#AAAAAA', marginBottom: '8px' }}>No posts yet. Be the first to post.</p>
                        {!user && <Link to="/login" style={{ color: '#FFD700', fontSize: '0.9rem' }}>Login to post</Link>}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.04 }}
                            >
                                <Link to={`/community/post/${post.id}`} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        background: post.is_pinned ? 'linear-gradient(135deg, #1A1A1A, #111111)' : '#111111',
                                        border: `1px solid ${post.is_pinned ? 'rgba(255,215,0,0.3)' : 'rgba(255,215,0,0.06)'}`,
                                        padding: '16px 20px', transition: 'all 0.2s', cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.25)'; e.currentTarget.style.background = '#1A1A1A'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = post.is_pinned ? 'rgba(255,215,0,0.3)' : 'rgba(255,215,0,0.06)'; e.currentTarget.style.background = post.is_pinned ? 'linear-gradient(135deg, #1A1A1A, #111111)' : '#111111'; }}
                                    >
                                        {post.is_pinned && (
                                            <span style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700', padding: '2px 8px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.1em', marginBottom: '8px', display: 'inline-block' }}>
                                                PINNED
                                            </span>
                                        )}
                                        <h3 style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.05rem', color: '#FFFFFF', margin: 0, marginBottom: '6px' }}>
                                            {post.title}
                                            {post.is_edited && <span style={{ color: '#555555', fontSize: '0.72rem', fontWeight: 400, marginLeft: '8px' }}>(edited)</span>}
                                        </h3>
                                        <p style={{ color: '#666666', fontSize: '0.85rem', margin: 0, marginBottom: '12px', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {post.content}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 700, color: '#0A0A0A' }}>
                                                    {post.author.username?.[0]?.toUpperCase()}
                                                </div>
                                                <span style={{ color: '#FFD700', fontSize: '0.82rem', fontFamily: 'Rajdhani', fontWeight: 600 }}>{post.author.username}</span>
                                                {post.author.is_premium && (
                                                    <span style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#0A0A0A', padding: '1px 6px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.1em' }}>VERIFIED</span>
                                                )}
                                                {post.author.state && <span style={{ color: '#555555', fontSize: '0.75rem' }}>{post.author.state}</span>}
                                            </div>
                                            <span style={{ color: '#444444', fontSize: '0.78rem' }}>{formatDate(post.created_at)}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#555555', fontSize: '0.78rem' }}>
                                                    <FiMessageSquare size={12} /> {post.reply_count}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#555555', fontSize: '0.78rem' }}>
                                                    <FiHeart size={12} /> {post.like_count}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#555555', fontSize: '0.78rem' }}>
                                                    <FiEye size={12} /> {post.views}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;