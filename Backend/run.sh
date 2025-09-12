#!/bin/bash

# Exit on error
set -e

# Navigate to backend dir
cd "$(dirname "$0")"

# Activate virtual environment if exists
if [ -d "venv" ]; then
  echo "✅ Activating virtual environment..."
  source venv/bin/activate
fi

# Install dependencies if needed
if [ -f "requirements.txt" ]; then
  echo "📦 Installing dependencies..."
  pip install -r requirements.txt
fi

# Run FastAPI with uvicorn
echo "🚀 Starting FastAPI backend on http://127.0.0.1:8000 ..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
