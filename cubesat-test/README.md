# CubeSat & Satellite 3D Demos

This folder contains interactive 3D demonstrations of satellites and spacecraft using Three.js, including wireframe models of CubeSats, Sputnik, and custom spacecraft with a unified launcher interface.

## Prerequisites

- Python 3.x (for local web server)
- Modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- No additional dependencies required (Three.js loads from CDN)

## Setup Instructions

### 1. Navigate to the Project Directory

```bash
cd /orbital-ctf/cubesat-test
```

### 2. Start Local Web Server

You need a local web server to run these demos due to CORS restrictions when loading 3D models and textures.

```bash
# Using Python 3
python3 -m http.server 8081

# Or using Python 2
python -m SimpleHTTPServer 8081
```

If port 8081 is already in use, you can use any available port:

```bash
python3 -m http.server 8082
```

### 3. Checking for Port Conflicts

If you get an "Address already in use" error:

```bash
# Find process using the port
lsof -i :8081

# Kill the process using the port
kill -9 $(lsof -t -i:8081)
```

## Quick Start - Demo Launcher

### **Main Launcher Interface**
**URL:** `http://localhost:8081/launcher.html`

The launcher provides a unified interface to access all demos with:
- Visual demo cards with descriptions and features
- Animated particle starfield background
- Fade-in effect for particles after page load
- Keyboard shortcuts (1-5) for quick access
- Opens demos in new tabs to preserve launcher access
- Responsive design for different screen sizes
- Featured demo highlighting (Sputnik CTF)
- Real-time status indicators

## Available Demos

### 1. **Basic CubeSat Orbits** 
**URL:** `http://localhost:8081/index.html`
- Multiple satellites orbiting Earth
- Category labels (WEB, CRYPTO, BINARY, etc.)
- Dashed orbital trails
- Interactive camera controls

### 2. **Detailed CubeSat with Challenges**
**URL:** `http://localhost:8081/detailed.html`
- Detailed satellite model with solar panels
- Challenge boxes integrated into the structure
- Color-coded challenge states (solved, locked, available)
- Hover and click interactions

### 3. **Sputnik Historical Model**
**URL:** `http://localhost:8081/sputnik.html`
- Historically accurate Sputnik representation
- Four extending antennas with segments
- Orbital animation
- Radio transmission pulse effects

### 4. **Sputnik CTF Challenges**
**URL:** `http://localhost:8081/sputnik-ctf.html`
- Sputnik with 4 integrated challenges
- Challenge panels on sphere surface
- Interactive challenge selection
- Fixed labels that rotate with the satellite

### 5. **TIE Fighter Model Demo**
**URL:** `http://localhost:8081/tie-fighter-demo.html`
- Loads GLB 3D model
- Wireframe toggle capability
- Auto-rotation and hovering effects
- Imperial theme styling
- Model Source - [Low Poly TIE Fighter](https://sketchfab.com/3d-models/low-poly-tie-fighter-ebeb22e16cbe48b38556f14f60ae297b)


## Controls

### Mouse Controls
- **Left Click + Drag**: Rotate view
- **Scroll Wheel**: Zoom in/out
- **Right Click + Drag**: Pan camera
- **Click on Challenges**: View challenge details (where applicable)

### Keyboard Controls (TIE Fighter Demo)
- **Space**: Toggle wireframe mode
- **A**: Toggle auto-rotation
- **R**: Reset camera position

## File Structure

```
cubesat-test/
├── README.md                    # This file
├── launcher.html                # Main demo launcher interface
├── index.html                   # Basic orbiting satellites
├── cubesat.js                   # JavaScript for basic demo
├── detailed.html                # Detailed CubeSat view
├── cubesat-detailed.js          # JavaScript for detailed CubeSat
├── sputnik.html                 # Sputnik historical model
├── sputnik.js                   # JavaScript for Sputnik
├── sputnik-ctf.html            # Sputnik with challenges
├── sputnik-challenges.js        # JavaScript for Sputnik CTF
├── tie-fighter-demo.html        # TIE Fighter model viewer
├── tie-fighter.js               # JavaScript for TIE Fighter
├── low_poly_tie_fighter.glb    # 3D model file (required for TIE Fighter demo)
└── stars/
    └── stars.js                 # Particle animation system for launcher background
```

## Environment Variables (.env)

While these demos don't require environment variables, if you want to configure the server port or other settings, you can create a `.env` file:

```bash
# .env file (optional)
SERVER_PORT=8081
AUTO_OPEN_BROWSER=true
```

To use environment variables with Python's http.server:

```bash
# Create a simple server script
cat > server.py << 'EOF'
import os
import http.server
import socketserver
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

PORT = int(os.getenv('SERVER_PORT', 8081))
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Server running at http://localhost:{PORT}/")
    httpd.serve_forever()
EOF

# Install python-dotenv if needed
pip3 install python-dotenv

# Run the server with .env configuration
python3 server.py
```

## Troubleshooting

### Black Screen Issues
- Check browser console for errors (F12 → Console)
- Ensure Three.js CDN is accessible
- Verify WebGL is enabled in your browser

### Model Not Loading (TIE Fighter)
- Ensure `low_poly_tie_fighter.glb` file exists in the directory
- Check browser console for loading errors
- Verify file path is correct

### Wireframe Not Displaying
- Some browsers may have issues with certain WebGL features
- Try refreshing the page
- Check that JavaScript is enabled

### Performance Issues
- Reduce number of stars in background (edit JS files)
- Close other browser tabs
- Try a different browser
- Disable auto-rotation if needed

## Customization

### Changing Colors
Edit the respective JavaScript files and modify color values:
```javascript
// Example: Change wireframe color
color: 0x00ff00  // Green (use hex color codes)
```

### Adjusting Animation Speed
Look for rotation or animation values in the JavaScript files:
```javascript
// Example: Slow down rotation
sputnik.rotation.y += 0.001  // Decrease value for slower rotation
```

### Adding New Challenges
In the challenge-enabled demos, modify the challenges array:
```javascript
const challenges = [
    { id: 1, title: 'New Challenge', points: 100, isSolved: false, isLocked: false },
    // Add more challenges here
];
```

## Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (macOS 10.15+)
- **Mobile Browsers**: Limited support, touch controls may vary

## License

These demos are for educational and demonstration purposes.

## Support

For issues specific to the Orbital CTF project, please refer to the main project documentation.