// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Camera position
camera.position.set(8, 5, 10);
camera.lookAt(0, 0, 0);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 50;

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

// Helper function to create antenna
function createAntenna(length, basePosition, direction, color = 0x00ff00) {
    const antennaGroup = new THREE.Group();
    
    // Main antenna rod (thin cylinder)
    const rodGeometry = new THREE.CylinderGeometry(0.02, 0.02, length, 4);
    const rodEdges = createEdgeGeometry(rodGeometry, color);
    
    // Position and orient the antenna
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    rodEdges.quaternion.copy(quaternion);
    rodEdges.position.copy(basePosition).add(direction.normalize().multiplyScalar(length / 2));
    
    antennaGroup.add(rodEdges);
    
    // Add segments/rings along the antenna for detail
    const numSegments = 4;
    for (let i = 1; i <= numSegments; i++) {
        const segmentPos = basePosition.clone().add(direction.normalize().multiplyScalar((length * i) / (numSegments + 1)));
        const segmentGeometry = new THREE.TorusGeometry(0.05, 0.01, 4, 8);
        const segmentEdges = createEdgeGeometry(segmentGeometry, color);
        segmentEdges.position.copy(segmentPos);
        segmentEdges.lookAt(segmentPos.clone().add(direction));
        antennaGroup.add(segmentEdges);
    }
    
    // Antenna tip
    const tipPos = basePosition.clone().add(direction.normalize().multiplyScalar(length));
    const tipGeometry = new THREE.SphereGeometry(0.04, 4, 4);
    const tipEdges = createEdgeGeometry(tipGeometry, color);
    tipEdges.position.copy(tipPos);
    antennaGroup.add(tipEdges);
    
    return antennaGroup;
}

// Create Sputnik group
const sputnik = new THREE.Group();

// Main spherical body (using multiple sphere layers for detail)
// Outer sphere
const mainSphereGeometry = new THREE.SphereGeometry(2, 16, 12);
const mainSphereEdges = createEdgeGeometry(mainSphereGeometry, 0x4a90e2);
sputnik.add(mainSphereEdges);

// Inner detail sphere (slightly smaller)
const innerSphereGeometry = new THREE.SphereGeometry(1.9, 12, 8);
const innerSphereEdges = createEdgeGeometry(innerSphereGeometry, 0x6b6b6b);
sputnik.add(innerSphereEdges);

// Equatorial band (torus around the middle)
const bandGeometry = new THREE.TorusGeometry(2.1, 0.05, 4, 24);
const bandEdges = createEdgeGeometry(bandGeometry, 0xffffff);
sputnik.add(bandEdges);

// Polar bands (smaller torus at top and bottom)
const polarBand1 = new THREE.TorusGeometry(0.8, 0.03, 4, 16);
const polarBand1Edges = createEdgeGeometry(polarBand1, 0xffffff);
polarBand1Edges.position.y = 1.8;
polarBand1Edges.rotation.x = Math.PI / 2;
sputnik.add(polarBand1Edges);

const polarBand2Edges = createEdgeGeometry(polarBand1, 0xffffff);
polarBand2Edges.position.y = -1.8;
polarBand2Edges.rotation.x = Math.PI / 2;
sputnik.add(polarBand2Edges);

// Surface detail panels (representing the polished segments)
const numPanels = 8;
for (let i = 0; i < numPanels; i++) {
    const angle = (i / numPanels) * Math.PI * 2;
    const panelGeometry = new THREE.PlaneGeometry(0.5, 1.5);
    const panelEdges = createEdgeGeometry(panelGeometry, 0x6b6b6b);
    panelEdges.position.x = Math.cos(angle) * 1.95;
    panelEdges.position.z = Math.sin(angle) * 1.95;
    panelEdges.rotation.y = angle;
    sputnik.add(panelEdges);
}

// Four iconic antennas
const antennaLength = 8;
const antennaPositions = [
    { base: new THREE.Vector3(1.4, 1.4, 0), direction: new THREE.Vector3(1, 1, 0) },
    { base: new THREE.Vector3(-1.4, 1.4, 0), direction: new THREE.Vector3(-1, 1, 0) },
    { base: new THREE.Vector3(0, 1.4, 1.4), direction: new THREE.Vector3(0, 1, 1) },
    { base: new THREE.Vector3(0, 1.4, -1.4), direction: new THREE.Vector3(0, 1, -1) }
];

antennaPositions.forEach((config, index) => {
    const antenna = createAntenna(antennaLength, config.base, config.direction, 0x00ff00);
    sputnik.add(antenna);
});

// Add transmitter details (small boxes/components on the sphere)
const transmitterGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.3);
const transmitter1 = createEdgeGeometry(transmitterGeometry, 0xffff00);
transmitter1.position.set(0, 2.05, 0);
sputnik.add(transmitter1);

const transmitter2 = createEdgeGeometry(transmitterGeometry, 0xffff00);
transmitter2.position.set(0, -2.05, 0);
sputnik.add(transmitter2);

// Add small detail antennas/sensors
const sensorGeometry = new THREE.ConeGeometry(0.1, 0.3, 4);
for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const sensor = createEdgeGeometry(sensorGeometry, 0xff00ff);
    sensor.position.x = Math.cos(angle) * 2.1;
    sensor.position.z = Math.sin(angle) * 2.1;
    sensor.rotation.z = -Math.PI / 2;
    sensor.rotation.y = angle;
    sputnik.add(sensor);
}

// Add the Sputnik to the scene
scene.add(sputnik);

// Create orbital trail
const trailPoints = [];
const trailRadius = 15;
for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    trailPoints.push(new THREE.Vector3(
        Math.cos(angle) * trailRadius,
        Math.sin(angle) * 3, // Elliptical orbit
        Math.sin(angle) * trailRadius
    ));
}
const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
const trailMaterial = new THREE.LineDashedMaterial({
    color: 0x4a90e2,
    dashSize: 0.5,
    gapSize: 0.3,
    opacity: 0.5,
    transparent: true
});
const trail = new THREE.Line(trailGeometry, trailMaterial);
trail.computeLineDistances();
scene.add(trail);

// Earth reference (small wireframe sphere)
const earthGeometry = new THREE.SphereGeometry(3, 12, 8);
const earthMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x0066cc, 
    wireframe: true,
    opacity: 0.3,
    transparent: true
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(-10, -5, -10);
scene.add(earth);

// Stars background
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
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

// Animation variables
let orbitAngle = 0;
let signalPulse = 0;

// Create pulsing signal effect (simulating radio transmission)
const signalGeometry = new THREE.RingGeometry(0, 3, 32);
const signalMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide
});
const signal = new THREE.Mesh(signalGeometry, signalMaterial);
sputnik.add(signal);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate Sputnik
    sputnik.rotation.y += 0.003;
    sputnik.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
    
    // Orbit animation
    orbitAngle += 0.002;
    sputnik.position.x = Math.cos(orbitAngle) * 5;
    sputnik.position.z = Math.sin(orbitAngle) * 5;
    sputnik.position.y = Math.sin(orbitAngle) * 1;
    
    // Antenna vibration (subtle movement)
    sputnik.children.forEach((child, index) => {
        if (child instanceof THREE.Group) { // Antennas are groups
            child.rotation.z = Math.sin(Date.now() * 0.001 + index) * 0.02;
        }
    });
    
    // Radio signal pulse effect
    signalPulse += 0.0;
    if (signalPulse > 3) {
        signalPulse = 0;
    }
    signal.scale.set(signalPulse, signalPulse, 1);
    signal.material.opacity = Math.max(0, 1 - signalPulse / 3) * 0.5;
    
    // Rotate Earth
    earth.rotation.y += 0.001;
    
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mouse interaction for info display
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([mainSphereEdges]);
    
    if (intersects.length > 0) {
        document.getElementById('info').innerHTML = 'SPUTNIK 1 - First Artificial Satellite (1957)';
    } else {
        document.getElementById('info').innerHTML = 'SPUTNIK WIREFRAME MODEL';
    }
}

window.addEventListener('mousemove', onMouseMove, false);

// Start animation
animate();