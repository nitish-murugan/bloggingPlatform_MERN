import React, { useState, useEffect } from 'react';
import styles from './NavBar.module.css';

const NavBar = ({ currentPage, onNavigate }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [currentPage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    onNavigate('login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <h2>Blogging Platform</h2>
        </div>
        <div className={styles.navLinks}>
          {!isLoggedIn ? (
            currentPage === 'login' ? (
              <>
                <button 
                  className={styles.navLink}
                  onClick={() => onNavigate('register')}
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                <button 
                  className={styles.navLink}
                  onClick={() => onNavigate('login')}
                >
                  Login
                </button>
              </>
            )
          ) : (
            <>
              <span className={styles.welcomeText}>
                Welcome, {user?.username || 'User'}!
              </span>
              
              {user?.role === 'superadmin' && currentPage !== 'superadmin' && (
                <button 
                  className={`${styles.navLink} ${styles.superAdminLink}`}
                  onClick={() => onNavigate('superadmin')}
                >
                  ⚡ Super Admin
                </button>
              )}
              {currentPage !== 'blog' && (
                <button 
                  className={styles.navLink}
                  onClick={() => onNavigate('blog')}
                >
                  View Blog
                </button>
              )}
              {currentPage !== 'profile' && (
                <button 
                  className={styles.navLink}
                  onClick={() => onNavigate('profile')}
                >
                  My Profile
                </button>
              )}
              <button 
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
