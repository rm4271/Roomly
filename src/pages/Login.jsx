import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
  </svg>
);

const Login = () => {
  const [method, setMethod] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginWithGoogle, loginWithEmail, sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError('');
    const { error } = await loginWithGoogle();
    if (error) setError(error.message);
    // redirect handled by Supabase OAuth
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true); setError('');
    const { error } = await loginWithEmail(email, password);
    setLoading(false);
    if (error) setError(error.message);
    else navigate('/listings');
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true); setError('');
    const { error } = await sendOTP(phone);
    setLoading(false);
    if (error) setError(error.message);
    else setOtpSent(true);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true); setError('');
    const { error } = await verifyOTP(phone, otp);
    setLoading(false);
    if (error) setError(error.message);
    else navigate('/listings');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '48px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Log in to your Roomly account</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#dc2626', fontSize: '0.88rem' }}>
            {error}
          </div>
        )}

        {/* Google */}
        <button onClick={handleGoogleLogin} disabled={loading}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1rem', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '16px', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-primary)'; e.currentTarget.style.borderColor = 'var(--text-secondary)'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
        >
          <GoogleIcon /> Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
        </div>

        {/* Method selector */}
        {!method && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => setMethod('email')} className="btn-outline" style={{ width: '100%', padding: '14px', justifyContent: 'center' }}>
              <Mail size={18} /> Continue with Email
            </button>
            <button onClick={() => setMethod('phone')} className="btn-outline" style={{ width: '100%', padding: '14px', justifyContent: 'center' }}>
              <Phone size={18} /> Continue with Phone
            </button>
          </div>
        )}

        {/* Email form */}
        {method === 'email' && (
          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email address</label>
              <input type="email" className="input-field" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} className="input-field" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: '48px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'} <ArrowRight size={18} />
            </button>
            <button type="button" onClick={() => { setMethod(null); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
              ← Other options
            </button>
          </form>
        )}

        {/* Phone form */}
        {method === 'phone' && (
          <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Phone number</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="input-field" style={{ width: '70px', flexShrink: 0, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>+91</div>
                <input type="tel" className="input-field" placeholder="98765 43210" value={phone} onChange={e => setPhone(e.target.value)} disabled={otpSent} autoFocus />
              </div>
            </div>
            {otpSent && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter OTP</label>
                <input type="text" className="input-field" placeholder="6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} autoFocus />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '8px' }}>Code sent to +91 {phone}</p>
              </div>
            )}
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Please wait...' : otpSent ? 'Verify & Log In' : 'Send OTP'} <ArrowRight size={18} />
            </button>
            <button type="button" onClick={() => { setMethod(null); setOtpSent(false); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
              ← Other options
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-light)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
