import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create the profile row for a given Supabase auth user
  const fetchProfile = async (authUser) => {
    if (!authUser) { setProfile(null); setUser(null); return; }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (data) {
      setProfile(data);
      setUser({ ...authUser, ...data });
    } else {
      // Profile doesn't exist yet — create a default one
      const newProfile = {
        id: authUser.id,
        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email || '',
        phone: authUser.phone || '',
        role: 'student',
        college: 'NSEC, Garia',
        avatar_url: authUser.user_metadata?.avatar_url || null,
      };
      const { data: created } = await supabase.from('profiles').insert(newProfile).select().single();
      setProfile(created || newProfile);
      setUser({ ...authUser, ...(created || newProfile) });
    }
    setLoading(false);
  };

  useEffect(() => {
    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session?.user ?? null);
      if (!session) setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user ?? null);
      if (!session) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Auth methods ──────────────────────────────────────────────

  const loginWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/listings' },
    });

  const loginWithEmail = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signupWithEmail = (email, password) =>
    supabase.auth.signUp({ email, password });

  const sendOTP = (phone) =>
    supabase.auth.signInWithOtp({ phone: `+91${phone}` });

  const verifyOTP = (phone, token) =>
    supabase.auth.verifyOtp({ phone: `+91${phone}`, token, type: 'sms' });

  const logout = () => supabase.auth.signOut();

  // ── Profile update ────────────────────────────────────────────

  const updateProfile = async (updates) => {
    if (!user) return { error: 'Not logged in' };
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (data) {
      setProfile(data);
      setUser(prev => ({ ...prev, ...data }));
    }
    return { data, error };
  };

  // Simulated login for demo/testing (remove once full auth is verified)
  const login = (userData) => {
    setUser(userData);
    setProfile(userData);
  };
  const signup = (userData) => {
    setUser(userData);
    setProfile(userData);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoggedIn: !!user,
      loading,
      login,
      signup,
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      sendOTP,
      verifyOTP,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
