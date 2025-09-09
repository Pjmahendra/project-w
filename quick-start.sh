#!/bin/bash

# Quick Start Script for Project W
echo "🚀 Project W - Quick Start"
echo "========================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project-w directory"
    exit 1
fi

echo "📋 Step 1: Setting up environment..."
echo ""

# Create .env file for backend
echo "Creating backend/.env file..."
cat > backend/.env << 'EOF'
# Project W Backend Environment Variables
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=project_w_db
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
EOF

echo "✅ Backend environment file created"
echo ""

echo "📋 Step 2: Testing database connection..."
cd backend

# Test database connection
if npm run test:db; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Database connection failed"
    echo ""
    echo "Please make sure:"
    echo "1. MySQL is running"
    echo "2. You have created the 'project_w_db' database"
    echo "3. You have run the schema.sql script"
    echo ""
    echo "To fix this:"
    echo "1. Open MySQL Workbench"
    echo "2. Run the script in backend/database/schema.sql"
    echo "3. Then run this script again"
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📋 Step 3: Starting backend server..."
echo "Starting backend on port 3000..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Test if backend is running
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Backend server is running"
else
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "📋 Step 4: Starting frontend server..."
cd ..

# Start frontend
echo "Starting frontend on port 5173..."
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 3

echo ""
echo "🎉 Project W is now running!"
echo "=========================="
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:3000"
echo "📊 Health:   http://localhost:3000/api/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped."
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
