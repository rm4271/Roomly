import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { mockListings } from '../data/listings';

/**
 * Fetches listings from Supabase.
 * Falls back to mock data if the table doesn't exist yet (during setup).
 */
export const useListings = (filters = {}) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('listings')
          .select(`
            *,
            listing_images ( url, order ),
            reviews ( stars, text, reviewer_name )
          `)
          .order('created_at', { ascending: false });

        if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
        if (filters.radiusKm && filters.radiusKm < Infinity) query = query.lte('distance_km', filters.radiusKm);
        if (filters.roommateOnly) query = query.eq('looking_for_roommate', true);
        if (filters.vacantOnly) query = query.eq('is_occupied', false);

        const { data, error: qErr } = await query;

        if (qErr || !data) {
          // Table probably doesn't exist yet — use mock data
          console.warn('Supabase listings not available, using mock data:', qErr?.message);
          setUsingMock(true);
          setListings(applyFilters(mockListings, filters));
        } else if (data.length === 0) {
          // Table exists but empty — fall back to mock for demo
          setUsingMock(true);
          setListings(applyFilters(mockListings, filters));
        } else {
          setUsingMock(false);
          setListings(data.map(normalizeRow));
        }
      } catch (e) {
        setUsingMock(true);
        setListings(applyFilters(mockListings, filters));
      }
      setLoading(false);
    };

    fetch();
  }, [filters.maxPrice, filters.radiusKm, filters.roommateOnly, filters.vacantOnly]);

  return { listings, loading, error, usingMock };
};

// Normalize Supabase row to match our app's shape
const normalizeRow = (row) => ({
  id: row.id,
  title: row.title,
  price: row.price,
  distance: row.walk_time || `${row.distance_km} km`,
  distanceKm: row.distance_km,
  rating: row.rating || 4.5,
  images: row.listing_images?.sort((a, b) => a.order - b.order).map(i => i.url) || ['/assets/room_interior.png'],
  isOccupied: row.is_occupied,
  lookingForRoommate: row.looking_for_roommate,
  occupantName: row.occupant_name,
  occupantYear: row.occupant_year,
  occupantPhone: row.occupant_phone,
  postedByRole: row.posted_by_role || 'owner',
  address: row.address,
  landmark: row.landmark,
  verified: row.verified || false,
  availableFrom: row.available_from,
  amenities: row.amenities || [],
  college: row.college,
  reviews: row.reviews?.map(r => ({ name: r.reviewer_name, stars: r.stars, text: r.text })) || [],
  roommateProfile: row.roommate_profile || null,
});

const applyFilters = (list, filters) =>
  list
    .filter(l => !filters.roommateOnly || l.lookingForRoommate)
    .filter(l => !filters.vacantOnly || !l.isOccupied)
    .filter(l => !filters.radiusKm || filters.radiusKm >= Infinity || l.distanceKm <= filters.radiusKm)
    .filter(l => !filters.maxPrice || l.price <= filters.maxPrice);
