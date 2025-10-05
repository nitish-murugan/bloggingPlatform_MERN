import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserMonitor.module.css';

const UserMonitor = () => {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    onlineUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userActivities, setUserActivities] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://bloggingplatform-mern.onrender.com/api/superadmin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([
          {
            _id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: 'user',
            isOnline: true,
            lastLogin: new Date().toISOString(),
            joinDate: '2025-01-15',
            postsCount: 5,
            commentsCount: 12,
            status: 'active'
          },
          {
            _id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            role: 'admin',
            isOnline: false,
            lastLogin: '2025-09-13T10:30:00Z',
            joinDate: '2024-12-20',
            postsCount: 8,
            commentsCount: 25,
            status: 'active'
          },
          {
            _id: '3',
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob@example.com',
            role: 'user',
            isOnline: true,
            lastLogin: new Date().toISOString(),
            joinDate: '2025-09-10',
            postsCount: 2,
            commentsCount: 6,
            status: 'suspended'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://bloggingplatform-mern.onrender.com/api/superadmin/user-stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserStats(response.data);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setUserStats({
          totalUsers: 3,
          activeUsers: 2,
          newUsersToday: 1,
          onlineUsers: 2
        });
      }
    };

    const fetchData = async () => {
      await fetchUserData();
      await fetchUserStats();
    };
    
    fetchData();
    
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchUserActivity = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://bloggingplatform-mern.onrender.com/api/superadmin/user-activity/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserActivities(response.data.activities);
    } catch (error) {
      console.error('Error fetching user activity:', error);
      setUserActivities([
        { type: 'login', timestamp: new Date().toISOString(), details: 'Logged in from Chrome' },
        { type: 'post_created', timestamp: '2025-09-13T14:30:00Z', details: 'Created post: "My Blog Journey"' },
        { type: 'comment', timestamp: '2025-09-13T12:15:00Z', details: 'Commented on "Tech Trends 2025"' },
        { type: 'logout', timestamp: '2025-09-12T18:45:00Z', details: 'Logged out' }
      ]);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://bloggingplatform-mern.onrender.com/api/superadmin/user-action`, {
        userId,
        action
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, status: action === 'suspend' ? 'suspended' : 'active' }
          : user
      ));
      
      alert(`User ${action}ed successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(`Failed to ${action} user`);
    }
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
    fetchUserActivity(user._id);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'online' && user.isOnline) ||
                         (filterStatus === 'offline' && !user.isOnline) ||
                         (filterStatus === 'active' && user.status === 'active') ||
                         (filterStatus === 'suspended' && user.status === 'suspended');
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: styles.statusActive,
      suspended: styles.statusSuspended,
      pending: styles.statusPending
    };
    return statusClasses[status] || styles.statusActive;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className={styles.userMonitorContainer}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>{userStats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h3>{userStats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🆕</div>
          <div className={styles.statContent}>
            <h3>{userStats.newUsersToday}</h3>
            <p>New Today</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🟢</div>
          <div className={styles.statContent}>
            <h3>{userStats.onlineUsers}</h3>
            <p>Online Now</p>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterContainer}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Users</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Status</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Last Login</th>
              <th>Posts</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} className={styles.userRow}>
                <td>
                  <div className={styles.statusContainer}>
                    <span className={`${styles.onlineIndicator} ${user.isOnline ? styles.online : styles.offline}`}></span>
                    <span className={`${styles.statusBadge} ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                </td>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.roleAdmin : styles.roleUser}`}>
                    {user.role}
                  </span>
                </td>
                <td>{formatDate(user.joinDate)}</td>
                <td>{formatDate(user.lastLogin)}</td>
                <td>{user.postsCount}</td>
                <td>{user.commentsCount}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.viewBtn}
                      onClick={() => openUserModal(user)}
                    >
                      👁️ View
                    </button>
                    {user.status === 'active' ? (
                      <button
                        className={styles.suspendBtn}
                        onClick={() => handleUserAction(user._id, 'suspend')}
                      >
                        🚫 Suspend
                      </button>
                    ) : (
                      <button
                        className={styles.activateBtn}
                        onClick={() => handleUserAction(user._id, 'activate')}
                      >
                        ✅ Activate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUserModal && selectedUser && (
        <div className={styles.modalOverlay} onClick={() => setShowUserModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>User Details: {selectedUser.firstName} {selectedUser.lastName}</h2>
              <button className={styles.closeBtn} onClick={() => setShowUserModal(false)}>×</button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.userDetails}>
                <div className={styles.detailSection}>
                  <h3>Basic Information</h3>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Role:</strong> {selectedUser.role}</p>
                  <p><strong>Status:</strong> {selectedUser.status}</p>
                  <p><strong>Join Date:</strong> {formatDate(selectedUser.joinDate)}</p>
                  <p><strong>Last Login:</strong> {formatDate(selectedUser.lastLogin)}</p>
                </div>
                <div className={styles.detailSection}>
                  <h3>Activity Summary</h3>
                  <p><strong>Posts Created:</strong> {selectedUser.postsCount}</p>
                  <p><strong>Comments Made:</strong> {selectedUser.commentsCount}</p>
                  <p><strong>Online Status:</strong> {selectedUser.isOnline ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              <div className={styles.activityLog}>
                <h3>Recent Activity</h3>
                <div className={styles.activityList}>
                  {userActivities.map((activity, index) => (
                    <div key={index} className={styles.activityItem}>
                      <div className={styles.activityType}>{activity.type}</div>
                      <div className={styles.activityDetails}>{activity.details}</div>
                      <div className={styles.activityTime}>{formatDate(activity.timestamp)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMonitor;