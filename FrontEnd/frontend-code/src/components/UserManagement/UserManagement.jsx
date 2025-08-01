import React, { useState, useEffect } from 'react';
import styles from './UserManagement.module.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    status: 'active'
  });

  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        username: 'john_doe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        status: 'active',
        createdAt: '2024-01-15',
        lastLogin: '2024-01-20',
        postsCount: 12
      },
      {
        id: 2,
        username: 'jane_smith',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        status: 'active',
        createdAt: '2024-01-10',
        lastLogin: '2024-01-19',
        postsCount: 8
      },
      {
        id: 3,
        username: 'bob_wilson',
        email: 'bob@example.com',
        firstName: 'Bob',
        lastName: 'Wilson',
        status: 'inactive',
        createdAt: '2024-01-05',
        lastLogin: '2024-01-15',
        postsCount: 5
      },
      {
        id: 4,
        username: 'alice_brown',
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'Brown',
        status: 'active',
        createdAt: '2024-01-12',
        lastLogin: '2024-01-20',
        postsCount: 15
      },
      {
        id: 5,
        username: 'charlie_davis',
        email: 'charlie@example.com',
        firstName: 'Charlie',
        lastName: 'Davis',
        status: 'suspended',
        createdAt: '2024-01-08',
        lastLogin: '2024-01-18',
        postsCount: 3
      }
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleSaveEdit = () => {
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, ...editForm }
        : user
    ));
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: styles.statusActive,
      inactive: styles.statusInactive,
      suspended: styles.statusSuspended
    };
    
    return (
      <span className={`${styles.statusBadge} ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className={styles.userManagement}>
      <div className={styles.header}>
        <h2>User Management</h2>
        <p>Manage blog users, their permissions, and account status</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search users by name, username, or email..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className={styles.statsOverview}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{users.length}</span>
          <span className={styles.statLabel}>Total Users</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{users.filter(u => u.status === 'active').length}</span>
          <span className={styles.statLabel}>Active</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{users.filter(u => u.status === 'inactive').length}</span>
          <span className={styles.statLabel}>Inactive</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{users.filter(u => u.status === 'suspended').length}</span>
          <span className={styles.statLabel}>Suspended</span>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Posts</th>
              <th>Joined</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className={styles.userName}>{user.firstName} {user.lastName}</div>
                      <div className={styles.userUsername}>@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{getStatusBadge(user.status)}</td>
                <td>{user.postsCount}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.editBtn}
                      onClick={() => handleEditUser(user)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteUser(user)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className={styles.noResults}>
            <p>No users found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Edit User</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>First Name</label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Last Name</label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.saveBtn}
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Confirm Delete</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to delete user <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>?</p>
              <p className={styles.warning}>This action cannot be undone.</p>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.cancelBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.deleteBtn}
                onClick={handleConfirmDelete}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
