#!/bin/bash

echo "🔄 Creating database..."
createdb -h localhost driverconnect

echo "🔄 Running database initialization..."
node scripts/init-db.js

echo "🔄 Starting server..."
node server.js > server.log 2>&1 &

echo "✅ Server started! Check server.log for output"
echo "🌐 API running on http://localhost:5000"
