import React, { useState } from 'react';
import axios from 'axios';
import styles from './BlogPost.module.css';

const BlogPost = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token || !user.id) {
        setMessage('Please log in to create a post');
        setMessageType('error');
        return;
      }

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

      const postData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: tagsArray,
        authorId: user.id
      };

      const response = await axios.post('http://localhost:5000/api/posts', postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setMessage('Blog post created successfully!');
        setMessageType('success');
        setFormData({
          title: '',
          content: '',
          category: '',
          tags: ''
        });

        setTimeout(() => {
          onNavigate('blog');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setMessage(error.response?.data?.message || 'Failed to create post');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => onNavigate('blog')}
        >
          ← Back to Blog
        </button>
        <h1>Create New Blog Post</h1>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter your blog post title"
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={isLoading}
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Enter tags separated by commas (e.g., tech, innovation, AI)"
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Write your blog post content here..."
              rows="15"
              required
              disabled={isLoading}
            />
          </div>

          {message && (
            <div className={`${styles.message} ${messageType === 'error' ? styles.error : styles.success}`}>
              {message}
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={() => onNavigate('blog')}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogPost;
