import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};

export const WishlistProvider = ({ children }) => {
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('roomly_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('roomly_wishlist', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggle = (id) => {
    setSavedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const isSaved = (id) => savedIds.includes(id);

  return (
    <WishlistContext.Provider value={{ savedIds, toggle, isSaved }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
