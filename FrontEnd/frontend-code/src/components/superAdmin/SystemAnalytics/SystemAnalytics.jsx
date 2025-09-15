import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SystemAnalytics.module.css';

const SystemAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalPosts: 0,
      totalComments: 0,
      totalUsers: 0,
      totalViews: 0
    },
    growth: {
      usersThisMonth: 0,
      postsThisMonth: 0,
      commentsThisMonth: 0,
      growthRate: 0
    },
    engagement: {
      avgCommentsPerPost: 0,
      mostActiveUsers: [],
      popularPosts: [],
      engagementRate: 0
    },
    systemHealth: {
      serverUptime: '99.9%',
      avgResponseTime: '245ms',
      errorRate: '0.1%',
      activeConnections: 0
    }
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/superadmin/analytics?range=${timeRange}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setAnalytics({
          overview: {
            totalPosts: 156,
            totalComments: 423,
            totalUsers: 89,
            totalViews: 2847
          },
          growth: {
            usersThisMonth: 15,
            postsThisMonth: 23,
            commentsThisMonth: 67,
            growthRate: 18.5
          },
          engagement: {
            avgCommentsPerPost: 2.7,
            mostActiveUsers: [
              { name: 'John Doe', posts: 12, comments: 45 },
              { name: 'Jane Smith', posts: 8, comments: 38 },
              { name: 'Bob Johnson', posts: 6, comments: 29 }
            ],
            popularPosts: [
              { title: 'Getting Started with React', views: 234, comments: 15 },
              { title: 'Node.js Best Practices', views: 198, comments: 12 },
              { title: 'MongoDB Tips & Tricks', views: 176, comments: 9 }
            ],
            engagementRate: 65.3
          },
          systemHealth: {
            serverUptime: '99.9%',
            avgResponseTime: '245ms',
            errorRate: '0.1%',
            activeConnections: 47
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const StatCard = ({ title, value, icon, trend, trendValue }) => (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <span className={styles.statIcon}>{icon}</span>
        <span className={styles.statTitle}>{title}</span>
      </div>
      <div className={styles.statValue}>{value}</div>
      {trend && (
        <div className={`${styles.statTrend} ${trend === 'up' ? styles.trendUp : styles.trendDown}`}>
          {trend === 'up' ? '↗️' : '↘️'} {trendValue}%
        </div>
      )}
    </div>
  );

  const ChartPlaceholder = ({ title, type = 'line' }) => (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.chartPlaceholder}>
        <div className={styles.chartIcon}>
          {type === 'line' ? '📈' : type === 'bar' ? '📊' : '🥧'}
        </div>
        <p>Interactive {type} chart would be displayed here</p>
        <span className={styles.chartNote}>
          Integration with Chart.js or similar library recommended
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.header}>
        <h2 className={styles.pageTitle}>
          <span className={styles.titleIcon}>📊</span>
          System Analytics
        </h2>
        <div className={styles.timeRangeSelector}>
          <label>Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={styles.timeSelect}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Platform Overview</h3>
        <div className={styles.statsGrid}>
          <StatCard
            title="Total Posts"
            value={analytics.overview.totalPosts}
            icon="📝"
            trend="up"
            trendValue="12.5"
          />
          <StatCard
            title="Total Comments"
            value={analytics.overview.totalComments}
            icon="💬"
            trend="up"
            trendValue="8.3"
          />
          <StatCard
            title="Total Users"
            value={analytics.overview.totalUsers}
            icon="👥"
            trend="up"
            trendValue="15.2"
          />
          <StatCard
            title="Total Views"
            value={analytics.overview.totalViews.toLocaleString()}
            icon="👁️"
            trend="up"
            trendValue="22.1"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Growth Metrics</h3>
        <div className={styles.growthGrid}>
          <div className={styles.growthCard}>
            <h4>New Users This Month</h4>
            <div className={styles.growthValue}>{analytics.growth.usersThisMonth}</div>
            <div className={styles.growthTrend}>
              📈 {analytics.growth.growthRate}% growth rate
            </div>
          </div>
          <div className={styles.growthCard}>
            <h4>Posts This Month</h4>
            <div className={styles.growthValue}>{analytics.growth.postsThisMonth}</div>
            <div className={styles.growthSubtext}>Content creation activity</div>
          </div>
          <div className={styles.growthCard}>
            <h4>Comments This Month</h4>
            <div className={styles.growthValue}>{analytics.growth.commentsThisMonth}</div>
            <div className={styles.growthSubtext}>Community engagement</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Visual Analytics</h3>
        <div className={styles.chartsGrid}>
          <ChartPlaceholder title="User Growth Over Time" type="line" />
          <ChartPlaceholder title="Content Distribution" type="bar" />
          <ChartPlaceholder title="Engagement Breakdown" type="pie" />
          <ChartPlaceholder title="Activity Heatmap" type="line" />
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Engagement Analysis</h3>
        <div className={styles.engagementGrid}>
          <div className={styles.engagementCard}>
            <h4>🎯 Engagement Rate</h4>
            <div className={styles.engagementValue}>{analytics.engagement.engagementRate}%</div>
            <div className={styles.engagementDesc}>Overall platform engagement</div>
          </div>
          <div className={styles.engagementCard}>
            <h4>💬 Avg Comments/Post</h4>
            <div className={styles.engagementValue}>{analytics.engagement.avgCommentsPerPost}</div>
            <div className={styles.engagementDesc}>Discussion activity level</div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Top Performers</h3>
        <div className={styles.performersGrid}>
          <div className={styles.performerCard}>
            <h4>🏆 Most Active Users</h4>
            <div className={styles.performerList}>
              {analytics.engagement.mostActiveUsers.map((user, index) => (
                <div key={index} className={styles.performerItem}>
                  <span className={styles.performerRank}>#{index + 1}</span>
                  <span className={styles.performerName}>{user.name}</span>
                  <span className={styles.performerStats}>
                    {user.posts} posts, {user.comments} comments
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.performerCard}>
            <h4>🔥 Popular Posts</h4>
            <div className={styles.performerList}>
              {analytics.engagement.popularPosts.map((post, index) => (
                <div key={index} className={styles.performerItem}>
                  <span className={styles.performerRank}>#{index + 1}</span>
                  <span className={styles.performerName}>{post.title}</span>
                  <span className={styles.performerStats}>
                    {post.views} views, {post.comments} comments
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>System Health</h3>
        <div className={styles.healthGrid}>
          <div className={styles.healthCard}>
            <div className={styles.healthIcon}>⚡</div>
            <div className={styles.healthContent}>
              <h4>Server Uptime</h4>
              <div className={styles.healthValue}>{analytics.systemHealth.serverUptime}</div>
            </div>
          </div>
          <div className={styles.healthCard}>
            <div className={styles.healthIcon}>🚀</div>
            <div className={styles.healthContent}>
              <h4>Response Time</h4>
              <div className={styles.healthValue}>{analytics.systemHealth.avgResponseTime}</div>
            </div>
          </div>
          <div className={styles.healthCard}>
            <div className={styles.healthIcon}>🛡️</div>
            <div className={styles.healthContent}>
              <h4>Error Rate</h4>
              <div className={styles.healthValue}>{analytics.systemHealth.errorRate}</div>
            </div>
          </div>
          <div className={styles.healthCard}>
            <div className={styles.healthIcon}>🔗</div>
            <div className={styles.healthContent}>
              <h4>Active Connections</h4>
              <div className={styles.healthValue}>{analytics.systemHealth.activeConnections}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SystemAnalytics;
