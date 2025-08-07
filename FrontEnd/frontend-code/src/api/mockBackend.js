// Mock backend simulation for demonstration
// This shows the expected API structure

export const mockApiResponses = {
  // Login endpoint: POST /auth/login
  login: {
    success: {
      token: "mock-jwt-token-123456",
      user: {
        id: 1,
        username: "johndoe",
        email: "john@example.com",
        role: "user" // or "admin"
      }
    },
    adminSuccess: {
      token: "mock-admin-token-789012",
      user: {
        id: 2,
        username: "admin",
        email: "admin@example.com",
        role: "admin"
      }
    },
    error: {
      message: "Invalid credentials"
    }
  },

  // Register endpoint: POST /auth/register
  register: {
    success: {
      token: "mock-jwt-token-456789",
      user: {
        id: 3,
        username: "newuser",
        email: "newuser@example.com",
        role: "user"
      }
    },
    error: {
      message: "User already exists"
    }
  },

  // Get posts endpoint: GET /api/posts
  posts: {
    success: {
      posts: [
        {
          id: 1,
          title: "Backend Integration Complete",
          content: "This post comes from the backend API...",
          excerpt: "This post demonstrates successful backend integration...",
          author: "System Admin",
          authorAvatar: "SA",
          category: "Technology",
          publishedAt: "2024-01-21",
          readTime: "3 min read",
          views: 0,
          likes: 0,
          comments: 0,
          image: null
        },
        {
          id: 2,
          title: "Real-time Data Updates",
          content: "Our backend now supports real-time updates...",
          excerpt: "Experience the power of real-time data synchronization...",
          author: "Backend Team",
          authorAvatar: "BT",
          category: "Backend",
          publishedAt: "2024-01-21",
          readTime: "5 min read",
          views: 15,
          likes: 3,
          comments: 1,
          image: null
        }
      ]
    },
    error: {
      message: "Failed to fetch posts"
    }
  },

  // Admin endpoints would include user management, post management, etc.
  adminUsers: {
    success: {
      users: [
        {
          id: 1,
          username: "johndoe",
          email: "john@example.com",
          role: "user",
          status: "active",
          joinedAt: "2024-01-15"
        },
        {
          id: 2,
          username: "admin",
          email: "admin@example.com",
          role: "admin",
          status: "active",
          joinedAt: "2024-01-01"
        }
      ]
    }
  }
};

// Example usage in components:
// try {
//   const response = await axios.get('http://localhost:5000/api/posts');
//   setPosts(response.data.posts || response.data);
// } catch (error) {
//   console.log('Backend not available, using mock data');
//   setPosts(mockPosts);
// }
