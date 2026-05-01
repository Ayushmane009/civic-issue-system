import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Issues from './pages/Issues';
import IssueDetail from './pages/IssueDetail';
import Report from './pages/Report';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import MapView from './pages/MapView';
import './index.css';

const AppLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Pages where sidebar should NOT be shown
  const publicPages = ['/', '/login', '/register'];
  const showSidebar = user && !publicPages.includes(location.pathname);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar — hidden on mobile, only shown on authenticated pages */}
        {showSidebar && (
          <div className="sidebar-wrapper" style={{ flexShrink: 0 }}>
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <main style={{
          flex: 1,
          overflow: 'hidden',
          minHeight: 'calc(100vh - 64px)',
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/issues" element={
              <ProtectedRoute><Issues /></ProtectedRoute>
            } />
            <Route path="/issues/:id" element={
              <ProtectedRoute><IssueDetail /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/report" element={
              <ProtectedRoute><Report /></ProtectedRoute>
            } />
            <Route path="/my-issues" element={
              <ProtectedRoute><Issues myIssues /></ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute><MapView /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .sidebar-wrapper { display: none !important; }
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppLayout />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
