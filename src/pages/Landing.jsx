import React from 'react';
import { Search, MapPin, Users, ArrowRight, BadgeCheck, Calculator, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div>
      {/* Hero */}
      <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '820px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.08)', color: '#065f46', padding: '6px 16px', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '24px', border: '1px solid rgba(16,185,129,0.2)' }}>
            🏠 Student Room Rentals Near NSEC, Kolkata
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', marginBottom: '20px', lineHeight: 1.08 }}>
            Find Your Room
            <br /><span style={{ color: '#10b981' }}>Near Campus</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 40px auto', lineHeight: 1.65 }}>
            Browse verified PGs and rooms near NSEC Garia. Find a vacant room, or find a roommate — all in one place.
          </p>

          {/* Search bar */}
          <div style={{ display: 'flex', padding: '8px', borderRadius: '16px', maxWidth: '560px', margin: '0 auto 48px', background: 'var(--bg-card)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 14px', borderRight: '1px solid var(--border-light)' }}>
              <MapPin size={18} color="var(--text-secondary)" style={{ marginRight: '10px', flexShrink: 0 }} />
              <input type="text" placeholder="Search area or college..." defaultValue="NSEC, Garia, Kolkata" style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.95rem', width: '100%', outline: 'none' }} />
            </div>
            <Link to="/listings" className="btn-primary" style={{ marginLeft: '8px', padding: '11px 24px', fontSize: '0.95rem' }}>
              <Search size={18} /> Search
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
            {[
              { val: '50k+', label: 'Active Listings' },
              { val: '120', label: 'Colleges' },
              { val: '4.9★', label: 'Student Rating' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#10b981' }}>{s.val}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features strip */}
      <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.08)', color: '#065f46', padding: '6px 16px', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 600, marginBottom: '16px', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Users size={14} /> Flagship Feature
            </div>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Find a Roommate 🤝</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
              Already have a room but want to split rent? Or looking to join someone who has a place? Roomly makes it easy.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', maxWidth: '900px', margin: '0 auto 40px' }}>
            {[
              { icon: '🏠', title: 'List Your Room', desc: 'Mark your room as "Looking for Roommate" so students nearby can find you.' },
              { icon: '🔍', title: 'Filter & Match', desc: 'Filter by distance, budget, and lifestyle preferences to find your ideal roommate.' },
              { icon: '💬', title: 'Chat on WhatsApp', desc: 'Contact the current tenant directly on WhatsApp to discuss rent and move-in.' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: '24px' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/listings" className="btn-primary" style={{ padding: '13px 28px', fontSize: '0.95rem' }}>
              Browse Roommate Listings <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* More features */}
      <div style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '36px' }}>Everything you need</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { icon: <BadgeCheck size={22} color="#3b82f6" />, title: 'Verified Listings', desc: 'Listings reviewed and marked Verified by our team for your safety.' },
              { icon: <Heart size={22} color="#ef4444" />, title: 'Wishlist', desc: 'Save rooms you like and come back to them anytime.' },
              { icon: <Calculator size={22} color="#10b981" />, title: 'Rent Split Calculator', desc: 'Instantly see per-person rent when sharing with roommates.' },
              { icon: <MapPin size={22} color="#8b5cf6" />, title: 'Distance Filter', desc: 'Filter by walking distance from your college for convenience.' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: '22px' }}>
                <div style={{ marginBottom: '10px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.55 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
