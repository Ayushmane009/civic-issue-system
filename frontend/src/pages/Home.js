import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Camera, AlertCircle, MessageCircle, ArrowRight, Shield, Zap, Users } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    { icon: MapPin, title: 'Pin Location', desc: 'Mark exact spots on the map for rapid response from authorities.', color: '#6366f1' },
    { icon: Camera, title: 'Photo Evidence', desc: 'Upload images as proof — a picture is worth a thousand reports.', color: '#10b981' },
    { icon: AlertCircle, title: 'Real-time Tracking', desc: 'Follow your issue from Pending → In Progress → Resolved.', color: '#f59e0b' },
    { icon: MessageCircle, title: 'Community Chat', desc: 'Comment and collaborate with neighbors and local officials.', color: '#3b82f6' },
  ];

  const steps = [
    { num: '01', title: 'Spot an Issue', desc: 'See a pothole, broken light, or waste dump? Open NAGAR-SATHI.' },
    { num: '02', title: 'Report It', desc: 'Snap a photo, pin the location, and describe the problem.' },
    { num: '03', title: 'Track Progress', desc: 'Get live updates as the department takes action on your report.' },
  ];

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <section style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        position: 'relative',
        textAlign: 'center',
      }}>
        {/* Glowing orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '15%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15, transparent)',
          borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12), transparent)',
          borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }} className="animate-fadeIn">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '8px 18px', borderRadius: '999px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            fontSize: '0.85rem', color: 'var(--primary-light)',
            marginBottom: '24px', fontWeight: 600,
          }}>
            <Zap size={14} />
            Making cities smarter, one report at a time
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '24px',
          }}>
            Report Civic Issues
            <br />
            <span className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
              in Your Neighborhood
            </span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--gray-light)',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            Streetlights out? Potholes everywhere? Garbage piling up?
            Report it, track it, and watch your community take action.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to={user ? '/dashboard' : '/register'}
              className="btn btn-primary btn-lg"
              style={{ textDecoration: 'none', fontSize: '1.1rem' }}
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/issues"
              className="btn btn-outline btn-lg"
              style={{ textDecoration: 'none', fontSize: '1.1rem' }}
            >
              View Issues
            </Link>
          </div>

          {/* Trust Badges */}
          <div style={{
            display: 'flex', gap: '32px', justifyContent: 'center',
            marginTop: '48px', flexWrap: 'wrap',
          }}>
            {[
              { value: '500+', label: 'Issues Reported' },
              { value: '85%', label: 'Resolved' },
              { value: '24h', label: 'Avg Response' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }} className="text-gradient">{stat.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '80px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
            Simple. Fast. <span className="text-gradient">Effective.</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--gray-light)', maxWidth: '600px', margin: '0 auto' }}>
            Report civic problems instantly and track their resolution with responsible departments.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          {features.map((feat, i) => (
            <div
              key={i}
              className="glass-card glass-card-hover"
              style={{
                padding: '32px',
                textAlign: 'center',
                animation: `slideUp 0.5s ease-out ${i * 0.1}s both`,
              }}
            >
              <div style={{
                width: '64px', height: '64px',
                borderRadius: '18px',
                background: `${feat.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <feat.icon size={28} style={{ color: feat.color }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>{feat.title}</h3>
              <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: '80px 24px',
        background: 'rgba(255, 255, 255, 0.02)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
              How It <span className="text-gradient">Works</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
          }}>
            {steps.map((step, i) => (
              <div key={i} style={{
                position: 'relative',
                padding: '32px 24px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255, 255, 255, 0.03)',
              }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 900,
                  opacity: 0.08,
                  position: 'absolute',
                  top: '12px', right: '20px',
                  lineHeight: 1,
                }}>{step.num}</div>
                <div style={{
                  width: '40px', height: '40px',
                  borderRadius: '12px', background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.9rem',
                  marginBottom: '16px',
                }}>{step.num}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '20px' }}>
            Ready to make a <span className="text-gradient">difference</span>?
          </h2>
          <p style={{ color: 'var(--gray-light)', fontSize: '1.1rem', marginBottom: '32px' }}>
            Join hundreds of citizens already making their neighborhoods better.
          </p>
          <Link
            to={user ? '/dashboard' : '/register'}
            className="btn btn-primary btn-lg"
            style={{ textDecoration: 'none' }}
          >
            Start Reporting Today
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        borderTop: '1px solid var(--glass-border)',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', marginBottom: '12px',
        }}>
          <MapPin size={18} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 700, fontSize: '1.1rem' }} className="text-gradient">NAGAR-SATHI</span>
        </div>
        <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
          © 2026 NAGAR-SATHI. Building better communities together.
        </p>
      </footer>
    </div>
  );
};

export default Home;
