import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  LayoutDashboard, PlusCircle, MapPin, List, Globe,
  User, LogOut, BarChart3, Award, TrendingUp
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState({ total: 0, resolved: 0 });

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Report Issue', icon: PlusCircle, path: '/report' },
    { name: 'Map View', icon: MapPin, path: '/map' },
    { name: 'My Issues', icon: List, path: '/my-issues' },
    { name: 'All Issues', icon: Globe, path: '/issues' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/issues/all');
        const issues = res.data;
        setStats({
          total: issues.length,
          resolved: issues.filter(i => i.status === 'resolved').length,
        });
      } catch (err) {
        // Fallback
        setStats({ total: 0, resolved: 0 });
      }
    };
    fetchStats();
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <aside style={{
      width: '280px',
      height: 'calc(100vh - 64px)',
      position: 'sticky',
      top: '64px',
      overflowY: 'auto',
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.06)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: 'var(--gradient-primary)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <MapPin size={22} color="white" />
          </div>
          <div>
            <h2 style={{
              fontSize: '1.2rem',
              fontWeight: 800,
            }}>
              <span className="text-gradient">NAGAR-SATHI</span>
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Community First</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderRadius: '14px',
                color: isActive(item.path) ? 'white' : 'var(--gray-light)',
                background: isActive(item.path) ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                fontWeight: isActive(item.path) ? 600 : 500,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'var(--transition)',
                position: 'relative',
              }}
            >
              {isActive(item.path) && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '20px',
                  background: 'var(--primary)',
                  borderRadius: '0 4px 4px 0',
                }} />
              )}
              <item.icon size={18} style={{
                color: isActive(item.path) ? 'var(--primary)' : 'var(--gray)',
              }} />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Stats */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '14px',
            borderRadius: '14px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '1.4rem',
              fontWeight: 800,
            }} className="text-gradient">{stats.total}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--gray)', marginTop: '2px' }}>Total Issues</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '14px',
            borderRadius: '14px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--secondary)',
            }}>{stats.resolved}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--gray)', marginTop: '2px' }}>Resolved</div>
          </div>
        </div>
      </div>

      {/* Profile Footer */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '14px',
          marginBottom: '10px',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--gradient-pink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.85rem',
            flexShrink: 0,
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{
              fontWeight: 600,
              fontSize: '0.9rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>{user?.name || 'User'}</p>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--gray)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>{user?.email}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Link to="/profile" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 14px',
            borderRadius: '10px',
            color: 'var(--gray-light)',
            fontSize: '0.85rem',
            textDecoration: 'none',
            transition: 'var(--transition)',
          }}>
            <User size={15} />
            Profile
          </Link>
          <button onClick={logout} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 14px',
            borderRadius: '10px',
            color: 'var(--gray-light)',
            fontSize: '0.85rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'var(--transition)',
            width: '100%',
          }}>
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
