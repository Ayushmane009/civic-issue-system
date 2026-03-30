import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import {
  BarChart3, MapPin, Clock, CheckCircle, AlertCircle,
  TrendingUp, Users, RefreshCw, Navigation, Plus,
  ThumbsUp, MessageCircle, Construction, Shield, Trash2, Bus
} from 'lucide-react';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CATEGORY_MAP = {
  infrastructure: { icon: Construction, color: '#f59e0b', label: 'Infrastructure' },
  safety: { icon: Shield, color: '#ef4444', label: 'Safety' },
  sanitation: { icon: Trash2, color: '#10b981', label: 'Sanitation' },
  transport: { icon: Bus, color: '#3b82f6', label: 'Transport' },
};

const STATUS_COLORS = {
  pending: { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171', icon: Clock },
  progress: { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', icon: RefreshCw },
  'in-progress': { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', icon: RefreshCw },
  resolved: { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', icon: CheckCircle },
};

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    categories: ['infrastructure', 'safety', 'sanitation', 'transport'],
    statuses: ['pending', 'progress', 'in-progress', 'resolved'],
  });
  const mapRef = useRef();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/issues/all');
      const issuesWithCoords = res.data.map(issue => ({
        ...issue,
        lat: issue.lat || 40.7128 + (Math.random() - 0.5) * 0.05,
        lng: issue.lng || -74.0060 + (Math.random() - 0.5) * 0.05,
      }));
      setIssues(issuesWithCoords);
    } catch (err) {
      setIssues([
        { issue_id: 1, title: 'Pothole on Main St', category: 'infrastructure', status: 'pending', lat: 40.73, lng: -74.00 },
        { issue_id: 2, title: 'Broken Streetlight', category: 'safety', status: 'progress', lat: 40.71, lng: -74.01 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter(i =>
    activeFilters.categories.includes(i.category) &&
    activeFilters.statuses.includes(i.status)
  );

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    inProgress: issues.filter(i => i.status === 'progress' || i.status === 'in-progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
  };

  const toggleFilter = (type, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value],
    }));
  };

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader-spinner" />
        <p style={{ color: 'var(--gray)' }}>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', padding: '20px', height: 'calc(100vh - 64px)', overflow: 'hidden' }}
      className="dashboard-grid"
    >
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="stat-row">
        {[
          { label: 'Total Issues', value: stats.total, icon: BarChart3, color: 'var(--primary)' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'var(--danger)' },
          { label: 'In Progress', value: stats.inProgress, icon: RefreshCw, color: 'var(--warning)' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'var(--secondary)' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px',
              background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <s.icon size={22} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '4px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Map + Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', flex: 1, minHeight: 0 }}
        className="map-activity-grid"
      >
        {/* Map */}
        <div className="glass-card" style={{
          padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)',
          position: 'relative', minHeight: '400px',
        }}>
          {/* Map Controls */}
          <div style={{
            position: 'absolute', top: '14px', left: '14px', zIndex: 1000,
            display: 'flex', gap: '8px',
          }}>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => { fetchData(); addToast('Refreshed!'); }}
              style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)' }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <MapContainer
            center={[40.7128, -74.0060]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {filteredIssues.map((issue) => {
              const cat = CATEGORY_MAP[issue.category] || { color: '#6366f1' };
              return (
                <Marker
                  key={issue.issue_id || issue.id}
                  position={[issue.lat, issue.lng]}
                  icon={L.divIcon({
                    html: `<div style="background:${cat.color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                    className: '',
                  })}
                >
                  <Popup>
                    <div style={{ minWidth: '200px' }}>
                      <div style={{ fontWeight: 700, marginBottom: '6px' }}>{issue.title}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '8px' }}>
                        {issue.location || `${issue.lat?.toFixed(4)}, ${issue.lng?.toFixed(4)}`}
                      </div>
                      <span className={`badge badge-${issue.status}`}>
                        {issue.status}
                      </span>
                      <Link
                        to={`/issues/${issue.issue_id || issue.id}`}
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%', marginTop: '10px', textDecoration: 'none', fontSize: '0.8rem' }}
                      >View Details</Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* FAB */}
          <Link to="/report" className="report-fab" style={{ textDecoration: 'none' }}>
            <Plus size={24} />
          </Link>
        </div>

        {/* Activity Feed */}
        <div className="glass-card" style={{
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} /> Activity
            </h3>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)',
            }}>
              <div className="live-dot" />
              LIVE
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {filteredIssues.slice(0, 10).map((issue, i) => {
              const cat = CATEGORY_MAP[issue.category] || { color: 'var(--primary)', label: 'Other' };
              const statusConf = STATUS_COLORS[issue.status] || STATUS_COLORS.pending;
              return (
                <Link
                  key={issue.issue_id || issue.id}
                  to={`/issues/${issue.issue_id || issue.id}`}
                  style={{
                    display: 'block',
                    padding: '14px',
                    borderRadius: '14px',
                    borderLeft: `3px solid ${cat.color}`,
                    background: 'rgba(255, 255, 255, 0.03)',
                    transition: 'var(--transition)',
                    textDecoration: 'none',
                    color: 'inherit',
                    animation: `slideIn 0.3s ease-out ${i * 0.05}s both`,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                    {issue.title}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '0.75rem', color: 'var(--gray)',
                    marginBottom: '6px',
                  }}>
                    <MapPin size={12} />
                    {issue.location || 'No location'}
                  </div>
                  <span className={`badge badge-${issue.status}`}>
                    {issue.status}
                  </span>
                </Link>
              );
            })}
            {filteredIssues.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray)' }}>
                <AlertCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p>No issues match filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        .dashboard-grid {
          grid-template-rows: auto 1fr;
        }
        @media (max-width: 1024px) {
          .map-activity-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-grid {
            height: auto !important;
            overflow: auto !important;
          }
        }
        @media (max-width: 768px) {
          .stat-row {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .stat-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
