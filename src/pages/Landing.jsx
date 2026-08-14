import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { FiShield, FiZap, FiUsers, FiTrendingUp } from 'react-icons/fi';

const TICKER_ITEMS = [
    { rank: '#1', name: 'ShadowKing_NG', game: 'Fortnite', kd: '4.2', state: 'Lagos' },
    { rank: '#2', name: 'ApexPredatorAbuja', game: 'Apex Legends', kd: '3.8', state: 'Abuja' },
    { rank: '#3', name: 'CODGodPH', game: 'COD Mobile', kd: '3.5', state: 'Port Harcourt' },
    { rank: '#4', name: 'FortKing_Kano', game: 'Fortnite', kd: '3.1', state: 'Kano' },
    { rank: '#5', name: 'NightOwl_Ibadan', game: 'Apex Legends', kd: '2.9', state: 'Ibadan' },
];

const GAME_CARDS = [
    {
        name: 'FORTNITE',
        tag: 'API Integration',
        desc: 'Auto stat sync via Epic Games API. Kills, wins and KD updated in real time.',
        color: '#7C3AED',
        glow: 'rgba(124, 58, 237, 0.15)',
        border: 'rgba(124, 58, 237, 0.4)',
    },
    {
        name: 'APEX LEGENDS',
        tag: 'API Integration',
        desc: 'Live stat sync via Apex Legends API. Track kills, wins and rank score.',
        color: '#DC2626',
        glow: 'rgba(220, 38, 38, 0.15)',
        border: 'rgba(220, 38, 38, 0.4)',
    },
    {
        name: 'COD MOBILE',
        tag: 'AI Verification',
        desc: 'Submit stats with AI screenshot verification for accuracy and fairness.',
        color: '#16A34A',
        glow: 'rgba(22, 163, 74, 0.15)',
        border: 'rgba(22, 163, 74, 0.4)',
    },
    {
        name: 'EFOOTBALL',
        tag: 'AI Verification',
        desc: 'Division 1 players only. Submit wins, draws and losses with AI screenshot verification.',
        color: '#0EA5E9',
        glow: 'rgba(14, 165, 233, 0.15)',
        border: 'rgba(14, 165, 233, 0.4)',
    },
];

const FEATURES = [
    { icon: <FiTrendingUp size={32} />, title: 'Live Leaderboard', desc: 'See who the best Nigerian players are across every supported game in real time.' },
    { icon: <FiZap size={32} />, title: 'AI Insights', desc: 'Get personalised coaching tips generated directly from your actual in-game stats.' },
    { icon: <FiUsers size={32} />, title: 'Nigerian Community', desc: 'Built exclusively for Nigerian gamers. Represent your state on the national board.' },
    { icon: <FiShield size={32} />, title: 'Verified Stats', desc: 'Every stat is either API verified or AI screenshot reviewed before going live.' },
];

const Landing = () => {
    const { user } = useAuth();
    const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];

    return (
        <div style={{ background: '#0A0A0A', minHeight: '100vh', overflowX: 'hidden' }}>
            <Navbar />

            {/* HERO */}
            <section className="mesh-bg" style={{
                minHeight: '92vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '80px 20px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Top gold line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }} />

                {/* Animated glow orbs */}
                <div style={{
                    position: 'absolute', top: '20%', left: '10%', width: '400px', height: '400px',
                    background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)',
                    borderRadius: '50%', animation: 'float 8s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute', bottom: '20%', right: '10%', width: '300px', height: '300px',
                    background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
                    borderRadius: '50%', animation: 'float 10s ease-in-out infinite reverse',
                }} />

                <div style={{ maxWidth: '860px', position: 'relative', zIndex: 1, width: '100%' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)',
                        padding: '6px 20px', marginBottom: '40px',
                        fontFamily: 'Rajdhani, sans-serif', fontSize: '0.8rem', fontWeight: 700,
                        letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFD700',
                    }}>
                        <span style={{ width: '6px', height: '6px', background: '#FFD700', borderRadius: '50%', animation: 'glint 2s ease-in-out infinite' }} />
                        Nigeria's #1 Gaming Stats Platform
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(3rem, 9vw, 7rem)',
                        lineHeight: 0.95,
                        marginBottom: '8px',
                        color: '#FFFFFF',
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 700,
                        fontStyle: 'italic',
                        letterSpacing: '-0.01em',
                    }}>
                        PROVE YOU'RE
                    </h1>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 9vw, 7rem)',
                        lineHeight: 0.95,
                        marginBottom: '32px',
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 700,
                        fontStyle: 'italic',
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        THE BEST
                    </h1>

                    <div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, #FFD700, #FFA500)', margin: '0 auto 32px' }} />

                    <p style={{
                        fontSize: '1.1rem', color: '#AAAAAA', lineHeight: 1.8,
                        maxWidth: '580px', margin: '0 auto 48px',
                    }}>
                        Track your stats across Fortnite, Apex Legends, COD Mobile and eFootball. Climb the Nigerian leaderboard. Get AI insights to dominate your competition.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {user ? (
                            <Link to="/dashboard"><button className="btn-gold" style={{ fontSize: '1.05rem', padding: '14px 44px' }}>Go to Dashboard</button></Link>
                        ) : (
                            <Link to="/register"><button className="btn-gold" style={{ fontSize: '1.05rem', padding: '14px 44px' }}>Get Started</button></Link>
                        )}
                        <Link to="/leaderboard"><button className="btn-outline-gold" style={{ fontSize: '1.05rem', padding: '14px 44px' }}>View Leaderboard</button></Link>
                    </div>
                </div>
            </section>

            {/* LIVE TICKER */}
            <div style={{ background: '#111111', borderTop: '1px solid rgba(255,215,0,0.15)', borderBottom: '1px solid rgba(255,215,0,0.15)', padding: '12px 0', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        flexShrink: 0, padding: '4px 16px', background: '#FFD700', color: '#0A0A0A',
                        fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '0.8rem',
                        letterSpacing: '0.15em', textTransform: 'uppercase', marginLeft: '20px',
                    }}>
                        LIVE
                    </div>
                    <div className="ticker-wrap" style={{ flex: 1 }}>
                        <div className="ticker-content">
                            {doubled.map((item, i) => (
                                <div key={i} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '0 40px', flexShrink: 0,
                                }}>
                                    <span style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem' }}>{item.rank}</span>
                                    <span style={{ color: '#FFFFFF', fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</span>
                                    <span style={{ color: '#AAAAAA', fontSize: '0.8rem' }}>{item.game}</span>
                                    <span style={{ color: '#FFD700', fontSize: '0.8rem' }}>KD {item.kd}</span>
                                    <span style={{ color: '#555555', fontSize: '0.8rem' }}>{item.state}</span>
                                    <span style={{ color: 'rgba(255,215,0,0.2)', fontSize: '0.8rem' }}>|</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* GAMES */}
            <section style={{ padding: '100px 20px', background: '#0D0D0D' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '12px', fontStyle: 'italic' }}>
                            SUPPORTED <span style={{ color: '#FFD700' }}>GAMES</span>
                        </h2>
                        <div style={{ width: '60px', height: '3px', background: '#FFD700', margin: '0 auto' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {GAME_CARDS.map((game) => (
                            <div key={game.name} style={{
                                background: `linear-gradient(135deg, #1A1A1A 0%, rgba(0,0,0,0.8) 100%)`,
                                border: `1px solid ${game.border}`,
                                padding: '32px',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                cursor: 'default',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = `0 20px 40px ${game.glow}`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            >
                                {/* Top accent */}
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${game.color}, transparent)` }} />
                                {/* Glow blob */}
                                <div style={{
                                    position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px',
                                    background: `radial-gradient(circle, ${game.glow} 0%, transparent 70%)`,
                                    borderRadius: '50%',
                                }} />

                                <div style={{
                                    display: 'inline-block', background: `${game.glow}`,
                                    border: `1px solid ${game.border}`, padding: '3px 12px',
                                    fontSize: '0.75rem', fontFamily: 'Rajdhani, sans-serif',
                                    fontWeight: 700, letterSpacing: '0.1em', color: game.color, marginBottom: '20px',
                                }}>
                                    {game.tag}
                                </div>

                                <h3 style={{ fontSize: '2rem', marginBottom: '12px', fontStyle: 'italic' }}>{game.name}</h3>
                                <p style={{ color: '#AAAAAA', lineHeight: 1.7, fontSize: '0.95rem' }}>{game.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES - Glassmorphism HUD */}
            <section style={{ padding: '100px 20px', background: '#111111', borderTop: '1px solid rgba(255,215,0,0.1)' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '12px', fontStyle: 'italic' }}>
                            WHY <span style={{ color: '#FFD700' }}>STATFORT</span>
                        </h2>
                        <div style={{ width: '60px', height: '3px', background: '#FFD700', margin: '0 auto' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                        {FEATURES.map((feature) => (
                            <div key={feature.title} className="glass" style={{
                                padding: '32px 24px',
                                textAlign: 'center',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                cursor: 'default',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(255,215,0,0.08)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            >
                                <div style={{ color: '#FFD700', marginBottom: '20px', animation: 'glint 3s ease-in-out infinite' }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{feature.title}</h3>
                                <p style={{ color: '#AAAAAA', fontSize: '0.9rem', lineHeight: 1.7 }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TOP PLAYER SPOTLIGHT */}
            <section style={{ padding: '100px 20px', background: '#0D0D0D' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ marginBottom: '48px' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '12px', fontStyle: 'italic' }}>
                            TOP PLAYER <span style={{ color: '#FFD700' }}>SPOTLIGHT</span>
                        </h2>
                        <div style={{ width: '60px', height: '3px', background: '#FFD700', margin: '0 auto 16px' }} />
                        <p style={{ color: '#AAAAAA' }}>The current leaders across all games. Your name could be here.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                        {TICKER_ITEMS.slice(0, 3).map((item, i) => (
                            <div key={i} className="glass" style={{
                                padding: '24px',
                                border: i === 0 ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,215,0,0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                {i === 0 && (
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #FFD700, #FFA500)' }} />
                                )}
                                <div style={{
                                    fontSize: i === 0 ? '2.5rem' : '1.8rem',
                                    fontFamily: 'Rajdhani', fontWeight: 700, fontStyle: 'italic',
                                    color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32',
                                    marginBottom: '8px',
                                }}>
                                    {item.rank}
                                </div>
                                <p style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{item.name}</p>
                                <p style={{ color: '#AAAAAA', fontSize: '0.85rem', marginBottom: '4px' }}>{item.game}</p>
                                <p style={{ color: '#FFD700', fontFamily: 'Rajdhani', fontWeight: 700 }}>KD {item.kd}</p>
                                <p style={{ color: '#555555', fontSize: '0.8rem' }}>{item.state}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <Link to="/leaderboard">
                            <button className="btn-outline-gold" style={{ fontSize: '0.95rem', padding: '12px 36px' }}>
                                View Full Leaderboard
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{
                padding: '120px 20px',
                textAlign: 'center',
                background: 'linear-gradient(180deg, #111111 0%, #0A0A0A 100%)',
                borderTop: '1px solid rgba(255,215,0,0.1)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '600px', height: '600px',
                    background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)',
                    borderRadius: '50%', pointerEvents: 'none',
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '16px', fontStyle: 'italic', lineHeight: 1 }}>
                        READY TO <span style={{
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>DOMINATE</span>?
                    </h2>
                    <div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, #FFD700, #FFA500)', margin: '0 auto 32px' }} />
                    <p style={{ color: '#AAAAAA', marginBottom: '48px', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 48px' }}>
                        Join Nigerian gamers already climbing the StatFort leaderboard.
                    </p>
                    {user ? (
                        <Link to="/dashboard"><button className="btn-gold" style={{ fontSize: '1.15rem', padding: '16px 56px' }}>Go to Dashboard</button></Link>
                    ) : (
                        <Link to="/register"><button className="btn-gold" style={{ fontSize: '1.15rem', padding: '16px 56px' }}>Create Free Account</button></Link>
                    )}
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{
                    background: '#080808',
                    borderTop: '1px solid rgba(255,215,0,0.1)',
                    padding: '40px 20px',
                    textAlign: 'center',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                        <img src="/statfort-logo.png" alt="StatFort" style={{ height: '32px', width: '32px', objectFit: 'contain' }} />
                        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#FFD700', letterSpacing: '0.1em' }}>
                            STAT<span style={{ color: '#FFFFFF' }}>FORT</span>
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Leaderboard', path: '/leaderboard' },
                            { label: 'Community', path: '/community' },
                            { label: 'Elite Tier', path: '/elite' },
                            { label: 'Contact & Support', path: '/contact' },
                        ].map((link) => (
                            <a key={link.label} href={link.path} style={{ color: '#555555', fontSize: '0.85rem', fontFamily: 'Rajdhani', letterSpacing: '0.05em', textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
                            onMouseLeave={e => e.currentTarget.style.color = '#555555'}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <p style={{ color: '#333333', fontSize: '0.82rem', fontFamily: 'Rajdhani', letterSpacing: '0.05em' }}>
                        STATFORT &copy; {new Date().getFullYear()} — BUILT FOR NIGERIAN GAMERS
                    </p>
                </footer>
        </div>
    );
};

export default Landing;