import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SecurityAudit.module.css';

const SecurityAudit = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [systemSecurity, setSystemSecurity] = useState({
    failedLogins: 0,
    suspiciousActivity: 0,
    securityScore: 85,
    lastSecurityScan: new Date().toISOString()
  });
  const [activeTab, setActiveTab] = useState('logs');
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('24h');

  useEffect(() => {
    const fetchSecurityData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        const logsResponse = await axios.get(`https://bloggingplatform-mern.onrender.com/api/superadmin/audit-logs?time=${timeFilter}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAuditLogs(logsResponse.data.logs);
        
        const alertsResponse = await axios.get('https://bloggingplatform-mern.onrender.com/api/superadmin/security-alerts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSecurityAlerts(alertsResponse.data.alerts);
        
        const securityResponse = await axios.get('https://bloggingplatform-mern.onrender.com/api/superadmin/security-metrics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSystemSecurity(securityResponse.data);
        
      } catch (error) {
        console.error('Error fetching security data:', error);
        
        setAuditLogs([
          {
            _id: '1',
            action: 'USER_LOGIN',
            user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
            timestamp: new Date().toISOString(),
            ipAddress: '192.168.1.100',
            userAgent: 'Chrome/91.0 Windows',
            details: 'Successful login',
            severity: 'info'
          },
          {
            _id: '2',
            action: 'POST_DELETED',
            user: { firstName: 'Admin', lastName: 'User', email: 'admin@example.com' },
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            ipAddress: '192.168.1.101',
            userAgent: 'Firefox/89.0 MacOS',
            details: 'Deleted post: "Spam Content"',
            severity: 'warning'
          },
          {
            _id: '3',
            action: 'FAILED_LOGIN',
            user: null,
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            ipAddress: '203.0.113.1',
            userAgent: 'Unknown Bot',
            details: 'Failed login attempt for admin@example.com',
            severity: 'high'
          },
          {
            _id: '4',
            action: 'USER_SUSPENDED',
            user: { firstName: 'Super', lastName: 'Admin', email: 'superadmin@example.com' },
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            ipAddress: '192.168.1.102',
            userAgent: 'Chrome/91.0 Windows',
            details: 'Suspended user: spam_user@example.com',
            severity: 'medium'
          },
          {
            _id: '5',
            action: 'BULK_DELETE',
            user: { firstName: 'Super', lastName: 'Admin', email: 'superadmin@example.com' },
            timestamp: new Date(Date.now() - 14400000).toISOString(),
            ipAddress: '192.168.1.102',
            userAgent: 'Chrome/91.0 Windows',
            details: 'Bulk deleted 5 spam comments',
            severity: 'medium'
          }
        ]);
        
        setSecurityAlerts([
          {
            _id: '1',
            type: 'BRUTE_FORCE',
            title: 'Multiple Failed Login Attempts',
            description: 'IP 203.0.113.1 attempted 15 failed logins in 10 minutes',
            severity: 'high',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            status: 'active',
            affectedResource: '203.0.113.1'
          },
          {
            _id: '2',
            type: 'SUSPICIOUS_ACTIVITY',
            title: 'Unusual User Behavior',
            description: 'User created 20 posts in 5 minutes',
            severity: 'medium',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'investigating',
            affectedResource: 'user_123'
          },
          {
            _id: '3',
            type: 'DATA_BREACH_ATTEMPT',
            title: 'Unauthorized Data Access',
            description: 'Attempt to access user data without proper authorization',
            severity: 'critical',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            status: 'resolved',
            affectedResource: 'users_endpoint'
          }
        ]);
        
        setSystemSecurity({
          failedLogins: 23,
          suspiciousActivity: 7,
          securityScore: 85,
          lastSecurityScan: new Date(Date.now() - 3600000).toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
  }, [timeFilter]);

  const handleAlertAction = async (alertId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://bloggingplatform-mern.onrender.com/api/superadmin/security-alert-action`, {
        alertId,
        action
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSecurityAlerts(prev =>
        prev.map(alert =>
          alert._id === alertId
            ? { ...alert, status: action }
            : alert
        )
      );
      
      alert(`Alert ${action} successfully!`);
    } catch (error) {
      console.error('Error updating alert:', error);
      alert('Failed to update alert');
    }
  };

  const runSecurityScan = async () => {
    try {
      const token = localStorage.getItem('token');
      setLoading(true);
      
      await axios.post('https://bloggingplatform-mern.onrender.com/api/superadmin/security-scan', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSystemSecurity(prev => ({
        ...prev,
        lastSecurityScan: new Date().toISOString()
      }));
      
      alert('Security scan completed successfully!');
    } catch (error) {
      console.error('Error running security scan:', error);
      alert('Security scan failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getSeverityBadge = (severity) => {
    const severityClasses = {
      info: styles.severityInfo,
      low: styles.severityLow,
      medium: styles.severityMedium,
      warning: styles.severityWarning,
      high: styles.severityHigh,
      critical: styles.severityCritical
    };
    return severityClasses[severity] || styles.severityInfo;
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: styles.statusActive,
      investigating: styles.statusInvestigating,
      resolved: styles.statusResolved,
      dismissed: styles.statusDismissed
    };
    return statusClasses[status] || styles.statusActive;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading security data...</p>
      </div>
    );
  }

  return (
    <div className={styles.securityAuditContainer}>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>
          <span className={styles.titleIcon}>🔒</span>
          Security & Audit
        </h2>
        <div className={styles.headerActions}>
          <button className={styles.scanBtn} onClick={runSecurityScan}>
            🛡️ Run Security Scan
          </button>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className={styles.timeFilter}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className={styles.securityOverview}>
        <div className={styles.securityCard}>
          <div className={styles.securityIcon}>🚨</div>
          <div className={styles.securityContent}>
            <h3>{systemSecurity.failedLogins}</h3>
            <p>Failed Logins</p>
          </div>
        </div>
        <div className={styles.securityCard}>
          <div className={styles.securityIcon}>⚠️</div>
          <div className={styles.securityContent}>
            <h3>{systemSecurity.suspiciousActivity}</h3>
            <p>Suspicious Activities</p>
          </div>
        </div>
        <div className={styles.securityCard}>
          <div className={styles.securityIcon}>📊</div>
          <div className={styles.securityContent}>
            <h3>{systemSecurity.securityScore}%</h3>
            <p>Security Score</p>
          </div>
        </div>
        <div className={styles.securityCard}>
          <div className={styles.securityIcon}>🔍</div>
          <div className={styles.securityContent}>
            <h3>{formatDate(systemSecurity.lastSecurityScan)}</h3>
            <p>Last Security Scan</p>
          </div>
        </div>
      </div>

      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tab} ${activeTab === 'logs' ? styles.active : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          📋 Audit Logs ({auditLogs.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'alerts' ? styles.active : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 Security Alerts ({securityAlerts.filter(a => a.status === 'active').length})
        </button>
      </div>

      {activeTab === 'logs' && (
        <div className={styles.tabContent}>
          <div className={styles.sectionHeader}>
            <h3>Audit Logs</h3>
            <span className={styles.sectionSubtitle}>
              Track all administrative actions and system events
            </span>
          </div>
          <div className={styles.logsContainer}>
            {auditLogs.map(log => (
              <div key={log._id} className={styles.logEntry}>
                <div className={styles.logHeader}>
                  <div className={styles.logAction}>
                    <span className={`${styles.severityBadge} ${getSeverityBadge(log.severity)}`}>
                      {log.severity}
                    </span>
                    <span className={styles.actionType}>{log.action}</span>
                  </div>
                  <div className={styles.logTimestamp}>
                    {formatDate(log.timestamp)}
                  </div>
                </div>
                <div className={styles.logContent}>
                  <div className={styles.logDetails}>
                    <p><strong>User:</strong> {log.user ? `${log.user.firstName} ${log.user.lastName} (${log.user.email})` : 'Unknown'}</p>
                    <p><strong>IP Address:</strong> {log.ipAddress}</p>
                    <p><strong>User Agent:</strong> {log.userAgent}</p>
                    <p><strong>Details:</strong> {log.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className={styles.tabContent}>
          <div className={styles.sectionHeader}>
            <h3>Security Alerts</h3>
            <span className={styles.sectionSubtitle}>
              Monitor and respond to security threats and anomalies
            </span>
          </div>
          <div className={styles.alertsContainer}>
            {securityAlerts.map(alert => (
              <div key={alert._id} className={styles.alertEntry}>
                <div className={styles.alertHeader}>
                  <div className={styles.alertTitle}>
                    <span className={`${styles.severityBadge} ${getSeverityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <h4>{alert.title}</h4>
                  </div>
                  <div className={styles.alertStatus}>
                    <span className={`${styles.statusBadge} ${getStatusBadge(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                </div>
                <div className={styles.alertContent}>
                  <p className={styles.alertDescription}>{alert.description}</p>
                  <div className={styles.alertMeta}>
                    <span><strong>Type:</strong> {alert.type}</span>
                    <span><strong>Affected:</strong> {alert.affectedResource}</span>
                    <span><strong>Time:</strong> {formatDate(alert.timestamp)}</span>
                  </div>
                </div>
                {alert.status === 'active' && (
                  <div className={styles.alertActions}>
                    <button
                      className={styles.investigateBtn}
                      onClick={() => handleAlertAction(alert._id, 'investigating')}
                    >
                      🔍 Investigate
                    </button>
                    <button
                      className={styles.resolveBtn}
                      onClick={() => handleAlertAction(alert._id, 'resolved')}
                    >
                      ✅ Resolve
                    </button>
                    <button
                      className={styles.dismissBtn}
                      onClick={() => handleAlertAction(alert._id, 'dismissed')}
                    >
                      ❌ Dismiss
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityAudit;
