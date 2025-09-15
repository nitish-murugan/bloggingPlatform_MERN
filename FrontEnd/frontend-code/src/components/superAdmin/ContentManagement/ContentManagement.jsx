import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ContentManagement.module.css';

const ContentManagement = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (activeTab === 'posts') {
          const response = await axios.get('http://localhost:5000/api/superadmin/posts', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPosts(response.data.posts);
        } else {
          const response = await axios.get('http://localhost:5000/api/superadmin/comments', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setComments(response.data.comments);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        if (activeTab === 'posts') {
          setPosts([
            {
              _id: '1',
              title: 'Getting Started with React',
              author: { firstName: 'John', lastName: 'Doe' },
              category: 'Technology',
              tags: ['react', 'javascript'],
              createdAt: '2025-09-10T10:30:00Z',
              status: 'published',
              views: 234,
              commentsCount: 15,
              likes: 42
            },
            {
              _id: '2',
              title: 'Node.js Best Practices',
              author: { firstName: 'Jane', lastName: 'Smith' },
              category: 'Development',
              tags: ['nodejs', 'backend'],
              createdAt: '2025-09-08T14:15:00Z',
              status: 'published',
              views: 198,
              commentsCount: 12,
              likes: 35
            },
            {
              _id: '3',
              title: 'Draft: Future of Web Dev',
              author: { firstName: 'Bob', lastName: 'Johnson' },
              category: 'Technology',
              tags: ['web', 'future'],
              createdAt: '2025-09-12T09:00:00Z',
              status: 'draft',
              views: 0,
              commentsCount: 0,
              likes: 0
            }
          ]);
        } else {
          setComments([
            {
              _id: '1',
              content: 'Great article! Very helpful for beginners.',
              author: { firstName: 'Alice', lastName: 'Wilson' },
              post: { title: 'Getting Started with React' },
              createdAt: '2025-09-11T16:30:00Z',
              status: 'approved',
              likes: 8,
              replies: 2
            },
            {
              _id: '2',
              content: 'This is spam content that should be removed.',
              author: { firstName: 'Spam', lastName: 'User' },
              post: { title: 'Node.js Best Practices' },
              createdAt: '2025-09-09T12:45:00Z',
              status: 'flagged',
              likes: 0,
              replies: 0
            },
            {
              _id: '3',
              content: 'Thanks for sharing this knowledge!',
              author: { firstName: 'Charlie', lastName: 'Brown' },
              post: { title: 'Getting Started with React' },
              createdAt: '2025-09-11T18:20:00Z',
              status: 'approved',
              likes: 5,
              replies: 1
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setSelectedItems([]);
  }, [activeTab]);

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    const filteredItems = getFilteredItems();
    
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item._id));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      alert('Please select items first');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/superadmin/bulk-action', {
        type: activeTab,
        action,
        items: selectedItems
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (activeTab === 'posts') {
        setPosts(prev => 
          action === 'delete' 
            ? prev.filter(post => !selectedItems.includes(post._id))
            : prev.map(post => 
                selectedItems.includes(post._id)
                  ? { ...post, status: action }
                  : post
              )
        );
      } else {
        setComments(prev => 
          action === 'delete'
            ? prev.filter(comment => !selectedItems.includes(comment._id))
            : prev.map(comment => 
                selectedItems.includes(comment._id)
                  ? { ...comment, status: action }
                  : comment
              )
        );
      }

      setSelectedItems([]);
      alert(`${action} completed successfully!`);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Action failed. Please try again.');
    }
  };

  const openContentModal = (content, type) => {
    setSelectedContent(content);
    setModalType(type);
    setShowModal(true);
  };

  const getFilteredItems = () => {
    const items = activeTab === 'posts' ? posts : comments;
    return items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        (activeTab === 'posts' 
          ? item.title.toLowerCase().includes(searchTerm.toLowerCase())
          : item.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      published: styles.statusPublished,
      draft: styles.statusDraft,
      archived: styles.statusArchived,
      approved: styles.statusApproved,
      flagged: styles.statusFlagged,
      pending: styles.statusPending
    };
    return statusClasses[status] || styles.statusPending;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading content data...</p>
      </div>
    );
  }

  const filteredItems = getFilteredItems();

  return (
    <div className={styles.contentManagementContainer}>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>
          <span className={styles.titleIcon}>📝</span>
          Content Management
        </h2>
        <div className={styles.tabSelector}>
          <button
            className={`${styles.tab} ${activeTab === 'posts' ? styles.active : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            📄 Posts ({posts.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'comments' ? styles.active : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            💬 Comments ({comments.length})
          </button>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
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
            <option value="all">All Status</option>
            {activeTab === 'posts' ? (
              <>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </>
            ) : (
              <>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
              </>
            )}
          </select>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className={styles.bulkActions}>
          <span className={styles.selectedCount}>
            {selectedItems.length} item(s) selected
          </span>
          <div className={styles.bulkButtons}>
            {activeTab === 'posts' ? (
              <>
                <button
                  className={styles.publishBtn}
                  onClick={() => handleBulkAction('published')}
                >
                  📤 Publish
                </button>
                <button
                  className={styles.draftBtn}
                  onClick={() => handleBulkAction('draft')}
                >
                  📝 Draft
                </button>
                <button
                  className={styles.archiveBtn}
                  onClick={() => handleBulkAction('archived')}
                >
                  📦 Archive
                </button>
              </>
            ) : (
              <>
                <button
                  className={styles.approveBtn}
                  onClick={() => handleBulkAction('approved')}
                >
                  ✅ Approve
                </button>
                <button
                  className={styles.flagBtn}
                  onClick={() => handleBulkAction('flagged')}
                >
                  🚩 Flag
                </button>
              </>
            )}
            <button
              className={styles.deleteBtn}
              onClick={() => handleBulkAction('delete')}
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.contentTable}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Status</th>
              <th>{activeTab === 'posts' ? 'Title' : 'Content'}</th>
              <th>Author</th>
              {activeTab === 'posts' && <th>Category</th>}
              <th>Created</th>
              <th>Stats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item._id} className={styles.contentRow}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleItemSelect(item._id)}
                  />
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className={styles.contentInfo}>
                    <div className={styles.contentTitle}>
                      {activeTab === 'posts' ? item.title : item.content.substring(0, 100) + '...'}
                    </div>
                    {activeTab === 'posts' && item.tags && (
                      <div className={styles.tags}>
                        {item.tags.map(tag => (
                          <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.authorInfo}>
                    {item.author.firstName} {item.author.lastName}
                  </div>
                </td>
                {activeTab === 'posts' && (
                  <td>
                    <span className={styles.category}>{item.category}</span>
                  </td>
                )}
                <td>{formatDate(item.createdAt)}</td>
                <td>
                  <div className={styles.stats}>
                    {activeTab === 'posts' ? (
                      <>
                        <span>👁️ {item.views}</span>
                        <span>💬 {item.commentsCount}</span>
                        <span>❤️ {item.likes}</span>
                      </>
                    ) : (
                      <>
                        <span>❤️ {item.likes}</span>
                        <span>💬 {item.replies}</span>
                      </>
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.viewBtn}
                      onClick={() => openContentModal(item, 'view')}
                    >
                      👁️
                    </button>
                    <button
                      className={styles.editBtn}
                      onClick={() => openContentModal(item, 'edit')}
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleBulkAction('delete')}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedContent && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>
                {modalType === 'view' ? 'View' : 'Edit'} {activeTab === 'posts' ? 'Post' : 'Comment'}
              </h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className={styles.modalContent}>
              {activeTab === 'posts' ? (
                <div className={styles.postDetails}>
                  <div className={styles.detailGroup}>
                    <label>Title:</label>
                    <input
                      type="text"
                      value={selectedContent.title}
                      readOnly={modalType === 'view'}
                      className={styles.detailInput}
                    />
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Author:</label>
                    <span>{selectedContent.author.firstName} {selectedContent.author.lastName}</span>
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Category:</label>
                    <input
                      type="text"
                      value={selectedContent.category}
                      readOnly={modalType === 'view'}
                      className={styles.detailInput}
                    />
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Status:</label>
                    <select
                      value={selectedContent.status}
                      disabled={modalType === 'view'}
                      className={styles.detailSelect}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Tags:</label>
                    <div className={styles.tagsList}>
                      {selectedContent.tags?.map(tag => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.commentDetails}>
                  <div className={styles.detailGroup}>
                    <label>Content:</label>
                    <textarea
                      value={selectedContent.content}
                      readOnly={modalType === 'view'}
                      className={styles.detailTextarea}
                      rows="4"
                    />
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Author:</label>
                    <span>{selectedContent.author.firstName} {selectedContent.author.lastName}</span>
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Post:</label>
                    <span>{selectedContent.post.title}</span>
                  </div>
                  <div className={styles.detailGroup}>
                    <label>Status:</label>
                    <select
                      value={selectedContent.status}
                      disabled={modalType === 'view'}
                      className={styles.detailSelect}
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="flagged">Flagged</option>
                    </select>
                  </div>
                </div>
              )}
              {modalType === 'edit' && (
                <div className={styles.modalActions}>
                  <button className={styles.saveBtn}>💾 Save Changes</button>
                  <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>❌ Cancel</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
