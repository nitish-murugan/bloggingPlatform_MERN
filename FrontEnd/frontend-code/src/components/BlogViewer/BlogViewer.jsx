import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './BlogViewer.module.css';

const BlogViewer = ({ onNavigate }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const fetchRecentPosts = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      try {
        const response = await axios.get('http://localhost:5000/api/posts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPosts(response.data.posts || response.data);
      } catch {
        console.log('Backend not available, using mock data');
        const mockPosts = [
        {
          id: 1,
          title: 'Getting Started with React Hooks',
          content: 'React Hooks revolutionized the way we write React components. They allow you to use state and other React features without writing a class component. In this comprehensive guide, we will explore the most commonly used hooks like useState, useEffect, useContext, and many more. We will also dive into custom hooks and how they can help you write more reusable and maintainable code.',
          excerpt: 'React Hooks revolutionized the way we write React components. They allow you to use state and other React features...',
          author: 'John Doe',
          authorAvatar: 'JD',
          category: 'Technology',
          publishedAt: '2024-01-20',
          readTime: '5 min read',
          views: 1250,
          likes: 45,
          comments: 12,
          image: null
        },
        {
          id: 2,
          title: 'Understanding CSS Grid Layout',
          content: 'CSS Grid is a two-dimensional layout system for the web. It lets you lay out items in rows and columns, making it easier to design complex responsive layouts. Unlike Flexbox, which is largely a one-dimensional system, Grid is optimized for two-dimensional layouts. In this article, we will cover the fundamentals of CSS Grid, including grid containers, grid items, grid lines, and grid areas.',
          excerpt: 'CSS Grid is a two-dimensional layout system for the web. It lets you lay out items in rows and columns...',
          author: 'Jane Smith',
          authorAvatar: 'JS',
          category: 'Design',
          publishedAt: '2024-01-19',
          readTime: '8 min read',
          views: 890,
          likes: 32,
          comments: 8,
          image: null
        },
        {
          id: 3,
          title: 'Modern JavaScript Features Every Developer Should Know',
          content: 'JavaScript has evolved significantly over the years. With ES6 and beyond, we have gotten many powerful features that make our code more readable, maintainable, and efficient. In this post, we will explore features like destructuring, arrow functions, template literals, async/await, modules, and more. These features have become essential tools in every JavaScript developer toolkit.',
          excerpt: 'JavaScript has evolved significantly over the years. With ES6 and beyond, we have gotten many powerful features...',
          author: 'Mike Johnson',
          authorAvatar: 'MJ',
          category: 'JavaScript',
          publishedAt: '2024-01-18',
          readTime: '10 min read',
          views: 2100,
          likes: 78,
          comments: 23,
          image: null
        },
        {
          id: 4,
          title: 'Building RESTful APIs with Node.js',
          content: 'Node.js has become one of the most popular platforms for building server-side applications. In this comprehensive tutorial, we will learn how to build a RESTful API from scratch using Node.js, Express.js, and MongoDB. We will cover everything from setting up the development environment to implementing authentication, validation, and error handling.',
          excerpt: 'Node.js has become one of the most popular platforms for building server-side applications...',
          author: 'Sarah Wilson',
          authorAvatar: 'SW',
          category: 'Backend',
          publishedAt: '2024-01-17',
          readTime: '12 min read',
          views: 1680,
          likes: 56,
          comments: 19,
          image: null
        },
        {
          id: 5,
          title: 'Database Design Best Practices',
          content: 'Designing a good database is crucial for the performance and scalability of your application. In this article, we will discuss the fundamental principles of database design, including normalization, indexing, relationships, and performance optimization. We will also cover common pitfalls to avoid and best practices that can save you hours of debugging later.',
          excerpt: 'Designing a good database is crucial for the performance and scalability of your application...',
          author: 'David Brown',
          authorAvatar: 'DB',
          category: 'Database',
          publishedAt: '2024-01-16',
          readTime: '7 min read',
          views: 1340,
          likes: 41,
          comments: 15,
          image: null
        },
        {
          id: 6,
          title: 'Introduction to Machine Learning',
          content: 'Machine Learning is transforming industries and creating new opportunities everywhere. This beginner-friendly guide will introduce you to the core concepts of machine learning, including supervised learning, unsupervised learning, and reinforcement learning. We will also explore popular algorithms and tools that you can use to get started with your own ML projects.',
          excerpt: 'Machine Learning is transforming industries and creating new opportunities everywhere...',
          author: 'Emily Davis',
          authorAvatar: 'ED',
          category: 'AI',
          publishedAt: '2024-01-15',
          readTime: '15 min read',
          views: 2850,
          likes: 92,
          comments: 31,
          image: null
        }
        ];
        setPosts(mockPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuthAndFetchPosts = useCallback(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      onNavigate('login');
      return;
    }
    
    fetchRecentPosts();
  }, [onNavigate, fetchRecentPosts]);

  useEffect(() => {
    checkAuthAndFetchPosts();
  }, [checkAuthAndFetchPosts]);

  const categories = ['all', 'Technology', 'Design', 'JavaScript', 'Backend', 'Database', 'AI'];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.blogViewer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading recent posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.blogViewer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Recent Blog Posts</h1>
          <p>Discover the latest insights and stories from our community</p>
          <button 
            className={styles.backBtn}
            onClick={() => onNavigate('login')}
          >
            ← Back to Login
          </button>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search posts, authors, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.categoryFilter}>
          {categories.map(category => (
            <button
              key={category}
              className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.postsContainer}>
        {filteredPosts.length === 0 ? (
          <div className={styles.noResults}>
            <h3>No posts found</h3>
            <p>Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {filteredPosts.map(post => (
              <article key={post.id} className={styles.postCard}>
                <div className={styles.postHeader}>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorAvatar}>
                      {post.authorAvatar}
                    </div>
                    <div className={styles.authorDetails}>
                      <span className={styles.authorName}>{post.author}</span>
                      <span className={styles.publishDate}>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                  <span className={styles.categoryTag}>{post.category}</span>
                </div>

                <div className={styles.postContent} onClick={() => handlePostClick(post)}>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <span className={styles.readTime}>{post.readTime}</span>
                </div>

                <div className={styles.postFooter}>
                  <div className={styles.postStats}>
                    <span className={styles.stat}>👁️ {post.views}</span>
                    <span className={styles.stat}>💬 {post.comments}</span>
                  </div>
                  <button 
                    className={styles.likeBtn}
                    onClick={() => handleLike(post.id)}
                  >
                    ❤️ {post.likes}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {showPostModal && selectedPost && (
        <div className={styles.modal} onClick={() => setShowPostModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalAuthorInfo}>
                <div className={styles.modalAuthorAvatar}>
                  {selectedPost.authorAvatar}
                </div>
                <div>
                  <h3>{selectedPost.author}</h3>
                  <p>{formatDate(selectedPost.publishedAt)} • {selectedPost.readTime}</p>
                </div>
              </div>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowPostModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <h1 className={styles.modalTitle}>{selectedPost.title}</h1>
              <span className={styles.modalCategory}>{selectedPost.category}</span>
              <div className={styles.modalContent}>
                <p>{selectedPost.content}</p>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <div className={styles.modalStats}>
                <span>👁️ {selectedPost.views} views</span>
                <span>💬 {selectedPost.comments} comments</span>
                <span>❤️ {selectedPost.likes} likes</span>
              </div>
              <button 
                className={styles.modalLikeBtn}
                onClick={() => handleLike(selectedPost.id)}
              >
                ❤️ Like
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogViewer;
