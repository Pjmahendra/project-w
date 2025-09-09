# 🚀 Project W - Complete Setup Guide

This guide will help you set up the complete Project W application with frontend, backend, and MySQL database integration.

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **MySQL Workbench** (optional, for database management)
- **Git** (for version control)

## 🗄️ Step 1: Database Setup

### 1.1 Install MySQL
- Download and install MySQL from [mysql.com](https://dev.mysql.com/downloads/)
- Start MySQL service
- Note your MySQL root password

### 1.2 Create Database
1. Open MySQL Workbench (or MySQL command line)
2. Connect to your MySQL server
3. Copy and paste the entire content from `backend/database/schema.sql`
4. Execute the script
5. Verify database creation:
   ```sql
   SHOW DATABASES LIKE 'project_w_db';
   USE project_w_db;
   SHOW TABLES;
   ```

### 1.3 Verify Sample Data
```sql
SELECT COUNT(*) as gallery_images FROM gallery_images;
SELECT COUNT(*) as birthday_messages FROM birthday_messages;
SELECT COUNT(*) as visitors FROM visitors;
SELECT COUNT(*) as birthday_wishes FROM birthday_wishes;
```

## 🔧 Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd backend
npm install
```

### 2.2 Configure Database Connection
1. Copy the environment file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=project_w_db
   ```

### 2.3 Test Database Connection
```bash
npm run test:db
```

### 2.4 Start Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will start on `http://localhost:3000`

## 🎨 Step 3: Frontend Setup

### 3.1 Install Dependencies
```bash
# From project root
npm install
```

### 3.2 Start Frontend Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔗 Step 4: Integration Testing

### 4.1 Test Backend API
```bash
cd backend
npm run test:api
```

### 4.2 Test Frontend Integration
1. Open `http://localhost:5173`
2. Navigate to the Integration Test component
3. Verify all tests pass

### 4.3 Manual API Testing
Test these endpoints in your browser or Postman:

- **Health Check**: `http://localhost:3000/api/health`
- **Server Status**: `http://localhost:3000/api/status`
- **Analytics**: `http://localhost:3000/api/analytics`
- **Gallery**: `http://localhost:3000/api/gallery`
- **Birthday Messages**: `http://localhost:3000/api/birthday/messages`
- **Visitors**: `http://localhost:3000/api/visitors`
- **Birthday Wishes**: `http://localhost:3000/api/wishes`

## 🚀 Step 5: Complete Application

### 5.1 Start Everything at Once
```bash
# From project root
npm run start:all
```

This will start both frontend and backend servers simultaneously.

### 5.2 Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## 🧪 Step 6: Verification Checklist

### ✅ Database Verification
- [ ] MySQL is running
- [ ] `project_w_db` database exists
- [ ] All tables created successfully
- [ ] Sample data inserted
- [ ] Database connection test passes

### ✅ Backend Verification
- [ ] Backend server starts without errors
- [ ] Database connection established
- [ ] All API endpoints respond
- [ ] CORS configured correctly
- [ ] Error handling works

### ✅ Frontend Verification
- [ ] Frontend server starts without errors
- [ ] API service connects to backend
- [ ] Integration tests pass
- [ ] Dome gallery displays images
- [ ] All components render correctly

### ✅ Integration Verification
- [ ] Frontend can fetch data from backend
- [ ] Backend can read/write to database
- [ ] Data persists across server restarts
- [ ] Real-time updates work
- [ ] Error handling works end-to-end

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check MySQL is running
brew services list | grep mysql  # macOS
systemctl status mysql          # Linux

# Test connection manually
mysql -u root -p
```

#### Backend Won't Start
```bash
# Check if port 3000 is available
lsof -i :3000

# Kill process if needed
kill -9 $(lsof -t -i:3000)
```

#### Frontend API Errors
- Check backend is running on port 3000
- Verify CORS settings in backend
- Check browser console for errors
- Test API endpoints directly

#### Database Schema Issues
```sql
-- Drop and recreate database
DROP DATABASE project_w_db;
-- Then run schema.sql again
```

### Debug Commands

```bash
# Backend logs
cd backend && npm run dev

# Database connection test
cd backend && npm run test:db

# API test
cd backend && npm run test:api

# Frontend logs
npm run dev
```

## 📊 Expected Results

When everything is working correctly, you should see:

### Backend Console
```
🔌 Testing database connection...
✅ Database connection established
🚀 Project W Backend Server running on port 3000
📊 Health check: http://localhost:3000/api/health
📈 Analytics: http://localhost:3000/api/analytics
🎨 Gallery API: http://localhost:3000/api/gallery
🎂 Birthday API: http://localhost:3000/api/birthday/messages
👥 Visitors API: http://localhost:3000/api/visitors
💝 Wishes API: http://localhost:3000/api/wishes
🗄️  Database: MySQL (project_w_db)
🔗 Frontend: http://localhost:5173
```

### Frontend Integration Test
- All tests should show ✅ (green checkmarks)
- Server status should be "online"
- Database connection should be "Connected"
- All API endpoints should work
- Data creation tests should pass

### Database Content
- 3+ gallery images
- 4+ birthday messages
- 3+ visitors
- 3+ birthday wishes
- Analytics data

## 🎉 Success!

If all steps complete successfully, you now have:

1. **Frontend**: React app with dome gallery
2. **Backend**: Node.js/Express API server
3. **Database**: MySQL with full schema
4. **Integration**: Complete data flow between all components

Your Project W dome gallery birthday app is now fully functional! 🎂✨

## 📚 Next Steps

- Customize the dome gallery with your own images
- Add more birthday messages and wishes
- Deploy to production (consider using services like Heroku, Vercel, or AWS)
- Add authentication and user management
- Implement real-time features with WebSockets
- Add more analytics and reporting features
