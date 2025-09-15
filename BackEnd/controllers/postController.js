const Post = require('../model/Post');
const User = require('../model/User');

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('authorId', 'username email firstName lastName')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      posts: posts.map(post => ({
        id: post._id,
        title: post.title,
        content: post.content,
        author: post.author,
        authorId: post.authorId,
        status: post.status,
        category: post.category,
        createdAt: post.formattedCreatedAt,
        updatedAt: post.formattedUpdatedAt,
        views: post.views,
        likes: post.likes,
        comments: post.comments
      }))
    });
  } catch (error) {
    console.log(`Error occurred while fetching posts: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching posts"
    });
  }
};

// Get single post by ID
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('authorId', 'username email firstName lastName');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      post: {
        id: post._id,
        title: post.title,
        content: post.content,
        author: post.author,
        authorId: post.authorId,
        status: post.status,
        category: post.category,
        createdAt: post.formattedCreatedAt,
        updatedAt: post.formattedUpdatedAt,
        views: post.views,
        likes: post.likes,
        comments: post.comments
      }
    });
  } catch (error) {
    console.log(`Error occurred while fetching post: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching post"
    });
  }
};

// Create new post
const createPost = async (req, res) => {
  try {
    const { title, content, category, tags, authorId } = req.body;

    if (!title || !content || !authorId) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and author ID are required"
      });
    }

    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found"
      });
    }

    const authorName = `${author.firstName} ${author.lastName}`;

    const newPost = await Post.create({
      title,
      content,
      author: authorName,
      authorId,
      status: 'published',
      category: category || 'Other',
      tags: tags || [],
      views: 0,
      likes: 0,
      likedBy: [],
      comments: [],
      commentCount: 0
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: {
        id: newPost._id,
        title: newPost.title,
        content: newPost.content,
        author: newPost.author,
        authorId: newPost.authorId,
        status: newPost.status,
        category: newPost.category,
        tags: newPost.tags,
        createdAt: newPost.formattedCreatedAt,
        updatedAt: newPost.formattedUpdatedAt,
        views: newPost.views,
        likes: newPost.likes,
        commentCount: newPost.commentCount
      }
    });
  } catch (error) {
    console.log(`Error occurred while creating post: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error occurred while creating post"
    });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('authorId', 'username email firstName lastName');

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: {
        id: updatedPost._id,
        title: updatedPost.title,
        content: updatedPost.content,
        author: updatedPost.author,
        authorId: updatedPost.authorId,
        status: updatedPost.status,
        category: updatedPost.category,
        createdAt: updatedPost.formattedCreatedAt,
        updatedAt: updatedPost.formattedUpdatedAt,
        views: updatedPost.views,
        likes: updatedPost.likes,
        comments: updatedPost.comments
      }
    });
  } catch (error) {
    console.log(`Error occurred while updating post: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating post"
    });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.log(`Error occurred while deleting post: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error occurred while deleting post"
    });
  }
};

// Increment post views
const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Views incremented successfully",
      views: post.views
    });
  } catch (error) {
    console.log(`Error occurred while incrementing views: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error occurred while incrementing views"
    });
  }
};

// Like post
const likePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
      likes: post.likes
    });
  } catch (error) {
    console.log(`Error occurred while liking post: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error occurred while liking post"
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  incrementViews,
  likePost
};
