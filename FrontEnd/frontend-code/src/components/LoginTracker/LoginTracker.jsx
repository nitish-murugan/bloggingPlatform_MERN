import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './LoginTracker.module.css';

const LoginTracker = () => {
  const [stats, setStats] = useState({
    dailyLogins: {},
    currentlyOnline: [],
    totalDailyLogins: 0,
    currentDate: '',
    totalUsers: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  const loadMockStats = useCallback(() => {
    const currentDate = new Date().toDateString();
    const mockStats = {
      dailyLogins: {
        '1': 3,
        '2': 1,
        '3': 2
      },
      currentlyOnline: ['1', '2'],
      totalDailyLogins: 6,
      currentDate: currentDate,
      totalUsers: 15,
      activeUsers: 12
    };
    setStats(mockStats);
  }, []);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      try {
        // Fetch login statistics from backend
        const response = await axios.get('https://bloggingplatform-mern.onrender.com/api/admin/login-stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setStats(response.data.stats);
        } else {
          console.error('Failed to fetch login stats:', response.data.message);
          loadMockStats();
        }
      } catch {
        console.log('Backend not available, using mock data');
        loadMockStats();
      }
    } catch (error) {
      console.error('Error fetching login stats:', error);
      loadMockStats();
    } finally {
      setLoading(false);
    }
  }, [loadMockStats]);

  useEffect(() => {
    loadStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(() => {
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadStats]);

  const handleRefresh = () => {
    loadStats();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading login statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Login Activity Tracker</h2>
        <button onClick={handleRefresh} className={styles.refreshButton}>
          🔄 Refresh
        </button>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Daily Logins</h3>
          <div className={styles.statValue}>{stats.totalDailyLogins}</div>
          <div className={styles.statSubtext}>Today ({stats.currentDate})</div>
        </div>
        
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Currently Online</h3>
          <div className={styles.statValue}>{stats.currentlyOnline?.length || 0}</div>
          <div className={styles.statSubtext}>Active users</div>
        </div>

        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Users</h3>
          <div className={styles.statValue}>{stats.totalUsers}</div>
          <div className={styles.statSubtext}>Registered</div>
        </div>

        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Active Users</h3>
          <div className={styles.statValue}>{stats.activeUsers}</div>
          <div className={styles.statSubtext}>Status: Active</div>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h3 className={styles.sectionTitle}>Daily Login Breakdown</h3>
        <div className={styles.loginList}>
          {Object.entries(stats.dailyLogins || {}).map(([userId, count]) => (
            <div key={userId} className={styles.loginItem}>
              <span className={styles.userId}>User ID: {userId}</span>
              <span className={styles.loginCount}>{count} login(s)</span>
            </div>
          ))}
          {Object.keys(stats.dailyLogins || {}).length === 0 && (
            <div className={styles.emptyState}>
              <p>No login data available for today</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h3 className={styles.sectionTitle}>Currently Online Users</h3>
        <div className={styles.onlineList}>
          {stats.currentlyOnline?.map((userId) => (
            <div key={userId} className={styles.onlineUser}>
              <span className={styles.onlineIndicator}>🟢</span>
              <span className={styles.onlineUserId}>User ID: {userId}</span>
            </div>
          ))}
          {(!stats.currentlyOnline || stats.currentlyOnline.length === 0) && (
            <div className={styles.emptyState}>
              <p>No users currently online</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginTracker;
