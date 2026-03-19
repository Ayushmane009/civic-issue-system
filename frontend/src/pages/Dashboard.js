import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BarChart3, CheckCircle, Clock, MapPin, AlertTriangle, PlusCircle, List } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    nearby: 0
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats and recent issues
      const [statsRes, issuesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users/stats'), // Add this endpoint later
        axios.get('http://localhost:5000/api/issues/my-recent')
      ]);
      
      setStats(statsRes.data || {
        total: 12,
        resolved: 8,
        pending: 4,
        nearby: 3
      });
      setRecentIssues(issuesRes.data.slice(0, 5) || []);
    } catch (error) {
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-xl text-gray-600">Here's what's happening in your area</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Total Reported</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Resolved</p>
              <p className="text-3xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Pending</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-xl">
              <MapPin className="w-8 h-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Nearby</p>
              <p className="text-3xl font-bold text-gray-900">{stats.nearby}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              <Link to="/my-issues" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center">
                View all <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>

            <div className="space-y-4">
              {recentIssues.length > 0 ? (
                recentIssues.map((issue) => (
                  <Link key={issue.id} to={`/issue/${issue.id}`} className="block p-6 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${issue.status === 'resolved' ? 'bg-green-100' : issue.status === 'in-progress' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                        <div className={`w-3 h-3 rounded-full ${issue.status === 'resolved' ? 'bg-green-500' : issue.status === 'in-progress' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">{issue.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{issue.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                          <span>{issue.location}</span>
                          <span>•</span>
                          <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                  <p className="text-gray-500 mb-6">Report your first issue to get started</p>
                  <Link to="/report" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">
                    Report Issue
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Preview */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6 h-64 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Location Preview</h3>
              <p className="text-sm text-gray-500 mb-4">Click to view full map</p>
              <Link to="/map" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">View Map →</Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Quick Actions</h3>
            <Link to="/report" className="block p-4 border-2 border-dashed border-indigo-300 rounded-xl text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all">
              <PlusCircle className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
              <span className="font-medium text-indigo-700">Report New Issue</span>
            </Link>
            <Link to="/my-issues" className="block p-4 border-2 border-dashed border-gray-300 rounded-xl text-center hover:border-gray-400 hover:bg-gray-50 transition-all">
              <List className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <span className="font-medium text-gray-700">My Issues</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

