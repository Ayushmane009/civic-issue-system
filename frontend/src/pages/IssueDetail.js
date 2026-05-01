import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import {
  ArrowLeft, MapPin, Clock, User, Send,
  MessageCircle, Image, Calendar, Tag, Trash2, ThumbsUp, Building2
} from 'lucide-react';

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [updatingPriority, setUpdatingPriority] = useState(false);

  useEffect(() => {
    fetchIssue();
    fetchUpvoteStatus();
  }, [id, user, token]);

  const fetchUpvoteStatus = async () => {
    if (!user) return;
    try {
      const res = await axios.get('http://localhost:5000/api/users/upvotes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsUpvoted(res.data.includes(parseInt(id)));
    } catch (err) {
      console.error('Failed to load upvotes', err);
    }
  };

  const fetchIssue = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/issues/${id}`);
      setIssue(res.data);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error('Error fetching issue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/issues/comment', {
        issue_id: id,
        comment: newComment,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      addToast('Comment added!', 'success');
      setNewComment('');
      // Re-fetch to get updated data
      fetchIssue();
    } catch (err) {
      addToast('Failed to add comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this issue? This action cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/issues/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      addToast('Issue deleted successfully', 'success');
      navigate('/issues');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete issue', 'error');
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdatingStatus(true);
    try {
      await axios.put('http://localhost:5000/api/issues/status', {
        issue_id: id,
        status: newStatus
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      addToast('Status updated', 'success');
      fetchIssue();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePriorityChange = async (e) => {
    const newPriority = e.target.value;
    setUpdatingPriority(true);
    try {
      await axios.put('http://localhost:5000/api/issues/priority', {
        issue_id: id,
        priority: newPriority
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      addToast('Priority updated', 'success');
      fetchIssue();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update priority', 'error');
    } finally {
      setUpdatingPriority(false);
    }
  };

  const handleUpvote = async () => {
    if (!user) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/issues/${id}/upvote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newUpvotedState = res.data.upvoted;
      setIsUpvoted(newUpvotedState);
      
      setIssue(prev => ({
        ...prev,
        upvotes_count: (prev.upvotes_count || 0) + (newUpvotedState ? 1 : -1)
      }));
    } catch (err) {
      addToast('Failed to toggle upvote', 'error');
    }
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

  const getStatusStyle = (status) => {
    const map = {
      pending: { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171', label: 'Pending' },
      progress: { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', label: 'In Progress' },
      'in-progress': { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', label: 'In Progress' },
      resolved: { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', label: 'Resolved' },
    };
    return map[status] || map.pending;
  };

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader-spinner" />
        <p style={{ color: 'var(--text-muted)' }}>Loading issue...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>Issue not found</h2>
        <Link to="/issues" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Issues
        </Link>
      </div>
    );
  }

  const status = getStatusStyle(issue.status);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Back Button */}
      <Link to="/issues" style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px',
        textDecoration: 'none', fontWeight: 500,
        transition: 'var(--transition)',
      }}>
        <ArrowLeft size={16} /> Back to Issues
      </Link>

      {/* Issue Card */}
      <div className="modern-card animate-slideUp" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Image */}
        {issue.image && (
          <div style={{ position: 'relative' }}>
            <img
              src={`http://localhost:5000/uploads/${issue.image}`}
              alt={issue.title}
              style={{
                width: '100%', maxHeight: '360px', objectFit: 'cover',
              }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: '80px',
              background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.9))',
            }} />
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Admin Controls — only show if admin belongs to same department or has no dept (super admin) */}
          {user?.role === 'admin' && (!user?.department_id || user?.department_id === issue.department_id) && (
            <div style={{
              background: 'var(--bg-secondary)',
              padding: '16px', borderRadius: 'var(--radius-md)',
              marginBottom: '20px', display: 'flex', gap: '16px',
              alignItems: 'center', flexWrap: 'wrap'
            }}>
              <div style={{ fontWeight: 600, color: 'var(--primary)' }}>Admin Controls:</div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select 
                  value={issue.status} 
                  onChange={handleStatusChange}
                  disabled={updatingStatus}
                  className="input-modern"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select 
                  value={issue.priority || 'Medium'} 
                  onChange={handlePriorityChange}
                  disabled={updatingPriority}
                  className="input-modern"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <button onClick={handleDelete} className="btn btn-sm" style={{
                  background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          )}

          {/* Category + Status */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '16px', flexWrap: 'wrap', gap: '10px',
          }}>
            <span className="badge badge-category" style={{ textTransform: 'capitalize' }}>
              <Tag size={12} />
              {issue.category || 'General'}
            </span>
            <span className="badge" style={{
              background: status.bg, color: status.color,
              padding: '6px 14px', fontSize: '0.8rem',
            }}>
              {status.label}
            </span>
            <span className="badge" style={{
              background: getPriorityStyle(issue.priority).bg, color: getPriorityStyle(issue.priority).color,
              padding: '6px 14px', fontSize: '0.8rem',
            }}>
              {issue.priority || 'Medium'}
            </span>
            {/* Department Badge */}
            {issue.department_name && (
              <span className="badge dept-badge" style={{
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '6px 14px', fontSize: '0.8rem',
              }}>
                <Building2 size={12} /> {issue.department_name}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '1.6rem', fontWeight: 800,
            marginBottom: '16px', lineHeight: 1.3,
          }}>{issue.title}</h1>

          {/* Meta */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '20px',
            marginBottom: '24px',
          }}>
            {issue.location && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '0.85rem', color: 'var(--text-secondary)',
              }}>
                <MapPin size={14} style={{ color: 'var(--primary)' }} />
                {issue.location}
              </div>
            )}
            {issue.created_at && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '0.85rem', color: 'var(--text-secondary)',
              }}>
                <Calendar size={14} style={{ color: 'var(--primary)' }} />
                {new Date(issue.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </div>
            )}
            
            {/* Upvote Button */}
            <button 
              onClick={handleUpvote}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: isUpvoted ? 'var(--primary-light)' : 'var(--bg-secondary)',
                border: `1px solid ${isUpvoted ? 'var(--primary)' : 'var(--border-light)'}`,
                color: isUpvoted ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                padding: '6px 12px', borderRadius: 'var(--radius-md)',
                transition: 'var(--transition)', marginLeft: 'auto'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <ThumbsUp size={16} fill={isUpvoted ? 'var(--primary)' : 'none'} />
              {issue.upvotes_count || 0} Upvotes
            </button>
          </div>

          {/* Description */}
          <div style={{
            padding: '20px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            marginBottom: '32px',
          }}>
            {issue.description || 'No description provided.'}
          </div>

          {/* Admin Remarks Section */}
          {issue.remarks && (
            <div style={{
              padding: '16px 20px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              marginBottom: '32px',
            }}>
              <h4 style={{
                fontSize: '0.9rem', fontWeight: 700,
                color: 'var(--primary)',
                marginBottom: '8px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <MessageCircle size={14} /> Admin Remarks
              </h4>
              <p style={{
                fontSize: '0.9rem', color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                {issue.remarks}
              </p>
            </div>
          )}

          {/* Comments Section */}
          <div>
            <h3 style={{
              fontSize: '1.1rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '20px',
            }}>
              <MessageCircle size={18} style={{ color: 'var(--primary)' }} />
              Comments
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleComment} style={{
              display: 'flex', gap: '10px', marginBottom: '24px',
            }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="input-modern"
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="btn btn-primary"
                style={{
                  flexShrink: 0,
                  opacity: submitting || !newComment.trim() ? 0.5 : 1,
                }}
              >
                {submitting ? (
                  <div className="loader-spinner-sm" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {comments.map((c) => (
                  <div key={c.comment_id} className="modern-card animate-slideUp" style={{ 
                    padding: '16px', 
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '24px', height: '24px', borderRadius: '50%', 
                          background: 'var(--primary)', display: 'flex', 
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', fontWeight: 800, color: 'white'
                        }}>
                          {c.user_name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                          {c.user_name}
                        </span>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(c.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p style={{ 
                      fontSize: '0.9rem', 
                      color: 'var(--text-secondary)', 
                      lineHeight: 1.6,
                      paddingLeft: '32px'
                    }}>
                      {c.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center', padding: '32px',
                color: 'var(--text-muted)', fontSize: '0.9rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
              }}>
                No comments yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
