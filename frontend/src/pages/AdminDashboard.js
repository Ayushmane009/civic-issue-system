import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  BarChart3, Clock, CheckCircle, RefreshCw, AlertCircle,
  Search, Filter, MapPin, Calendar, MessageCircle,
  Construction, Shield, Trash2, Bus, ChevronDown,
  Send, Eye, TrendingUp, Users, Building2, X
} from 'lucide-react';

// Department config — colors & icons
const DEPT_CONFIG = {
  1: { name: 'Infrastructure', icon: Construction, color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  2: { name: 'Sanitization', icon: Trash2, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
  3: { name: 'Safety', icon: Shield, color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
  4: { name: 'Transport', icon: Bus, color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Issues' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [remarksModal, setRemarksModal] = useState({ open: false, issueId: null, remarks: '' });
  const [updatingId, setUpdatingId] = useState(null);

  const deptId = user?.department_id;
  const deptConfig = DEPT_CONFIG[deptId] || DEPT_CONFIG[1];
  const DeptIcon = deptConfig.icon;

  useEffect(() => {
    if (deptId) {
      fetchIssues();
      fetchStats();
    }
  }, [deptId, statusFilter]);

  const fetchIssues = async () => {
    try {
      const url = `http://localhost:5000/api/issues/department/${deptId}${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIssues(res.data);
    } catch (err) {
      console.error('Failed to fetch department issues:', err);
      addToast('Failed to load issues', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/departments/${deptId}/stats`);
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    setUpdatingId(issueId);
    try {
      await axios.put('http://localhost:5000/api/issues/status', {
        issue_id: issueId,
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast(`Status updated to ${newStatus}`, 'success');
      fetchIssues();
      fetchStats();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePriorityChange = async (issueId, newPriority) => {
    try {
      await axios.put('http://localhost:5000/api/issues/priority', {
        issue_id: issueId,
        priority: newPriority
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast(`Priority updated to ${newPriority}`, 'success');
      fetchIssues();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update priority', 'error');
    }
  };

  const handleAddRemarks = async () => {
    if (!remarksModal.remarks.trim()) return;
    try {
      await axios.put('http://localhost:5000/api/issues/remarks', {
        issue_id: remarksModal.issueId,
        remarks: remarksModal.remarks
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('Remarks added', 'success');
      setRemarksModal({ open: false, issueId: null, remarks: '' });
      fetchIssues();
    } catch (err) {
      addToast('Failed to add remarks', 'error');
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (!search) return true;
    return issue.title?.toLowerCase().includes(search.toLowerCase()) ||
           issue.description?.toLowerCase().includes(search.toLowerCase()) ||
           issue.reporter_name?.toLowerCase().includes(search.toLowerCase());
  });

  const getStatusStyle = (status) => {
    const map = {
      pending: { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171' },
      progress: { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24' },
      'in-progress': { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24' },
      resolved: { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399' },
    };
    return map[status] || map.pending;
  };

  const getPriorityStyle = (priority) => {
    const map = {
      Low: { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399' },
      Medium: { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24' },
      High: { bg: 'rgba(234, 88, 12, 0.12)', color: '#f97316' },
      Urgent: { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171' },
    };
    return map[priority] || map.Medium;
  };

  // Non-admin or no department assigned
  if (!user || user.role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <AlertCircle size={48} style={{ color: 'var(--danger)', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)' }}>This page is for department admins only.</p>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '20px', textDecoration: 'none' }}>
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (!deptId) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <Building2 size={48} style={{ color: 'var(--warning)', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>No Department Assigned</h2>
        <p style={{ color: 'var(--text-muted)' }}>You are an admin but haven't been assigned to a department yet.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader-spinner" />
        <p style={{ color: 'var(--text-muted)' }}>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Department Header */}
      <div className="modern-card animate-slideUp" style={{
        padding: '24px 28px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        borderLeft: `4px solid ${deptConfig.color}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: deptConfig.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 24px ${deptConfig.color}40`,
          }}>
            <DeptIcon size={26} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {deptConfig.name} <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Admin Panel</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
              Manage {deptConfig.name.toLowerCase()} issues for your city
            </p>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', borderRadius: '12px',
          background: `${deptConfig.color}15`, border: `1px solid ${deptConfig.color}30`,
        }}>
          <div className="live-dot" style={{ background: deptConfig.color }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: deptConfig.color }}>
            {user?.name || 'Admin'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px', marginBottom: '24px',
      }} className="admin-stat-row">
        {[
          { label: 'Total Issues', value: stats.total || 0, icon: BarChart3, color: deptConfig.color },
          { label: 'Pending', value: stats.pending || 0, icon: Clock, color: '#f87171' },
          { label: 'In Progress', value: stats.in_progress || 0, icon: RefreshCw, color: '#fbbf24' },
          { label: 'Resolved', value: stats.resolved || 0, icon: CheckCircle, color: '#34d399' },
        ].map((s, i) => (
          <div key={i} className="modern-card" style={{
            padding: '20px', display: 'flex', alignItems: 'center', gap: '14px',
            animation: `slideUp 0.4s ease-out ${i * 0.08}s both`,
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px',
              background: `${s.color}15`, display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <s.icon size={22} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1, color: 'var(--text-main)' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="modern-card" style={{
        padding: '16px', marginBottom: '24px',
        display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 250px' }}>
          <Search size={16} style={{
            position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)',
          }} />
          <input
            type="text"
            placeholder="Search issues, reporters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-modern"
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              style={{
                padding: '8px 16px', borderRadius: '10px',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                border: '1px solid var(--border-light)',
                background: statusFilter === opt.value ? `${deptConfig.color}15` : 'var(--bg-card)',
                color: statusFilter === opt.value ? deptConfig.color : 'var(--text-secondary)',
                borderColor: statusFilter === opt.value ? deptConfig.color : 'var(--border-light)',
                transition: 'var(--transition)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button
          onClick={() => { fetchIssues(); fetchStats(); addToast('Refreshed!'); }}
          className="btn btn-sm btn-secondary"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Issues Table/Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredIssues.map((issue, idx) => {
          const statusStyle = getStatusStyle(issue.status);
          const priorityStyle = getPriorityStyle(issue.priority);

          return (
            <div
              key={issue.id}
              className="modern-card"
              style={{
                padding: '20px',
                borderLeft: `3px solid ${deptConfig.color}`,
                animation: `slideUp 0.3s ease-out ${idx * 0.04}s both`,
              }}
            >
              {/* Top Row: Title + Badges */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px',
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <Link to={`/issues/${issue.id}`} style={{
                    fontSize: '1.05rem', fontWeight: 700,
                    color: 'var(--text-main)', textDecoration: 'none',
                    display: 'block', marginBottom: '6px',
                  }}>
                    {issue.title}
                  </Link>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    fontSize: '0.8rem', color: 'var(--text-secondary)',
                  }}>
                    {issue.reporter_name && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} /> {issue.reporter_name}
                      </span>
                    )}
                    {issue.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {issue.location}
                      </span>
                    )}
                    {issue.created_at && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        {new Date(issue.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                    {issue.status}
                  </span>
                  <span className="badge" style={{ background: priorityStyle.bg, color: priorityStyle.color }}>
                    {issue.priority || 'Medium'}
                  </span>
                  <span className="badge dept-badge" style={{
                    background: `${deptConfig.color}15`,
                    color: deptConfig.color,
                  }}>
                    <DeptIcon size={11} /> {deptConfig.name}
                  </span>
                </div>
              </div>

              {/* Description snippet */}
              {issue.description && (
                <p style={{
                  fontSize: '0.85rem', color: 'var(--text-secondary)',
                  marginBottom: '14px', lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {issue.description}
                </p>
              )}

              {/* Existing remarks */}
              {issue.remarks && (
                <div style={{
                  padding: '10px 14px', borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  marginBottom: '14px', fontSize: '0.82rem',
                }}>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Admin Remarks: </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{issue.remarks}</span>
                </div>
              )}

              {/* Action Bar */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', paddingTop: '12px',
                borderTop: '1px solid var(--border-light)',
                flexWrap: 'wrap', gap: '10px',
              }}>
                {/* Status Update */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status:</span>
                  <select
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                    disabled={updatingId === issue.id}
                    className="input-modern"
                    style={{
                      width: 'auto', padding: '6px 12px',
                      fontSize: '0.8rem', borderRadius: '10px',
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginLeft: '8px' }}>Priority:</span>
                  <select
                    value={issue.priority || 'Medium'}
                    onChange={(e) => handlePriorityChange(issue.id, e.target.value)}
                    className="input-modern"
                    style={{
                      width: 'auto', padding: '6px 12px',
                      fontSize: '0.8rem', borderRadius: '10px',
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setRemarksModal({ open: true, issueId: issue.id, remarks: issue.remarks || '' })}
                    className="btn btn-sm btn-secondary"
                    style={{ fontSize: '0.78rem' }}
                  >
                    <MessageCircle size={13} /> Remarks
                  </button>
                  <Link
                    to={`/issues/${issue.id}`}
                    className="btn btn-sm btn-secondary"
                    style={{ textDecoration: 'none', fontSize: '0.78rem' }}
                  >
                    <Eye size={13} /> View
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredIssues.length === 0 && (
        <div className="modern-card" style={{
          textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)',
        }}>
          <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>
            No issues found
          </h3>
          <p>No {statusFilter !== 'all' ? statusFilter : ''} issues in {deptConfig.name} department</p>
        </div>
      )}

      {/* Remarks Modal */}
      {remarksModal.open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
        }} onClick={() => setRemarksModal({ open: false, issueId: null, remarks: '' })}>
          <div
            className="modern-card animate-slideUp"
            style={{
              width: '90%', maxWidth: '500px', padding: '28px',
              background: 'var(--bg-card)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageCircle size={18} style={{ color: deptConfig.color }} />
                Add Remarks
              </h3>
              <button
                onClick={() => setRemarksModal({ open: false, issueId: null, remarks: '' })}
                style={{
                  background: 'none', border: 'none', color: 'var(--text-muted)',
                  cursor: 'pointer', padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <textarea
              value={remarksModal.remarks}
              onChange={(e) => setRemarksModal({ ...remarksModal, remarks: e.target.value })}
              placeholder="Add admin remarks or comments about this issue..."
              className="input-modern"
              rows="4"
              style={{ resize: 'vertical', minHeight: '100px', marginBottom: '16px' }}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setRemarksModal({ open: false, issueId: null, remarks: '' })}
                className="btn btn-sm btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRemarks}
                className="btn btn-sm btn-primary"
                disabled={!remarksModal.remarks.trim()}
                style={{ opacity: !remarksModal.remarks.trim() ? 0.5 : 1 }}
              >
                <Send size={14} /> Save Remarks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .admin-stat-row {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .admin-stat-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
