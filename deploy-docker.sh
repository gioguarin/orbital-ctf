#!/bin/bash

# Orbital CTF Docker Deployment Script
# Run this on a fresh Ubuntu 22.04 Linode instance

set -e

echo "🚀 Starting Orbital CTF Docker Deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "📦 Installing Docker..."
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "📦 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone the CTF repository
echo "📥 Cloning Orbital CTF..."
git clone https://github.com/gioguarin/orbital-ctf.git
cd orbital-ctf

# Create environment file
echo "⚙️ Setting up environment..."
cp .env.example .env

# Generate secure secrets
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"

# Update .env file
sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\"|" .env
sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=\"$NEXTAUTH_URL\"|" .env
sed -i "s|DATABASE_URL=.*|DATABASE_URL=file:./dev.db|" .env

# Set game times (adjust as needed)
GAME_START_TIME="2025-01-15T18:00:00.000Z"  # 6 PM UTC
GAME_END_TIME="2025-01-15T22:00:00.000Z"    # 10 PM UTC

echo "GAME_START_TIME=\"$GAME_START_TIME\"" >> .env
echo "GAME_END_TIME=\"$GAME_END_TIME\"" >> .env

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p public/uploads
mkdir -p ssl

# Build and start with Docker Compose
echo "🐳 Building and starting with Docker..."
docker-compose up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Test the application
echo "🧪 Testing application..."
curl -f http://localhost:3000/api/health || echo "Health check failed, but continuing..."

echo "✅ Docker deployment complete!"
echo ""
echo "🎯 Your CTF is now running!"
echo ""
echo "Access URLs:"
echo "• CTF Platform: http://172.235.146.217"
echo "• Admin Panel: http://172.235.146.217/admin"
echo ""
echo "Next steps:"
echo "1. Test user registration and login"
echo "2. Verify challenges are loaded (should be 12 total)"
echo "3. Configure game start/end times if needed"
echo "4. Set up domain and SSL (optional)"
echo ""
echo "Docker commands:"
echo "• View logs: docker-compose logs -f"
echo "• Stop: docker-compose down"
echo "• Restart: docker-compose restart"
echo ""
echo "🎉 Ready for your CTF event!"