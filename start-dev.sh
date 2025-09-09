#!/bin/bash

# Project W Development Startup Script
# This script starts both the frontend and backend servers

echo "🚀 Starting Project W Development Environment..."
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Check if backend port is available
if check_port 3000; then
    echo "⚠️  Port 3000 is already in use. Backend might already be running."
fi

# Check if frontend port is available
if check_port 5173; then
    echo "⚠️  Port 5173 is already in use. Frontend might already be running."
fi

echo ""
echo "📦 Installing dependencies..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "🔧 Starting servers..."

# Start backend in background
echo "Starting backend server on port 3000..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server on port 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment started!"
echo "================================================"
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
