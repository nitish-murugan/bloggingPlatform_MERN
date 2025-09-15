const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Post = require('../model/Post');
const Comment = require('../model/Comment');
const { authenticateToken } = require('../middleware/auth');

// Middleware to check if user is super admin
const requireSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Super admin required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create super admin (for initial setup - remove in production)
router.post('/create-superadmin', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Update existing user to superadmin
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'superadmin' },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User promoted to super admin', user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating super admin', error: error.message });
  }
});

// Get all users with stats
router.get('/users', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const postsCount = await Post.countDocuments({ author: user._id });
        const commentsCount = await Comment.countDocuments({ author: user._id });
        
        return {
          ...user.toObject(),
          postsCount,
          commentsCount,
          isOnline: Math.random() > 0.5, // Mock online status
          status: user.isActive ? 'active' : 'suspended'
        };
      })
    );

    res.json({ users: usersWithStats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get user statistics
router.get('/user-stats', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    
    // Users created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({ 
      createdAt: { $gte: today } 
    });

    // Mock online users (in real app, you'd track this)
    const onlineUsers = Math.floor(totalUsers * 0.3);

    res.json({
      totalUsers,
      activeUsers,
      newUsersToday,
      onlineUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user stats', error: error.message });
  }
});

// Get user activity
router.get('/user-activity/:userId', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Mock activity data (in real app, you'd have an activity log)
    const activities = [
      {
        type: 'login',
        timestamp: new Date().toISOString(),
        details: 'Logged in from Chrome'
      },
      {
        type: 'post_created',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: 'Created a new blog post'
      },
      {
        type: 'comment',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        details: 'Commented on a post'
      }
    ];

    res.json({ activities });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user activity', error: error.message });
  }
});

// User action (suspend/activate)
router.post('/user-action', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { userId, action } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'suspend') {
      user.isActive = false;
    } else if (action === 'activate') {
      user.isActive = true;
    }

    await user.save();

    // Log the action (in real app, save to audit log)
    console.log(`Admin ${req.user.id} ${action}ed user ${userId}`);

    res.json({ message: `User ${action}ed successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error performing user action', error: error.message });
  }
});

// Get system analytics
router.get('/analytics', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { range } = req.query;
    
    // Calculate date range
    let dateFilter = {};
    const now = new Date();
    
    switch (range) {
      case '24h':
        dateFilter = { createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } };
        break;
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = {};
    }

    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const postsInRange = await Post.countDocuments(dateFilter);
    const commentsInRange = await Comment.countDocuments(dateFilter);
    const usersInRange = await User.countDocuments(dateFilter);

    // Get most active users
    const mostActiveUsers = await User.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'author',
          as: 'posts'
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'author',
          as: 'comments'
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          posts: { $size: '$posts' },
          comments: { $size: '$comments' }
        }
      },
      {
        $addFields: {
          name: { $concat: ['$firstName', ' ', '$lastName'] }
        }
      },
      { $sort: { posts: -1, comments: -1 } },
      { $limit: 5 }
    ]);

    // Get popular posts
    const popularPosts = await Post.find()
      .select('title views')
      .sort({ views: -1 })
      .limit(5)
      .populate('comments');

    const popularPostsWithStats = popularPosts.map(post => ({
      title: post.title,
      views: post.views || Math.floor(Math.random() * 500) + 50, // Mock views
      comments: post.comments ? post.comments.length : 0
    }));

    res.json({
      overview: {
        totalPosts,
        totalComments,
        totalUsers,
        totalViews: Math.floor(Math.random() * 10000) + 5000 // Mock total views
      },
      growth: {
        usersThisMonth: usersInRange,
        postsThisMonth: postsInRange,
        commentsThisMonth: commentsInRange,
        growthRate: Math.floor(Math.random() * 30) + 10 // Mock growth rate
      },
      engagement: {
        avgCommentsPerPost: totalPosts > 0 ? (totalComments / totalPosts).toFixed(1) : 0,
        mostActiveUsers: mostActiveUsers.slice(0, 3),
        popularPosts: popularPostsWithStats.slice(0, 3),
        engagementRate: Math.floor(Math.random() * 40) + 50 // Mock engagement rate
      },
      systemHealth: {
        serverUptime: '99.9%',
        avgResponseTime: Math.floor(Math.random() * 200) + 150 + 'ms',
        errorRate: '0.' + Math.floor(Math.random() * 5) + '%',
        activeConnections: Math.floor(Math.random() * 100) + 20
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
});

// Get all posts for content management
router.get('/posts', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'firstName lastName')
      .sort({ createdAt: -1 });

    const postsWithStats = posts.map(post => ({
      ...post.toObject(),
      views: Math.floor(Math.random() * 500) + 10, // Mock views
      commentsCount: post.comments ? post.comments.length : 0,
      likes: Math.floor(Math.random() * 100) + 1 // Mock likes
    }));

    res.json({ posts: postsWithStats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// Get all comments for content management
router.get('/comments', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('author', 'firstName lastName')
      .populate('post', 'title')
      .sort({ createdAt: -1 });

    const commentsWithStats = comments.map(comment => ({
      ...comment.toObject(),
      likes: comment.likes ? comment.likes.length : 0,
      replies: comment.replies ? comment.replies.length : 0,
      status: 'approved' // Mock status
    }));

    res.json({ comments: commentsWithStats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
});

// Bulk action on posts/comments
router.post('/bulk-action', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { type, action, items } = req.body;
    
    if (type === 'posts') {
      if (action === 'delete') {
        await Post.deleteMany({ _id: { $in: items } });
      } else {
        await Post.updateMany(
          { _id: { $in: items } },
          { status: action }
        );
      }
    } else if (type === 'comments') {
      if (action === 'delete') {
        await Comment.deleteMany({ _id: { $in: items } });
      } else {
        await Comment.updateMany(
          { _id: { $in: items } },
          { status: action }
        );
      }
    }

    // Log the action
    console.log(`Admin ${req.user.id} performed ${action} on ${items.length} ${type}`);

    res.json({ message: `Bulk ${action} completed successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error performing bulk action', error: error.message });
  }
});

// Get audit logs
router.get('/audit-logs', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    // Mock audit logs (in real app, you'd have an audit log collection)
    const logs = [
      {
        _id: '1',
        action: 'USER_LOGIN',
        user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome/91.0 Windows',
        details: 'Successful login',
        severity: 'info'
      },
      {
        _id: '2',
        action: 'POST_DELETED',
        user: { firstName: 'Admin', lastName: 'User', email: 'admin@example.com' },
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        ipAddress: '192.168.1.101',
        userAgent: 'Firefox/89.0 MacOS',
        details: 'Deleted spam post',
        severity: 'warning'
      }
    ];

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs', error: error.message });
  }
});

// Get security alerts
router.get('/security-alerts', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    // Mock security alerts
    const alerts = [
      {
        _id: '1',
        type: 'BRUTE_FORCE',
        title: 'Multiple Failed Login Attempts',
        description: 'IP 203.0.113.1 attempted 15 failed logins in 10 minutes',
        severity: 'high',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: 'active',
        affectedResource: '203.0.113.1'
      }
    ];

    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching security alerts', error: error.message });
  }
});

// Security alert action
router.post('/security-alert-action', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { alertId, action } = req.body;
    
    // In real app, update alert status in database
    console.log(`Admin ${req.user.id} ${action} security alert ${alertId}`);
    
    res.json({ message: `Alert ${action} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating alert', error: error.message });
  }
});

// Run security scan
router.post('/security-scan', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    // Mock security scan
    console.log(`Admin ${req.user.id} initiated security scan`);
    
    // Simulate scan delay
    setTimeout(() => {
      console.log('Security scan completed');
    }, 2000);
    
    res.json({ message: 'Security scan initiated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error running security scan', error: error.message });
  }
});

module.exports = router;