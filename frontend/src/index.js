import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error);
    console.error("Component stack:", errorInfo.componentStack);
    const div = document.createElement('div');
    div.innerHTML = `<div style="padding: 20px; background: #fee; color: red;"><h1>Runtime Error</h1><pre>${error.toString()}</pre><pre>${errorInfo.componentStack}</pre></div>`;
    document.body.prepend(div);
  }
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Check the console or screen.</h1>;
    }
    return this.props.children; 
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
