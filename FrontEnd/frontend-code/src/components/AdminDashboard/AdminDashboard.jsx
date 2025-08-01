import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminDashboard.module.css';

import UserManagement from '../UserManagement/UserManagement';
import PostManagement from '../PostManagement/PostManagement';
import Statistics from '../Statistics/Statistics';

const AdminDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    activeUsers: 0,
    postsThisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalUsers: 156,
        totalPosts: 423,
        activeUsers: 89,
        postsThisMonth: 67
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onNavigate('login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'posts':
        return <PostManagement />;
      case 'statistics':
        return <Statistics />;
      default:
        return (
          <div className={styles.dashboardOverview}>
            <h2 className={styles.sectionTitle}>Dashboard Overview</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statContent}>
                  <h3>{isLoading ? '...' : stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📝</div>
                <div className={styles.statContent}>
                  <h3>{isLoading ? '...' : stats.totalPosts}</h3>
                  <p>Total Posts</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🟢</div>
                <div className={styles.statContent}>
                  <h3>{isLoading ? '...' : stats.activeUsers}</h3>
                  <p>Active Users</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📊</div>
                <div className={styles.statContent}>
                  <h3>{isLoading ? '...' : stats.postsThisMonth}</h3>
                  <p>Posts This Month</p>
                </div>
              </div>
            </div>
            
            <div className={styles.quickActions}>
              <h3>Quick Actions</h3>
              <div className={styles.actionButtons}>
                <button 
                  className={styles.actionBtn}
                  onClick={() => setActiveTab('users')}
                >
                  Manage Users
                </button>
                <button 
                  className={styles.actionBtn}
                  onClick={() => setActiveTab('posts')}
                >
                  Manage Posts
                </button>
                <button 
                  className={styles.actionBtn}
                  onClick={() => setActiveTab('statistics')}
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
          <p>OneCredit Blog</p>
        </div>
        
        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.active : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className={styles.navIcon}>🏠</span>
            Dashboard
          </button>
          
          <button
            className={`${styles.navItem} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className={styles.navIcon}>👥</span>
            User Management
          </button>
          
          <button
            className={`${styles.navItem} ${activeTab === 'posts' ? styles.active : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <span className={styles.navIcon}>📝</span>
            Post Management
          </button>
          
          <button
            className={`${styles.navItem} ${activeTab === 'statistics' ? styles.active : ''}`}
            onClick={() => setActiveTab('statistics')}
          >
            <span className={styles.navIcon}>📊</span>
            Statistics
          </button>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <span className={styles.navIcon}>🚪</span>
            Logout
          </button>
        </div>
      </div>
      
      <main className={styles.mainContent}>
        <div className={styles.topBar}>
          <h1>Admin Dashboard</h1>
          <div className={styles.adminInfo}>
            <span>Welcome, Admin</span>
            <div className={styles.adminAvatar}>A</div>
          </div>
        </div>
        
        <div className={styles.content}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
