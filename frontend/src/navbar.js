// navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import endpoint from './key';

function Navbar({ user, onLogout, onShowCalendar }) {
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (user) {
      navigate('/loginSuccess');
    } else {
      navigate('/');
    }
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    onLogout();
    navigate('/');
  };

  const handleCalendarClick = async (e) => {
    e.preventDefault();
    if (user && user.flatID) {
      await onShowCalendar(user.flatID);
      navigate('/calendar');
    }
  };

  return (
    <nav className="nav">
      <NavLink 
        to="/" 
        className="site-title" 
        onClick={handleLogoClick}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        Flat Hub
      </NavLink>
      <ul>
        {user ? (
          <>
            <li>
              <NavLink 
                to="/loginSuccess" 
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/calendar" 
                onClick={handleCalendarClick}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Calendar
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/tasks" 
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Tasks
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/payments" 
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Payments
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/" 
                onClick={handleLogoutClick}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Logout
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink 
                to="/login" 
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Login
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/signup" 
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Create Account
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

