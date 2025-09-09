#!/bin/bash

# Project W Startup Script
# This script will help you start the complete application

echo "🚀 Project W - Complete Application Startup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MySQL is running (basic check)
if ! pgrep -x "mysqld" > /dev/null; then
    echo "⚠️  MySQL doesn't appear to be running."
    echo "   Please start MySQL first:"
    echo "   - macOS: brew services start mysql"
    echo "   - Linux: sudo systemctl start mysql"
    echo "   - Windows: Start MySQL service"
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  No .env file found. Running database setup..."
    echo "   Please provide your MySQL credentials when prompted."
    echo ""
    npm run setup
fi

# Test database connection
echo ""
echo "🔌 Testing database connection..."
if npm run test:db; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    echo "   Please check your MySQL credentials in backend/.env"
    echo "   Or run: cd backend && npm run setup"
    exit 1
fi

# Start backend in background
echo ""
echo "🔧 Starting backend server..."
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✅ Backend server is running on http://localhost:3000"
else
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Go back to project root
cd ..

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
npm install

# Start frontend
echo ""
echo "🎨 Starting frontend server..."
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
echo "📈 Analytics: http://localhost:3000/api/analytics"
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
