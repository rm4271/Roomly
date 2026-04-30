import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Navigation, MapPin, LocateFixed, ArrowRight, Upload, X, CheckCircle, Loader } from 'lucide-react';

const AMENITY_LIST = ['WiFi', 'AC', 'Attached Bathroom', 'Meals Included', 'Power Backup', 'Laundry', 'Parking', 'Geyser'];

const PostListing = () => {
  const [step, setStep] = useState(1);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [photos, setPhotos] = useState([]);        // preview URLs
  const [photoFiles, setPhotoFiles] = useState([]); // actual File objects
  const [uploading, setUploading] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishError, setPublishError] = useState('');

  const [form, setForm] = useState({
    title: '', price: '', walkTime: '',
    address: '', landmark: '',
    college: 'NSEC, Garia',
    isOccupied: false, lookingForRoommate: false,
    description: '',
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

  const toggleAmenity = (a) =>
    setSelectedAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newFiles = [...photoFiles, ...files].slice(0, 5); // max 5 photos
    setPhotoFiles(newFiles);
    setPhotos(newFiles.map(f => URL.createObjectURL(f)));
  };

  const removePhoto = (i) => {
    const newFiles = photoFiles.filter((_, idx) => idx !== i);
    setPhotoFiles(newFiles);
    setPhotos(newFiles.map(f => URL.createObjectURL(f)));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) { setLocationError('Geolocation not supported.'); return; }
    setLocating(true); setLocationError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
        setForm(f => ({ ...f, address: `Near NSEC, Garia, Kolkata (Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)})` }));
        setLocating(false);
      },
      () => { setLocationError('Could not get location. Please allow access.'); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePublish = async () => {
    setUploading(true); setPublishError('');
    try {
      // 1. Insert listing row
      const { data: listing, error: listingErr } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          title: form.title,
          price: Number(form.price),
          walk_time: form.walkTime,
          address: form.address,
          landmark: form.landmark,
          college: form.college,
          is_occupied: form.isOccupied,
          looking_for_roommate: form.lookingForRoommate,
          amenities: selectedAmenities,
          posted_by_role: user.role || 'student',
          distance_km: estimateDistanceKm(form.walkTime),
          rating: 4.5,
        })
        .select()
        .single();

      if (listingErr) throw listingErr;

      // 2. Upload photos to Supabase Storage
      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        const ext = file.name.split('.').pop();
        const path = `listings/${listing.id}/${i}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from('room-images')
          .upload(path, file, { upsert: true });

        if (!uploadErr) {
          const { data: { publicUrl } } = supabase.storage.from('room-images').getPublicUrl(path);
          await supabase.from('listing_images').insert({
            listing_id: listing.id,
            url: publicUrl,
            order: i,
          });
        }
      }

      setPublished(true);
      setTimeout(() => navigate(`/room/${listing.id}`), 2000);
    } catch (err) {
      console.error(err);
      setPublishError(err.message || 'Something went wrong. Please try again.');
    }
    setUploading(false);
  };

  // Rough estimate: "3 min walk" → ~0.2 km
  const estimateDistanceKm = (walkTime) => {
    const match = walkTime?.match(/(\d+)/);
    if (!match) return 1;
    const mins = Number(match[1]);
    if (walkTime?.includes('min')) return +(mins * 0.067).toFixed(2); // ~4km/h walking
    if (walkTime?.includes('bus') || walkTime?.includes('auto')) return +(mins * 0.4).toFixed(2);
    return 1;
  };

  if (published) {
    return (
      <div className="container" style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '48px 40px', textAlign: 'center' }}>
          <CheckCircle size={56} color="#10b981" style={{ marginBottom: '16px' }} />
          <h2 style={{ marginBottom: '12px' }}>Listing Published! 🎉</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Taking you to your listing...</p>
        </div>
      </div>
    );
  }

  const canNext = () => {
    if (step === 1) return form.title && form.price && form.walkTime;
    if (step === 2) return form.address;
    return true;
  };

  return (
    <div className="container" style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '60px' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '40px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '2rem' }}>
          Post a <span style={{ color: '#10b981' }}>Listing</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>Step {step} of {totalSteps}</p>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ flex: 1, height: '4px', background: i <= step ? 'var(--accent-primary)' : 'var(--border-light)', borderRadius: '2px', transition: 'background 0.3s' }}></div>
          ))}
        </div>

        {/* ── Step 1: Basic Info ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Field label="Property Title">
              <input type="text" className="input-field" placeholder="e.g. Furnished PG Near NSEC" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} autoFocus />
            </Field>
            <Field label="Monthly Rent (₹)">
              <input type="number" className="input-field" placeholder="5500" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </Field>
            <Field label="Walking Distance from College">
              <input type="text" className="input-field" placeholder="e.g. 3 min walk / 10 min bus" value={form.walkTime} onChange={e => setForm({ ...form, walkTime: e.target.value })} />
            </Field>
            <Field label="Nearest College">
              <input type="text" className="input-field" placeholder="e.g. NSEC, Garia" value={form.college} onChange={e => setForm({ ...form, college: e.target.value })} />
            </Field>
          </div>
        )}

        {/* ── Step 2: Location ── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Field label="Full Address">
              <textarea className="input-field" rows="3" placeholder="e.g. Technopolis Building, Near NSEC Gate, Garia, Kolkata 700152" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}></textarea>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>This will be linked to Google Maps so students can get directions.</p>
            </Field>
            <Field label="Nearest Landmark">
              <input type="text" className="input-field" placeholder="e.g. Near Garia Metro, opposite City Mart" value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })} />
            </Field>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button type="button" onClick={handleUseCurrentLocation} disabled={locating}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-card)', cursor: locating ? 'wait' : 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 500, opacity: locating ? 0.6 : 1 }}>
                <LocateFixed size={16} color="#3b82f6" />
                {locating ? 'Locating...' : 'Use My Location'}
              </button>
              <button type="button" onClick={() => window.open('https://www.google.com/maps/@22.4839,88.4101,16z', '_blank')}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg-card)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 500 }}>
                <MapPin size={16} color="#10b981" /> Find on Map
              </button>
            </div>
            {locationError && <p style={{ fontSize: '0.82rem', color: '#ef4444' }}>{locationError}</p>}
          </div>
        )}

        {/* ── Step 3: Occupancy & Amenities ── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Field label="Is someone currently living here?">
              <div style={{ display: 'flex', gap: '12px' }}>
                {[{ label: 'Yes, occupied', val: true }, { label: "No, it's vacant", val: false }].map(opt => (
                  <button key={String(opt.val)} type="button" onClick={() => setForm({ ...form, isOccupied: opt.val, lookingForRoommate: opt.val ? form.lookingForRoommate : false })}
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: form.isOccupied === opt.val ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)', background: form.isOccupied === opt.val ? 'var(--bg-primary)' : 'var(--bg-card)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </Field>

            {form.isOccupied && (
              <Field label="Looking for a roommate? 🤝">
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[{ label: 'Yes, find me a roommate!', val: true }, { label: 'No', val: false }].map(opt => (
                    <button key={String(opt.val)} type="button" onClick={() => setForm({ ...form, lookingForRoommate: opt.val })}
                      style={{ flex: 1, padding: '14px', borderRadius: '12px', border: form.lookingForRoommate === opt.val ? '2px solid #10b981' : '1px solid var(--border-light)', background: form.lookingForRoommate === opt.val ? 'rgba(16,185,129,0.06)' : 'var(--bg-card)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, color: form.lookingForRoommate === opt.val ? '#065f46' : 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </Field>
            )}

            <Field label="Amenities (select all that apply)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {AMENITY_LIST.map(a => (
                  <label key={a} onClick={() => toggleAmenity(a)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${selectedAmenities.includes(a) ? 'var(--accent-primary)' : 'var(--border-light)'}`, background: selectedAmenities.includes(a) ? 'var(--bg-primary)' : 'transparent', transition: 'all 0.15s' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${selectedAmenities.includes(a) ? 'var(--accent-primary)' : 'var(--border-light)'}`, background: selectedAmenities.includes(a) ? 'var(--accent-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {selectedAmenities.includes(a) && <span style={{ color: 'var(--bg-card)', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{a}</span>
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Description (optional)">
              <textarea className="input-field" rows="3" placeholder="Describe the room, rules, food situation, neighbourhood..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
            </Field>
          </div>
        )}

        {/* ── Step 4: Photos ── */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Drop zone */}
            <div
              onClick={() => fileRef.current.click()}
              style={{ width: '100%', minHeight: '160px', border: '2px dashed var(--border-light)', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-secondary)', cursor: 'pointer', background: 'var(--bg-primary)', transition: 'border-color 0.2s, background 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.background = 'var(--bg-primary)'; }}
            >
              <Upload size={28} />
              <div style={{ fontWeight: 500 }}>Click to upload photos</div>
              <div style={{ fontSize: '0.82rem' }}>JPG, PNG up to 5MB each · Max 5 photos</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePhotoSelect} />

            {/* Preview grid */}
            {photos.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                {photos.map((src, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '1', border: '1px solid var(--border-light)' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removePhoto(i)}
                      style={{ position: 'absolute', top: '6px', right: '6px', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', textAlign: 'center' }}>
              {photos.length === 0
                ? 'Good photos of the room, bathroom & entrance attract 3× more inquiries!'
                : `${photos.length} photo${photos.length > 1 ? 's' : ''} selected — you can add up to ${5 - photos.length} more`}
            </p>

            {publishError && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '12px 16px', color: '#dc2626', fontSize: '0.88rem' }}>
                {publishError}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', gap: '12px' }}>
          <button onClick={() => setStep(Math.max(1, step - 1))} className="btn-outline" style={{ padding: '12px 24px', opacity: step === 1 ? 0.4 : 1 }} disabled={step === 1}>
            Back
          </button>
          <button
            className="btn-primary"
            disabled={!canNext() || uploading}
            onClick={() => {
              if (step < totalSteps) setStep(step + 1);
              else handlePublish();
            }}
            style={{ padding: '12px 28px', opacity: canNext() && !uploading ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {uploading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Publishing...</> : step === totalSteps ? 'Publish Listing' : 'Next Step'}
            {!uploading && <ArrowRight size={16} />}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{label}</label>
    {children}
  </div>
);

export default PostListing;
