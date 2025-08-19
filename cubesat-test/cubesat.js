// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Camera position
camera.position.set(0, 10, 20);
camera.lookAt(0, 0, 0);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 50;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Earth (central wireframe sphere)
const earthGeometry = new THREE.SphereGeometry(3, 16, 16);
const earthMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x4a90e2, 
    wireframe: true 
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Satellite/CubeSat class
class CubeSat {
    constructor(name, orbitRadius, orbitSpeed, orbitTilt = 0, color = 0xffffff) {
        this.name = name;
        this.orbitRadius = orbitRadius;
        this.orbitSpeed = orbitSpeed;
        this.orbitTilt = orbitTilt;
        this.angle = Math.random() * Math.PI * 2;
        
        // Create satellite group
        this.group = new THREE.Group();
        
        // CubeSat wireframe (small cube representing the satellite)
        const satelliteGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const satelliteMaterial = new THREE.MeshBasicMaterial({ 
            color: color,
            wireframe: true
        });
        this.satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
        this.group.add(this.satellite);
        
        // Label (using CSS2DRenderer would be better, but keeping it simple)
        const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 256;
        labelCanvas.height = 64;
        const context = labelCanvas.getContext('2d');
        context.fillStyle = 'black';
        context.fillRect(0, 0, 256, 64);
        context.fillStyle = 'white';
        context.font = '24px Courier New';
        context.textAlign = 'center';
        context.fillText(name.toUpperCase(), 128, 40);
        
        const labelTexture = new THREE.CanvasTexture(labelCanvas);
        const labelMaterial = new THREE.MeshBasicMaterial({ 
            map: labelTexture, 
            transparent: true,
            side: THREE.DoubleSide
        });
        this.label = new THREE.Mesh(labelGeometry, labelMaterial);
        this.label.position.y = 0.8;
        this.group.add(this.label);
        
        // Orbit trail
        this.createOrbitTrail();
        
        scene.add(this.group);
    }
    
    createOrbitTrail() {
        const points = [];
        const segments = 64;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * this.orbitRadius;
            const z = Math.sin(angle) * this.orbitRadius;
            const y = Math.sin(angle) * Math.sin(this.orbitTilt) * this.orbitRadius * 0.3;
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const trailGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const trailMaterial = new THREE.LineDashedMaterial({
            color: 0xffffff,
            dashSize: 0.5,
            gapSize: 0.3,
            opacity: 0.3,
            transparent: true
        });
        
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        trail.computeLineDistances();
        scene.add(trail);
    }
    
    update(deltaTime) {
        // Update orbit position
        this.angle += this.orbitSpeed * deltaTime;
        
        const x = Math.cos(this.angle) * this.orbitRadius;
        const z = Math.sin(this.angle) * this.orbitRadius;
        const y = Math.sin(this.angle) * Math.sin(this.orbitTilt) * this.orbitRadius * 0.3;
        
        this.group.position.set(x, y, z);
        
        // Rotate satellite
        this.satellite.rotation.y += deltaTime * 0.5;
        
        // Make label face camera
        this.label.lookAt(camera.position);
    }
}

// Create multiple satellites (categories)
const satellites = [
    new CubeSat('WEB', 5, 0.3, 0.2, 0x00ff00),
    new CubeSat('CRYPTO', 7, 0.2, 0.5, 0xff0000),
    new CubeSat('BINARY', 9, 0.15, 0.8, 0xffff00),
    new CubeSat('FORENSICS', 11, 0.1, 1.0, 0xff00ff),
    new CubeSat('OSINT', 13, 0.08, 0.3, 0x00ffff),
    new CubeSat('PWN', 15, 0.06, 0.6, 0xffa500)
];

// Stars background
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8
});

const starsVertices = [];
for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    starsVertices.push(x, y, z);
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Animation loop
let lastTime = 0;
function animate(currentTime) {
    requestAnimationFrame(animate);
    
    const deltaTime = (currentTime - lastTime) * 0.001;
    lastTime = currentTime;
    
    // Rotate Earth
    earth.rotation.y += deltaTime * 0.1;
    
    // Update satellites
    satellites.forEach(satellite => satellite.update(deltaTime));
    
    // Update controls
    controls.update();
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate(0);