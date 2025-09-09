-- Project W Database Schema
-- MySQL Workbench Compatible
-- Run this script to create the complete database structure

-- Create database
CREATE DATABASE IF NOT EXISTS project_w_db;
USE project_w_db;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS birthday_wishes;
DROP TABLE IF EXISTS birthday_messages;
DROP TABLE IF EXISTS visitors;
DROP TABLE IF EXISTS gallery_images;
DROP TABLE IF EXISTS analytics;

-- Create gallery_images table
CREATE TABLE gallery_images (
    id VARCHAR(36) PRIMARY KEY,
    src VARCHAR(500) NOT NULL,
    alt VARCHAR(255) DEFAULT '',
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    file_size BIGINT,
    mime_type VARCHAR(100),
    width INT,
    height INT,
    INDEX idx_active (is_active),
    INDEX idx_display_order (display_order),
    INDEX idx_created_at (created_at)
);

-- Create birthday_messages table
CREATE TABLE birthday_messages (
    id VARCHAR(36) PRIMARY KEY,
    message TEXT NOT NULL,
    author VARCHAR(100) DEFAULT 'Anonymous',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    INDEX idx_approved (is_approved),
    INDEX idx_created_at (created_at),
    INDEX idx_likes (likes)
);

-- Create visitors table
CREATE TABLE visitors (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(100),
    referrer VARCHAR(500),
    country VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    INDEX idx_visited_at (visited_at),
    INDEX idx_ip_address (ip_address),
    INDEX idx_session_id (session_id)
);

-- Create birthday_wishes table
CREATE TABLE birthday_wishes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    wish TEXT NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    INDEX idx_approved (is_approved),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
);

-- Create analytics table for storing aggregated data
CREATE TABLE analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value BIGINT NOT NULL,
    metric_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_metric_date (metric_name, metric_date),
    INDEX idx_metric_name (metric_name),
    INDEX idx_metric_date (metric_date)
);

-- Insert initial analytics data
INSERT INTO analytics (metric_name, metric_value, metric_date) VALUES
('total_visitors', 0, CURDATE()),
('total_messages', 0, CURDATE()),
('total_wishes', 0, CURDATE()),
('total_images', 0, CURDATE());

-- Create views for easier data access

-- View for gallery images with metadata
CREATE VIEW v_gallery_images AS
SELECT 
    id,
    src,
    alt,
    metadata,
    created_at,
    updated_at,
    display_order,
    file_size,
    mime_type,
    width,
    height,
    CASE 
        WHEN width > 0 AND height > 0 THEN ROUND(width/height, 2)
        ELSE NULL 
    END as aspect_ratio
FROM gallery_images 
WHERE is_active = TRUE
ORDER BY display_order, created_at;

-- View for approved birthday messages
CREATE VIEW v_approved_messages AS
SELECT 
    id,
    message,
    author,
    created_at,
    likes,
    CHAR_LENGTH(message) as message_length
FROM birthday_messages 
WHERE is_approved = TRUE
ORDER BY created_at DESC;

-- View for approved birthday wishes
CREATE VIEW v_approved_wishes AS
SELECT 
    id,
    name,
    wish,
    email,
    created_at,
    CHAR_LENGTH(wish) as wish_length
FROM birthday_wishes 
WHERE is_approved = TRUE
ORDER BY created_at DESC;

-- View for visitor statistics
CREATE VIEW v_visitor_stats AS
SELECT 
    DATE(visited_at) as visit_date,
    COUNT(*) as daily_visitors,
    COUNT(DISTINCT ip_address) as unique_visitors,
    COUNT(DISTINCT session_id) as unique_sessions
FROM visitors 
GROUP BY DATE(visited_at)
ORDER BY visit_date DESC;

-- Create stored procedures

-- Procedure to get random birthday message
DELIMITER //
CREATE PROCEDURE GetRandomBirthdayMessage()
BEGIN
    SELECT 
        id,
        message,
        author,
        created_at,
        likes
    FROM birthday_messages 
    WHERE is_approved = TRUE
    ORDER BY RAND() 
    LIMIT 1;
END //
DELIMITER ;

-- Procedure to update analytics
DELIMITER //
CREATE PROCEDURE UpdateAnalytics(IN metric_name VARCHAR(100), IN metric_value BIGINT)
BEGIN
    INSERT INTO analytics (metric_name, metric_value, metric_date)
    VALUES (metric_name, metric_value, CURDATE())
    ON DUPLICATE KEY UPDATE 
    metric_value = metric_value,
    created_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Procedure to get dashboard data
DELIMITER //
CREATE PROCEDURE GetDashboardData()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM visitors WHERE DATE(visited_at) = CURDATE()) as today_visitors,
        (SELECT COUNT(*) FROM visitors) as total_visitors,
        (SELECT COUNT(*) FROM birthday_messages WHERE is_approved = TRUE) as total_messages,
        (SELECT COUNT(*) FROM birthday_wishes WHERE is_approved = TRUE) as total_wishes,
        (SELECT COUNT(*) FROM gallery_images WHERE is_active = TRUE) as total_images,
        (SELECT COUNT(*) FROM visitors WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as weekly_visitors,
        (SELECT COUNT(*) FROM birthday_messages WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as weekly_messages;
END //
DELIMITER ;

-- Create triggers for automatic analytics updates

-- Trigger to update visitor count when new visitor is added
DELIMITER //
CREATE TRIGGER tr_visitor_insert
AFTER INSERT ON visitors
FOR EACH ROW
BEGIN
    CALL UpdateAnalytics('total_visitors', (SELECT COUNT(*) FROM visitors));
END //
DELIMITER ;

-- Trigger to update message count when new message is added
DELIMITER //
CREATE TRIGGER tr_message_insert
AFTER INSERT ON birthday_messages
FOR EACH ROW
BEGIN
    CALL UpdateAnalytics('total_messages', (SELECT COUNT(*) FROM birthday_messages WHERE is_approved = TRUE));
END //
DELIMITER ;

-- Trigger to update wish count when new wish is added
DELIMITER //
CREATE TRIGGER tr_wish_insert
AFTER INSERT ON birthday_wishes
FOR EACH ROW
BEGIN
    CALL UpdateAnalytics('total_wishes', (SELECT COUNT(*) FROM birthday_wishes WHERE is_approved = TRUE));
END //
DELIMITER ;

-- Trigger to update image count when new image is added
DELIMITER //
CREATE TRIGGER tr_image_insert
AFTER INSERT ON gallery_images
FOR EACH ROW
BEGIN
    CALL UpdateAnalytics('total_images', (SELECT COUNT(*) FROM gallery_images WHERE is_active = TRUE));
END //
DELIMITER ;

-- Insert sample data for testing

-- Sample gallery images
INSERT INTO gallery_images (id, src, alt, metadata, display_order, file_size, mime_type, width, height) VALUES
(UUID(), '/assets/1.jpeg', 'Birthday celebration image 1', '{"tags": ["birthday", "celebration"], "category": "party"}', 1, 245760, 'image/jpeg', 800, 600),
(UUID(), '/assets/2.jpeg', 'Birthday celebration image 2', '{"tags": ["birthday", "celebration"], "category": "party"}', 2, 312000, 'image/jpeg', 1024, 768),
(UUID(), '/assets/3.jpeg', 'Birthday celebration image 3', '{"tags": ["birthday", "celebration"], "category": "party"}', 3, 189000, 'image/jpeg', 640, 480);

-- Sample birthday messages
INSERT INTO birthday_messages (id, message, author, likes, ip_address) VALUES
(UUID(), 'Happy Birthday! Hope you have an amazing day filled with joy and laughter!', 'Sarah', 5, '192.168.1.100'),
(UUID(), 'Wishing you a wonderful year ahead! May all your dreams come true.', 'Mike', 3, '192.168.1.101'),
(UUID(), 'Another year older, another year wiser! Happy Birthday!', 'Emma', 7, '192.168.1.102'),
(UUID(), 'Hope your special day brings you lots of happiness and love!', 'John', 2, '192.168.1.103');

-- Sample visitors
INSERT INTO visitors (id, name, ip_address, user_agent, session_id, device_type, browser, os) VALUES
(UUID(), 'Alice Johnson', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'sess_001', 'desktop', 'Chrome', 'Windows'),
(UUID(), 'Bob Smith', '192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', 'sess_002', 'mobile', 'Safari', 'iOS'),
(UUID(), 'Carol Davis', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'sess_003', 'desktop', 'Firefox', 'macOS');

-- Sample birthday wishes
INSERT INTO birthday_wishes (id, name, wish, email, is_approved, ip_address) VALUES
(UUID(), 'David Wilson', 'Hope you have the most wonderful birthday ever! May this year bring you endless joy and success.', 'david@example.com', TRUE, '192.168.1.104'),
(UUID(), 'Lisa Brown', 'Wishing you a day as special as you are! Happy Birthday!', 'lisa@example.com', TRUE, '192.168.1.105'),
(UUID(), 'Tom Anderson', 'Another year of amazing memories! Hope your birthday is fantastic!', 'tom@example.com', FALSE, '192.168.1.106');

-- Create indexes for better performance
CREATE INDEX idx_gallery_created_at ON gallery_images(created_at);
CREATE INDEX idx_messages_created_at ON birthday_messages(created_at);
CREATE INDEX idx_visitors_visited_at ON visitors(visited_at);
CREATE INDEX idx_wishes_created_at ON birthday_wishes(created_at);

-- Create full-text search indexes
ALTER TABLE birthday_messages ADD FULLTEXT(message);
ALTER TABLE birthday_wishes ADD FULLTEXT(wish);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON project_w_db.* TO 'your_username'@'localhost';
-- FLUSH PRIVILEGES;

-- Display table information
SELECT 'Database setup completed successfully!' as status;
SELECT 'Tables created:' as info;
SHOW TABLES;

SELECT 'Sample data inserted:' as info;
SELECT 
    (SELECT COUNT(*) FROM gallery_images) as gallery_images,
    (SELECT COUNT(*) FROM birthday_messages) as birthday_messages,
    (SELECT COUNT(*) FROM visitors) as visitors,
    (SELECT COUNT(*) FROM birthday_wishes) as birthday_wishes;
