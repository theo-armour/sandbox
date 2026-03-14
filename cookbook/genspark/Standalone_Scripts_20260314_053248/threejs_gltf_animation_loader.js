/**
 * Three.js glTF Loader with Animations
 * Standalone script to load and play glTF models with embedded animations
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/DRACOLoader.js';

class GLTFAnimationPlayer {
    constructor(config = {}) {
        this.config = {
            modelURL: config.modelURL || 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/RobotExpressive/glTF/RobotExpressive.gltf',
            containerElement: config.containerElement || document.body,
            autoRotate: config.autoRotate !== undefined ? config.autoRotate : false,
            backgroundColor: config.backgroundColor || 0x263238,
            ...config
        };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.model = null;
        this.animations = [];
        this.activeActions = [];

        this.init();
        this.setupLighting();
        this.loadModel();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.config.backgroundColor);
        this.scene.fog = new THREE.Fog(this.config.backgroundColor, 20, 100);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 10);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.config.containerElement.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.autoRotate = this.config.autoRotate;
        this.controls.autoRotateSpeed = 2.0;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI / 2;

        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize(), false);

        // Create UI
        this.createUI();

        // Start animation loop
        this.animate();
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Main directional light (key light)
        const keyLight = new THREE.DirectionalLight(0xffffff, 1);
        keyLight.position.set(5, 10, 7);
        keyLight.castShadow = true;
        keyLight.shadow.camera.left = -10;
        keyLight.shadow.camera.right = 10;
        keyLight.shadow.camera.top = 10;
        keyLight.shadow.camera.bottom = -10;
        keyLight.shadow.camera.near = 0.1;
        keyLight.shadow.camera.far = 50;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.bias = -0.001;
        this.scene.add(keyLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 5, -5);
        this.scene.add(fillLight);

        // Back light (rim light)
        const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
        backLight.position.set(0, 5, -10);
        this.scene.add(backLight);

        // Hemisphere light for better ambient
        const hemiLight = new THREE.HemisphereLight(0x8dc1de, 0x4a4a4a, 0.5);
        this.scene.add(hemiLight);

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Grid helper
        const gridHelper = new THREE.GridHelper(50, 50, 0x888888, 0x444444);
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
    }

    loadModel() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');

        // Setup loaders
        const loader = new GLTFLoader();
        
        // Optional: Setup Draco decoder for compressed models
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        loader.setDRACOLoader(dracoLoader);

        // Load the model
        loader.load(
            this.config.modelURL,
            (gltf) => this.onModelLoaded(gltf),
            (progress) => {
                const percentComplete = (progress.loaded / progress.total) * 100;
                progressBar.style.width = percentComplete + '%';
                progressText.textContent = `${Math.round(percentComplete)}%`;
                console.log(`Loading: ${percentComplete.toFixed(2)}%`);
            },
            (error) => {
                console.error('Error loading model:', error);
                loadingOverlay.innerHTML = `
                    <div style="color: #ff4444; background: rgba(0,0,0,0.8); padding: 20px; border-radius: 10px;">
                        <h3>Error Loading Model</h3>
                        <p>${error.message}</p>
                        <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 10px;">Retry</button>
                    </div>
                `;
            }
        );
    }

    onModelLoaded(gltf) {
        console.log('Model loaded successfully!');
        console.log('Animations available:', gltf.animations.length);
        
        this.model = gltf.scene;
        this.animations = gltf.animations;

        // Enable shadows
        this.model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Improve material rendering
                if (child.material) {
                    child.material.envMapIntensity = 1.0;
                }
            }
        });

        // Center and scale model
        this.centerAndScaleModel();

        // Add to scene
        this.scene.add(this.model);

        // Setup animations
        if (this.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.model);
            this.setupAnimationControls();
            
            // Play first animation by default
            this.playAnimation(0);
        }

        // Hide loading overlay
        document.getElementById('loadingOverlay').style.display = 'none';

        // Update camera to look at model
        this.controls.target.set(0, 1, 0);
        this.camera.position.set(3, 2, 5);
        this.controls.update();
    }

    centerAndScaleModel() {
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center the model
        this.model.position.sub(center);
        this.model.position.y = size.y / 2;

        // Scale to reasonable size (fit in 4 unit height)
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;
        this.model.scale.setScalar(scale);

        console.log('Model scaled to:', scale);
        console.log('Model size:', size);
    }

    setupAnimationControls() {
        const animationList = document.getElementById('animationList');
        
        this.animations.forEach((clip, index) => {
            const button = document.createElement('button');
            button.className = 'animation-button';
            button.textContent = clip.name || `Animation ${index + 1}`;
            button.onclick = () => this.playAnimation(index);
            animationList.appendChild(button);
        });

        document.getElementById('animationControls').style.display = 'block';
    }

    playAnimation(index) {
        if (!this.mixer || index >= this.animations.length) return;

        // Stop all current actions
        this.activeActions.forEach(action => {
            action.fadeOut(0.5);
        });
        this.activeActions = [];

        // Play new animation
        const clip = this.animations[index];
        const action = this.mixer.clipAction(clip);
        action.reset();
        action.fadeIn(0.5);
        action.play();
        
        this.activeActions.push(action);

        console.log(`Playing animation: ${clip.name || index}`);
        
        // Update UI
        document.querySelectorAll('.animation-button').forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });
    }

    pauseAnimations() {
        this.activeActions.forEach(action => action.paused = true);
    }

    resumeAnimations() {
        this.activeActions.forEach(action => action.paused = false);
    }

    stopAnimations() {
        this.activeActions.forEach(action => {
            action.stop();
        });
        this.activeActions = [];
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();

        // Update animations
        if (this.mixer) {
            this.mixer.update(delta);
        }

        // Update controls
        this.controls.update();

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    createUI() {
        // Styles
        const style = document.createElement('style');
        style.textContent = `
            body { margin: 0; overflow: hidden; font-family: Arial, sans-serif; }
            
            #loadingOverlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                flex-direction: column;
            }
            
            #progressContainer {
                width: 300px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                overflow: hidden;
                margin-top: 20px;
            }
            
            #progressBar {
                height: 30px;
                background: linear-gradient(90deg, #667eea, #764ba2);
                width: 0%;
                transition: width 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            #progressText {
                color: white;
                font-weight: bold;
            }
            
            #info {
                position: absolute;
                top: 20px;
                left: 20px;
                color: white;
                background: rgba(0, 0, 0, 0.7);
                padding: 15px;
                border-radius: 8px;
                max-width: 300px;
                z-index: 100;
            }
            
            #animationControls {
                position: absolute;
                bottom: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.7);
                padding: 15px;
                border-radius: 8px;
                display: none;
                z-index: 100;
            }
            
            .animation-button {
                display: block;
                width: 100%;
                padding: 10px;
                margin: 5px 0;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .animation-button:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateX(5px);
            }
            
            .animation-button.active {
                background: #667eea;
                border-color: #667eea;
            }
            
            h3 { margin: 0 0 10px 0; color: #fff; }
            p { margin: 5px 0; font-size: 14px; }
        `;
        document.head.appendChild(style);

        // Loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.innerHTML = `
            <h2 style="color: white; margin-bottom: 10px;">Loading glTF Model...</h2>
            <div id="progressContainer">
                <div id="progressBar">
                    <span id="progressText">0%</span>
                </div>
            </div>
        `;
        document.body.appendChild(loadingOverlay);

        // Info panel
        const info = document.createElement('div');
        info.id = 'info';
        info.innerHTML = `
            <h3>🎬 glTF Animation Player</h3>
            <p>🖱️ Drag: Rotate</p>
            <p>🖱️ Scroll: Zoom</p>
            <p>🖱️ Right-drag: Pan</p>
            <p>📦 Model: ${this.config.modelURL.split('/').pop()}</p>
        `;
        document.body.appendChild(info);

        // Animation controls
        const animationControls = document.createElement('div');
        animationControls.id = 'animationControls';
        animationControls.innerHTML = `
            <h3>🎭 Animations</h3>
            <div id="animationList"></div>
        `;
        document.body.appendChild(animationControls);
    }

    // Public API
    setModelURL(url) {
        this.config.modelURL = url;
        this.loadModel();
    }

    toggleAutoRotate() {
        this.controls.autoRotate = !this.controls.autoRotate;
    }

    dispose() {
        this.renderer.dispose();
        this.scene.clear();
        if (this.mixer) this.mixer.stopAllAction();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Example: Create player with default model
    const player = new GLTFAnimationPlayer({
        modelURL: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/RobotExpressive/glTF/RobotExpressive.gltf',
        autoRotate: false
    });

    // Make player available globally for debugging
    window.gltfPlayer = player;

    console.log('glTF Animation Player initialized!');
    console.log('Access player via: window.gltfPlayer');
});

// Export for module usage
export default GLTFAnimationPlayer;
