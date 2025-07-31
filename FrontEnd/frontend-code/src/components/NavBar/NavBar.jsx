import React from 'react';
import styles from './NavBar.module.css';

const NavBar = ({ currentPage, onNavigate }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <h2>Blogging Platform</h2>
        </div>
        <div className={styles.navLinks}>
          {currentPage === 'login' ? (
            <button 
              className={styles.navLink}
              onClick={() => onNavigate('register')}
            >
              Create Account
            </button>
          ) : (
            <button 
              className={styles.navLink}
              onClick={() => onNavigate('login')}
            >
              Already have an account?
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
