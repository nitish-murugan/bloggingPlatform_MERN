import React, { useState, useEffect } from 'react';
import styles from './Statistics.module.css';

const Statistics = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [stats, setStats] = useState({});

  useEffect(() => {
    const mockStats = {
      monthly: {
        visitors: {
          current: 45680,
          previous: 42150,
          change: 8.4
        },
        pageViews: {
          current: 125340,
          previous: 118200,
          change: 6.0
        },
        posts: {
          current: 28,
          previous: 25,
          change: 12.0
        },
        users: {
          current: 1250,
          previous: 1180,
          change: 5.9
        },
        engagement: {
          current: 3.2,
          previous: 2.9,
          change: 10.3
        },
        chartData: [
          { period: 'Jan', visitors: 35000, pageViews: 98000, posts: 22, newUsers: 180 },
          { period: 'Feb', visitors: 38500, pageViews: 105000, posts: 25, newUsers: 210 },
          { period: 'Mar', visitors: 42000, pageViews: 115000, posts: 28, newUsers: 195 },
          { period: 'Apr', visitors: 45680, pageViews: 125340, posts: 32, newUsers: 220 }
        ],
        topPosts: [
          { title: 'Getting Started with React Hooks', views: 8540, likes: 245, comments: 67 },
          { title: 'Modern JavaScript Features', views: 7320, likes: 198, comments: 52 },
          { title: 'CSS Grid Layout Guide', views: 6890, likes: 176, comments: 43 },
          { title: 'Node.js Best Practices', views: 5670, likes: 145, comments: 38 },
          { title: 'Database Design Patterns', views: 4820, likes: 132, comments: 29 }
        ],
        topCategories: [
          { name: 'Technology', posts: 45, views: 28540 },
          { name: 'JavaScript', posts: 32, views: 22100 },
          { name: 'Design', posts: 28, views: 18670 },
          { name: 'Backend', posts: 24, views: 15890 },
          { name: 'Database', posts: 18, views: 12340 }
        ]
      },
      weekly: {
        visitors: {
          current: 12450,
          previous: 11200,
          change: 11.2
        },
        pageViews: {
          current: 34560,
          previous: 31280,
          change: 10.5
        },
        posts: {
          current: 8,
          previous: 6,
          change: 33.3
        },
        users: {
          current: 340,
          previous: 280,
          change: 21.4
        },
        engagement: {
          current: 3.8,
          previous: 3.2,
          change: 18.8
        },
        chartData: [
          { period: 'Mon', visitors: 1800, pageViews: 4200, posts: 1, newUsers: 45 },
          { period: 'Tue', visitors: 2100, pageViews: 5800, posts: 2, newUsers: 52 },
          { period: 'Wed', visitors: 1950, pageViews: 5200, posts: 1, newUsers: 38 },
          { period: 'Thu', visitors: 2200, pageViews: 6100, posts: 2, newUsers: 61 },
          { period: 'Fri', visitors: 2400, pageViews: 6800, posts: 1, newUsers: 47 },
          { period: 'Sat', visitors: 1500, pageViews: 3200, posts: 0, newUsers: 28 },
          { period: 'Sun', visitors: 1200, pageViews: 2800, posts: 1, newUsers: 32 }
        ],
        topPosts: [
          { title: 'React Performance Tips', views: 2840, likes: 89, comments: 23 },
          { title: 'TypeScript Advanced Types', views: 2320, likes: 67, comments: 18 },
          { title: 'API Design Guidelines', views: 1890, likes: 54, comments: 15 },
          { title: 'Testing Best Practices', views: 1670, likes: 43, comments: 12 },
          { title: 'Microservices Architecture', views: 1420, likes: 38, comments: 9 }
        ],
        topCategories: [
          { name: 'Technology', posts: 12, views: 7540 },
          { name: 'JavaScript', posts: 8, views: 5100 },
          { name: 'Design', posts: 6, views: 3670 },
          { name: 'Backend', posts: 5, views: 2890 },
          { name: 'Database', posts: 3, views: 1840 }
        ]
      }
    };
    setStats(mockStats);
  }, []);

  const currentStats = stats[timeRange] || {};

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString();
  };

  const getChangeIcon = (change) => {
    if (change > 0) return '📈';
    if (change < 0) return '📉';
    return '➖';
  };

  const getChangeClass = (change) => {
    if (change > 0) return styles.positive;
    if (change < 0) return styles.negative;
    return styles.neutral;
  };

  return (
    <div className={styles.statistics}>
      <div className={styles.header}>
        <div>
          <h2>Analytics & Statistics</h2>
          <p>Monitor your blog's performance and engagement metrics</p>
        </div>
        
        <div className={styles.timeRangeSelector}>
          <button 
            className={`${styles.timeBtn} ${timeRange === 'weekly' ? styles.active : ''}`}
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`${styles.timeBtn} ${timeRange === 'monthly' ? styles.active : ''}`}
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>👥</span>
            <span className={styles.metricTitle}>Visitors</span>
          </div>
          <div className={styles.metricValue}>
            {formatNumber(currentStats.visitors?.current)}
          </div>
          <div className={`${styles.metricChange} ${getChangeClass(currentStats.visitors?.change)}`}>
            {getChangeIcon(currentStats.visitors?.change)} {Math.abs(currentStats.visitors?.change || 0).toFixed(1)}%
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>📄</span>
            <span className={styles.metricTitle}>Page Views</span>
          </div>
          <div className={styles.metricValue}>
            {formatNumber(currentStats.pageViews?.current)}
          </div>
          <div className={`${styles.metricChange} ${getChangeClass(currentStats.pageViews?.change)}`}>
            {getChangeIcon(currentStats.pageViews?.change)} {Math.abs(currentStats.pageViews?.change || 0).toFixed(1)}%
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>📝</span>
            <span className={styles.metricTitle}>Posts</span>
          </div>
          <div className={styles.metricValue}>
            {currentStats.posts?.current}
          </div>
          <div className={`${styles.metricChange} ${getChangeClass(currentStats.posts?.change)}`}>
            {getChangeIcon(currentStats.posts?.change)} {Math.abs(currentStats.posts?.change || 0).toFixed(1)}%
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>👤</span>
            <span className={styles.metricTitle}>New Users</span>
          </div>
          <div className={styles.metricValue}>
            {currentStats.users?.current}
          </div>
          <div className={`${styles.metricChange} ${getChangeClass(currentStats.users?.change)}`}>
            {getChangeIcon(currentStats.users?.change)} {Math.abs(currentStats.users?.change || 0).toFixed(1)}%
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricIcon}>💫</span>
            <span className={styles.metricTitle}>Engagement</span>
          </div>
          <div className={styles.metricValue}>
            {currentStats.engagement?.current}
          </div>
          <div className={`${styles.metricChange} ${getChangeClass(currentStats.engagement?.change)}`}>
            {getChangeIcon(currentStats.engagement?.change)} {Math.abs(currentStats.engagement?.change || 0).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <h3>Traffic Overview</h3>
          <div className={styles.chartPlaceholder}>
            <div className={styles.chartBars}>
              {currentStats.chartData?.map((data, index) => (
                <div key={index} className={styles.chartBar}>
                  <div 
                    className={styles.bar}
                    style={{ 
                      height: `${(data.visitors / Math.max(...(currentStats.chartData?.map(d => d.visitors) || [1]))) * 100}%` 
                    }}
                  ></div>
                  <span className={styles.barLabel}>{data.period}</span>
                </div>
              ))}
            </div>
            <div className={styles.chartLegend}>
              <span>📊 Visitor trends over time</span>
            </div>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Page Views Distribution</h3>
          <div className={styles.donutChart}>
            <div className={styles.donutPlaceholder}>
              <div className={styles.donutCenter}>
                <span className={styles.donutValue}>{formatNumber(currentStats.pageViews?.current)}</span>
                <span className={styles.donutLabel}>Total Views</span>
              </div>
            </div>
            <div className={styles.donutLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{background: '#3498db'}}></span>
                <span>Desktop (65%)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{background: '#e74c3c'}}></span>
                <span>Mobile (30%)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendColor} style={{background: '#f39c12'}}></span>
                <span>Tablet (5%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className={styles.tablesContainer}>
        <div className={styles.tableCard}>
          <h3>Top Performing Posts</h3>
          <div className={styles.tableContainer}>
            <table className={styles.statsTable}>
              <thead>
                <tr>
                  <th>Post Title</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {currentStats.topPosts?.map((post, index) => (
                  <tr key={index}>
                    <td className={styles.postTitle}>{post.title}</td>
                    <td>{post.views.toLocaleString()}</td>
                    <td>{post.likes}</td>
                    <td>{post.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.tableCard}>
          <h3>Top Categories</h3>
          <div className={styles.tableContainer}>
            <table className={styles.statsTable}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Posts</th>
                  <th>Total Views</th>
                  <th>Avg Views</th>
                </tr>
              </thead>
              <tbody>
                {currentStats.topCategories?.map((category, index) => (
                  <tr key={index}>
                    <td className={styles.categoryName}>{category.name}</td>
                    <td>{category.posts}</td>
                    <td>{category.views.toLocaleString()}</td>
                    <td>{Math.round(category.views / category.posts).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className={styles.exportSection}>
        <h3>Export Data</h3>
        <div className={styles.exportButtons}>
          <button className={styles.exportBtn}>
            📊 Export as CSV
          </button>
          <button className={styles.exportBtn}>
            📈 Generate Report
          </button>
          <button className={styles.exportBtn}>
            📧 Email Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
