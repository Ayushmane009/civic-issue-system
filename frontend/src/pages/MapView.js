import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import {
  RefreshCw, Navigation, Filter,
  Construction, Shield, Trash2, Bus, MapPin
} from 'lucide-react';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CATEGORIES = [
  { key: 'infrastructure', label: 'Infrastructure', color: '#f59e0b' },
  { key: 'safety', label: 'Safety', color: '#ef4444' },
  { key: 'sanitation', label: 'Sanitation', color: '#10b981' },
  { key: 'transport', label: 'Transport', color: '#3b82f6' },
];

const MapView = () => {
  const { addToast } = useToast();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: ['infrastructure', 'safety', 'sanitation', 'transport'],
    statuses: ['pending', 'progress', 'in-progress', 'resolved'],
  });
  const mapRef = useRef();

  useEffect(() => { fetchIssues(); }, []);

  const fetchIssues = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/issues/all');
      const withCoords = res.data.map(issue => ({
        ...issue,
        lat: issue.lat || 40.7128 + (Math.random() - 0.5) * 0.05,
        lng: issue.lng || -74.006 + (Math.random() - 0.5) * 0.05,
      }));
      setIssues(withCoords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = issues.filter(i =>
    filters.categories.includes(i.category) &&
    filters.statuses.includes(i.status)
  );

  const toggleFilter = (type, val) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(val)
        ? prev[type].filter(v => v !== val)
        : [...prev[type], val],
    }));
  };

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader-spinner" />
        <p style={{ color: 'var(--gray)' }}>Loading map...</p>
      </div>
    );
  }

  return (
    <div style={{
      height: 'calc(100vh - 64px)',
      position: 'relative',
    }}>
      {/* Map Controls */}
      <div style={{
        position: 'absolute', top: '16px', left: '16px',
        zIndex: 1000, display: 'flex', gap: '8px',
      }}>
        <button
          className="btn btn-sm"
          onClick={() => { fetchIssues(); addToast('Map refreshed!'); }}
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--glass-border)',
            color: 'var(--light)',
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
        <button
          className="btn btn-sm"
          onClick={() => setShowFilters(!showFilters)}
          style={{
            background: showFilters ? 'var(--primary)' : 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--glass-border)',
            color: 'white',
          }}
        >
          <Filter size={14} /> Filters ({filtered.length})
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div style={{
          position: 'absolute', top: '56px', left: '16px',
          zIndex: 1000, width: '260px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          boxShadow: 'var(--shadow-xl)',
          animation: 'slideDown 0.2s ease-out',
        }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Categories
          </h4>
          {CATEGORIES.map(cat => (
            <label key={cat.key} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px', borderRadius: '8px', cursor: 'pointer',
              fontSize: '0.85rem', marginBottom: '4px',
              background: filters.categories.includes(cat.key) ? 'rgba(255,255,255,0.06)' : 'transparent',
            }}>
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.key)}
                onChange={() => toggleFilter('categories', cat.key)}
                style={{ accentColor: cat.color }}
              />
              <span style={{ color: cat.color, fontWeight: 500 }}>{cat.label}</span>
            </label>
          ))}

          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray)', marginBottom: '12px', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Status
          </h4>
          {['pending', 'progress', 'resolved'].map(s => (
            <label key={s} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px', borderRadius: '8px', cursor: 'pointer',
              fontSize: '0.85rem', marginBottom: '4px',
              background: filters.statuses.includes(s) ? 'rgba(255,255,255,0.06)' : 'transparent',
            }}>
              <input
                type="checkbox"
                checked={filters.statuses.includes(s)}
                onChange={() => toggleFilter('statuses', s)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <span style={{ textTransform: 'capitalize' }}>{s}</span>
            </label>
          ))}
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={[40.7128, -74.006]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {filtered.map((issue) => {
          const cat = CATEGORIES.find(c => c.key === issue.category);
          const color = cat?.color || '#6366f1';
          return (
            <Marker
              key={issue.issue_id || issue.id}
              position={[issue.lat, issue.lng]}
              icon={L.divIcon({
                html: `<div style="background:${color};width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 16px rgba(0,0,0,0.4);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
                iconSize: [36, 36],
                iconAnchor: [18, 18],
                className: '',
              })}
            >
              <Popup>
                <div style={{ minWidth: '220px' }}>
                  <div style={{
                    fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px',
                  }}>{issue.title}</div>
                  <div style={{
                    fontSize: '0.8rem', opacity: 0.7, marginBottom: '8px',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <MapPin size={12} />
                    {issue.location || `${issue.lat?.toFixed(4)}, ${issue.lng?.toFixed(4)}`}
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '10px',
                  }}>
                    <span style={{ textTransform: 'capitalize', fontSize: '0.8rem', color: cat?.color || 'var(--primary)' }}>
                      {issue.category}
                    </span>
                    <span className={`badge badge-${issue.status}`}>
                      {issue.status}
                    </span>
                  </div>
                  <Link
                    to={`/issues/${issue.issue_id || issue.id}`}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', textDecoration: 'none', fontSize: '0.8rem' }}
                  >View Details</Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
