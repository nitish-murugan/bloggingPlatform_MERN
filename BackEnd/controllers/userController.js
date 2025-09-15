const User = require('../model/User');

// Get login statistics
const getLoginStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get users who logged in today
    const todayLogins = await User.find({
      lastLoginDate: {
        $gte: today,
        $lt: tomorrow
      }
    }).select('_id loginCount lastLoginDate');

    // Get currently online users
    const onlineUsers = await User.find({
      isOnline: true
    }).select('_id username email');

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get active users count
    const activeUsers = await User.countDocuments({ status: 'active' });

    // Build daily login stats
    const dailyLogins = {};
    let totalDailyLogins = 0;

    todayLogins.forEach(user => {
      dailyLogins[user._id.toString()] = 1; // Count login for today
      totalDailyLogins += 1;
    });

    const stats = {
      dailyLogins,
      currentlyOnline: onlineUsers.map(user => user._id.toString()),
      totalDailyLogins,
      currentDate: today.toDateString(),
      totalUsers,
      activeUsers,
      onlineUsersDetails: onlineUsers.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email
      }))
    };

    return res.status(200).json({
      success: true,
      message: "Login statistics retrieved successfully",
      stats
    });

  } catch (error) {
    console.log(`Error occurred while fetching login stats: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching login statistics"
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // From JWT middleware
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        loginCount: user.loginCount,
        lastLoginDate: user.lastLoginDate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.log(`Error occurred while fetching user profile: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching user profile"
    });
  }
};

// Update user online status
const updateOnlineStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { isOnline } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    await User.findByIdAndUpdate(userId, {
      isOnline: isOnline,
      lastActivityDate: new Date()
    });

    return res.status(200).json({
      success: true,
      message: "Online status updated successfully"
    });

  } catch (error) {
    console.log(`Error occurred while updating online status: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating online status"
    });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
        loginCount: user.loginCount,
        lastLoginDate: user.lastLoginDate,
        isOnline: user.isOnline,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });

  } catch (error) {
    console.log(`Error occurred while fetching users: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching users"
    });
  }
};

module.exports = {
  getLoginStats,
  getUserProfile,
  updateOnlineStatus,
  getAllUsers
};
