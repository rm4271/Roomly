import React, { useState } from 'react';
import { Calculator, IndianRupee, X } from 'lucide-react';

const RentSplitCalculator = ({ baseRent = '', onClose }) => {
  const [rent, setRent] = useState(String(baseRent));
  const [people, setPeople] = useState(2);

  const perPerson = rent && people > 0 ? Math.ceil(Number(rent) / people) : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calculator size={22} />
            <h3 style={{ margin: 0 }}>Rent Split Calculator</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Total Monthly Rent (₹)
            </label>
            <input
              type="number"
              className="input-field"
              value={rent}
              onChange={e => setRent(e.target.value)}
              placeholder="e.g. 5500"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Number of Roommates: <strong>{people}</strong>
            </label>
            <input
              type="range"
              className="range-slider"
              min={1}
              max={6}
              value={people}
              onChange={e => setPeople(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
            </div>
          </div>

          {perPerson > 0 && (
            <div style={{
              padding: '24px',
              background: 'var(--bg-primary)',
              borderRadius: '14px',
              textAlign: 'center',
              border: '1px solid var(--border-light)'
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
                Each person pays
              </p>
              <div style={{
                fontSize: '3rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                color: '#10b981'
              }}>
                ₹{perPerson.toLocaleString('en-IN')}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                per month ({people} {people === 1 ? 'person' : 'people'}, ₹{Number(rent).toLocaleString('en-IN')} total)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentSplitCalculator;
