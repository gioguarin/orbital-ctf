// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Camera position
camera.position.set(5, 3, 5);
camera.lookAt(0, 0, 0);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 20;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
scene.add(directionalLight);

// Add a spotlight for dramatic effect
const spotLight = new THREE.SpotLight(0xff0000, 0.5);
spotLight.position.set(-5, 10, 0);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.5;
scene.add(spotLight);

// Grid removed - no floor needed

// Load the TIE Fighter model
let tieFighter = null;
let mixer = null;
let wireframeMode = false;

const loader = new THREE.GLTFLoader();
loader.load(
    'low_poly_tie_fighter.glb',
    function (gltf) {
        // Success callback
        tieFighter = gltf.scene;
        
        // Scale and position the model
        tieFighter.scale.set(1, 1, 1); // Adjust scale if needed
        tieFighter.position.set(0, 0, 0);
        
        // Enable shadows for the model
        tieFighter.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Store original material for wireframe toggle
                child.userData.originalMaterial = child.material.clone();
            }
        });
        
        scene.add(tieFighter);
        
        // Check for animations
        if (gltf.animations && gltf.animations.length) {
            mixer = new THREE.AnimationMixer(tieFighter);
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        }
        
        // Hide loading message and update status
        document.getElementById('loading').style.display = 'none';
        document.getElementById('status').textContent = 'Operational';
        document.getElementById('status').style.color = '#00ff00';
        
        console.log('TIE Fighter loaded successfully!');
    },
    function (xhr) {
        // Progress callback
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        document.getElementById('loading').textContent = `Loading TIE Fighter... ${Math.round(percentComplete)}%`;
    },
    function (error) {
        // Error callback
        console.error('Error loading TIE Fighter:', error);
        document.getElementById('loading').textContent = 'Error loading model!';
        document.getElementById('loading').style.color = '#ff0000';
        document.getElementById('status').textContent = 'Error';
        document.getElementById('status').style.color = '#ff0000';
    }
);

// Create a starfield background
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    transparent: true,
    opacity: 0.8
});

const starsVertices = [];
for (let i = 0; i < 2000; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    starsVertices.push(x, y, z);
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Laser effects removed

// Keyboard controls
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        // Toggle wireframe mode using proper Three.js methods
        wireframeMode = !wireframeMode;
        if (tieFighter) {
            tieFighter.traverse((child) => {
                if (child.isMesh) {
                    if (wireframeMode) {
                        // Method 1: Using wireframe property on material
                        child.material = new THREE.MeshBasicMaterial({
                            color: 0x00ff00,
                            wireframe: true
                        });
                        
                        // Alternative Method 2: Using EdgesGeometry for hard edges only
                        // const edges = new THREE.EdgesGeometry(child.geometry);
                        // const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
                        // const wireframe = new THREE.LineSegments(edges, lineMaterial);
                        // child.add(wireframe);
                    } else {
                        child.material = child.userData.originalMaterial;
                    }
                }
            });
        }
    } else if (event.code === 'KeyR') {
        // Reset camera position
        camera.position.set(5, 3, 5);
        camera.lookAt(0, 0, 0);
        controls.update();
    } else if (event.code === 'KeyA') {
        // Toggle auto-rotate
        controls.autoRotate = !controls.autoRotate;
    }
});

// Animation variables
let clock = new THREE.Clock();

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    
    // Update animations if they exist
    if (mixer) {
        mixer.update(delta);
    }
    
    // Animate the TIE Fighter if loaded
    if (tieFighter) {
        // Subtle hovering effect
        tieFighter.position.y = Math.sin(elapsedTime * 2) * 0.1;
        
        // Slight rotation when not auto-rotating
        if (!controls.autoRotate) {
            tieFighter.rotation.y += delta * 0.1;
        }
    }
    
    // Laser animation removed
    
    // Rotate starfield slowly
    stars.rotation.y += delta * 0.01;
    
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