import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin, Clock, MessageCircle, Search,
  Filter, Image, ChevronRight, AlertCircle, Plus, ThumbsUp
} from 'lucide-react';

const Issues = ({ myIssues = false }) => {
  const { user, token } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [upvotedIssues, setUpvotedIssues] = useState(new Set());

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/issues/all');
        let data = res.data;
        if (myIssues && user) {
          data = data.filter(i => i.user_id === (user.id || user.user_id));
        }
        setIssues(data);
      } catch (err) {
        setError('Failed to load issues');
      } finally {
        setLoading(false);
      }
    };

    const fetchUpvotes = async () => {
      if (!user) return;
      try {
        const res = await axios.get('http://localhost:5000/api/users/upvotes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUpvotedIssues(new Set(res.data));
      } catch (err) {
        console.error('Failed to load upvotes', err);
      }
    };

    fetchIssues();
    fetchUpvotes();
  }, [myIssues, user, token]);

  const handleUpvote = async (e, issueId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return; // or show toast

    try {
      const res = await axios.post(`http://localhost:5000/api/issues/${issueId}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const isUpvoted = res.data.upvoted;
      
      setUpvotedIssues(prev => {
        const next = new Set(prev);
        if (isUpvoted) next.add(issueId);
        else next.delete(issueId);
        return next;
      });

      setIssues(prev => prev.map(iss => {
        if (iss.id === issueId) {
          return { ...iss, upvotes_count: (iss.upvotes_count || 0) + (isUpvoted ? 1 : -1) };
        }
        return iss;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = issues.filter(issue => {
    const matchSearch = !search ||
      issue.title?.toLowerCase().includes(search.toLowerCase()) ||
      issue.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const statusOptions = ['all', 'pending', 'progress', 'in-progress', 'resolved'];
  const categoryOptions = ['all', 'infrastructure', 'safety', 'sanitation', 'transport'];

  const getStatusBadge = (status) => {
    const map = {
      pending: { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171' },
      progress: { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24' },
      'in-progress': { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24' },
      resolved: { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399' },
    };
    const s = map[status] || map.pending;
    return { background: s.bg, color: s.color };
  };

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader-spinner" />
        <p style={{ color: 'var(--gray)' }}>Loading issues...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '24px', flexWrap: 'wrap', gap: '16px',
      }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {myIssues ? 'My Issues' : 'All Issues'}
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem', marginTop: '4px' }}>
            {filtered.length} issue{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <Link to="/report" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={16} /> Report Issue
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="glass-card" style={{
        padding: '16px', marginBottom: '24px',
        display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: '1 1 250px' }}>
          <Search size={16} style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--gray)',
          }} />
          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-dark"
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-dark"
          style={{ flex: '0 0 auto', width: 'auto', cursor: 'pointer' }}
        >
          {statusOptions.map(s => (
            <option key={s} value={s} style={{ background: 'var(--dark-lighter)' }}>
              {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="input-dark"
          style={{ flex: '0 0 auto', width: 'auto', cursor: 'pointer' }}
        >
          {categoryOptions.map(c => (
            <option key={c} value={c} style={{ background: 'var(--dark-lighter)' }}>
              {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Issue Cards */}
      {error && (
        <div style={{
          padding: '16px', background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 'var(--radius-md)', color: '#f87171',
          marginBottom: '20px',
        }}>{error}</div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '16px',
      }}>
        {filtered.map((issue) => (
          <Link
            key={issue.id}
            to={`/issues/${issue.id}`}
            className="glass-card glass-card-hover"
            style={{
              padding: 0,
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Image */}
            {issue.image && (
              <div style={{
                height: '180px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <img
                  src={`http://localhost:5000/uploads/${issue.image}`}
                  alt={issue.title}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                  }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: '60px',
                  background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.8))',
                }} />
              </div>
            )}

            {/* Content */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Category & Status */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '12px',
              }}>
                <span className="badge badge-category" style={{ textTransform: 'capitalize' }}>
                  {issue.category || 'General'}
                </span>
                <span className="badge" style={getStatusBadge(issue.status)}>
                  {issue.status}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '1.05rem', fontWeight: 700,
                marginBottom: '8px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>{issue.title}</h3>

              {/* Description */}
              <p style={{
                color: 'var(--gray-light)', fontSize: '0.85rem',
                lineHeight: 1.5, marginBottom: '16px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flex: 1,
              }}>{issue.description}</p>

              {/* Footer */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid var(--glass-border)',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.8rem', color: 'var(--gray)',
                }}>
                  <MapPin size={13} />
                  {issue.location || 'Unknown'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button 
                    onClick={(e) => handleUpvote(e, issue.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      background: 'none', border: 'none',
                      color: upvotedIssues.has(issue.id) ? 'var(--primary)' : 'var(--gray)',
                      cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                      padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <ThumbsUp size={14} fill={upvotedIssues.has(issue.id) ? 'var(--primary)' : 'none'} />
                    {issue.upvotes_count || 0}
                  </button>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.8rem', color: 'var(--primary-light)',
                    fontWeight: 600,
                  }}>
                    View <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && !error && (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          color: 'var(--gray)',
        }}>
          <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--light)' }}>
            No issues found
          </h3>
          <p style={{ marginBottom: '20px' }}>Try adjusting your search or filters</p>
          <Link to="/report" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <Plus size={16} /> Report an Issue
          </Link>
        </div>
      )}
    </div>
  );
};

export default Issues;
