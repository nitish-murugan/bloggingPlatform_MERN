import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserProfile.module.css';

const UserProfile = ({ 
  user: propUser, 
  isEditable = false, 
  onEdit,
  showStats = true 
}) => {
  const [user, setUser] = useState(propUser);
  const [loading, setLoading] = useState(!propUser);

  useEffect(() => {
    if (!propUser) {
      // Fetch current user data from localStorage or API
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        setLoading(false);
      } else {
        fetchUserProfile();
      }
    } else {
      setUser(propUser);
      setLoading(false);
    }
  }, [propUser]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      try {
        const response = await axios.get('https://bloggingplatform-mern.onrender.com/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch {
        console.log('Could not fetch user profile from backend');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'inactive':
        return styles.statusInactive;
      case 'banned':
        return styles.statusBanned;
      default:
        return styles.statusDefault;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return styles.roleAdmin;
      case 'user':
        return styles.roleUser;
      case 'moderator':
        return styles.roleModerator;
      default:
        return styles.roleDefault;
    }
  };

  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.noUser}>
          <h2>No User Data Available</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        {/* Header Section */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {user.firstName && user.lastName 
                ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                : user.username ? user.username.charAt(0).toUpperCase()
                : 'U'
              }
            </div>
            <div className={styles.userBasicInfo}>
              <h1 className={styles.userName}>
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.username
                }
              </h1>
              <p className={styles.userEmail}>{user.email}</p>
              <div className={styles.badges}>
                <span className={`${styles.badge} ${getRoleColor(user.role)}`}>
                  {user.role?.toUpperCase() || 'USER'}
                </span>
                <span className={`${styles.badge} ${getStatusColor(user.status || 'active')}`}>
                  {(user.status || 'active')?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          {isEditable && (
            <div className={styles.actionButtons}>
              <button 
                className={styles.editButton}
                onClick={onEdit}
              >
                ✏️ Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className={styles.profileDetails}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailGroup}>
              <h3 className={styles.groupTitle}>Account Information</h3>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Username:</span>
                <span className={styles.detailValue}>{user.username || 'Not set'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Email:</span>
                <span className={styles.detailValue}>{user.email}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Role:</span>
                <span className={styles.detailValue}>{user.role || 'user'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status:</span>
                <span className={styles.detailValue}>{user.status || 'active'}</span>
              </div>
            </div>

            <div className={styles.detailGroup}>
              <h3 className={styles.groupTitle}>Personal Information</h3>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>First Name:</span>
                <span className={styles.detailValue}>{user.firstName || 'Not set'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Last Name:</span>
                <span className={styles.detailValue}>{user.lastName || 'Not set'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Member Since:</span>
                <span className={styles.detailValue}>{formatDate(user.createdAt || user.joinedAt)}</span>
              </div>
            </div>

            {showStats && (
              <div className={styles.detailGroup}>
                <h3 className={styles.groupTitle}>Activity Statistics</h3>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Login Count:</span>
                  <span className={styles.detailValue}>{user.loginCount || 0}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Last Login:</span>
                  <span className={styles.detailValue}>
                    {user.lastLoginDate ? (
                      <>
                        {formatDate(user.lastLoginDate)}
                        {formatTime(user.lastLoginDate) && (
                          <span className={styles.timeInfo}> at {formatTime(user.lastLoginDate)}</span>
                        )}
                      </>
                    ) : 'Never'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Account Created:</span>
                  <span className={styles.detailValue}>{formatDate(user.createdAt || user.joinedAt)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
