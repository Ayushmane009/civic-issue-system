import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Image, MessageCircle, Clock } from 'lucide-react';

const Issues = () => {
  const { token } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/issues/all');
        setIssues(res.data);
      } catch (err) {
        setError('Failed to load issues');
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading issues...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-gray-900">Civic Issues</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/report" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                + Report Issue
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Issues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <div key={issue.issue_id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {issue.image && (
                  <img src={`http://localhost:5000/uploads/${issue.image}`} alt={issue.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {issue.location || 'Location not specified'}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{issue.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{issue.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className={`px-2 py-1 rounded-full ${issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : issue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {issue.status}
                    </span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex space-x-2">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-500">0 comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {issues.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No issues yet</h3>
              <Link to="/report" className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                Be the first to report
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Issues;

