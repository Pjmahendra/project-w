-- Project W SQLite Database Schema
-- This creates the same structure as the MySQL version but for SQLite

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
    id TEXT PRIMARY KEY,
    src TEXT NOT NULL,
    alt TEXT DEFAULT '',
    metadata TEXT, -- JSON stored as TEXT
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    display_order INTEGER DEFAULT 0,
    file_size INTEGER,
    mime_type TEXT,
    width INTEGER,
    height INTEGER
);

-- Create birthday_messages table
CREATE TABLE IF NOT EXISTS birthday_messages (
    id TEXT PRIMARY KEY,
    message TEXT NOT NULL,
    author TEXT DEFAULT 'Anonymous',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT 1,
    ip_address TEXT,
    user_agent TEXT
);

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    user_agent TEXT,
    session_id TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT
);

-- Create birthday_wishes table
CREATE TABLE IF NOT EXISTS birthday_wishes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    wish TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT 0,
    ip_address TEXT,
    user_agent TEXT
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_name TEXT NOT NULL,
    metric_value INTEGER NOT NULL,
    metric_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(metric_name, metric_date)
);

-- Insert initial analytics data
INSERT OR IGNORE INTO analytics (metric_name, metric_value, metric_date) VALUES
('total_visitors', 0, date('now')),
('total_messages', 0, date('now')),
('total_wishes', 0, date('now')),
('total_images', 0, date('now'));

-- Insert sample data for testing
INSERT OR IGNORE INTO gallery_images (id, src, alt, metadata, display_order, file_size, mime_type, width, height) VALUES
('img-1', '/assets/1.jpeg', 'Birthday celebration image 1', '{"tags": ["birthday", "celebration"], "category": "party"}', 1, 245760, 'image/jpeg', 800, 600),
('img-2', '/assets/2.jpeg', 'Birthday celebration image 2', '{"tags": ["birthday", "celebration"], "category": "party"}', 2, 312000, 'image/jpeg', 1024, 768),
('img-3', '/assets/3.jpeg', 'Birthday celebration image 3', '{"tags": ["birthday", "celebration"], "category": "party"}', 3, 189000, 'image/jpeg', 640, 480);

INSERT OR IGNORE INTO birthday_messages (id, message, author, likes, ip_address) VALUES
('msg-1', 'Happy Birthday! Hope you have an amazing day filled with joy and laughter!', 'Sarah', 5, '192.168.1.100'),
('msg-2', 'Wishing you a wonderful year ahead! May all your dreams come true.', 'Mike', 3, '192.168.1.101'),
('msg-3', 'Another year older, another year wiser! Happy Birthday!', 'Emma', 7, '192.168.1.102'),
('msg-4', 'Hope your special day brings you lots of happiness and love!', 'John', 2, '192.168.1.103');

INSERT OR IGNORE INTO visitors (id, name, ip_address, user_agent, session_id, device_type, browser, os) VALUES
('vis-1', 'Alice Johnson', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'sess_001', 'desktop', 'Chrome', 'Windows'),
('vis-2', 'Bob Smith', '192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', 'sess_002', 'mobile', 'Safari', 'iOS'),
('vis-3', 'Carol Davis', '192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'sess_003', 'desktop', 'Firefox', 'macOS');

INSERT OR IGNORE INTO birthday_wishes (id, name, wish, email, is_approved, ip_address) VALUES
('wish-1', 'David Wilson', 'Hope you have the most wonderful birthday ever! May this year bring you endless joy and success.', 'david@example.com', 1, '192.168.1.104'),
('wish-2', 'Lisa Brown', 'Wishing you a day as special as you are! Happy Birthday!', 'lisa@example.com', 1, '192.168.1.105'),
('wish-3', 'Tom Anderson', 'Another year of amazing memories! Hope your birthday is fantastic!', 'tom@example.com', 0, '192.168.1.106');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery_images(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_messages_approved ON birthday_messages(is_approved);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON birthday_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at);
CREATE INDEX IF NOT EXISTS idx_wishes_approved ON birthday_wishes(is_approved);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON birthday_wishes(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_date ON analytics(metric_name, metric_date);
