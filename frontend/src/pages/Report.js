import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { MapPin, Image, Tag, Upload, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'road',
    location: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: 'road', label: 'Road Damage/Potholes', icon: '🛣️' },
    { value: 'electricity', label: 'Street Light/Electricity', icon: '💡' },
    { value: 'water', label: 'Water Leakage/Supply', icon: '💧' },
    { value: 'garbage', label: 'Garbage/Cleaning', icon: '🗑️' },
    { value: 'sewer', label: 'Sewer/Drainage', icon: '🚽' },
    { value: 'other', label: 'Other', icon: '❓' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('location', formData.location);
    data.append('category', formData.category);
    if (image) data.append('image', image);

    try {
      await axios.post('http://localhost:5000/api/issues/report', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Report error:', error);
      alert('Failed to report issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Report Issue
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Help fix your city - every report matters
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Issue Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g. Large pothole on main road"
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description <span className="text-red-500">*</span></label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the problem in detail..."
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-500 focus:border-transparent resize-vertical transition-all duration-200 shadow-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">Category <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <label key={cat.value} className="flex items-center p-4 border-2 border-gray-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group hover:bg-indigo-50">
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={formData.category === cat.value}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3 w-full">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="font-medium text-gray-900 group-hover:text-indigo-700">{cat.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Location (optional)</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g. Main Road, Kolhapur"
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">Photo Evidence (recommended)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group">
              {image ? (
                <div className="space-y-4">
                  <img src={URL.createObjectURL(image)} alt="Preview" className="max-h-48 mx-auto rounded-xl shadow-md object-cover" />
                  <p className="text-sm text-gray-600 truncate">{image.name}</p>
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Change photo
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <Upload className="w-16 h-16 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  <div>
                    <p className="text-lg font-medium text-gray-900 group-hover:text-indigo-700">Click to upload</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-6 px-8 rounded-2xl text-xl font-bold hover:from-indigo-700 hover:to-purple-800 focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                <span>Report Issue</span>
              </>
            )}
          </button>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-2xl text-center font-medium animate-pulse">
              Issue reported successfully! Redirecting to dashboard...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Report;

