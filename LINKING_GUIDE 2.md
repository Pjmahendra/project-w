# 🔗 Project W - Backend & Frontend Linking Guide

This guide will help you properly link your backend and frontend for the Project W dome gallery application.

## 🚀 Quick Start (Recommended)

### Option 1: Automated Setup
```bash
# Run the complete setup script
npm run start
```

This will:
- Check dependencies
- Set up database connection
- Start backend server
- Start frontend server
- Test the integration

### Option 2: Manual Setup

#### Step 1: Database Setup
```bash
# 1. Set up MySQL database
cd backend
npm run setup
# Follow the prompts to enter your MySQL credentials
```

#### Step 2: Test Database Connection
```bash
# Test if database is working
npm run test:db
```

#### Step 3: Start Backend
```bash
# Start the backend server
npm run dev
```

#### Step 4: Start Frontend (in new terminal)
```bash
# From project root
npm run dev
```

#### Step 5: Test Integration
```bash
# Test the complete integration
npm run test:integration
```

## 🔧 Detailed Setup

### 1. Database Configuration

The backend needs to connect to your MySQL database. You have two options:

#### Option A: Use the setup script (Recommended)
```bash
cd backend
npm run setup
```

#### Option B: Manual configuration
1. Create `backend/.env` file:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=project_w_db
```

2. Create the database in MySQL:
```sql
CREATE DATABASE project_w_db;
```

3. Run the schema script in MySQL Workbench:
   - Open `backend/database/schema.sql`
   - Execute the entire script

### 2. Backend Server

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:3000`

### 3. Frontend Server

```bash
# From project root
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🧪 Testing the Integration

### Test Backend API
```bash
# Test all API endpoints
cd backend
npm run test:api
```

### Test Database Connection
```bash
# Test database connectivity
cd backend
npm run test:db
```

### Test Complete Integration
```bash
# Test frontend-backend-database integration
npm run test:integration
```

### Manual Testing
Visit these URLs in your browser:

- **Frontend**: http://localhost:5173
- **Backend Health**: http://localhost:3000/api/health
- **Backend Status**: http://localhost:3000/api/status
- **Analytics**: http://localhost:3000/api/analytics
- **Gallery**: http://localhost:3000/api/gallery
- **Messages**: http://localhost:3000/api/birthday/messages
- **Visitors**: http://localhost:3000/api/visitors
- **Wishes**: http://localhost:3000/api/wishes

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check if MySQL is running
brew services list | grep mysql  # macOS
systemctl status mysql          # Linux

# Test connection manually
mysql -u root -p
```

#### 2. Backend Won't Start
```bash
# Check if port 3000 is available
lsof -i :3000

# Kill process if needed
kill -9 $(lsof -t -i:3000)
```

#### 3. Frontend Can't Connect to Backend
- Check if backend is running on port 3000
- Check browser console for CORS errors
- Verify API_BASE_URL in frontend services

#### 4. Database Schema Issues
```sql
-- Drop and recreate database
DROP DATABASE project_w_db;
CREATE DATABASE project_w_db;
-- Then run schema.sql again
```

### Debug Commands

```bash
# Check backend logs
cd backend && npm run dev

# Check database connection
cd backend && npm run test:db

# Check API endpoints
cd backend && npm run test:api

# Check integration
npm run test:integration
```

## 📊 Expected Results

When everything is working correctly:

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

### Frontend Console
```
  VITE v7.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Integration Test
```
🧪 Testing Project W Integration...

Testing Health Check...
✅ Health Check: OK
Testing Server Status...
✅ Server Status: OK
Testing Analytics...
✅ Analytics: OK
   Records: 4
Testing Gallery Images...
✅ Gallery Images: OK
   Records: 3
Testing Birthday Messages...
✅ Birthday Messages: OK
   Records: 4
Testing Visitors...
✅ Visitors: OK
   Records: 3
Testing Birthday Wishes...
✅ Birthday Wishes: OK
   Records: 3

📊 Test Results:
✅ Passed: 7
❌ Failed: 0
📈 Success Rate: 100%

🎉 All tests passed! Your integration is working perfectly.
```

## 🎯 Next Steps

Once everything is linked and working:

1. **Customize the Gallery**: Add your own images to the dome gallery
2. **Add Content**: Create birthday messages and wishes
3. **Test Features**: Try all the interactive features
4. **Deploy**: Consider deploying to production
5. **Extend**: Add new features and functionality

## 📚 File Structure

```
project-w/
├── backend/                 # Backend server
│   ├── config/             # Database configuration
│   ├── services/           # Business logic services
│   ├── database/           # SQL schema and queries
│   ├── server.js           # Main server file
│   └── .env               # Environment variables
├── src/                    # Frontend React app
│   ├── services/           # API service files
│   ├── DomeGallery.jsx     # Main gallery component
│   └── IntegrationTest.jsx # Integration test component
├── start-project.sh        # Complete startup script
└── test-integration.js     # Integration test script
```

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Run the test scripts to identify the problem
3. Check the console logs for error messages
4. Verify all dependencies are installed
5. Ensure MySQL is running and accessible

Your Project W dome gallery should now be fully linked and functional! 🎂✨
