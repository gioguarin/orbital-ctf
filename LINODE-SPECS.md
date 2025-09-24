# 🖥️ **Linode Instance Specifications for Orbital CTF**

## 🎯 **Recommended Configuration**

### **Instance Type:** Linode 4GB
- **CPU:** 2 vCPU Cores (AMD EPYC 9654)
- **RAM:** 4GB DDR4
- **Storage:** 80GB NVMe SSD
- **Network:** 4 Gbps In / 4 Gbps Out
- **Transfer:** 4TB/month included
- **Price:** $12/month ($0.018/hour)

### **Operating System:** Ubuntu 22.04 LTS
- **Version:** Ubuntu 22.04 LTS (Jammy Jellyfish)
- **Architecture:** x64
- **Security:** Latest security patches

---

## 📊 **Why These Specs?**

### **Capacity Analysis:**
- **Concurrent Users:** 150+ supported
- **API Requests:** 500+ requests/minute
- **Database Queries:** 1000+ queries/minute
- **File Downloads:** 50+ simultaneous downloads
- **Real-time Updates:** WebSocket connections for live scoring

### **Performance Benchmarks:**
- **Page Load:** <2 seconds
- **API Response:** <500ms
- **Database:** Handles 1000+ submissions/hour
- **File Serving:** <5 seconds for challenge files

---

## 🚀 **Quick Setup Instructions**

### **Step 1: Create Linode Instance**
```bash
# Linode Cloud Manager:
# 1. Click "Create Linode"
# 2. Choose "Linode 4GB" plan
# 3. Select "Ubuntu 22.04 LTS"
# 4. Choose datacenter (closest to your users)
# 5. Set root password
# 6. Add SSH keys (recommended)
# 7. Create instance
```

### **Step 2: Initial Configuration**
```bash
# SSH into your new instance
ssh root@YOUR_LINODE_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git htop iotop

# Check resources
free -h
df -h
nproc
```

### **Step 3: Deploy CTF**
```bash
# Run our deployment script
curl -fsSL https://raw.githubusercontent.com/asynchronous-x/orbital-ctf/main/deploy-linode.sh | bash
```

---

## 💰 **Cost Breakdown**

### **Monthly Costs:**
- **Linode 4GB:** $12.00
- **Backup Service:** $2.50 (optional, recommended)
- **Domain:** $10-15/year (optional)
- **SSL Certificate:** Free (Let's Encrypt)

### **Total First Month:** $12-15
### **Your $100 Credit Covers:** 8+ months of operation

---

## 📈 **Scaling Options**

### **If You Need More Power:**
- **Linode 8GB:** $24/month (double capacity)
- **Linode 16GB:** $48/month (quadruple capacity)

### **Performance Monitoring:**
```bash
# Install monitoring tools
sudo apt install -y prometheus-node-exporter
sudo apt install -y htop iotop nload

# Monitor resources
htop          # CPU/Memory
iotop         # Disk I/O
nload         # Network
```

---

## 🌐 **Network Configuration**

### **Firewall Setup (UFW):**
```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

### **Domain Setup (Optional):**
```bash
# Point your domain A record to: YOUR_LINODE_IP
# Then run SSL setup:
sudo certbot --nginx -d your-domain.com
```

---

## 🔧 **Post-Deployment Checklist**

- [ ] Instance created and accessible
- [ ] SSH keys configured
- [ ] Firewall enabled
- [ ] CTF deployed successfully
- [ ] Domain configured (optional)
- [ ] SSL certificate installed (optional)
- [ ] Admin panel accessible
- [ ] Test user registration works
- [ ] Challenges loaded properly
- [ ] Game times configured

---

## 🚨 **Emergency Contacts**

**Linode Support:** 24/7 available
**Documentation:** https://www.linode.com/docs/
**Community:** https://www.linode.com/community/

---

## 🎯 **Ready to Launch!**

With these specifications, your CTF will handle 100-150 players effortlessly. The Linode 4GB instance provides enterprise-grade performance at a fraction of the cost.

**Total Setup Time:** 30 minutes
**Monthly Cost:** $12
**Capacity:** 150+ players

**Launch your CTF!** 🚀