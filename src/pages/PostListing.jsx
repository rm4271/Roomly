import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigation, MapPin, LocateFixed, ArrowRight } from 'lucide-react';

const PostListing = () => {
  const [step, setStep] = useState(1);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const [form, setForm] = useState({
    title: '',
    price: '',
    walkTime: '',
    address: '',
    landmark: '',
    college: 'NSEC, Garia',
    isOccupied: false,
    lookingForRoommate: false,
  });

  if (!isLoggedIn) {
    return (
      <div className="container" style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '48px 40px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '12px' }}>Log in to post a room</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>You need to be logged in to create a listing on Roomly.</p>
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '14px 32px' }}>Log In</button>
        </div>
      </div>
    );
  }

  const totalSteps = 4;

  const handlePreviewOnMap = () => {
    if (form.address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.address)}`, '_blank');
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Open Google Maps at the user's location so they can copy the address
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(url, '_blank');
        setForm({ ...form, address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)} (See Google Maps for full address)` });
        setLocating(false);
      },
      (error) => {
        setLocationError('Unable to get your location. Please allow location access and try again.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePickOnMap = () => {
    // Opens Google Maps centered on NSEC so the user can explore and find their place
    const nsecLat = 22.4839;
    const nsecLng = 88.4101;
    window.open(`https://www.google.com/maps/@${nsecLat},${nsecLng},16z`, '_blank');
  };

  return (
    <div className="container" style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '40px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '2rem' }}>Post a <span style={{ color: 'var(--accent-primary)' }}>Listing</span></h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>Step {step} of {totalSteps}</p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{
              flex: 1, height: '4px',
              background: i <= step ? 'var(--accent-primary)' : 'var(--border-light)',
              borderRadius: '2px', transition: 'background 0.3s'
            }}></div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Property Title</label>
              <input type="text" className="input-field" placeholder="e.g. Furnished PG Near NSEC" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Monthly Rent (₹)</label>
              <input type="number" className="input-field" placeholder="5500" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Walking Distance from College</label>
              <input type="text" className="input-field" placeholder="e.g. 3 min walk" value={form.walkTime} onChange={(e) => setForm({...form, walkTime: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nearest College</label>
              <input type="text" className="input-field" placeholder="e.g. NSEC, Garia" value={form.college} onChange={(e) => setForm({...form, college: e.target.value})} />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Full Address</label>
              <textarea
                className="input-field"
                rows="3"
                placeholder="e.g. Technopolis Building, Near NSEC Gate, Garia, Kolkata 700152"
                value={form.address}
                onChange={(e) => setForm({...form, address: e.target.value})}
              ></textarea>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                This address will be linked to Google Maps so students can get directions.
              </p>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nearest Landmark</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Near Garia Metro Station, opposite City Mart"
                value={form.landmark}
                onChange={(e) => setForm({...form, landmark: e.target.value})}
              />
            </div>

            {/* Location Helper Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Not sure of the exact address? Use these tools:
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={locating}
                  style={{
                    flex: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid var(--border-light)', background: 'var(--bg-card)',
                    cursor: locating ? 'wait' : 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 500,
                    color: 'var(--text-primary)', transition: 'all 0.2s ease',
                    opacity: locating ? 0.6 : 1
                  }}
                >
                  <LocateFixed size={16} color="#3b82f6" />
                  {locating ? 'Locating...' : 'Use My Location'}
                </button>
                <button
                  type="button"
                  onClick={handlePickOnMap}
                  style={{
                    flex: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid var(--border-light)', background: 'var(--bg-card)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 500,
                    color: 'var(--text-primary)', transition: 'all 0.2s ease'
                  }}
                >
                  <MapPin size={16} color="#10b981" />
                  Find on Map
                </button>
              </div>
              {locationError && (
                <p style={{ fontSize: '0.8rem', color: '#ef4444' }}>{locationError}</p>
              )}
            </div>

            {form.address && (
              <button
                type="button"
                onClick={handlePreviewOnMap}
                className="btn-outline"
                style={{ padding: '12px', justifyContent: 'center' }}
              >
                <Navigation size={16} />
                Preview Address on Google Maps
              </button>
            )}
          </div>
        )}

        {/* Step 3: Occupancy & Amenities */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Is someone currently living here?</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[{ label: 'Yes', val: true }, { label: "No, it's vacant", val: false }].map(opt => (
                  <button key={String(opt.val)} type="button" onClick={() => setForm({...form, isOccupied: opt.val, lookingForRoommate: opt.val ? form.lookingForRoommate : false})}
                    style={{
                      flex: 1, padding: '14px', borderRadius: '12px',
                      border: form.isOccupied === opt.val ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                      background: form.isOccupied === opt.val ? 'rgba(17, 24, 39, 0.03)' : 'var(--bg-card)',
                      cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--text-primary)'
                    }}
                  >{opt.label}</button>
                ))}
              </div>
            </div>

            {form.isOccupied && (
              <div>
                <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Looking for a roommate? 🤝</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[{ label: 'Yes, find me a roommate!', val: true, color: '#10b981', colorBg: 'rgba(16, 185, 129, 0.06)', colorText: '#065f46' },
                    { label: 'No', val: false, color: 'var(--accent-primary)', colorBg: 'rgba(17, 24, 39, 0.03)', colorText: 'var(--text-primary)' }
                  ].map(opt => (
                    <button key={String(opt.val)} type="button" onClick={() => setForm({...form, lookingForRoommate: opt.val})}
                      style={{
                        flex: 1, padding: '14px', borderRadius: '12px',
                        border: form.lookingForRoommate === opt.val ? `2px solid ${opt.color}` : '1px solid var(--border-light)',
                        background: form.lookingForRoommate === opt.val ? opt.colorBg : 'var(--bg-card)',
                        cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500,
                        color: form.lookingForRoommate === opt.val ? opt.colorText : 'var(--text-primary)',
                        fontSize: '0.9rem'
                      }}
                    >{opt.label}</button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Amenities</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['WiFi Included', 'AC / Cooler', 'Attached Bathroom', 'Meals Included', 'Power Backup', 'Laundry', 'Parking', 'Geyser / Hot Water'].map(item => (
                  <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <input type="checkbox" style={{ accentColor: 'var(--accent-primary)' }} /> {item}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Description</label>
              <textarea className="input-field" rows="4" placeholder="Describe the room, neighbourhood, rules, food, etc..."></textarea>
            </div>
          </div>
        )}

        {/* Step 4: Photos */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
            <div style={{
              width: '100%', height: '200px',
              border: '2px dashed var(--border-light)', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)', cursor: 'pointer', background: 'var(--bg-primary)', fontSize: '0.95rem'
            }}>
              📷 Click to upload photos
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Upload clear photos of the room, bathroom, and entrance. Good photos attract more students!</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
          <button onClick={() => setStep(Math.max(1, step - 1))} className="btn-outline" style={{ padding: '12px 24px', opacity: step === 1 ? 0.5 : 1 }} disabled={step === 1}>
            Back
          </button>
          <button className="btn-primary" onClick={() => {
            if (step < totalSteps) setStep(step + 1);
            else { alert('🎉 Listing published successfully!'); navigate('/listings'); }
          }}>
            {step === totalSteps ? 'Publish Listing' : 'Next Step'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostListing;
