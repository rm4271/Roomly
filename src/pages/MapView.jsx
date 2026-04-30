import React from 'react';
import { Map as MapIcon, X } from 'lucide-react';
import RoomCard from '../components/RoomCard';

const MapView = () => {
  const [selectedRoom, setSelectedRoom] = React.useState(null);

  const mockRoom = { 
    id: 1, 
    image: '/assets/room_interior.png', 
    title: 'Furnished PG Near NSEC', 
    price: 5500, 
    distance: '3 min walk', 
    rating: '4.8',
    isOccupied: true,
    lookingForRoommate: true,
    postedByRole: 'student',
    address: 'Technopolis, Garia, Kolkata 700152'
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 70px)', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Simulated Clean Map Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#f3f4f6', /* very light gray for map */
        backgroundImage: 'radial-gradient(var(--border-light) 1.5px, transparent 1.5px)',
        backgroundSize: '40px 40px',
        zIndex: 0
      }}>
        {/* Simulated Map Paths */}
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.5 }}>
          <path d="M 0 200 Q 300 400 600 200 T 1200 400" fill="none" stroke="#d1d5db" strokeWidth="6" strokeLinecap="round" />
          <path d="M 200 0 Q 400 300 200 600 T 400 1200" fill="none" stroke="#e5e7eb" strokeWidth="8" strokeLinecap="round" />
        </svg>

        {/* Floating Pins */}
        <div 
          onClick={() => setSelectedRoom(mockRoom)}
          style={{
            position: 'absolute',
            top: '40%',
            left: '45%',
            width: '36px',
            height: '36px',
            background: 'var(--accent-primary)',
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'rotate(-45deg) scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'rotate(-45deg) scale(1)'}
        >
          <div style={{ transform: 'rotate(45deg)', background: '#fff', width: '12px', height: '12px', borderRadius: '50%' }}></div>
        </div>
      </div>

      {/* Slide-in side panel */}
      <div className="card" style={{
        position: 'absolute',
        top: '24px',
        right: selectedRoom ? '24px' : '-400px',
        width: '350px',
        height: 'calc(100% - 48px)',
        transition: 'right 0.3s ease',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Location <span style={{ color: 'var(--accent-primary)' }}>Details</span></h2>
          <button 
            onClick={() => setSelectedRoom(null)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>
        
        {selectedRoom && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <RoomCard {...selectedRoom} />
          </div>
        )}
      </div>

      {/* Top overlay search/filter */}
      <div className="card" style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        zIndex: 10,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <MapIcon size={20} color="var(--accent-primary)" />
        <span style={{ fontWeight: 600 }}>Interactive Map View</span>
      </div>
    </div>
  );
};

export default MapView;
