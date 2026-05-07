import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiTrendingUp, FiUsers, FiZap, FiShield } from 'react-icons/fi';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="page-container">
            <Navbar />

            <section style={{
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '80px 40px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                }} />

                <div style={{ maxWidth: '800px', position: 'relative' }}>
                    <div style={{
                        display: 'inline-block',
                        background: 'var(--gold-glow)',
                        border: '1px solid var(--border)',
                        padding: '6px 20px',
                        marginBottom: '32px',
                        fontFamily: 'Rajdhani, sans-serif',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--gold)',
                    }}>
                        Nigeria's #1 Gaming Stats Platform
                    </div>

                    <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1, marginBottom: '24px', color: 'var(--text)' }}>
                        PROVE YOU'RE THE <br />
                        <span style={{ color: 'var(--gold)' }}>BEST</span>
                    </h1>

                    <div className="gold-line" style={{ margin: '0 auto 24px' }} />

                    <p style={{
                        fontSize: '1.1rem',
                        color: 'var(--text-dim)',
                        lineHeight: 1.7,
                        maxWidth: '560px',
                        margin: '0 auto 48px',
                    }}>
                        Track your stats across Fortnite and COD Mobile. Climb the Nigerian leaderboard. Get AI insights to level up your game.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {user ? (
                            <Link to="/dashboard">
                                <button className="btn-gold" style={{ fontSize: '1rem', padding: '14px 40px' }}>
                                    Go to Dashboard
                                </button>
                            </Link>
                        ) : (
                            <Link to="/register">
                                <button className="btn-gold" style={{ fontSize: '1rem', padding: '14px 40px' }}>
                                    Get Started
                                </button>
                            </Link>
                        )}
                        <Link to="/leaderboard">
                            <button className="btn-outline" style={{ fontSize: '1rem', padding: '14px 40px' }}>
                                View Leaderboard
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <section style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>SUPPORTED <span style={{ color: 'var(--gold)' }}>GAMES</span></h2>
                    <div className="gold-line" style={{ margin: '0 auto' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {[
                        { name: 'FORTNITE', desc: 'Automatic stat sync via Epic Games API. Your kills, wins and KD ratio updated in real time.', tag: 'API Integration' },
                        { name: 'COD MOBILE', desc: 'Submit your stats with AI-powered screenshot verification for accuracy and fairness.', tag: 'AI Verification' },
                    ].map((game) => (
                        <div key={game.name} className="card" style={{ position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--gold)' }} />
                            <div style={{
                                display: 'inline-block',
                                background: 'var(--gold-glow)',
                                border: '1px solid var(--border)',
                                padding: '3px 12px',
                                fontSize: '0.75rem',
                                fontFamily: 'Rajdhani, sans-serif',
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                color: 'var(--gold)',
                                marginBottom: '16px',
                            }}>
                                {game.tag}
                            </div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{game.name}</h3>
                            <p style={{ color: 'var(--text-dim)', lineHeight: 1.6 }}>{game.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ padding: '80px 40px', background: 'var(--dark)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>WHY <span style={{ color: 'var(--gold)' }}>STATFORT</span></h2>
                        <div className="gold-line" style={{ margin: '0 auto' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
                        {[
                            { icon: <FiTrendingUp size={28} />, title: 'Live Leaderboard', desc: 'See who the best Nigerian players are across every supported game.' },
                            { icon: <FiZap size={28} />, title: 'AI Insights', desc: 'Get personalised coaching tips generated from your actual stats.' },
                            { icon: <FiUsers size={28} />, title: 'Nigerian Community', desc: 'Built exclusively for Nigerian gamers. Represent your city.' },
                            { icon: <FiShield size={28} />, title: 'Verified Stats', desc: 'Every stat is either API verified or AI screenshot reviewed.' },
                        ].map((feature) => (
                            <div key={feature.title} style={{ textAlign: 'center' }}>
                                <div style={{ color: 'var(--gold)', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{feature.icon}</div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{feature.title}</h3>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.6 }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: '100px 40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>READY TO <span style={{ color: 'var(--gold)' }}>DOMINATE</span>?</h2>
                <div className="gold-line" style={{ margin: '0 auto 32px' }} />
                <p style={{ color: 'var(--text-dim)', marginBottom: '40px', fontSize: '1.05rem' }}>Join thousands of Nigerian gamers already on StatFort.</p>
                {!user && (
                    <Link to="/register">
                        <button className="btn-gold" style={{ fontSize: '1.1rem', padding: '16px 48px' }}>Create Free Account</button>
                    </Link>
                )}
                {user && (
                    <Link to="/dashboard">
                        <button className="btn-gold" style={{ fontSize: '1.1rem', padding: '16px 48px' }}>Go to Dashboard</button>
                    </Link>
                )}
            </section>

            <footer style={{
                background: 'var(--dark)',
                borderTop: '1px solid var(--border)',
                padding: '32px 40px',
                textAlign: 'center',
                color: 'var(--text-dim)',
                fontSize: '0.85rem',
                fontFamily: 'Rajdhani, sans-serif',
                letterSpacing: '0.05em',
            }}>
                STATFORT &copy; {new Date().getFullYear()} — BUILT FOR NIGERIAN GAMERS
            </footer>
        </div>
    );
};

export default Landing;