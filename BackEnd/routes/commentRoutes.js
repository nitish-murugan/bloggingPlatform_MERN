const express = require('express');
const {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment,
    likeComment
} = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, createComment);
router.get('/post/:postId', getCommentsByPost);
router.put('/:commentId', authenticateToken, updateComment);
router.delete('/:commentId', authenticateToken, deleteComment);
router.post('/:commentId/like', authenticateToken, likeComment);

module.exports = router;
