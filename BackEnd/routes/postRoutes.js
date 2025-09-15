const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  incrementViews,
  likePost
} = require('../controllers/postController');

// GET /api/posts - Get all posts
router.get('/', getAllPosts);

// GET /api/posts/:id - Get single post by ID
router.get('/:id', getPostById);

// POST /api/posts - Create new post
router.post('/', createPost);

// PUT /api/posts/:id - Update post
router.put('/:id', updatePost);

// DELETE /api/posts/:id - Delete post
router.delete('/:id', deletePost);

// PATCH /api/posts/:id/views - Increment post views
router.patch('/:id/views', incrementViews);

// PATCH /api/posts/:id/like - Like post
router.patch('/:id/like', likePost);

module.exports = router;
