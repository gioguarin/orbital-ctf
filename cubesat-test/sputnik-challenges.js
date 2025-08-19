// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Camera position
camera.position.set(6, 4, 8);
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
function createEdgeGeometry(geometry, color = 0xffffff) {
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: color }));
    return line;
}

// Sample challenges data - 4 challenges for Sputnik
const challenges = [
    { id: 1, title: 'Radio Frequency Analysis', points: 100, isSolved: false, isLocked: false },
    { id: 2, title: 'Orbital Mechanics', points: 200, isSolved: true, isLocked: false },
    { id: 3, title: 'Signal Decryption', points: 300, isSolved: false, isLocked: false },
    { id: 4, title: 'Telemetry Decode', points: 500, isSolved: false, isLocked: true }
];

// Create Sputnik group
const sputnik = new THREE.Group();

// Main spherical body - larger to accommodate challenges
const mainSphereGeometry = new THREE.SphereGeometry(2.5, 20, 16);
const mainSphereEdges = createEdgeGeometry(mainSphereGeometry, 0x4a90e2);
sputnik.add(mainSphereEdges);

// Inner detail sphere
const innerSphereGeometry = new THREE.SphereGeometry(2.4, 16, 12);
const innerSphereEdges = createEdgeGeometry(innerSphereGeometry, 0x6b6b6b);
sputnik.add(innerSphereEdges);

// Equatorial band removed for cleaner surface

// Challenge boxes integrated into Sputnik's sphere
const challengeBoxes = [];
const challengeLabels = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredBox = null;

// Position challenges at 4 quadrants around the sphere
const challengePositions = [
    { angle: 0, elevation: 0.3, label: 'FREQ' },           // Front
    { angle: Math.PI / 2, elevation: 0.3, label: 'ORBIT' }, // Right
    { angle: Math.PI, elevation: 0.3, label: 'SIGNAL' },    // Back
    { angle: -Math.PI / 2, elevation: 0.3, label: 'TELEM' } // Left
];

challenges.forEach((challenge, index) => {
    const pos = challengePositions[index];
    
    // Calculate position on sphere surface
    const radius = 2.3; // Just inside the main sphere
    const x = Math.cos(pos.angle) * Math.cos(pos.elevation) * radius;
    const y = Math.sin(pos.elevation) * radius;
    const z = Math.sin(pos.angle) * Math.cos(pos.elevation) * radius;
    
    // Determine color based on state
    let color;
    if (challenge.isLocked) {
        color = 0xffd700; // Gold for locked
    } else if (challenge.isSolved) {
        color = 0x00ff00; // Green for solved
    } else {
        color = 0xffffff; // White for unsolved
    }
    
    // Create challenge panel (rectangular box embedded in sphere)
    const boxGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.2);
    const boxMaterial = new THREE.MeshBasicMaterial({ 
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.9
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(x, y, z);
    
    // Make the box face outward from the sphere center
    box.lookAt(x * 2, y * 2, z * 2);
    box.userData = challenge;
    
    challengeBoxes.push(box);
    sputnik.add(box);
    
    // Add status indicator on the challenge box
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    context.fillStyle = 'black';
    context.fillRect(0, 0, 256, 128);
    
    // Draw challenge status
    context.fillStyle = challenge.isLocked ? 'gold' : (challenge.isSolved ? '#00ff00' : 'white');
    context.font = 'bold 20px Courier New';
    context.textAlign = 'center';
    
    // Display abbreviated label
    context.fillText(pos.label, 128, 40);
    
    // Display status or points
    context.font = '16px Courier New';
    if (challenge.isLocked) {
        context.fillText('🔒 LOCKED', 128, 70);
    } else if (challenge.isSolved) {
        context.fillText('✓ SOLVED', 128, 70);
    } else {
        context.fillText(`${challenge.points} PTS`, 128, 70);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    
    // Create a plane mesh instead of sprite so it rotates with the sphere
    const labelGeometry = new THREE.PlaneGeometry(1.0, 0.5);
    const labelMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    
    // Position label slightly outside the challenge box
    label.position.set(x * 1.1, y * 1.1, z * 1.1);
    
    // Orient the label to face outward from sphere center
    label.lookAt(x * 2, y * 2, z * 2);
    
    challengeLabels.push(label);
    sputnik.add(label);
});

// Four iconic antennas - aligned with challenge positions
const antennaLength = 7;

// Create antennas aligned with each challenge
challengePositions.forEach((pos, index) => {
    const antennaGroup = new THREE.Group();
    
    // Calculate base position on sphere surface
    const radius = 2.5;
    const baseX = Math.cos(pos.angle) * Math.cos(pos.elevation) * radius;
    const baseY = Math.sin(pos.elevation) * radius;
    const baseZ = Math.sin(pos.angle) * Math.cos(pos.elevation) * radius;
    
    // Calculate antenna direction (extending outward from sphere)
    const direction = new THREE.Vector3(baseX, baseY, baseZ).normalize();
    
    // Main antenna rod - create as a line for better control
    const antennaPoints = [];
    antennaPoints.push(new THREE.Vector3(baseX, baseY, baseZ));
    
    // Extend antenna outward and slightly angled
    const endX = baseX + direction.x * antennaLength - direction.y * 2;
    const endY = baseY + direction.y * antennaLength + 3;
    const endZ = baseZ + direction.z * antennaLength - direction.y * 2;
    antennaPoints.push(new THREE.Vector3(endX, endY, endZ));
    
    const antennaGeometry = new THREE.BufferGeometry().setFromPoints(antennaPoints);
    const antennaMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const antennaLine = new THREE.Line(antennaGeometry, antennaMaterial);
    antennaGroup.add(antennaLine);
    
    // Antenna base connection point
    const baseGeometry = new THREE.SphereGeometry(0.08, 6, 6);
    const baseEdges = createEdgeGeometry(baseGeometry, 0x00ff00);
    baseEdges.position.set(baseX, baseY, baseZ);
    antennaGroup.add(baseEdges);
    
    // Add segments along the antenna
    for (let i = 1; i <= 4; i++) {
        const t = i / 5; // Position along antenna (0 to 1)
        const segX = baseX + (endX - baseX) * t;
        const segY = baseY + (endY - baseY) * t;
        const segZ = baseZ + (endZ - baseZ) * t;
        
        const segmentGeometry = new THREE.TorusGeometry(0.06 - i * 0.01, 0.015, 4, 8);
        const segmentEdges = createEdgeGeometry(segmentGeometry, 0x00ff00);
        segmentEdges.position.set(segX, segY, segZ);
        segmentEdges.lookAt(endX, endY, endZ);
        antennaGroup.add(segmentEdges);
    }
    
    // Antenna tip
    const tipGeometry = new THREE.SphereGeometry(0.04, 4, 4);
    const tipEdges = createEdgeGeometry(tipGeometry, 0x00ff00);
    tipEdges.position.set(endX, endY, endZ);
    antennaGroup.add(tipEdges);
    
    sputnik.add(antennaGroup);
});

// Polar transmitters (top and bottom)
const transmitterGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.4);
const transmitter1 = createEdgeGeometry(transmitterGeometry, 0xffff00);
transmitter1.position.set(0, 2.55, 0);
sputnik.add(transmitter1);

const transmitter2 = createEdgeGeometry(transmitterGeometry, 0xffff00);
transmitter2.position.set(0, -2.55, 0);
sputnik.add(transmitter2);

// Challenge ring removed - challenges now sit directly on sphere surface

// Add the Sputnik to the scene
scene.add(sputnik);

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
        document.getElementById('info').innerHTML = `SPUTNIK CTF - ${challenge.title} (${challenge.points} pts)`;
    } else {
        document.getElementById('info').innerHTML = 'SPUTNIK CTF - CHALLENGE SATELLITE';
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
            // Show challenge details
            const status = challenge.isSolved ? 'SOLVED ✓' : 'UNSOLVED';
            const message = `
═══════════════════════════════════════
CHALLENGE: ${challenge.title}
POINTS: ${challenge.points}
STATUS: ${status}
CATEGORY: SPACE COMMUNICATIONS

${challenge.isSolved ? 'You have already solved this challenge!' : 'Click to attempt this challenge...'}
═══════════════════════════════════════`;
            alert(message);
        } else {
            alert('⚠️ CHALLENGE LOCKED ⚠️\n\nSolve prerequisite challenges first!');
        }
    }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onClick, false);

// Signal rings removed for cleaner view

// Stars background
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.6
});

const starsVertices = [];
for (let i = 0; i < 800; i++) {
    const x = (Math.random() - 0.5) * 150;
    const y = (Math.random() - 0.5) * 150;
    const z = (Math.random() - 0.5) * 150;
    starsVertices.push(x, y, z);
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Animation variables

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate Sputnik slowly
    sputnik.rotation.y += 0.002;
    
    // Subtle floating animation
    sputnik.position.y = Math.sin(Date.now() * 0.001) * 0.2;
    
    // Antenna vibration
    sputnik.children.forEach((child, index) => {
        if (child instanceof THREE.Group) {
            child.rotation.z = Math.sin(Date.now() * 0.001 + index) * 0.01;
        }
    });
    
    // Signal pulse effect removed
    
    // Labels are fixed to sphere geometry - removed camera tracking
    
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