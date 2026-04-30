import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Wifi, Wind, Coffee, Star, MessageCircle, Users, Navigation, BadgeCheck, Heart, Calculator, Flag, X, Zap, Utensils, ShowerHead, Car, WashingMachine, Thermometer } from 'lucide-react';
import { mockListings } from '../data/listings';
import { supabase } from '../lib/supabase';
import { useWishlist } from '../context/WishlistContext';
import RentSplitCalculator from '../components/RentSplitCalculator';

const amenityIcons = {
  'WiFi': Wifi, 'AC': Wind, 'Meals Included': Utensils, 'Power Backup': Zap,
  'Attached Bathroom': ShowerHead, 'Parking': Car, 'Laundry': WashingMachine,
  'Geyser': Thermometer, 'Ceiling Fan': Wind, 'Shared Kitchen': Coffee,
};

const nearbyLinks = [
  { label: '🍕 Nearby Dhabas', query: 'dhabas near Garia Kolkata' },
  { label: '🏪 Grocery', query: 'grocery stores near Garia Kolkata' },
  { label: '🏥 Medical', query: 'medical shops near Garia Kolkata' },
  { label: '🚇 Metro Station', query: 'Garia Metro Station Kolkata' },
];

const compatLabels = { 'night-owl': '🦉 Night owl', 'early-bird': '🌅 Early bird' };
const noiseLabels  = { 'quiet': '🤫 Prefers quiet', 'some-noise': '🎵 Okay with noise' };
const foodLabels   = { 'veg': '🥗 Vegetarian', 'nonveg': '🍗 Non-veg okay' };

const RoomDetail = () => {
  const { id } = useParams();
  const { isSaved, toggle } = useWishlist();
  const [activeImg, setActiveImg] = useState(0);
  const [showCalc, setShowCalc] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      // Try Supabase first
      const { data, error } = await supabase
        .from('listings')
        .select('*, listing_images(url, order), reviews(stars, text, reviewer_name)')
        .eq('id', id)
        .single();

      if (data && !error) {
        // Normalize DB row to app shape
        setRoom({
          id: data.id,
          title: data.title,
          price: data.price,
          distance: data.walk_time || `${data.distance_km} km`,
          distanceKm: data.distance_km,
          rating: data.rating || 4.5,
          images: data.listing_images?.sort((a, b) => a.order - b.order).map(i => i.url) || ['/assets/room_interior.png'],
          isOccupied: data.is_occupied,
          lookingForRoommate: data.looking_for_roommate,
          occupantName: data.occupant_name,
          occupantYear: data.occupant_year,
          occupantPhone: data.occupant_phone,
          postedByRole: data.posted_by_role || 'owner',
          address: data.address,
          landmark: data.landmark,
          verified: data.verified || false,
          availableFrom: data.available_from,
          amenities: data.amenities || [],
          college: data.college,
          reviews: data.reviews?.map(r => ({ name: r.reviewer_name, stars: r.stars, text: r.text })) || [],
          roommateProfile: data.roommate_profile || null,
        });
      } else {
        // Fall back to mock data
        const mock = mockListings.find(l => l.id === Number(id)) || mockListings[0];
        setRoom(mock);
      }
      setLoading(false);
    };
    fetchRoom();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-light)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}></div>
        <p>Loading listing...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!room) return <div className="container" style={{ paddingTop: '120px' }}>Listing not found.</div>;

  const saved = isSaved(room.id);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(room.address)}`;
  const whatsappUrl = room.occupantPhone
    ? `https://wa.me/91${room.occupantPhone}?text=${encodeURIComponent(`Hi! I saw your listing on Roomly: "${room.title}" near NSEC. I'm interested. Can we talk?`)}`
    : '#';

  const handleReport = () => {
    if (!reportReason) return;
    setReportSent(true);
    setTimeout(() => { setShowReport(false); setReportSent(false); setReportReason(''); }, 2000);
  };

  const renderStars = (count) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} fill={i < Math.round(count) ? '#f59e0b' : 'none'} color={i < Math.round(count) ? '#f59e0b' : 'var(--text-secondary)'} />
    ));

  return (
    <div style={{ paddingBottom: '100px' }}>

      {/* ── MAIN PHOTO ── */}
      <div style={{ width: '100%', height: '55vh', background: '#111', overflow: 'hidden' }}>
        <img
          src={room.images?.[activeImg] || '/assets/room_interior.png'}
          alt={room.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }}
        />
      </div>

      {/* ── THUMBNAIL STRIP (always visible below the main photo) ── */}
      {room.images?.length > 1 && (
        <div style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-light)',
          padding: '12px 24px',
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, flexShrink: 0, marginRight: '4px' }}>📷 Photos</span>
          {room.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Photo ${i + 1}`}
              onClick={() => setActiveImg(i)}
              style={{
                width: '90px',
                height: '64px',
                objectFit: 'cover',
                borderRadius: '8px',
                cursor: 'pointer',
                flexShrink: 0,
                border: activeImg === i ? '2px solid var(--accent-primary)' : '2px solid transparent',
                opacity: activeImg === i ? 1 : 0.65,
                transition: 'all 0.15s ease',
              }}
            />
          ))}
        </div>
      )}

      <div className="container" style={{ marginTop: '32px', display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* ─── MAIN ─── */}
        <div style={{ flex: '1 1 560px', minWidth: 0 }}>

          {/* Title Card */}
          <div className="card" style={{ padding: '28px', borderRadius: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
              <h1 style={{ fontSize: '1.75rem', margin: 0 }}>{room.title}</h1>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {/* Wishlist */}
                <button
                  onClick={() => toggle(room.id)}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Heart size={18} fill={saved ? '#ef4444' : 'none'} color={saved ? '#ef4444' : 'var(--text-secondary)'} />
                </button>
                {/* Report */}
                <button
                  onClick={() => setShowReport(true)}
                  title="Report this listing"
                  style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Flag size={16} color="var(--text-secondary)" />
                </button>
              </div>
            </div>

            {/* Rating + Verified */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fefce8', padding: '5px 12px', borderRadius: '20px' }}>
                {renderStars(room.rating)}
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#a16207', marginLeft: '4px' }}>{Number(room.rating).toFixed(1)}</span>
              </div>
              {room.verified && <span className="verified-badge"><BadgeCheck size={12} /> Verified Listing</span>}
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'var(--bg-primary)', padding: '4px 10px', borderRadius: '8px', fontWeight: 500 }}>
                {room.postedByRole === 'student' ? '🎓 Posted by Student' : '🏠 Posted by Owner'}
              </span>
            </div>

            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <MapPin size={16} color="var(--accent-primary)" />
                <span>{room.distance} from NSEC</span>
              </div>
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#3b82f6', fontWeight: 500, fontSize: '0.85rem', padding: '5px 12px', borderRadius: '100px', border: '1px solid #bfdbfe', background: '#eff6ff' }}>
                <Navigation size={13} /> Get Directions
              </a>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>📍 {room.address}</p>
            {room.landmark && <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>🏪 {room.landmark}</p>}

            <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>About this space</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '20px' }}>
              A clean and well-maintained room located just {room.distance} from the NSEC campus gate. The Garia Metro station is nearby, making it convenient to travel anywhere in Kolkata. Ideal for NSEC, HIT, and Techno India students.
            </p>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Amenities</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
              {room.amenities.map(a => {
                const Icon = amenityIcons[a] || Wifi;
                return (
                  <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <Icon size={16} color="var(--accent-primary)" /> {a}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Roommate Section */}
          {room.isOccupied && (
            <div className="card" style={{ padding: '28px', borderRadius: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <Users size={20} color={room.lookingForRoommate ? '#10b981' : 'var(--text-secondary)'} />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                  {room.lookingForRoommate ? 'Looking for a Roommate 🤝' : 'Currently Occupied'}
                </h3>
              </div>

              {room.occupantName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', marginBottom: room.lookingForRoommate ? '16px' : '0' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                    {room.occupantName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{room.occupantName}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{room.occupantYear}</div>
                  </div>
                </div>
              )}

              {/* Roommate Compatibility Profile */}
              {room.roommateProfile && (
                <div style={{ marginTop: '16px' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '10px' }}>Lifestyle Profile</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="compat-pill compat-high">{compatLabels[room.roommateProfile.sleepSchedule] || room.roommateProfile.sleepSchedule}</span>
                    <span className="compat-pill compat-mid">{noiseLabels[room.roommateProfile.noise] || room.roommateProfile.noise}</span>
                    <span className="compat-pill compat-high">{foodLabels[room.roommateProfile.food] || room.roommateProfile.food}</span>
                    {!room.roommateProfile.smoking && <span className="compat-pill compat-high">🚭 Non-smoking</span>}
                  </div>
                </div>
              )}

              {room.lookingForRoommate && (
                <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '14px 18px', color: '#065f46', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '16px' }}>
                  <strong>{room.occupantName}</strong> is currently living here and looking for a roommate. Contact them to discuss rent split, habits, and move-in dates!
                </div>
              )}
            </div>
          )}

          {/* Nearby Essentials */}
          <div className="card" style={{ padding: '28px', borderRadius: '20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Nearby Essentials</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {nearbyLinks.map(nl => (
                <a
                  key={nl.label}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nl.query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', background: 'var(--bg-primary)', borderRadius: '10px', fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500, border: '1px solid var(--border-light)', transition: 'border-color 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.borderColor = 'var(--text-secondary)'}
                  onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
                >
                  {nl.label}
                </a>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="card" style={{ padding: '28px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Reviews</h3>
            {room.reviews.map((review, i) => (
              <div key={i} style={{ marginBottom: i < room.reviews.length - 1 ? '20px' : '0', paddingBottom: i < room.reviews.length - 1 ? '20px' : '0', borderBottom: i < room.reviews.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{review.name}</div>
                  <div style={{ display: 'flex', gap: '2px' }}>{renderStars(review.stars)}</div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── SIDEBAR ─── */}
        <div style={{ flex: '0 0 330px', minWidth: '280px' }}>
          <div className="card" style={{ position: 'sticky', top: '90px', padding: '28px', borderRadius: '20px' }}>
            <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: '#10b981', fontWeight: 700, marginBottom: '4px' }}>
              ₹{room.price.toLocaleString('en-IN')}<span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/month</span>
            </div>

            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px', fontSize: '0.88rem', fontWeight: 500, color: room.isOccupied ? '#f59e0b' : '#10b981' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: room.isOccupied ? '#f59e0b' : '#10b981' }}></div>
              {room.isOccupied ? 'Occupied' : 'Vacant — Available Now'}
              {room.isOccupied && room.lookingForRoommate && <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}> · roommate wanted</span>}
            </div>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', marginBottom: '10px', background: '#25d366', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 500, fontSize: '0.95rem', fontFamily: 'var(--font-body)', textDecoration: 'none', transition: 'opacity 0.2s ease' }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>

            {/* Directions */}
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline"
              style={{ width: '100%', padding: '13px', justifyContent: 'center', marginBottom: '10px', textDecoration: 'none', display: 'flex' }}>
              <Navigation size={16} /> Get Directions
            </a>

            {/* Wishlist */}
            <button
              onClick={() => toggle(room.id)}
              className="btn-outline"
              style={{ width: '100%', padding: '13px', justifyContent: 'center', marginBottom: '10px', color: saved ? '#ef4444' : 'var(--text-primary)', borderColor: saved ? '#ef4444' : 'var(--border-light)' }}
            >
              <Heart size={16} fill={saved ? '#ef4444' : 'none'} color={saved ? '#ef4444' : 'var(--text-primary)'} />
              {saved ? 'Saved ✓' : 'Save for Later'}
            </button>

            {/* Rent Calculator */}
            <button
              onClick={() => setShowCalc(true)}
              className="btn-outline"
              style={{ width: '100%', padding: '13px', justifyContent: 'center' }}
            >
              <Calculator size={16} /> Rent Split Calculator
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCalc && <RentSplitCalculator baseRent={room.price} onClose={() => setShowCalc(false)} />}

      {showReport && (
        <div className="modal-overlay" onClick={() => setShowReport(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Flag size={18} /> Report Listing</h3>
              <button onClick={() => setShowReport(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>
            {reportSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ fontSize: '1.5rem', marginBottom: '8px' }}>✅</p>
                <p style={{ fontWeight: 600 }}>Report submitted. Thank you!</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Our team will review this listing.</p>
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>Help us maintain quality. Why are you reporting this listing?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {['Fake / Fraudulent listing', 'Incorrect information', 'Inappropriate content', 'Already rented', 'Other'].map(reason => (
                    <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${reportReason === reason ? 'var(--accent-primary)' : 'var(--border-light)'}`, background: reportReason === reason ? 'var(--bg-primary)' : 'transparent' }}>
                      <input type="radio" name="reason" value={reason} checked={reportReason === reason} onChange={() => setReportReason(reason)} style={{ accentColor: 'var(--accent-primary)' }} />
                      <span style={{ fontSize: '0.9rem' }}>{reason}</span>
                    </label>
                  ))}
                </div>
                <button className="btn-primary" onClick={handleReport} style={{ width: '100%', padding: '13px', opacity: reportReason ? 1 : 0.5 }} disabled={!reportReason}>
                  Submit Report
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
