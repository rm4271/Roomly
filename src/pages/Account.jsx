import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Save, ArrowLeft, GraduationCap, Building2, Mail, Phone, MapPin } from 'lucide-react';

const Account = () => {
  const { user, isLoggedIn, login } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'student',
    college: user?.college || '',
    avatar: user?.avatar || null,
  });
  const [saved, setSaved] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '48px 40px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '12px' }}>Log in to view your account</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>You need to be logged in to access account settings.</p>
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '14px 32px' }}>
            Log In
          </button>
        </div>
      </div>
    );
  }

  const getInitial = () => {
    if (form.name) return form.name.charAt(0).toUpperCase();
    return 'U';
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    login({
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      college: form.college,
      avatar: form.avatar,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '80px', maxWidth: '640px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          marginBottom: '24px',
          padding: 0,
        }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 style={{ fontSize: '2rem', marginBottom: '32px' }}>My Account</h1>

      {/* Success toast */}
      {saved && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '24px',
          background: '#10b981',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '12px',
          fontSize: '0.9rem',
          fontWeight: 500,
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          animation: 'fadeIn 0.3s ease'
        }}>
          ✓ Changes saved successfully
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Avatar Section */}
        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Profile Photo</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div
              onClick={handleAvatarClick}
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                background: form.avatar ? `url(${form.avatar}) center/cover` : 'var(--accent-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '2rem',
                cursor: 'pointer',
                position: 'relative',
                flexShrink: 0,
                transition: 'opacity 0.2s ease',
                border: '3px solid var(--border-light)'
              }}
            >
              {!form.avatar && getInitial()}
              <div style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '2px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Camera size={14} color="var(--text-secondary)" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            <div>
              <p style={{ fontWeight: 500, marginBottom: '4px' }}>Upload a photo</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Click the avatar to upload a new profile picture. JPG or PNG, max 2MB.</p>
              {form.avatar && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, avatar: null })}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    padding: 0,
                    marginTop: '8px',
                    fontWeight: 500
                  }}
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Personal Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Full Name</label>
              <input
                type="text"
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Mail size={14} /> Email
              </label>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Phone size={14} /> Phone Number
              </label>
              <input
                type="tel"
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>
        </div>

        {/* Role & College */}
        <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Account Type & College</h3>

          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>I am a...</label>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'student' })}
              style={{
                flex: 1,
                padding: '16px',
                borderRadius: '12px',
                border: form.role === 'student' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                background: form.role === 'student' ? 'rgba(17, 24, 39, 0.03)' : 'var(--bg-card)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                fontSize: '0.95rem'
              }}
            >
              <GraduationCap size={18} />
              Student
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'owner' })}
              style={{
                flex: 1,
                padding: '16px',
                borderRadius: '12px',
                border: form.role === 'owner' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                background: form.role === 'owner' ? 'rgba(17, 24, 39, 0.03)' : 'var(--bg-card)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                fontSize: '0.95rem'
              }}
            >
              <Building2 size={18} />
              Property Owner
            </button>
          </div>

          {form.role === 'student' && (
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <MapPin size={14} /> Your College / University
              </label>
              <input
                type="text"
                className="input-field"
                value={form.college}
                onChange={(e) => setForm({ ...form, college: e.target.value })}
                placeholder="e.g. BITS Pilani"
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                This helps us show you rooms near your campus.
              </p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1rem' }}>
          <Save size={18} />
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Account;
