# 🔧 Manual Setup Guide for Project W

This guide will help you manually set up and link your frontend and backend.

## 📋 Prerequisites

- MySQL installed and running
- Node.js installed
- Terminal/Command line access

## 🗄️ Step 1: Database Setup

### 1.1 Start MySQL
Make sure MySQL is running on your system.

### 1.2 Create Database
1. Open MySQL Workbench (or MySQL command line)
2. Connect to your MySQL server
3. Create the database:
   ```sql
   CREATE DATABASE project_w_db;
   ```

### 1.3 Run Schema Script
1. Open the file `backend/database/schema.sql`
2. Copy the entire content
3. Paste and execute it in MySQL Workbench
4. Verify tables were created:
   ```sql
   USE project_w_db;
   SHOW TABLES;
   ```

## 🔧 Step 2: Backend Setup

### 2.1 Create Environment File
Create a file called `.env` in the `backend` folder with this content:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=project_w_db
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

**Important**: Replace `your_mysql_password_here` with your actual MySQL password.

### 2.2 Install Dependencies
```bash
cd backend
npm install
```

### 2.3 Test Database Connection
```bash
npm run test:db
```

If this fails, check your MySQL password in the `.env` file.

### 2.4 Start Backend Server
```bash
npm run dev
```

You should see:
```
🔌 Testing database connection...
✅ Database connection established
🚀 Project W Backend Server running on port 3000
```

## 🎨 Step 3: Frontend Setup

### 3.1 Install Dependencies
```bash
# From project root (not backend folder)
npm install
```

### 3.2 Start Frontend Server
```bash
npm run dev
```

You should see:
```
  VITE v7.0.0  ready in 500 ms
  ➜  Local:   http://localhost:5173/
```

## 🧪 Step 4: Test Integration

### 4.1 Test Backend API
Open these URLs in your browser:
- http://localhost:3000/api/health
- http://localhost:3000/api/status
- http://localhost:3000/api/analytics

### 4.2 Test Frontend
Open http://localhost:5173 in your browser

### 4.3 Run Integration Test
```bash
npm run test:integration
```

## 🔍 Troubleshooting

### Database Connection Failed
- Check if MySQL is running
- Verify your password in `backend/.env`
- Make sure the database `project_w_db` exists

### Backend Won't Start
- Check if port 3000 is available
- Look for error messages in the console
- Verify all dependencies are installed

### Frontend Can't Connect
- Make sure backend is running on port 3000
- Check browser console for errors
- Verify CORS settings

## ✅ Success Indicators

When everything is working:

1. **Backend Console Shows:**
   ```
   ✅ Database connection established
   🚀 Project W Backend Server running on port 3000
   ```

2. **Frontend Console Shows:**
   ```
   VITE v7.0.0  ready in 500 ms
   ➜  Local:   http://localhost:5173/
   ```

3. **Integration Test Shows:**
   ```
   🎉 All tests passed! Your integration is working perfectly.
   ```

4. **Browser Access:**
   - Frontend: http://localhost:5173
   - Backend Health: http://localhost:3000/api/health

## 🎯 Next Steps

Once everything is linked:

1. **Test the Dome Gallery**: Navigate to the gallery component
2. **Add Content**: Try adding birthday messages and wishes
3. **Check Analytics**: View visitor tracking and statistics
4. **Customize**: Add your own images and content

## 📞 Getting Help

If you encounter issues:

1. Check the error messages in the console
2. Verify all steps were completed correctly
3. Make sure MySQL is running and accessible
4. Check that all ports (3000, 5173) are available

Your Project W dome gallery should now be fully functional! 🎂✨
