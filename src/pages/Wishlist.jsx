import React from 'react';
import { Heart, MapPin } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { mockListings } from '../data/listings';
import RoomCard from '../components/RoomCard';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { savedIds } = useWishlist();
  const saved = mockListings.filter(l => savedIds.includes(l.id));

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Heart size={28} fill="#ef4444" color="#ef4444" />
          Saved Rooms
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.9rem' }}>
          {saved.length === 0 ? 'No rooms saved yet.' : `${saved.length} room${saved.length !== 1 ? 's' : ''} saved`}
        </p>
      </div>

      {saved.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Heart size={56} color="var(--border-light)" style={{ marginBottom: '16px' }} />
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Your wishlist is empty</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Browse listings and tap the ❤️ to save rooms you like.</p>
          <Link to="/listings" className="btn-primary" style={{ padding: '12px 28px' }}>Browse Listings</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {saved.map(listing => (
            <RoomCard key={listing.id} {...listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
