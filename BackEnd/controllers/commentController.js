const Comment = require('../model/Comment');
const Post = require('../model/Post');
const User = require('../model/User');

const createComment = async (req, res) => {
    try {
        const { postId, content, parentComment } = req.body;
        const userId = req.user.id;
        const userEmail = req.user.email;
        const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.username || 'Anonymous';

        if (!postId || !content) {
            return res.status(400).json({
                success: false,
                message: "Post ID and content are required"
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const newComment = await Comment.create({
            content: content.trim(),
            authorId: userId,
            postId: postId,
            authorName: userName,
            authorEmail: userEmail,
            parentComment: parentComment || null
        });

        if (parentComment) {
            await Comment.findByIdAndUpdate(parentComment, {
                $push: { replies: newComment._id }
            });
        } else {
            await Post.findByIdAndUpdate(postId, {
                $push: { comments: newComment._id },
                $inc: { commentCount: 1 }
            });
        }

        await newComment.populate('authorId', 'firstName lastName profilePicture');

        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
            comment: newComment
        });

    } catch (error) {
        console.log(`Error creating comment: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Error creating comment"
        });
    }
};

const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const comments = await Comment.find({ 
            postId: postId, 
            parentComment: null 
        })
        .populate('authorId', 'firstName lastName profilePicture')
        .populate({
            path: 'replies',
            populate: {
                path: 'authorId',
                select: 'firstName lastName profilePicture'
            }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        const totalComments = await Comment.countDocuments({ 
            postId: postId, 
            parentComment: null 
        });

        return res.status(200).json({
            success: true,
            comments: comments,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalComments / limit),
                totalComments: totalComments,
                hasNext: page < Math.ceil(totalComments / limit),
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.log(`Error fetching comments: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Error fetching comments"
        });
    }
};

const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Content is required"
            });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        if (comment.authorId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own comments"
            });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { 
                content: content.trim(),
                isEdited: true,
                editedAt: new Date()
            },
            { new: true }
        ).populate('authorId', 'firstName lastName profilePicture');

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment: updatedComment
        });

    } catch (error) {
        console.log(`Error updating comment: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Error updating comment"
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        if (comment.authorId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own comments"
            });
        }

        if (comment.parentComment) {
            await Comment.findByIdAndUpdate(comment.parentComment, {
                $pull: { replies: commentId }
            });
        } else {
            await Post.findByIdAndUpdate(comment.postId, {
                $pull: { comments: commentId },
                $inc: { commentCount: -1 }
            });
        }

        await Comment.findByIdAndDelete(commentId);

        if (comment.replies && comment.replies.length > 0) {
            await Comment.deleteMany({ _id: { $in: comment.replies } });
        }

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.log(`Error deleting comment: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Error deleting comment"
        });
    }
};

const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        const isLiked = comment.likedBy.includes(userId);
        
        if (isLiked) {
            await Comment.findByIdAndUpdate(commentId, {
                $pull: { likedBy: userId },
                $inc: { likes: -1 }
            });
        } else {
            await Comment.findByIdAndUpdate(commentId, {
                $push: { likedBy: userId },
                $inc: { likes: 1 }
            });
        }

        const updatedComment = await Comment.findById(commentId);

        return res.status(200).json({
            success: true,
            message: isLiked ? "Comment unliked" : "Comment liked",
            isLiked: !isLiked,
            likes: updatedComment.likes
        });

    } catch (error) {
        console.log(`Error liking comment: ${error}`);
        return res.status(500).json({
            success: false,
            message: "Error liking comment"
        });
    }
};

module.exports = {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment,
    likeComment
};
