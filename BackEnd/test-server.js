const express = require('express');
const app = express();

// Test basic express setup
app.get('/test', (req, res) => {
  res.json({ message: 'Basic test works' });
});

console.log('Testing basic Express setup...');

// Try to add routes one by one to isolate the issue
try {
  console.log('Adding auth routes...');
  const authRoute = require('./routes/authRoutes');
  app.use('/api/auth', authRoute);
  console.log('Auth routes added successfully');
} catch (error) {
  console.error('Error with auth routes:', error.message);
}

try {
  console.log('Adding admin routes...');
  const statisticsRoute = require('./routes/adminRouter');
  app.use('/api/admin', statisticsRoute);
  console.log('Admin routes added successfully');
} catch (error) {
  console.error('Error with admin routes:', error.message);
}

try {
  console.log('Adding post routes...');
  const postRoute = require('./routes/postRoutes');
  app.use('/api/posts', postRoute);
  console.log('Post routes added successfully');
} catch (error) {
  console.error('Error with post routes:', error.message);
}

try {
  console.log('Adding comment routes...');
  const commentRoute = require('./routes/commentRoutes');
  app.use('/api/comments', commentRoute);
  console.log('Comment routes added successfully');
} catch (error) {
  console.error('Error with comment routes:', error.message);
}

try {
  console.log('Adding superadmin routes...');
  const superAdminRoute = require('./routes/superAdminRoutes');
  app.use('/api/superadmin', superAdminRoute);
  console.log('SuperAdmin routes added successfully');
} catch (error) {
  console.error('Error with superadmin routes:', error.message);
}

console.log('All routes tested successfully!');