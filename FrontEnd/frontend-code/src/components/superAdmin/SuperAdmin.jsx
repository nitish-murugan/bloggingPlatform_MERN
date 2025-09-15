import React, { useState, useEffect } from 'react';
import UserMonitor from './UserMonitor/UserMonitor';
import SystemAnalytics from './SystemAnalytics/SystemAnalytics';
import ContentManagement from './ContentManagement/ContentManagement';
import SecurityAudit from './SecurityAudit/SecurityAudit';
import styles from './SuperAdmin.module.css';

const SuperAdmin = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [adminInfo, setAdminInfo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'superadmin') {
      onNavigate('login');
      return;
    }
    setAdminInfo(user);
  }, [onNavigate]);

  const tabs = [
    { id: 'users', label: 'User Monitor', icon: '👥' },
    { id: 'analytics', label: 'System Analytics', icon: '📊' },
    { id: 'content', label: 'Content Management', icon: '📝' },
    { id: 'security', label: 'Security & Audit', icon: '🔒' }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'users':
        return <UserMonitor />;
      case 'analytics':
        return <SystemAnalytics />;
      case 'content':
        return <ContentManagement />;
      case 'security':
        return <SecurityAudit />;
      default:
        return <UserMonitor />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onNavigate('login');
  };

  return (
    <div className={styles.superAdminContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>⚡</span>
            Super Admin Panel
          </h1>
          <span className={styles.subtitle}>Advanced System Management</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.adminInfo}>
            <span className={styles.adminName}>
              {adminInfo?.firstName} {adminInfo?.lastName}
            </span>
            <span className={styles.adminRole}>Super Administrator</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </header>

      <nav className={styles.navigation}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.navTab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className={styles.mainContent}>
        {renderActiveComponent()}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>© 2025 Blogging Platform - Super Admin Panel</span>
          <span>Last Login: {new Date().toLocaleString()}</span>
        </div>
      </footer>
    </div>
  );
};

export default SuperAdmin;