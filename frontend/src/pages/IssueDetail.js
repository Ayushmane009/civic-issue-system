import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import {
  ArrowLeft, MapPin, Clock, User, Send,
  MessageCircle, Image, Calendar, Tag
} from 'lucide-react';

const IssueDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/issues/${id}`);
      setIssue(res.data);
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
        <p style={{ color: 'var(--gray)' }}>Loading issue...</p>
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
        color: 'var(--gray-light)', fontSize: '0.9rem', marginBottom: '24px',
        textDecoration: 'none', fontWeight: 500,
        transition: 'var(--transition)',
      }}>
        <ArrowLeft size={16} /> Back to Issues
      </Link>

      {/* Issue Card */}
      <div className="glass-card animate-slideUp" style={{ padding: '0', overflow: 'hidden' }}>
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
                fontSize: '0.85rem', color: 'var(--gray-light)',
              }}>
                <MapPin size={14} style={{ color: 'var(--primary)' }} />
                {issue.location}
              </div>
            )}
            {issue.created_at && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '0.85rem', color: 'var(--gray-light)',
              }}>
                <Calendar size={14} style={{ color: 'var(--primary)' }} />
                {new Date(issue.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)',
            lineHeight: 1.7,
            color: 'var(--gray-light)',
            fontSize: '0.95rem',
            marginBottom: '32px',
          }}>
            {issue.description || 'No description provided.'}
          </div>

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
                className="input-dark"
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
            {comments.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '32px',
                color: 'var(--gray)', fontSize: '0.9rem',
                background: 'rgba(255,255,255,0.02)',
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
