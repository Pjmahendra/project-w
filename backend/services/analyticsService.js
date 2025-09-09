import { executeQuery } from '../config/database.js';

// Analytics Service - Handles all analytics-related database operations

export const analyticsService = {
  // Get all analytics data
  async getAllAnalytics() {
    const query = `
      SELECT 
        metric_name, metric_value, metric_date, created_at
      FROM analytics 
      ORDER BY metric_date DESC, metric_name
    `;
    return await executeQuery(query);
  },

  // Get analytics by date range
  async getAnalyticsByDateRange(startDate, endDate) {
    const query = `
      SELECT 
        metric_name, metric_value, metric_date, created_at
      FROM analytics 
      WHERE metric_date BETWEEN ? AND ?
      ORDER BY metric_date DESC, metric_name
    `;
    return await executeQuery(query, [startDate, endDate]);
  },

  // Get current analytics
  async getCurrentAnalytics() {
    const query = `
      SELECT 
        metric_name, metric_value, metric_date
      FROM analytics 
      WHERE metric_date = CURDATE()
      ORDER BY metric_name
    `;
    return await executeQuery(query);
  },

  // Update analytics metric
  async updateMetric(metricName, metricValue) {
    const query = `
      INSERT INTO analytics (metric_name, metric_value, metric_date)
      VALUES (?, ?, CURDATE())
      ON DUPLICATE KEY UPDATE 
        metric_value = VALUES(metric_value),
        created_at = CURRENT_TIMESTAMP
    `;
    return await executeQuery(query, [metricName, metricValue]);
  },

  // Get comprehensive dashboard data
  async getDashboardData() {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM visitors WHERE DATE(visited_at) = CURDATE()) as today_visitors,
        (SELECT COUNT(*) FROM visitors) as total_visitors,
        (SELECT COUNT(*) FROM birthday_messages WHERE is_approved = TRUE) as total_messages,
        (SELECT COUNT(*) FROM birthday_wishes WHERE is_approved = TRUE) as total_wishes,
        (SELECT COUNT(*) FROM gallery_images WHERE is_active = TRUE) as total_images,
        (SELECT COUNT(*) FROM visitors WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as weekly_visitors,
        (SELECT COUNT(*) FROM birthday_messages WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as weekly_messages,
        (SELECT COUNT(*) FROM birthday_wishes WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as weekly_wishes,
        (SELECT COUNT(*) FROM visitors WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as monthly_visitors,
        (SELECT COUNT(*) FROM birthday_messages WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as monthly_messages,
        (SELECT COUNT(*) FROM birthday_wishes WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as monthly_wishes
    `;
    return await executeQuery(query);
  },

  // Get growth statistics
  async getGrowthStats() {
    const query = `
      SELECT 
        'visitors' as metric_type,
        COUNT(CASE WHEN DATE(visited_at) = CURDATE() THEN 1 END) as today,
        COUNT(CASE WHEN DATE(visited_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 1 END) as yesterday,
        COUNT(CASE WHEN visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as this_week,
        COUNT(CASE WHEN visited_at BETWEEN DATE_SUB(NOW(), INTERVAL 14 DAY) AND DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as last_week
      FROM visitors
      
      UNION ALL
      
      SELECT 
        'messages' as metric_type,
        COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today,
        COUNT(CASE WHEN DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 1 END) as yesterday,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as this_week,
        COUNT(CASE WHEN created_at BETWEEN DATE_SUB(NOW(), INTERVAL 14 DAY) AND DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as last_week
      FROM birthday_messages
      WHERE is_approved = TRUE
      
      UNION ALL
      
      SELECT 
        'wishes' as metric_type,
        COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today,
        COUNT(CASE WHEN DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) THEN 1 END) as yesterday,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as this_week,
        COUNT(CASE WHEN created_at BETWEEN DATE_SUB(NOW(), INTERVAL 14 DAY) AND DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as last_week
      FROM birthday_wishes
      WHERE is_approved = TRUE
    `;
    return await executeQuery(query);
  },

  // Get hourly visitor distribution for today
  async getHourlyVisitorsToday() {
    const query = `
      SELECT 
        HOUR(visited_at) as hour,
        COUNT(*) as visitor_count
      FROM visitors 
      WHERE DATE(visited_at) = CURDATE()
      GROUP BY HOUR(visited_at)
      ORDER BY hour
    `;
    return await executeQuery(query);
  },

  // Get weekly visitor distribution
  async getWeeklyVisitors() {
    const query = `
      SELECT 
        DAYNAME(visited_at) as day_name,
        DAYOFWEEK(visited_at) as day_number,
        COUNT(*) as visitor_count
      FROM visitors 
      WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DAYOFWEEK(visited_at), DAYNAME(visited_at)
      ORDER BY day_number
    `;
    return await executeQuery(query);
  },

  // Get content statistics
  async getContentStats() {
    const query = `
      SELECT 
        'messages' as content_type,
        COUNT(*) as total_count,
        AVG(CHAR_LENGTH(message)) as avg_length,
        MAX(CHAR_LENGTH(message)) as max_length,
        MIN(CHAR_LENGTH(message)) as min_length,
        AVG(likes) as avg_likes
      FROM birthday_messages 
      WHERE is_approved = TRUE
      
      UNION ALL
      
      SELECT 
        'wishes' as content_type,
        COUNT(*) as total_count,
        AVG(CHAR_LENGTH(wish)) as avg_length,
        MAX(CHAR_LENGTH(wish)) as max_length,
        MIN(CHAR_LENGTH(wish)) as min_length,
        NULL as avg_likes
      FROM birthday_wishes 
      WHERE is_approved = TRUE
    `;
    return await executeQuery(query);
  },

  // Get top performing content
  async getTopContent(limit = 10) {
    const query = `
      SELECT 
        'message' as content_type,
        id,
        message as content,
        author,
        likes,
        created_at
      FROM birthday_messages 
      WHERE is_approved = TRUE
      ORDER BY likes DESC
      LIMIT ?
      
      UNION ALL
      
      SELECT 
        'wish' as content_type,
        id,
        wish as content,
        name as author,
        0 as likes,
        created_at
      FROM birthday_wishes 
      WHERE is_approved = TRUE
      ORDER BY created_at DESC
      LIMIT ?
    `;
    return await executeQuery(query, [limit, limit]);
  },

  // Get system health metrics
  async getSystemHealth() {
    const query = `
      SELECT 
        'database_health' as metric,
        'ok' as status,
        NOW() as timestamp
      UNION ALL
      SELECT 
        'data_freshness' as metric,
        CASE 
          WHEN MAX(visited_at) > DATE_SUB(NOW(), INTERVAL 1 HOUR) THEN 'fresh'
          WHEN MAX(visited_at) > DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 'stale'
          ELSE 'old'
        END as status,
        MAX(visited_at) as timestamp
      FROM visitors
    `;
    return await executeQuery(query);
  },

  // Clean up old analytics data
  async cleanupOldAnalytics(days = 365) {
    const query = 'DELETE FROM analytics WHERE metric_date < DATE_SUB(CURDATE(), INTERVAL ? DAY)';
    return await executeQuery(query, [days]);
  },

  // Reset all analytics counters
  async resetAnalytics() {
    const queries = [
      {
        query: 'UPDATE analytics SET metric_value = (SELECT COUNT(*) FROM visitors) WHERE metric_name = "total_visitors" AND metric_date = CURDATE()',
        params: []
      },
      {
        query: 'UPDATE analytics SET metric_value = (SELECT COUNT(*) FROM birthday_messages WHERE is_approved = TRUE) WHERE metric_name = "total_messages" AND metric_date = CURDATE()',
        params: []
      },
      {
        query: 'UPDATE analytics SET metric_value = (SELECT COUNT(*) FROM birthday_wishes WHERE is_approved = TRUE) WHERE metric_name = "total_wishes" AND metric_date = CURDATE()',
        params: []
      },
      {
        query: 'UPDATE analytics SET metric_value = (SELECT COUNT(*) FROM gallery_images WHERE is_active = TRUE) WHERE metric_name = "total_images" AND metric_date = CURDATE()',
        params: []
      }
    ];
    
    return await Promise.all(queries.map(({ query, params }) => executeQuery(query, params)));
  }
};
