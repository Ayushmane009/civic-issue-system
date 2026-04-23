import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      return { user: null, token: null, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null, token: null, loading: true });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token
      axios.get('http://localhost:5000/api/users/profile').then(res => {
        dispatch({ type: 'LOGIN', payload: { token, user: res.data } });
      }).catch(() => {
        localStorage.removeItem('token');
      }).finally(() => {
        dispatch({ type: 'SET_LOADING', payload: false });
      });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch({ type: 'LOGIN', payload: { token, user } });
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || 'Network error. Please check if the server is running.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', { name, email, password });
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || 'Network error. Please check if the server is running.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

