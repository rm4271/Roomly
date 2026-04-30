import React from 'react';
import { MapPin, Star, Users, Navigation, Heart, BadgeCheck, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const RoomCard = ({ id, images, title, price, distance, rating, isOccupied, lookingForRoommate, postedByRole, address, verified, availableFrom, amenities = [] }) => {
  const navigate = useNavigate();
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(id);

  const mapsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : '#';

  const image = images?.[0] || '/assets/room_interior.png';

  const handleCardClick = (e) => {
    if (e.target.closest('[data-external]') || e.target.closest('[data-wishlist]')) return;
    navigate(`/room/${id}`);
  };

  const availableDate = availableFrom
    ? new Date(availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div onClick={handleCardClick} style={{ display: 'block', cursor: 'pointer' }}>
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {/* Image */}
        <div className="card-image-container" style={{ borderRadius: '16px 16px 0 0', margin: 0, height: '200px', flexShrink: 0 }}>
          <img src={image} alt={title} />

          {/* Wishlist heart */}
          <button
            data-wishlist="true"
            onClick={(e) => { e.stopPropagation(); toggle(id); }}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'var(--bg-card)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-md)', transition: 'transform 0.15s ease'
            }}
          >
            <Heart size={16} fill={saved ? '#ef4444' : 'none'} color={saved ? '#ef4444' : 'var(--text-secondary)'} />
          </button>

          {/* Roommate badge */}
          {lookingForRoommate && (
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: '#10b981', color: '#fff',
              padding: '4px 10px', borderRadius: '20px',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '0.72rem', fontWeight: 600, boxShadow: 'var(--shadow-sm)',
            }}>
              <Users size={12} /> Roommate Wanted
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px' }}>
          {/* Title row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.3 }}>{title}</h3>
            <div style={{ fontFamily: 'var(--font-heading)', color: '#10b981', fontWeight: 700, fontSize: '1.05rem', whiteSpace: 'nowrap' }}>
              ₹{price.toLocaleString('en-IN')}<span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/mo</span>
            </div>
          </div>

          {/* Verified + Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.82rem', fontWeight: 600, color: '#b45309' }}>
              <Star size={13} fill="#f59e0b" color="#f59e0b" />
              {Number(rating).toFixed(1)}
            </div>
            {verified && (
              <span className="verified-badge">
                <BadgeCheck size={12} /> Verified
              </span>
            )}
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '6px', fontWeight: 500 }}>
              {postedByRole === 'student' ? '🎓 Student' : '🏠 Owner'}
            </span>
          </div>

          {/* Distance + Directions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <MapPin size={14} color="var(--accent-primary)" />
              <span>{distance} from NSEC</span>
            </div>
            <a
              href={mapsUrl} target="_blank" rel="noopener noreferrer"
              data-external="true"
              style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#3b82f6', fontSize: '0.78rem', fontWeight: 500 }}
            >
              <Navigation size={12} /> Directions
            </a>
          </div>

          {/* Occupancy */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.82rem', fontWeight: 500,
            color: isOccupied ? '#f59e0b' : '#10b981',
            marginBottom: '10px'
          }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: isOccupied ? '#f59e0b' : '#10b981', flexShrink: 0 }}></div>
            {isOccupied ? 'Occupied' : 'Vacant'}
            {!isOccupied && availableDate && (
              <span style={{ color: 'var(--text-secondary)', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <CalendarClock size={12} /> From {availableDate}
              </span>
            )}
            {isOccupied && lookingForRoommate && <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}> — roommate wanted</span>}
          </div>

          {/* Amenity pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
            {amenities.slice(0, 3).map(a => (
              <span key={a} style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '3px 8px', borderRadius: '6px' }}>
                {a}
              </span>
            ))}
            {amenities.length > 3 && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '3px 8px', borderRadius: '6px' }}>
                +{amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
