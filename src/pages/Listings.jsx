import React, { useState } from 'react';
import { Users, MapPin, IndianRupee, CalendarClock, X } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import { useListings } from '../hooks/useListings';

const radiusOptions = [
  { label: 'Under 500m', value: 0.5 },
  { label: 'Under 1 km', value: 1 },
  { label: 'Under 2 km', value: 2 },
  { label: 'Under 5 km', value: 5 },
  { label: 'Any distance', value: Infinity },
];

const Listings = () => {
  const [roommateFilter, setRoommateFilter] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [radiusKm, setRadiusKm] = useState(Infinity);
  const [showRadiusDropdown, setShowRadiusDropdown] = useState(false);
  const [maxPrice, setMaxPrice] = useState(15000);

  const { listings: filtered, loading, usingMock } = useListings({
    roommateOnly: roommateFilter,
    vacantOnly: availableOnly,
    radiusKm,
    maxPrice,
  });

  const activeRadiusLabel = radiusOptions.find(r => r.value === radiusKm)?.label || 'Any distance';
  const hasFilters = roommateFilter || availableOnly || radiusKm < Infinity || maxPrice < 15000;

  const clearAll = () => {
    setRoommateFilter(false);
    setAvailableOnly(false);
    setRadiusKm(Infinity);
    setMaxPrice(15000);
  };

  return (
    <div className="container" style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>Available <span style={{ color: '#10b981' }}>Rooms</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            {loading ? 'Loading...' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} near NSEC, Garia`}
            {usingMock && !loading && <span style={{ marginLeft: '8px', fontSize: '0.75rem', background: 'rgba(245,158,11,0.1)', color: '#b45309', padding: '2px 8px', borderRadius: '8px', fontWeight: 500 }}>Demo data</span>}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Roommate Toggle */}
          <FilterChip active={roommateFilter} color="#10b981" onClick={() => setRoommateFilter(!roommateFilter)}>
            <Users size={14} /> Find a Roommate
          </FilterChip>

          {/* Available Only */}
          <FilterChip active={availableOnly} color="#3b82f6" onClick={() => setAvailableOnly(!availableOnly)}>
            <CalendarClock size={14} /> Vacant Only
          </FilterChip>

          {/* Radius Dropdown */}
          <div style={{ position: 'relative' }}>
            <FilterChip active={radiusKm < Infinity} color="#8b5cf6" onClick={() => setShowRadiusDropdown(!showRadiusDropdown)}>
              <MapPin size={14} /> {activeRadiusLabel}
            </FilterChip>
            {showRadiusDropdown && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', zIndex: 50, minWidth: '175px', overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-light)', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Distance from NSEC</div>
                {radiusOptions.map(opt => (
                  <button key={opt.value} onClick={() => { setRadiusKm(opt.value); setShowRadiusDropdown(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 14px', background: radiusKm === opt.value ? 'var(--bg-primary)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: radiusKm === opt.value ? 600 : 400, color: radiusKm === opt.value ? '#8b5cf6' : 'var(--text-primary)' }}
                  >{opt.label}</button>
                ))}
              </div>
            )}
          </div>

          {hasFilters && (
            <button onClick={clearAll} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
              <X size={14} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, flexShrink: 0 }}>
          <IndianRupee size={16} /> Budget
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="range"
            className="range-slider"
            min={2000}
            max={15000}
            step={500}
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${((maxPrice - 2000) / 13000) * 100}%, var(--slider-track) ${((maxPrice - 2000) / 13000) * 100}%, var(--slider-track) 100%)`
            }}
          />
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Up to ₹{maxPrice.toLocaleString('en-IN')}
          {maxPrice === 15000 && <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>+</span>}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {filtered.map(listing => (
          <RoomCard key={listing.id} {...listing} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
          <MapPin size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No rooms match your filters.</p>
          <button onClick={clearAll} className="btn-outline" style={{ marginTop: '16px' }}>Clear filters</button>
        </div>
      )}
    </div>
  );
};

const FilterChip = ({ children, active, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '9px 14px', borderRadius: '100px',
      border: active ? `2px solid ${color}` : '1px solid var(--border-light)',
      background: active ? `${color}14` : 'var(--bg-card)',
      cursor: 'pointer', fontFamily: 'var(--font-body)',
      fontWeight: 500, fontSize: '0.85rem',
      color: active ? color : 'var(--text-primary)',
      transition: 'all 0.2s ease'
    }}
  >
    {children}
  </button>
);

export default Listings;
