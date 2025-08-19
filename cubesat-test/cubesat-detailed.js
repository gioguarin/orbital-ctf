// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Camera position
camera.position.set(5, 3, 8);
camera.lookAt(0, 0, 0);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 30;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Helper function to create edge geometry
function createEdgeBox(width, height, depth, position, rotation = [0, 0, 0], color = 0x6b6b6b) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: color }));
    line.position.set(...position);
    line.rotation.set(...rotation);
    return line;
}

// Sample challenges data
const challenges = [
    { id: 1, title: 'Web Challenge 1', points: 100, isSolved: false, isLocked: false },
    { id: 2, title: 'Web Challenge 2', points: 200, isSolved: true, isLocked: false },
    { id: 3, title: 'Web Challenge 3', points: 300, isSolved: false, isLocked: true },
    { id: 4, title: 'SQL Injection', points: 150, isSolved: false, isLocked: false },
    { id: 5, title: 'XSS Attack', points: 250, isSolved: true, isLocked: false },
    { id: 6, title: 'CSRF Token', points: 350, isSolved: false, isLocked: false },
    { id: 7, title: 'Auth Bypass', points: 400, isSolved: false, isLocked: true },
    { id: 8, title: 'Cookie Theft', points: 200, isSolved: false, isLocked: false }
];

// Create CubeSat group
const cubeSat = new THREE.Group();

// Main satellite body
const mainBox = createEdgeBox(2, 2, 2, [0, 0, 0]);
cubeSat.add(mainBox);

// Accent boxes
cubeSat.add(createEdgeBox(1, 0.5, 0.2, [0.3, 0.4, -1.1]));
cubeSat.add(createEdgeBox(1, 0.2, 0.4, [0, -1.1, 0.6]));

// Solar panel connections
cubeSat.add(createEdgeBox(0.3, 0.1, 0.1, [-1.15, 0, 0]));
cubeSat.add(createEdgeBox(0.3, 0.1, 0.1, [1.15, 0, 0]));

// Left solar panel
cubeSat.add(createEdgeBox(5, 0.05, 1.5, [-3.8, 0, 0], [0.5, 0, 0]));
cubeSat.add(createEdgeBox(1.3, 0.01, 1.3, [-2.1, 0, 0], [0.5, 0, 0]));
cubeSat.add(createEdgeBox(1.3, 0.01, 1.3, [-3.8, 0, 0], [0.5, 0, 0]));
cubeSat.add(createEdgeBox(1.3, 0.01, 1.3, [-5.5, 0, 0], [0.5, 0, 0]));

// Right solar panel
cubeSat.add(createEdgeBox(5, 0.05, 1.5, [3.8, 0, 0], [0.5, 0, 0]));
cubeSat.add(createEdgeBox(1.3, 0.01, 1.3, [2.1, 0, 0], [0.5, 0, 0]));
cubeSat.add(createEdgeBox(1.3, 0.01, 1.3, [3.8, 0, 0], [0.5, 0, 0]));
cubeSat.add(createEdgeBox(1.3, 0.01, 1.3, [5.5, 0, 0], [0.5, 0, 0]));

// Satellite dish
const dishGroup = new THREE.Group();
dishGroup.position.set(0, 0, 1.2);

// Dish (hemisphere)
const dishGeometry = new THREE.SphereGeometry(0.9, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
const dishEdges = new THREE.EdgesGeometry(dishGeometry);
const dishLine = new THREE.LineSegments(dishEdges, new THREE.LineBasicMaterial({ color: 0x6b6b6b }));
dishLine.rotation.x = 1.7;
dishGroup.add(dishLine);

// Dish arm
const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8);
const armEdges = new THREE.EdgesGeometry(armGeometry);
const armLine = new THREE.LineSegments(armEdges, new THREE.LineBasicMaterial({ color: 0x6b6b6b }));
armLine.rotation.x = Math.PI / 2;
dishGroup.add(armLine);

cubeSat.add(dishGroup);

// Challenge boxes
const challengesPerRow = 2;
const spacing = 0.35;
const startX = -0.5;
const startY = -0.8;
const startZ = 0;

// Create challenge indicators with hover functionality
const challengeBoxes = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredBox = null;

challenges.forEach((challenge, index) => {
    const row = Math.floor(index / challengesPerRow);
    const col = index % challengesPerRow;
    const x = startX + (col * 1.0);
    const y = startY + (row * spacing);
    
    // Determine color based on state
    let color;
    if (challenge.isLocked) {
        color = 0xffd700; // Gold for locked
    } else if (challenge.isSolved) {
        color = 0x00ff00; // Green for solved
    } else {
        color = 0xffffff; // White for unsolved
    }
    
    // Create challenge box
    const boxGeometry = new THREE.BoxGeometry(0.8, 0.25, 1.9);
    const boxMaterial = new THREE.MeshBasicMaterial({ 
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(x, y, startZ);
    box.userData = challenge;
    
    challengeBoxes.push(box);
    cubeSat.add(box);
    
    // Add text label
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.fillStyle = 'black';
    context.fillRect(0, 0, 256, 64);
    
    // Draw status icon and text
    context.fillStyle = challenge.isLocked ? 'gold' : (challenge.isSolved ? '#00ff00' : 'white');
    context.font = '18px Courier New';
    context.textAlign = 'center';
    
    let text = '';
    if (challenge.isLocked) {
        text = '🔒 Locked';
    } else if (challenge.isSolved) {
        text = '✓ Solved';
    } else {
        text = `${challenge.points} pts`;
    }
    context.fillText(text, 128, 40);
    
    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const label = new THREE.Sprite(labelMaterial);
    label.scale.set(0.8, 0.2, 1);
    label.position.set(x, y, startZ + 0.1);
    cubeSat.add(label);
});

// Add the CubeSat to the scene
scene.add(cubeSat);

// Mouse hover detection
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(challengeBoxes);
    
    // Reset previously hovered box
    if (hoveredBox && hoveredBox !== intersects[0]?.object) {
        const challenge = hoveredBox.userData;
        if (challenge.isLocked) {
            hoveredBox.material.color.setHex(0xffd700);
        } else if (challenge.isSolved) {
            hoveredBox.material.color.setHex(0x00ff00);
        } else {
            hoveredBox.material.color.setHex(0xffffff);
        }
        hoveredBox.material.wireframe = true;
        hoveredBox = null;
    }
    
    // Highlight newly hovered box
    if (intersects.length > 0) {
        hoveredBox = intersects[0].object;
        hoveredBox.material.color.setHex(0x4a90e2);
        hoveredBox.material.wireframe = false;
        
        // Show challenge title on hover
        const challenge = hoveredBox.userData;
        document.getElementById('info').innerHTML = `ORBITAL CTF - ${challenge.title} (${challenge.points} pts)`;
    } else {
        document.getElementById('info').innerHTML = 'ORBITAL CTF - CUBESAT DETAILED VIEW';
    }
}

// Mouse click detection
function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(challengeBoxes);
    
    if (intersects.length > 0) {
        const challenge = intersects[0].object.userData;
        if (!challenge.isLocked) {
            alert(`Challenge: ${challenge.title}\nPoints: ${challenge.points}\nStatus: ${challenge.isSolved ? 'Solved ✓' : 'Unsolved'}`);
        } else {
            alert('This challenge is locked! 🔒');
        }
    }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onClick, false);

// Stars background
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.6
});

const starsVertices = [];
for (let i = 0; i < 500; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    starsVertices.push(x, y, z);
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Subtle floating animation for the CubeSat
    cubeSat.position.y = Math.sin(Date.now() * 0.001) * 0.1;
    
    // Slow rotation
    cubeSat.rotation.y += 0.001;
    
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
animate();