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

# Function to wait for healthy services (cross-platform)
wait_for_healthy() {
  local docker_compose_cmd="$1"
  local max_attempts=30
  local attempt=0

  echo "🔍 Checking service health..."

  while [ $attempt -lt $max_attempts ]; do
    if $docker_compose_cmd ps | grep -q "healthy"; then
      echo "✅ Services are healthy!"
      return 0
    fi

    attempt=$((attempt + 1))
    echo "⏳ Waiting for services... (attempt $attempt/$max_attempts)"
    sleep 2
  done

  echo "⚠️  Timeout waiting for services to become healthy"
  echo "📊 Current service status:"
  $docker_compose_cmd ps
  return 1
}

# Function to check service availability
check_services() {
  echo "🌐 Checking service availability..."

  # Check backend
  if curl -s http://localhost:3001/health >/dev/null 2>&1; then
    echo "✅ Backend (3001): Responsive"
  else
    echo "⚠️  Backend (3001): Not responding"
  fi

  # Check frontend
  if curl -s http://localhost >/dev/null 2>&1; then
    echo "✅ Frontend (80): Responsive"
  else
    echo "⚠️  Frontend (80): Not responding"
  fi
}

# Detect which docker compose command to use
DOCKER_COMPOSE=$(detect_docker_compose)
echo "ℹ️  Using: $DOCKER_COMPOSE"

echo "🚀 Deploying Hono + React + tRPC application..."

# Build and deploy production
echo "📦 Building production images..."
$DOCKER_COMPOSE down
$DOCKER_COMPOSE build --no-cache
$DOCKER_COMPOSE up -d

echo "⏳ Waiting for services to start..."
$DOCKER_COMPOSE ps

# Wait for services to be healthy (with custom timeout)
if wait_for_healthy "$DOCKER_COMPOSE"; then
  echo "✅ Deployment completed successfully!"
else
  echo "⚠️  Deployment may have issues, but services are running"
fi

# Check service availability
check_services

echo ""
echo "🎉 Deployment Summary:"
echo "=================="
echo "🌐 Frontend: http://localhost"
echo "🔗 Backend: http://localhost:3001"
echo "📊 Health: http://localhost:3001/health"
echo ""
echo "📋 Useful commands:"
echo "  - View logs: $DOCKER_COMPOSE logs -f"
echo "  - Check status: $DOCKER_COMPOSE ps"
echo "  - Stop services: $DOCKER_COMPOSE down"
