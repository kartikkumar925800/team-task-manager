#!/bin/bash

# Function to gracefully kill the background Python process
cleanup() {
    echo -e "\n🛑 Shutting down backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C (SIGINT) and termination signals to run the cleanup function
trap cleanup SIGINT SIGTERM EXIT

echo "🚀 Booting FastAPI Backend..."
cd backend
source venv/bin/activate
uvicorn main:app --reload &
# Capture the Process ID of the backend so we can kill it later
BACKEND_PID=$!
cd ..

echo "🚀 Booting Next.js Frontend..."
cd frontend
npm run dev