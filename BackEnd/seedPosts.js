require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./model/Post');
const User = require('./model/User');
const connectDB = require('./database/db');

const samplePosts = [
  {
    title: 'Getting Started with React Hooks',
    content: 'React Hooks revolutionized the way we write React components. They allow you to use state and other React features without writing a class component. In this comprehensive guide, we will explore the most commonly used hooks like useState, useEffect, useContext, and many more. We will also dive into custom hooks and how they can help you write more reusable and maintainable code.',
    author: 'John Doe',
    status: 'published',
    category: 'Technology',
    views: 1250,
    likes: 45,
    comments: 12
  },
  {
    title: 'Understanding CSS Grid Layout',
    content: 'CSS Grid is a two-dimensional layout system for the web. It lets you lay out items in rows and columns, making it easier to design complex responsive layouts. Unlike Flexbox, which is largely a one-dimensional system, Grid is optimized for two-dimensional layouts. In this article, we will cover the fundamentals of CSS Grid, including grid containers, grid items, grid lines, and grid areas.',
    author: 'Jane Smith',
    status: 'published',
    category: 'Design',
    views: 890,
    likes: 32,
    comments: 8
  },
  {
    title: 'Modern JavaScript Features Every Developer Should Know',
    content: 'JavaScript has evolved significantly over the years. With ES6 and beyond, we have gotten many powerful features that make our code more readable, maintainable, and efficient. In this post, we will explore features like destructuring, arrow functions, template literals, async/await, modules, and more. These features have become essential tools in every JavaScript developer toolkit.',
    author: 'Mike Johnson',
    status: 'published',
    category: 'JavaScript',
    views: 2100,
    likes: 78,
    comments: 23
  },
  {
    title: 'Building RESTful APIs with Node.js',
    content: 'Node.js has become one of the most popular platforms for building server-side applications. In this comprehensive tutorial, we will learn how to build a RESTful API from scratch using Node.js, Express.js, and MongoDB. We will cover everything from setting up the development environment to implementing authentication, validation, and error handling.',
    author: 'Sarah Wilson',
    status: 'published',
    category: 'Backend',
    views: 1680,
    likes: 56,
    comments: 19
  },
  {
    title: 'Database Design Best Practices',
    content: 'Designing a good database is crucial for the performance and scalability of your application. In this article, we will discuss the fundamental principles of database design, including normalization, indexing, relationships, and performance optimization. We will also cover common pitfalls to avoid and best practices that can save you hours of debugging later.',
    author: 'David Brown',
    status: 'published',
    category: 'Database',
    views: 1340,
    likes: 41,
    comments: 15
  },
  {
    title: 'Introduction to Machine Learning',
    content: 'Machine Learning is transforming industries and creating new opportunities everywhere. This beginner-friendly guide will introduce you to the core concepts of machine learning, including supervised learning, unsupervised learning, and reinforcement learning. We will also explore popular algorithms and tools that you can use to get started with your own ML projects.',
    author: 'Emily Davis',
    status: 'published',
    category: 'AI',
    views: 2850,
    likes: 92,
    comments: 31
  }
];

const seedPosts = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');
    
    // Find or create a default user for authorId
    let defaultUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!defaultUser) {
      // Create a default user if none exists
      const bcryptjs = require('bcryptjs');
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash('admin123', salt);
      
      defaultUser = await User.create({
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword
      });
      console.log('Created default admin user');
    }
    
    // Add authorId to each post
    const postsWithAuthorId = samplePosts.map(post => ({
      ...post,
      authorId: defaultUser._id
    }));
    
    // Insert sample posts
    const insertedPosts = await Post.insertMany(postsWithAuthorId);
    console.log(`Inserted ${insertedPosts.length} sample posts`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedPosts();
