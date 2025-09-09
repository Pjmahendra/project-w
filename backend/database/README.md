# Project W Database Schema

This directory contains the complete MySQL database schema and queries for the Project W dome gallery application.

## Files

- `schema.sql` - Complete database schema with tables, views, procedures, and triggers
- `queries.sql` - Useful queries for data management and analytics
- `README.md` - This documentation file

## Quick Setup

### 1. Create Database in MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open the `schema.sql` file
4. Execute the entire script (Ctrl+Shift+Enter)
5. The database `project_w_db` will be created with all tables and sample data

### 2. Verify Installation

Run these queries to verify everything is working:

```sql
-- Check if database exists
SHOW DATABASES LIKE 'project_w_db';

-- Check tables
USE project_w_db;
SHOW TABLES;

-- Check sample data
SELECT COUNT(*) as gallery_images FROM gallery_images;
SELECT COUNT(*) as birthday_messages FROM birthday_messages;
SELECT COUNT(*) as visitors FROM visitors;
SELECT COUNT(*) as birthday_wishes FROM birthday_wishes;
```

## Database Structure

### Tables

1. **gallery_images** - Stores dome gallery images
2. **birthday_messages** - Stores birthday messages
3. **visitors** - Tracks visitor information
4. **birthday_wishes** - Stores birthday wishes
5. **analytics** - Stores aggregated analytics data

### Views

1. **v_gallery_images** - Active gallery images with metadata
2. **v_approved_messages** - Approved birthday messages
3. **v_approved_wishes** - Approved birthday wishes
4. **v_visitor_stats** - Visitor statistics by date

### Stored Procedures

1. **GetRandomBirthdayMessage()** - Returns a random approved message
2. **UpdateAnalytics(metric_name, metric_value)** - Updates analytics counters
3. **GetDashboardData()** - Returns dashboard statistics

### Triggers

- Automatic analytics updates when data is inserted
- Maintains accurate counts for visitors, messages, wishes, and images

## Key Features

### Data Types Used

- **VARCHAR(36)** - UUID primary keys
- **JSON** - Flexible metadata storage
- **TIMESTAMP** - Automatic date/time tracking
- **TEXT** - Long text content
- **BOOLEAN** - Approval flags
- **BIGINT** - Large numbers (file sizes, counts)

### Indexes

- Primary keys on all tables
- Performance indexes on frequently queried columns
- Full-text search indexes on message and wish content
- Composite indexes for complex queries

### Sample Data

The schema includes sample data for testing:
- 3 gallery images
- 4 birthday messages
- 3 visitors
- 3 birthday wishes

## Common Queries

### Get All Active Images
```sql
SELECT * FROM v_gallery_images ORDER BY display_order;
```

### Get Random Birthday Message
```sql
CALL GetRandomBirthdayMessage();
```

### Get Dashboard Statistics
```sql
CALL GetDashboardData();
```

### Search Messages
```sql
SELECT * FROM birthday_messages 
WHERE MATCH(message) AGAINST('happy birthday' IN NATURAL LANGUAGE MODE)
AND is_approved = TRUE;
```

### Get Visitor Analytics
```sql
SELECT * FROM v_visitor_stats LIMIT 30;
```

## Maintenance

### Regular Cleanup
```sql
-- Clean old analytics data (older than 1 year)
DELETE FROM analytics 
WHERE metric_date < DATE_SUB(CURDATE(), INTERVAL 1 YEAR);

-- Clean old visitor data (older than 6 months)
DELETE FROM visitors 
WHERE visited_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);
```

### Reset Analytics
```sql
-- Reset all analytics counters
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
```

## Integration with Backend

To use this database with your Node.js backend:

1. Install MySQL driver: `npm install mysql2`
2. Update your backend connection settings
3. Replace JSON file operations with database queries
4. Use the provided stored procedures for common operations

## Security Considerations

1. **User Permissions**: Create a dedicated database user with limited privileges
2. **Input Validation**: Always validate and sanitize user input
3. **SQL Injection**: Use parameterized queries
4. **Data Backup**: Regular database backups
5. **Access Control**: Restrict database access to authorized applications only

## Performance Optimization

1. **Indexes**: All frequently queried columns are indexed
2. **Views**: Pre-computed views for common queries
3. **Triggers**: Automatic maintenance of analytics data
4. **Partitioning**: Consider partitioning large tables by date
5. **Caching**: Implement application-level caching for frequently accessed data

## Troubleshooting

### Common Issues

1. **Character Set**: Ensure UTF-8 support for international characters
2. **Timezone**: Set appropriate timezone for timestamp columns
3. **Memory**: Adjust MySQL memory settings for large datasets
4. **Connections**: Monitor and limit concurrent connections

### Useful Diagnostic Queries

```sql
-- Check table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'project_w_db'
ORDER BY (data_length + index_length) DESC;

-- Check slow queries
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- Check table status
SHOW TABLE STATUS FROM project_w_db;
```

## Backup and Recovery

### Create Backup
```bash
mysqldump -u username -p project_w_db > project_w_backup.sql
```

### Restore Backup
```bash
mysql -u username -p project_w_db < project_w_backup.sql
```

## Support

For questions or issues with the database schema:
1. Check the queries.sql file for examples
2. Review MySQL documentation
3. Test queries in MySQL Workbench first
4. Monitor MySQL error logs for issues
