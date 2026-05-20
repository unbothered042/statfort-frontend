import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiEdit2, FiTrash2, FiArrowLeft, FiSend, FiEye } from 'react-icons/fi';

const PostPage = () => {
    const { postId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);
    const [replyError, setReplyError] = useState('');
    const [editingPost, setEditingPost] = useState(false);
    const [editPostForm, setEditPostForm] = useState({ title: '', content: '' });
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editReplyContent, setEditReplyContent] = useState('');
    const [likeLoading, setLikeLoading] = useState({});

    useEffect(() => {
        loadPost();
    }, [postId]);

    const loadPost = async () => {
        setLoading(true);
        try {
            const res = await API.get(`/community/posts/${postId}/`);
            setPost(res.data.post);
            setReplies(res.data.replies);
            setEditPostForm({ title: res.data.post.title, content: res.data.post.content });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }
        setSubmittingReply(true);
        setReplyError('');
        try {
            const res = await API.post(`/community/posts/${postId}/replies/`, { content: replyContent });
            setReplies([...replies, res.data]);
            setReplyContent('');
            setPost({ ...post, reply_count: post.reply_count + 1 });
        } catch (err) {
            setReplyError(err.response?.data?.error || 'Failed to reply.');
        } finally {
            setSubmittingReply(false);
        }
    };

    const handleLikePost = async () => {
        if (!user) { navigate('/login'); return; }
        setLikeLoading({ ...likeLoading, post: true });
        try {
            const res = await API.post(`/community/posts/${postId}/like/`);
            setPost({ ...post, is_liked: res.data.liked, like_count: res.data.like_count });
        } catch (err) {
            console.error(err);
        } finally {
            setLikeLoading({ ...likeLoading, post: false });
        }
    };

    const handleLikeReply = async (replyId) => {
        if (!user) { navigate('/login'); return; }
        setLikeLoading({ ...likeLoading, [replyId]: true });
        try {
            const res = await API.post(`/community/replies/${replyId}/like/`);
            setReplies(replies.map(r => r.id === replyId ? { ...r, is_liked: res.data.liked, like_count: res.data.like_count } : r));
        } catch (err) {
            console.error(err);
        } finally {
            setLikeLoading({ ...likeLoading, [replyId]: false });
        }
    };

    const handleEditPost = async (e) => {
        e.preventDefault();
        try {
            const res = await API.put(`/community/posts/${postId}/`, editPostForm);
            setPost(res.data);
            setEditingPost(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePost = async () => {
        if (!window.confirm('Delete this post?')) return;
        try {
            await API.delete(`/community/posts/${postId}/`);
            navigate(`/community/${post.category_slug}`);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditReply = async (replyId) => {
        try {
            const res = await API.put(`/community/replies/${replyId}/`, { content: editReplyContent });
            setReplies(replies.map(r => r.id === replyId ? res.data : r));
            setEditingReplyId(null);
            setEditReplyContent('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteReply = async (replyId) => {
        if (!window.confirm('Delete this reply?')) return;
        try {
            await API.delete(`/community/replies/${replyId}/`);
            setReplies(replies.filter(r => r.id !== replyId));
            setPost({ ...post, reply_count: post.reply_count - 1 });
        } catch (err) {
            console.error(err);
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

    const AuthorTag = ({ author }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD700, #FFA500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#0A0A0A', flexShrink: 0 }}>
                {author.username?.[0]?.toUpperCase()}
            </div>
            <span style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem' }}>{author.username}</span>
            {author.is_premium && (
                <span style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#0A0A0A', padding: '1px 7px', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.12em' }}>VERIFIED</span>
            )}
            {author.state && <span style={{ color: '#555555', fontSize: '0.78rem' }}>{author.state}</span>}
            <span style={{ color: '#333333', fontSize: '0.75rem', fontFamily: 'Rajdhani' }}>{author.rep_points} rep</span>
        </div>
    );

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

    if (!post) return (
        <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <p style={{ color: '#FF4444' }}>Post not found.</p>
            </div>
        </div>
    );

    return (
        <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 16px' }}>

                <Link to={`/community/${post.category_slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#AAAAAA', textDecoration: 'none', fontFamily: 'Rajdhani', fontSize: '0.9rem', marginBottom: '24px' }}>
                    <FiArrowLeft size={14} /> Back to {post.category_name}
                </Link>

                {/* Post */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, #1A1A1A, #111111)',
                        border: '1px solid rgba(255,215,0,0.2)',
                        padding: '28px', marginBottom: '24px',
                        position: 'relative', overflow: 'hidden',
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #FFD700, transparent)' }} />

                    {editingPost ? (
                        <form onSubmit={handleEditPost} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input className="sf-input" value={editPostForm.title} onChange={(e) => setEditPostForm({ ...editPostForm, title: e.target.value })} required />
                            <textarea className="sf-input" value={editPostForm.content} onChange={(e) => setEditPostForm({ ...editPostForm, content: e.target.value })} required rows={6} style={{ resize: 'vertical' }} />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button type="submit" className="btn-gold" style={{ padding: '8px 24px', fontSize: '0.85rem' }}>Save</button>
                                <button type="button" onClick={() => setEditingPost(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#AAAAAA', padding: '8px 24px', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h1 style={{ fontSize: '1.8rem', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.2 }}>
                                {post.title}
                                {post.is_edited && <span style={{ color: '#555555', fontSize: '0.75rem', fontWeight: 400, fontStyle: 'normal', marginLeft: '10px' }}>(edited)</span>}
                            </h1>

                            <div style={{ marginBottom: '20px' }}>
                                <AuthorTag author={post.author} />
                                <p style={{ color: '#444444', fontSize: '0.78rem', marginTop: '4px', marginLeft: '36px' }}>{formatDate(post.created_at)}</p>
                            </div>

                            <p style={{ color: '#CCCCCC', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-line', marginBottom: '24px' }}>{post.content}</p>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <button onClick={handleLikePost} disabled={likeLoading.post} style={{
                                        background: 'transparent', border: `1px solid ${post.is_liked ? 'rgba(255,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
                                        color: post.is_liked ? '#FF4444' : '#AAAAAA', padding: '6px 14px',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.82rem',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                    }}>
                                        <FiHeart size={13} fill={post.is_liked ? '#FF4444' : 'none'} /> {post.like_count}
                                    </button>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#555555', fontSize: '0.82rem' }}>
                                        <FiEye size={13} /> {post.views}
                                    </span>
                                </div>

                                {user && (user.username === post.author.username || user.is_superuser) && (
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => setEditingPost(true)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#AAAAAA', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                                            <FiEdit2 size={12} /> Edit
                                        </button>
                                        <button onClick={handleDeletePost} style={{ background: 'transparent', border: '1px solid rgba(255,68,68,0.3)', color: '#FF4444', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                                            <FiTrash2 size={12} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </motion.div>

                {/* Replies */}
                <h2 style={{ fontFamily: 'Rajdhani', fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '16px' }}>
                    <span style={{ color: '#FFD700' }}>{post.reply_count}</span> {post.reply_count === 1 ? 'Reply' : 'Replies'}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                    {replies.map((reply, index) => (
                        <motion.div
                            key={reply.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.04 }}
                            style={{
                                background: '#111111',
                                border: '1px solid rgba(255,215,0,0.06)',
                                padding: '16px 20px',
                            }}
                        >
                            <div style={{ marginBottom: '12px' }}>
                                <AuthorTag author={reply.author} />
                                <p style={{ color: '#444444', fontSize: '0.75rem', marginTop: '4px', marginLeft: '36px' }}>{formatDate(reply.created_at)}</p>
                            </div>

                            {editingReplyId === reply.id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <textarea
                                        className="sf-input"
                                        value={editReplyContent}
                                        onChange={(e) => setEditReplyContent(e.target.value)}
                                        rows={3}
                                        style={{ resize: 'vertical' }}
                                    />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleEditReply(reply.id)} className="btn-gold" style={{ padding: '6px 20px', fontSize: '0.82rem' }}>Save</button>
                                        <button onClick={() => setEditingReplyId(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#AAAAAA', padding: '6px 20px', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p style={{ color: '#CCCCCC', lineHeight: 1.7, fontSize: '0.9rem', whiteSpace: 'pre-line', marginBottom: '12px' }}>
                                        {reply.content}
                                        {reply.is_edited && <span style={{ color: '#555555', fontSize: '0.72rem', marginLeft: '8px' }}>(edited)</span>}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <button onClick={() => handleLikeReply(reply.id)} disabled={likeLoading[reply.id]} style={{
                                            background: 'transparent', border: `1px solid ${reply.is_liked ? 'rgba(255,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                            color: reply.is_liked ? '#FF4444' : '#AAAAAA', padding: '4px 12px',
                                            display: 'flex', alignItems: 'center', gap: '5px',
                                            fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
                                        }}>
                                            <FiHeart size={11} fill={reply.is_liked ? '#FF4444' : 'none'} /> {reply.like_count}
                                        </button>

                                        {user && (user.username === reply.author.username || user.is_superuser) && (
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button onClick={() => { setEditingReplyId(reply.id); setEditReplyContent(reply.content); }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#AAAAAA', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                                                    <FiEdit2 size={11} /> Edit
                                                </button>
                                                <button onClick={() => handleDeleteReply(reply.id)} style={{ background: 'transparent', border: '1px solid rgba(255,68,68,0.2)', color: '#FF4444', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
                                                    <FiTrash2 size={11} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Reply form */}
                {user ? (
                    <div style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.15)', padding: '20px' }}>
                        <h3 style={{ fontFamily: 'Rajdhani', fontSize: '1rem', marginBottom: '12px', fontStyle: 'italic' }}>
                            ADD <span style={{ color: '#FFD700' }}>REPLY</span>
                        </h3>
                        <form onSubmit={handleReply} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <textarea
                                className="sf-input"
                                placeholder="Write your reply..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                required
                                rows={4}
                                style={{ resize: 'vertical' }}
                            />
                            {replyError && <p className="error-msg">{replyError}</p>}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={submittingReply}
                                style={{
                                    background: '#FFD700', color: '#0A0A0A', border: 'none',
                                    padding: '10px 28px', fontFamily: 'Rajdhani', fontWeight: 700,
                                    fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content',
                                }}
                            >
                                <FiSend size={14} /> {submittingReply ? 'Posting...' : 'Post Reply'}
                            </motion.button>
                        </form>
                    </div>
                ) : (
                    <div style={{ background: '#111111', border: '1px solid rgba(255,215,0,0.1)', padding: '24px', textAlign: 'center' }}>
                        <p style={{ color: '#AAAAAA', marginBottom: '12px' }}>Login to join the discussion.</p>
                        <Link to="/login"><button className="btn-gold" style={{ padding: '10px 32px', fontSize: '0.9rem' }}>Login</button></Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostPage;