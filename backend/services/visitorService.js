import { executeQuery } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// Visitor Service - Handles all visitor-related database operations

export const visitorService = {
  // Get all visitors
  async getAllVisitors() {
    const query = `
      SELECT 
        id, name, visited_at, ip_address, user_agent,
        session_id, referrer, country, city, device_type, browser, os
      FROM visitors 
      ORDER BY visited_at DESC
    `;
    return await executeQuery(query);
  },

  // Get visitor by ID
  async getVisitorById(id) {
    const query = 'SELECT * FROM visitors WHERE id = ?';
    return await executeQuery(query, [id]);
  },

  // Add new visitor
  async addVisitor(visitorData) {
    const {
      name,
      ip_address = null,
      user_agent = null,
      session_id = null,
      referrer = null,
      country = null,
      city = null,
      device_type = null,
      browser = null,
      os = null
    } = visitorData;

    const id = uuidv4();
    const query = `
      INSERT INTO visitors 
      (id, name, ip_address, user_agent, session_id, referrer, country, city, device_type, browser, os)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [id, name, ip_address, user_agent, session_id, referrer, country, city, device_type, browser, os];
    return await executeQuery(query, params);
  },

  // Get visitor statistics
  async getVisitorStats() {
    const query = `
      SELECT 
        COUNT(*) as total_visitors,
        COUNT(DISTINCT ip_address) as unique_visitors,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(CASE WHEN DATE(visited_at) = CURDATE() THEN 1 END) as today_visitors,
        COUNT(CASE WHEN visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as weekly_visitors,
        COUNT(CASE WHEN visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as monthly_visitors
      FROM visitors
    `;
    return await executeQuery(query);
  },

  // Get daily visitor statistics
  async getDailyVisitorStats(days = 30) {
    const query = `
      SELECT 
        DATE(visited_at) as visit_date,
        COUNT(*) as daily_visitors,
        COUNT(DISTINCT ip_address) as unique_visitors,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM visitors 
      WHERE visited_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(visited_at)
      ORDER BY visit_date DESC
    `;
    return await executeQuery(query, [days]);
  },

  // Get monthly visitor statistics
  async getMonthlyVisitorStats() {
    const query = `
      SELECT 
        YEAR(visited_at) as year,
        MONTH(visited_at) as month,
        COUNT(*) as total_visitors,
        COUNT(DISTINCT ip_address) as unique_visitors,
        COUNT(DISTINCT session_id) as unique_sessions
      FROM visitors 
      GROUP BY YEAR(visited_at), MONTH(visited_at)
      ORDER BY year DESC, month DESC
    `;
    return await executeQuery(query);
  },

  // Get top visitors by visit count
  async getTopVisitors(limit = 10) {
    const query = `
      SELECT 
        name,
        ip_address,
        COUNT(*) as visit_count,
        MAX(visited_at) as last_visit,
        MIN(visited_at) as first_visit
      FROM visitors 
      GROUP BY name, ip_address
      ORDER BY visit_count DESC
      LIMIT ?
    `;
    return await executeQuery(query, [limit]);
  },

  // Get device and browser statistics
  async getDeviceStats() {
    const query = `
      SELECT 
        device_type,
        browser,
        os,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM visitors), 2) as percentage
      FROM visitors 
      GROUP BY device_type, browser, os
      ORDER BY count DESC
    `;
    return await executeQuery(query);
  },

  // Get visitors by country
  async getVisitorsByCountry() {
    const query = `
      SELECT 
        country,
        COUNT(*) as visitor_count,
        COUNT(DISTINCT ip_address) as unique_visitors
      FROM visitors 
      WHERE country IS NOT NULL
      GROUP BY country
      ORDER BY visitor_count DESC
    `;
    return await executeQuery(query);
  },

  // Get recent visitors
  async getRecentVisitors(limit = 20) {
    const query = `
      SELECT 
        id, name, visited_at, ip_address, device_type, browser, os, country, city
      FROM visitors 
      ORDER BY visited_at DESC
      LIMIT ?
    `;
    return await executeQuery(query, [limit]);
  },

  // Get visitors by date range
  async getVisitorsByDateRange(startDate, endDate) {
    const query = `
      SELECT 
        id, name, visited_at, ip_address, user_agent,
        session_id, referrer, country, city, device_type, browser, os
      FROM visitors 
      WHERE DATE(visited_at) BETWEEN ? AND ?
      ORDER BY visited_at DESC
    `;
    return await executeQuery(query, [startDate, endDate]);
  },

  // Get unique visitors by IP
  async getUniqueVisitorsByIP() {
    const query = `
      SELECT 
        ip_address,
        COUNT(*) as visit_count,
        MAX(visited_at) as last_visit,
        MIN(visited_at) as first_visit,
        GROUP_CONCAT(DISTINCT name) as names
      FROM visitors 
      GROUP BY ip_address
      ORDER BY visit_count DESC
    `;
    return await executeQuery(query);
  },

  // Get session statistics
  async getSessionStats() {
    const query = `
      SELECT 
        session_id,
        COUNT(*) as page_views,
        MIN(visited_at) as session_start,
        MAX(visited_at) as session_end,
        TIMESTAMPDIFF(MINUTE, MIN(visited_at), MAX(visited_at)) as session_duration_minutes
      FROM visitors 
      WHERE session_id IS NOT NULL
      GROUP BY session_id
      ORDER BY session_start DESC
    `;
    return await executeQuery(query);
  },

  // Clean up old visitor data
  async cleanupOldVisitors(days = 180) {
    const query = 'DELETE FROM visitors WHERE visited_at < DATE_SUB(NOW(), INTERVAL ? DAY)';
    return await executeQuery(query, [days]);
  },

  // Get visitor analytics for dashboard
  async getDashboardAnalytics() {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM visitors WHERE DATE(visited_at) = CURDATE()) as today_visitors,
        (SELECT COUNT(*) FROM visitors) as total_visitors,
        (SELECT COUNT(DISTINCT ip_address) FROM visitors) as unique_visitors,
        (SELECT COUNT(*) FROM visitors WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as weekly_visitors,
        (SELECT COUNT(*) FROM visitors WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as monthly_visitors,
        (SELECT COUNT(DISTINCT device_type) FROM visitors) as device_types,
        (SELECT COUNT(DISTINCT browser) FROM visitors) as browsers,
        (SELECT COUNT(DISTINCT country) FROM visitors WHERE country IS NOT NULL) as countries
    `;
    return await executeQuery(query);
  }
};
