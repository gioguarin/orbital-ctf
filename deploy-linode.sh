#!/bin/bash

# Orbital CTF Linode Deployment Script
# Run this on a fresh Ubuntu 22.04 Linode instance

set -e

echo "🚀 Starting Orbital CTF Deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
echo "📦 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Install Redis (for session storage)
echo "📦 Installing Redis..."
sudo apt install -y redis-server

# Install nginx
echo "📦 Installing nginx..."
sudo apt install -y nginx

# Install certbot for SSL
echo "📦 Installing certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Setup PostgreSQL
echo "🗄️ Setting up PostgreSQL..."
DB_USER="orbital_user"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH CREATEDB SUPERUSER PASSWORD 'orbital_password';" 2>/dev/null || echo "User $DB_USER already exists"
sudo -u postgres createdb -O $DB_USER orbital_ctf 2>/dev/null || echo "Database orbital_ctf already exists"

# Setup Redis
echo "🔄 Starting Redis..."
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Clone and setup the CTF
echo "📥 Cloning Orbital CTF..."
git clone https://github.com/asynchronous-x/orbital-ctf.git
cd orbital-ctf

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Setting up database..."
npm run prisma:generate

# Setup environment
echo "⚙️ Setting up environment..."
cp .env.example .env

# Generate secure secrets
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL="https://your-domain.com"  # Replace with actual domain

# Update .env file
sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\"|" .env
sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=\"$NEXTAUTH_URL\"|" .env
sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://$DB_USER:orbital_password@localhost:5432/orbital_ctf\"|" .env

# Set game times (adjust as needed)
GAME_START_TIME="2025-01-15T18:00:00.000Z"  # 6 PM UTC
GAME_END_TIME="2025-01-15T22:00:00.000Z"    # 10 PM UTC

echo "GAME_START_TIME=\"$GAME_START_TIME\"" >> .env
echo "GAME_END_TIME=\"$GAME_END_TIME\"" >> .env

# Setup database
echo "🗄️ Setting up database schema..."
npx prisma migrate reset --force

# Seed database
echo "🌱 Seeding database..."
npm run prisma:seed

# Build the application
echo "🔨 Building application..."
npm run build

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'orbital-ctf',
    script: 'npm run start',
    cwd: '/home/$USER/orbital-ctf',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Setup nginx
echo "🌐 Configuring nginx..."
sudo tee /etc/nginx/sites-available/orbital-ctf << EOF
server {
    listen 80;
    server_name your-domain.com;  # Replace with actual domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/orbital-ctf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Point your domain to this Linode's IP"
echo "2. Run: sudo certbot --nginx -d your-domain.com"
echo "3. Create challenges in the admin panel"
echo "4. Test the platform"
echo ""
echo "Application is running at: http://localhost:3000"
echo "Admin panel: http://your-domain.com/admin"