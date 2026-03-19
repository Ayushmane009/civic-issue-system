import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  MapPin, 
  List, 
  Globe, 
  MessageCircle, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Report Issue', icon: PlusCircle, path: '/report' },
    { name: 'Map View', icon: MapPin, path: '/map' },
    { name: 'My Issues', icon: List, path: '/my-issues' },
    { name: 'All Issues', icon: Globe, path: '/issues' },
    { name: 'Community', icon: MessageCircle, path: '/community' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">CF</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">CivicFix</h2>
            <p className="text-sm text-gray-600">Fix Your City</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-all duration-200 group"
          >
            <item.icon className="w-5 h-5 mr-3 group-hover:text-indigo-600" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-indigo-50">
        <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <img
            src="/api/placeholder/40/40"
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-indigo-200"
          />
          <div>
            <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
            <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <div className="flex mt-4 pt-4 border-t border-gray-100 space-x-2">
          <Link to="/profile" className="flex items-center flex-1 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Link>
          <Link to="/settings" className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-4 h-4" />
          </Link>
          <button onClick={logout} className="flex items-center p-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors ml-auto">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

