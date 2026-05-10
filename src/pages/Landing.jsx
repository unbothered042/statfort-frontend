import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { FiTrendingUp, FiUsers, FiZap, FiShield } from 'react-icons/fi';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="page-container">
            <Navbar />

            {/* Hero */}
            <section style={{
                minHeight: '90vh', display: 'flex', alignItems: 'center',
                textAlign: 'center', padding: '80px 20px', position: 'relative', overflow: 'hidden',
                background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.06) 0%, transparent 70%)',
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }} />
                <Container>
                    <div style={{
                        display: 'inline-block', background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.2)',
                        padding: '6px 20px', marginBottom: '32px', fontFamily: 'Rajdhani, sans-serif',
                        fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FFD700',
                    }}>
                        Nigeria's #1 Gaming Stats Platform
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', lineHeight: 1, marginBottom: '24px', color: '#FFFFFF' }}>
                        PROVE YOU'RE THE <br /><span style={{ color: '#FFD700' }}>BEST</span>
                    </h1>
                    <div className="gold-line-center" style={{ marginBottom: '24px' }} />
                    <p style={{ fontSize: '1.1rem', color: '#AAAAAA', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 48px' }}>
                        Track your stats across Fortnite, Apex Legends and COD Mobile. Climb the Nigerian leaderboard. Get AI insights to level up your game.
                    </p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        {user ? (
                            <Link to="/dashboard"><button className="btn-gold" style={{ fontSize: '1rem', padding: '14px 40px' }}>Go to Dashboard</button></Link>
                        ) : (
                            <Link to="/register"><button className="btn-gold" style={{ fontSize: '1rem', padding: '14px 40px' }}>Get Started</button></Link>
                        )}
                        <Link to="/leaderboard"><button className="btn-outline-gold" style={{ fontSize: '1rem', padding: '14px 40px' }}>View Leaderboard</button></Link>
                    </div>
                </Container>
            </section>

            {/* Games */}
            <section style={{ padding: '80px 20px', background: '#111111', borderTop: '1px solid rgba(255,215,0,0.2)' }}>
                <Container>
                    <div className="text-center mb-5">
                        <h2 style={{ fontSize: '2.5rem' }}>SUPPORTED <span style={{ color: '#FFD700' }}>GAMES</span></h2>
                        <div className="gold-line-center" />
                    </div>
                    <Row className="g-4">
                        {[
                            { name: 'FORTNITE', desc: 'Automatic stat sync via Epic Games API. Kills, wins and KD ratio updated in real time.', tag: 'API Integration' },
                            { name: 'APEX LEGENDS', desc: 'Automatic stat sync via Apex Legends API. Track your kills, wins and rank score.', tag: 'API Integration' },
                            { name: 'COD MOBILE', desc: 'Submit your stats with AI-powered screenshot verification for accuracy and fairness.', tag: 'AI Verification' },
                        ].map((game) => (
                            <Col key={game.name} md={4}>
                                <div className="sf-card h-100" style={{ position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#FFD700' }} />
                                    <div style={{
                                        display: 'inline-block', background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.2)',
                                        padding: '3px 12px', fontSize: '0.75rem', fontFamily: 'Rajdhani, sans-serif',
                                        fontWeight: 600, letterSpacing: '0.1em', color: '#FFD700', marginBottom: '16px',
                                    }}>
                                        {game.tag}
                                    </div>
                                    <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{game.name}</h3>
                                    <p style={{ color: '#AAAAAA', lineHeight: 1.6 }}>{game.desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Features */}
            <section style={{ padding: '80px 20px' }}>
                <Container>
                    <div className="text-center mb-5">
                        <h2 style={{ fontSize: '2.5rem' }}>WHY <span style={{ color: '#FFD700' }}>STATFORT</span></h2>
                        <div className="gold-line-center" />
                    </div>
                    <Row className="g-4">
                        {[
                            { icon: <FiTrendingUp size={28} />, title: 'Live Leaderboard', desc: 'See who the best Nigerian players are across every supported game.' },
                            { icon: <FiZap size={28} />, title: 'AI Insights', desc: 'Get personalised coaching tips generated from your actual stats.' },
                            { icon: <FiUsers size={28} />, title: 'Nigerian Community', desc: 'Built exclusively for Nigerian gamers. Represent your state.' },
                            { icon: <FiShield size={28} />, title: 'Verified Stats', desc: 'Every stat is either API verified or AI screenshot reviewed.' },
                        ].map((feature) => (
                            <Col key={feature.title} md={3} sm={6}>
                                <div className="text-center p-3">
                                    <div style={{ color: '#FFD700', marginBottom: '16px' }}>{feature.icon}</div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{feature.title}</h3>
                                    <p style={{ color: '#AAAAAA', fontSize: '0.9rem', lineHeight: 1.6 }}>{feature.desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* CTA */}
            <section style={{ padding: '100px 20px', textAlign: 'center', background: '#111111', borderTop: '1px solid rgba(255,215,0,0.2)' }}>
                <Container>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '16px' }}>READY TO <span style={{ color: '#FFD700' }}>DOMINATE</span>?</h2>
                    <div className="gold-line-center" style={{ marginBottom: '32px' }} />
                    <p style={{ color: '#AAAAAA', marginBottom: '40px', fontSize: '1.05rem' }}>Join Nigerian gamers already on StatFort.</p>
                    {user ? (
                        <Link to="/dashboard"><button className="btn-gold" style={{ fontSize: '1.1rem', padding: '16px 48px' }}>Go to Dashboard</button></Link>
                    ) : (
                        <Link to="/register"><button className="btn-gold" style={{ fontSize: '1.1rem', padding: '16px 48px' }}>Create Free Account</button></Link>
                    )}
                </Container>
            </section>

            <footer style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,215,0,0.2)', padding: '32px 20px', textAlign: 'center', color: '#AAAAAA', fontSize: '0.85rem', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                STATFORT &copy; {new Date().getFullYear()} — BUILT FOR NIGERIAN GAMERS
            </footer>
        </div>
    );
};

export default Landing;