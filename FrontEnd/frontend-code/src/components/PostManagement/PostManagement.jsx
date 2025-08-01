import React, { useState, useEffect } from 'react';
import styles from './PostManagement.module.css';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    status: 'published',
    category: ''
  });

  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        title: 'Getting Started with React Hooks',
        content: 'React Hooks are a powerful feature that allows you to use state and other React features without writing a class component...',
        author: 'John Doe',
        authorId: 1,
        status: 'published',
        category: 'Technology',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        views: 1250,
        likes: 45,
        comments: 12
      },
      {
        id: 2,
        title: 'Understanding CSS Grid Layout',
        content: 'CSS Grid is a two-dimensional layout system for the web. It lets you lay out items in rows and columns...',
        author: 'Jane Smith',
        authorId: 2,
        status: 'published',
        category: 'Design',
        createdAt: '2024-01-12',
        updatedAt: '2024-01-13',
        views: 890,
        likes: 32,
        comments: 8
      },
      {
        id: 3,
        title: 'Introduction to Node.js',
        content: 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine. It allows you to run JavaScript on the server...',
        author: 'Bob Wilson',
        authorId: 3,
        status: 'draft',
        category: 'Backend',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-14',
        views: 0,
        likes: 0,
        comments: 0
      },
      {
        id: 4,
        title: 'Modern JavaScript Features',
        content: 'JavaScript has evolved significantly over the years. Let\'s explore some of the modern features that make development easier...',
        author: 'Alice Brown',
        authorId: 4,
        status: 'published',
        category: 'JavaScript',
        createdAt: '2024-01-08',
        updatedAt: '2024-01-09',
        views: 2100,
        likes: 78,
        comments: 23
      },
      {
        id: 5,
        title: 'Database Design Best Practices',
        content: 'When designing a database, there are several best practices to follow to ensure optimal performance and maintainability...',
        author: 'Charlie Davis',
        authorId: 5,
        status: 'archived',
        category: 'Database',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-06',
        views: 567,
        likes: 21,
        comments: 5
      }
    ];
    setPosts(mockPosts);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || post.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowViewModal(true);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setEditForm({
      title: post.title,
      content: post.content,
      status: post.status,
      category: post.category
    });
    setShowEditModal(true);
  };

  const handleDeletePost = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const handleSaveEdit = () => {
    setPosts(posts.map(post => 
      post.id === selectedPost.id 
        ? { ...post, ...editForm, updatedAt: new Date().toISOString().split('T')[0] }
        : post
    ));
    setShowEditModal(false);
    setSelectedPost(null);
  };

  const handleConfirmDelete = () => {
    setPosts(posts.filter(post => post.id !== selectedPost.id));
    setShowDeleteModal(false);
    setSelectedPost(null);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      published: styles.statusPublished,
      draft: styles.statusDraft,
      archived: styles.statusArchived
    };
    
    return (
      <span className={`${styles.statusBadge} ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const truncateContent = (content, maxLength = 100) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <div className={styles.postManagement}>
      <div className={styles.header}>
        <h2>Post Management</h2>
        <p>Manage blog posts, edit content, and monitor engagement</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search posts by title, author, or category..."
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
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <button className={styles.addPostBtn}>
          ➕ Add New Post
        </button>
      </div>

      <div className={styles.statsOverview}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{posts.length}</span>
          <span className={styles.statLabel}>Total Posts</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{posts.filter(p => p.status === 'published').length}</span>
          <span className={styles.statLabel}>Published</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{posts.filter(p => p.status === 'draft').length}</span>
          <span className={styles.statLabel}>Drafts</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{posts.reduce((sum, p) => sum + p.views, 0)}</span>
          <span className={styles.statLabel}>Total Views</span>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.postsTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Status</th>
              <th>Views</th>
              <th>Engagement</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map(post => (
              <tr key={post.id}>
                <td>
                  <div className={styles.postTitle}>
                    <h4>{post.title}</h4>
                    <p>{truncateContent(post.content)}</p>
                  </div>
                </td>
                <td>{post.author}</td>
                <td>
                  <span className={styles.categoryTag}>{post.category}</span>
                </td>
                <td>{getStatusBadge(post.status)}</td>
                <td>{post.views.toLocaleString()}</td>
                <td>
                  <div className={styles.engagement}>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </td>
                <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.viewBtn}
                      onClick={() => handleViewPost(post)}
                    >
                      👁️ View
                    </button>
                    <button 
                      className={styles.editBtn}
                      onClick={() => handleEditPost(post)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDeletePost(post)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPosts.length === 0 && (
          <div className={styles.noResults}>
            <p>No posts found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedPost && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{selectedPost.title}</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.postMeta}>
                <span><strong>Author:</strong> {selectedPost.author}</span>
                <span><strong>Category:</strong> {selectedPost.category}</span>
                <span><strong>Status:</strong> {getStatusBadge(selectedPost.status)}</span>
                <span><strong>Created:</strong> {new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                <span><strong>Views:</strong> {selectedPost.views.toLocaleString()}</span>
              </div>
              <div className={styles.postContent}>
                <h4>Content:</h4>
                <p>{selectedPost.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Edit Post</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Content</label>
                <textarea
                  rows="8"
                  value={editForm.content}
                  onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                />
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
              <p>Are you sure you want to delete the post <strong>"{selectedPost?.title}"</strong>?</p>
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
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManagement;
