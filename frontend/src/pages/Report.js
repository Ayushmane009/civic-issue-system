import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Camera, Send, X, Flag, Check,
  Construction, Shield, Trash2, Bus, Crosshair, Loader
} from 'lucide-react';

const CATEGORIES = [
  { value: 'infrastructure', label: 'Infrastructure', icon: Construction, color: '#f59e0b' },
  { value: 'safety', label: 'Safety', icon: Shield, color: '#ef4444' },
  { value: 'sanitation', label: 'Sanitation', icon: Trash2, color: '#10b981' },
  { value: 'transport', label: 'Transport', icon: Bus, color: '#3b82f6' },
];

const Report = () => {
  const { token } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', location: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  // Reverse geocode coordinates to a human-readable address
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        // Build a readable address from components
        const parts = [
          addr.road || addr.pedestrian || addr.neighbourhood,
          addr.suburb || addr.village,
          addr.city || addr.town || addr.state_district,
          addr.state,
        ].filter(Boolean);
        return parts.join(', ') || data.display_name;
      }
      return data.display_name || '';
    } catch {
      return '';
    }
  }, []);

  // Detect user location
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        if (address) {
          setFormData(prev => ({ ...prev, location: address }));
          addToast('Location detected successfully!', 'success');
        } else {
          setFormData(prev => ({ ...prev, location: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` }));
          addToast('Got coordinates, but could not get address', 'info');
        }
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            addToast('Location permission denied. Please allow location access.', 'error');
            break;
          case error.POSITION_UNAVAILABLE:
            addToast('Location information is unavailable.', 'error');
            break;
          case error.TIMEOUT:
            addToast('Location request timed out.', 'error');
            break;
          default:
            addToast('An unknown error occurred while detecting location.', 'error');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [addToast, reverseGeocode]);

  // Auto-detect location on page load
  useEffect(() => {
    detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      addToast('Please select a category', 'error');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('location', formData.location);
    if (image) data.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/issues/report', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      addToast('Issue reported successfully!', 'success');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      addToast('Failed to report issue. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: '32px 24px',
    }}>
      <div className="glass-card animate-slideUp" style={{ padding: '36px' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '32px', paddingBottom: '20px',
          borderBottom: '1px solid var(--glass-border)',
        }}>
          <h2 style={{
            fontSize: '1.5rem', fontWeight: 800,
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <Flag size={22} style={{ color: 'var(--primary)' }} />
            Report New Issue
          </h2>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)', border: 'none',
              color: 'var(--gray-light)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'var(--transition)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block', fontSize: '0.85rem', fontWeight: 600,
              color: 'var(--gray-light)', marginBottom: '12px',
            }}>Select Category</label>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px',
            }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${formData.category === cat.value ? cat.color : 'var(--glass-border)'}`,
                    background: formData.category === cat.value ? `${cat.color}15` : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'var(--transition)',
                    color: cat.color,
                  }}
                >
                  <cat.icon size={24} style={{ margin: '0 auto 8px', display: 'block' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block', fontSize: '0.85rem', fontWeight: 600,
              color: 'var(--gray-light)', marginBottom: '8px',
            }}>Issue Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Pothole on Main Street"
              className="input-dark"
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block', fontSize: '0.85rem', fontWeight: 600,
              color: 'var(--gray-light)', marginBottom: '8px',
            }}>Description</label>
            <textarea
              rows="4"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              className="input-dark"
              style={{ resize: 'vertical', minHeight: '100px' }}
            />
          </div>

          {/* Location */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block', fontSize: '0.85rem', fontWeight: 600,
              color: 'var(--gray-light)', marginBottom: '8px',
            }}>Location</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <MapPin size={16} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--gray)',
                }} />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={locating ? 'Detecting your location...' : 'e.g., Main Street intersection'}
                  className="input-dark"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
              <button
                type="button"
                onClick={detectLocation}
                disabled={locating}
                title="Detect my location"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '0 16px',
                  background: locating
                    ? 'rgba(99, 102, 241, 0.15)'
                    : 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--primary-light)',
                  cursor: locating ? 'not-allowed' : 'pointer',
                  transition: 'var(--transition)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  opacity: locating ? 0.7 : 1,
                }}
              >
                {locating ? (
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Crosshair size={16} />
                )}
                {locating ? 'Detecting...' : 'Detect'}
              </button>
            </div>
          </div>

          {/* Photo Upload */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block', fontSize: '0.85rem', fontWeight: 600,
              color: 'var(--gray-light)', marginBottom: '8px',
            }}>Photo (optional)</label>
            <label style={{
              display: 'block',
              padding: '24px',
              border: '2px dashed var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'var(--transition)',
              position: 'relative',
            }}>
              {image ? (
                <>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    style={{
                      maxHeight: '120px', borderRadius: '12px',
                      margin: '0 auto 12px', objectFit: 'cover',
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--secondary)' }}>
                    <Check size={16} />
                    <span style={{ fontSize: '0.85rem' }}>{image.name}</span>
                  </div>
                </>
              ) : (
                <>
                  <Camera size={28} style={{ color: 'var(--gray)', margin: '0 auto 10px', display: 'block' }} />
                  <div style={{ fontWeight: 500, marginBottom: '4px' }}>Click to upload photo</div>
                  <small style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>JPG, PNG up to 10MB</small>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                style={{
                  position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer',
                }}
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%', padding: '16px',
              fontSize: '1rem', borderRadius: 'var(--radius-md)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <><div className="loader-spinner-sm" /> Submitting...</>
            ) : (
              <><Send size={18} /> Submit Report</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Report;
