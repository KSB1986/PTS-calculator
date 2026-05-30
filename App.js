import React, { useState, useEffect } from 'react';
import './App.css';
import Calculator from './components/Calculator';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

function App() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [page, setPage] = useState(localStorage.getItem('adminToken') ? 'admin' : 'calculator');

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem('adminToken', adminToken);
    } else {
      localStorage.removeItem('adminToken');
      setPage('calculator');
    }
  }, [adminToken]);

  const handleLogout = () => {
    setAdminToken(null);
    setPage('calculator');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Auriel PTS Calculator</h1>
          {adminToken && (
            <div className="header-actions">
              <span className="admin-badge">Admin Mode</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>

      <nav className="nav">
        {adminToken && (
          <>
            <button 
              className={`nav-btn ${page === 'calculator' ? 'active' : ''}`}
              onClick={() => setPage('calculator')}
            >
              Calculator
            </button>
            <button 
              className={`nav-btn ${page === 'admin' ? 'active' : ''}`}
              onClick={() => setPage('admin')}
            >
              Manage Products
            </button>
          </>
        )}
        {!adminToken && (
          <button 
            className={`nav-btn ${page === 'calculator' ? 'active' : ''}`}
            onClick={() => setPage('calculator')}
          >
            Calculator
          </button>
        )}
        {!adminToken && (
          <button 
            className="nav-btn admin-btn"
            onClick={() => setPage('login')}
          >
            Admin Login
          </button>
        )}
      </nav>

      <main className="main-content">
        {page === 'calculator' && <Calculator />}
        {page === 'login' && !adminToken && (
          <AdminLogin onLogin={(token) => {
            setAdminToken(token);
            setPage('calculator');
          }} />
        )}
        {page === 'admin' && adminToken && (
          <AdminPanel token={adminToken} />
        )}
      </main>
    </div>
  );
}

export default App;
