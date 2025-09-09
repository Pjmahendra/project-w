-- Project W Database Queries
-- Useful queries for managing and analyzing data

-- ==============================================
-- BASIC DATA RETRIEVAL QUERIES
-- ==============================================

-- Get all active gallery images
SELECT * FROM v_gallery_images ORDER BY display_order, created_at;

-- Get all approved birthday messages
SELECT * FROM v_approved_messages ORDER BY created_at DESC;

-- Get all approved birthday wishes
SELECT * FROM v_approved_wishes ORDER BY created_at DESC;

-- Get visitor statistics
SELECT * FROM v_visitor_stats LIMIT 30;

-- Get random birthday message
CALL GetRandomBirthdayMessage();

-- Get dashboard data
CALL GetDashboardData();

-- ==============================================
-- ANALYTICS QUERIES
-- ==============================================

-- Daily visitor count for the last 30 days
SELECT 
    DATE(visited_at) as date,
    COUNT(*) as visitors,
    COUNT(DISTINCT ip_address) as unique_visitors
FROM visitors 
WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(visited_at)
ORDER BY date DESC;

-- Monthly statistics
SELECT 
    YEAR(visited_at) as year,
    MONTH(visited_at) as month,
    COUNT(*) as total_visitors,
    COUNT(DISTINCT ip_address) as unique_visitors,
    COUNT(DISTINCT session_id) as unique_sessions
FROM visitors 
GROUP BY YEAR(visited_at), MONTH(visited_at)
ORDER BY year DESC, month DESC;

-- Top visitors by visit count
SELECT 
    name,
    COUNT(*) as visit_count,
    MAX(visited_at) as last_visit,
    MIN(visited_at) as first_visit
FROM visitors 
GROUP BY name, ip_address
ORDER BY visit_count DESC
LIMIT 10;

-- Birthday messages by author
SELECT 
    author,
    COUNT(*) as message_count,
    AVG(likes) as avg_likes,
    MAX(created_at) as last_message
FROM birthday_messages 
WHERE is_approved = TRUE
GROUP BY author
ORDER BY message_count DESC;

-- Device and browser statistics
SELECT 
    device_type,
    browser,
    os,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM visitors), 2) as percentage
FROM visitors 
GROUP BY device_type, browser, os
ORDER BY count DESC;

-- ==============================================
-- CONTENT MANAGEMENT QUERIES
-- ==============================================

-- Get images by category (using metadata)
SELECT 
    id,
    src,
    alt,
    JSON_EXTRACT(metadata, '$.category') as category,
    JSON_EXTRACT(metadata, '$.tags') as tags
FROM gallery_images 
WHERE JSON_EXTRACT(metadata, '$.category') = 'party'
AND is_active = TRUE;

-- Search birthday messages by keyword
SELECT 
    id,
    message,
    author,
    created_at,
    likes
FROM birthday_messages 
WHERE MATCH(message) AGAINST('happy birthday' IN NATURAL LANGUAGE MODE)
AND is_approved = TRUE
ORDER BY created_at DESC;

-- Search birthday wishes by keyword
SELECT 
    id,
    name,
    wish,
    email,
    created_at
FROM birthday_wishes 
WHERE MATCH(wish) AGAINST('amazing wonderful' IN NATURAL LANGUAGE MODE)
AND is_approved = TRUE
ORDER BY created_at DESC;

-- Get pending approval items
SELECT 
    'message' as type,
    id,
    message as content,
    author,
    created_at
FROM birthday_messages 
WHERE is_approved = FALSE
UNION ALL
SELECT 
    'wish' as type,
    id,
    wish as content,
    name as author,
    created_at
FROM birthday_wishes 
WHERE is_approved = FALSE
ORDER BY created_at DESC;

-- ==============================================
-- MAINTENANCE QUERIES
-- ==============================================

-- Clean up old analytics data (older than 1 year)
DELETE FROM analytics 
WHERE metric_date < DATE_SUB(CURDATE(), INTERVAL 1 YEAR);

-- Clean up old visitor data (older than 6 months)
DELETE FROM visitors 
WHERE visited_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- Update image display order
UPDATE gallery_images 
SET display_order = (
    SELECT @row_number := @row_number + 1 
    FROM (SELECT @row_number := 0) r
) 
WHERE is_active = TRUE
ORDER BY created_at;

-- Reset analytics counters
UPDATE analytics 
SET metric_value = (
    CASE metric_name
        WHEN 'total_visitors' THEN (SELECT COUNT(*) FROM visitors)
        WHEN 'total_messages' THEN (SELECT COUNT(*) FROM birthday_messages WHERE is_approved = TRUE)
        WHEN 'total_wishes' THEN (SELECT COUNT(*) FROM birthday_wishes WHERE is_approved = TRUE)
        WHEN 'total_images' THEN (SELECT COUNT(*) FROM gallery_images WHERE is_active = TRUE)
    END
)
WHERE metric_date = CURDATE();

-- ==============================================
-- REPORTING QUERIES
-- ==============================================

-- Weekly activity report
SELECT 
    'This Week' as period,
    COUNT(DISTINCT v.id) as visitors,
    COUNT(DISTINCT m.id) as messages,
    COUNT(DISTINCT w.id) as wishes
FROM visitors v
LEFT JOIN birthday_messages m ON DATE(m.created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
LEFT JOIN birthday_wishes w ON DATE(w.created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
WHERE v.visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)

UNION ALL

SELECT 
    'Last Week' as period,
    COUNT(DISTINCT v.id) as visitors,
    COUNT(DISTINCT m.id) as messages,
    COUNT(DISTINCT w.id) as wishes
FROM visitors v
LEFT JOIN birthday_messages m ON DATE(m.created_at) BETWEEN DATE_SUB(CURDATE(), INTERVAL 14 DAY) AND DATE_SUB(CURDATE(), INTERVAL 7 DAY)
LEFT JOIN birthday_wishes w ON DATE(w.created_at) BETWEEN DATE_SUB(CURDATE(), INTERVAL 14 DAY) AND DATE_SUB(CURDATE(), INTERVAL 7 DAY)
WHERE v.visited_at BETWEEN DATE_SUB(NOW(), INTERVAL 14 DAY) AND DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Popular content analysis
SELECT 
    'Most Liked Messages' as content_type,
    author,
    message as content,
    likes,
    created_at
FROM birthday_messages 
WHERE is_approved = TRUE
ORDER BY likes DESC
LIMIT 5

UNION ALL

SELECT 
    'Recent Messages' as content_type,
    author,
    message as content,
    likes,
    created_at
FROM birthday_messages 
WHERE is_approved = TRUE
ORDER BY created_at DESC
LIMIT 5;

-- ==============================================
-- DATA EXPORT QUERIES
-- ==============================================

-- Export all data for backup
SELECT 'gallery_images' as table_name, COUNT(*) as record_count FROM gallery_images
UNION ALL
SELECT 'birthday_messages', COUNT(*) FROM birthday_messages
UNION ALL
SELECT 'visitors', COUNT(*) FROM visitors
UNION ALL
SELECT 'birthday_wishes', COUNT(*) FROM birthday_wishes
UNION ALL
SELECT 'analytics', COUNT(*) FROM analytics;

-- Export visitor data for analysis
SELECT 
    name,
    visited_at,
    ip_address,
    device_type,
    browser,
    os,
    country,
    city
FROM visitors 
ORDER BY visited_at DESC;

-- Export birthday messages for content analysis
SELECT 
    author,
    message,
    created_at,
    likes,
    CHAR_LENGTH(message) as message_length
FROM birthday_messages 
WHERE is_approved = TRUE
ORDER BY created_at DESC;
