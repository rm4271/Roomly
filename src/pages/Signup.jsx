import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, GraduationCap, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { signupWithEmail, updateProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!role) return;
    setLoading(true); setError('');
    const { data, error: signupErr } = await signupWithEmail(email, password);
    if (signupErr) { setError(signupErr.message); setLoading(false); return; }

    // Profile will be auto-created by AuthContext; update name + role
    if (data?.user) {
      await updateProfile({ name, role, college: 'NSEC, Garia' });
    }
    setLoading(false);
    setSuccess(true);
  };

  if (success) return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '48px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📬</div>
        <h2 style={{ marginBottom: '12px' }}>Check your email!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
          We've sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back and log in.
        </p>
        <Link to="/login" className="btn-primary" style={{ padding: '12px 28px' }}>Go to Login</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '48px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Create your account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{step === 1 ? 'Fill in your details' : 'How will you use Roomly?'}</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ flex: 1, height: '4px', background: i <= step ? 'var(--accent-primary)' : 'var(--border-light)', borderRadius: '2px', transition: 'background 0.3s' }}></div>
          ))}
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#dc2626', fontSize: '0.88rem' }}>
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={e => { e.preventDefault(); if (name && email && password) setStep(2); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Full name</label>
              <input type="text" className="input-field" placeholder="Rahul Das" value={name} onChange={e => setName(e.target.value)} autoFocus required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email address</label>
              <input type="email" className="input-field" placeholder="rahul@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password (min 6 characters)</label>
              <input type="password" className="input-field" placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', marginTop: '4px' }}>
              Continue <ArrowRight size={18} />
            </button>
          </form>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { val: 'student', Icon: GraduationCap, title: "I'm a Student", desc: 'Looking for rooms, PGs, or a roommate near my college' },
              { val: 'owner', Icon: Building2, title: "I'm a Property Owner", desc: 'I want to list my property and find tenants' },
            ].map(({ val, Icon, title, desc }) => (
              <button key={val} onClick={() => setRole(val)} style={{ padding: '22px', borderRadius: '16px', border: role === val ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)', background: role === val ? 'var(--bg-primary)' : 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left', transition: 'all 0.2s' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: role === val ? 'var(--accent-primary)' : 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                  <Icon size={22} color={role === val ? 'var(--bg-card)' : 'var(--text-secondary)'} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>{desc}</div>
                </div>
              </button>
            ))}

            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1, padding: '13px', justifyContent: 'center' }}>Back</button>
              <button onClick={handleSubmit} className="btn-primary" style={{ flex: 2, padding: '13px', opacity: role && !loading ? 1 : 0.5 }} disabled={!role || loading}>
                {loading ? 'Creating...' : 'Create Account'} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
