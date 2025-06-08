#!/bin/bash

set -e

# Function to detect docker compose command
detect_docker_compose() {
  if command -v docker &>/dev/null && docker compose version &>/dev/null; then
    echo "docker compose"
  elif command -v docker-compose &>/dev/null; then
    echo "docker-compose"
  else
    echo "❌ Error: Neither 'docker compose' nor 'docker-compose' found!"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
  fi
}

# Function to check service availability
check_dev_services() {
  echo "🌐 Checking development service availability..."

  # Check backend
  if curl -s http://localhost:3001/health >/dev/null 2>&1; then
    echo "✅ Backend (3001): Responsive"
  else
    echo "⚠️  Backend (3001): Not responding"
  fi

  # Check frontend dev server
  if curl -s http://localhost:5173 >/dev/null 2>&1; then
    echo "✅ Frontend Dev (5173): Responsive"
  else
    echo "⚠️  Frontend Dev (5173): Not responding"
  fi
}

# Detect which docker compose command to use
DOCKER_COMPOSE=$(detect_docker_compose)
echo "ℹ️  Using: $DOCKER_COMPOSE"

echo "🚀 Starting development environment with hot reload..."

# Stop any running containers
echo "🛑 Stopping any existing services..."
$DOCKER_COMPOSE -f docker-compose.dev.yml down 2>/dev/null || true

# Build and start development containers
echo "📦 Building development images..."
$DOCKER_COMPOSE -f docker-compose.dev.yml build

echo "🔄 Starting development services with hot reload..."
$DOCKER_COMPOSE -f docker-compose.dev.yml up -d

echo "⏳ Waiting for services to start..."
sleep 15

echo "📊 Development service status:"
$DOCKER_COMPOSE -f docker-compose.dev.yml ps

# Check service availability
check_dev_services

echo ""
echo "🎉 Development Environment Ready!"
echo "================================"
echo "🌐 Frontend (Dev): http://localhost:5173"
echo "🔗 Backend (Dev): http://localhost:3001"
echo "📊 Health Check: http://localhost:3001/health"
echo ""
echo "🔥 Features:"
echo "  - Hot reload enabled for both frontend and backend"
echo "  - Source code changes trigger automatic rebuilds"
echo "  - Database persists between restarts"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: $DOCKER_COMPOSE -f docker-compose.dev.yml logs -f"
echo "  - Stop services: $DOCKER_COMPOSE -f docker-compose.dev.yml down"
echo "  - Restart service: $DOCKER_COMPOSE -f docker-compose.dev.yml restart [service]"
echo ""
echo "🔍 To follow logs in real-time:"
echo "  $DOCKER_COMPOSE -f docker-compose.dev.yml logs -f"
