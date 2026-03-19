import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Map, AlertCircle, Camera, MessageCircle } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Report Civic Issues
              <span className="block text-indigo-200">in Your Area</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
              Streetlights out? Potholes? Report civic problems with photos and track resolution. 
              Your voice matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="bg-white text-indigo-600 px-8 py-4 rounded-full text-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
              </Link>
              <Link
                to="/issues"
                className="border-2 border-white text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300"
              >
                View Issues
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Simple. Fast. Effective.</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Report civic problems instantly and track their resolution with government departments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <Map className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pin Location</h3>
              <p className="text-gray-600">Mark exact location on map for quick response.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <Camera className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Photo Evidence</h3>
              <p className="text-gray-600">Upload photos as proof - better than words.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <AlertCircle className="w-16 h-16 text-orange-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-time Status</h3>
              <p className="text-gray-600">Pending → In Progress → Resolved. Always updated.</p>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <MessageCircle className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Discussion</h3>
              <p className="text-gray-600">Comment and collaborate with neighbors and officials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
              <div className="text-gray-600">Issues Reported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-600">Resolved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24h</div>
              <div className="text-gray-600">Avg Response</div>
            </div>
          </div>
          <Link
            to={user ? "/dashboard" : "/register"}
            className="inline-flex items-center px-10 py-4 border border-transparent text-base font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Start Reporting Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

