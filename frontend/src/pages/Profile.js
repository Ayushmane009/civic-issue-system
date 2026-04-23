import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  User, Mail, MapPin, Calendar, Clock,
  CheckCircle, AlertCircle, ChevronRight, FileText
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserIssues = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/issues/all');
        console.log(res);
        const userIssues = res.data.filter(i =>
          i.user_id === (user?.id || user?.user_id)
        );
        setIssues(userIssues);
      } catch (err) {
        console.error('Error fetching issues:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserIssues();
  }, [user]);

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
  };

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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Profile Card */}
      <div className="glass-card animate-slideUp" style={{ padding: '36px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '24px',
          flexWrap: 'wrap',
        }}>
          {/* Avatar */}
          <div style={{
            width: '80px', height: '80px',
            borderRadius: '20px',
            background: 'var(--gradient-pink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.6rem',
            flexShrink: 0,
            boxShadow: '0 8px 20px rgba(240, 147, 251, 0.3)',
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>
              {user?.name || 'Ayush'}
            </h1>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--gray)', fontSize: '0.9rem',
            }}>
              <Mail size={14} />
              {user?.email || 'No email'}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
          marginTop: '28px', paddingTop: '24px',
          borderTop: '1px solid var(--glass-border)',
        }}>
          <div style={{
            textAlign: 'center', padding: '16px',
            background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)',
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }} className="text-gradient">{stats.total}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: '4px' }}>Reported</div>
          </div>
          <div style={{
            textAlign: 'center', padding: '16px',
            background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)',
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--warning)' }}>{stats.pending}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: '4px' }}>Pending</div>
          </div>
          <div style={{
            textAlign: 'center', padding: '16px',
            background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)',
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)' }}>{stats.resolved}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: '4px' }}>Resolved</div>
          </div>
        </div>
      </div>

      {/* My Issues */}
      <div className="glass-card animate-slideUp" style={{ padding: '24px' }}>
        <h2 style={{
          fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <FileText size={18} style={{ color: 'var(--primary)' }} />
          My Reported Issues
        </h2>

        {loading ? (
          <div className="loader-overlay" style={{ minHeight: '200px' }}>
            <div className="loader-spinner" />
          </div>
        ) : issues.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 20px', color: 'var(--gray)',
          }}>
            <AlertCircle size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ marginBottom: '16px' }}>You haven't reported any issues yet.</p>
            <Link to="/report" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Report Your First Issue
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {issues.map((issue) => (
              <Link
                key={issue.id}
                to={`/issues/${issue.id}`}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--glass-border)',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'var(--transition)',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{issue.title}</div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    fontSize: '0.75rem', color: 'var(--gray)',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={11} />
                      {issue.location || 'No location'}
                    </span>
                    {issue.created_at && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={11} />
                        {new Date(issue.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <span className="badge" style={getStatusBadge(issue.status)}>
                    {issue.status}
                  </span>
                  <ChevronRight size={16} style={{ color: 'var(--gray)' }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
