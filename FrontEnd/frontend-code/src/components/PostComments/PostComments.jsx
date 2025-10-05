import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './PostComments.module.css';

const PostComments = ({ postId, commentCount, onCommentCountChange }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/comments/post/${postId}`);
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/comments',
        {
          postId: postId,
          content: newComment.trim()
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setNewComment('');
        // Add the new comment to the existing comments array immediately
        const newCommentData = response.data.comment;
        setComments(prevComments => [newCommentData, ...prevComments]);
        if (onCommentCountChange) {
          onCommentCountChange(commentCount + 1);
        }
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      // If there's an error, refetch to ensure consistency
      fetchComments();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (e, parentCommentId) => {
    e.preventDefault();
    if (!replyContent.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/comments',
        {
          postId: postId,
          content: replyContent.trim(),
          parentComment: parentCommentId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setReplyContent('');
        setReplyingTo(null);
        // Refetch comments to get the updated replies structure
        fetchComments();
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/comments/${commentId}/like`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        fetchComments();
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`${styles.comment} ${isReply ? styles.reply : ''}`}>
      <div className={styles.commentHeader}>
        <div className={styles.authorInfo}>
          <span className={styles.authorName}>
            {comment.authorName || 
             (comment.authorId && comment.authorId.firstName && comment.authorId.lastName 
              ? `${comment.authorId.firstName} ${comment.authorId.lastName}` 
              : comment.authorId?.username || 'Anonymous')}
          </span>
          <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
          {comment.isEdited && <span className={styles.edited}>(edited)</span>}
        </div>
      </div>
      
      <div className={styles.commentContent}>
        {comment.content}
      </div>
      
      <div className={styles.commentActions}>
        <button 
          className={`${styles.likeButton} ${comment.likedBy?.includes(user?.id) ? styles.liked : ''}`}
          onClick={() => handleLikeComment(comment._id)}
          disabled={!user}
        >
          👍 {comment.likes || 0}
        </button>
        
        {!isReply && (
          <button 
            className={styles.replyButton}
            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
            disabled={!user}
          >
            Reply
          </button>
        )}
      </div>

      {replyingTo === comment._id && (
        <form onSubmit={(e) => handleSubmitReply(e, comment._id)} className={styles.replyForm}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className={styles.replyTextarea}
            rows="3"
          />
          <div className={styles.replyActions}>
            <button type="button" onClick={() => setReplyingTo(null)} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || !replyContent.trim()} className={styles.submitButton}>
              {isSubmitting ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
          {comment.replies.map(reply => (
            <CommentItem key={reply._id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  if (!user) {
    return (
      <div className={styles.commentsSection}>
        <h3>Comments ({commentCount || 0})</h3>
        <p className={styles.loginPrompt}>Please log in to view and post comments.</p>
      </div>
    );
  }

  return (
    <div className={styles.commentsSection}>
      <h3>Comments ({commentCount || 0})</h3>
      
      <form onSubmit={handleSubmitComment} className={styles.commentForm}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className={styles.commentTextarea}
          rows="4"
        />
        <button 
          type="submit" 
          disabled={isSubmitting || !newComment.trim()}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className={styles.commentsList}>
        {isLoading ? (
          <div className={styles.loading}>Loading comments...</div>
        ) : comments.length === 0 ? (
          <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment._id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default PostComments;
