/**
 * Standalone Three.js Animation
 * A complete 3D scene with animated objects
 * No external dependencies except Three.js CDN
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/controls/OrbitControls.js';

class ThreeJSAnimation {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animatedObjects = [];
        this.clock = new THREE.Clock();
        
        this.init();
        this.createLights();
        this.createObjects();
        this.animate();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 5, 10);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 50;

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);

        // Add stats overlay
        this.addInfoOverlay();
    }

    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point lights (colored)
        const pointLight1 = new THREE.PointLight(0xff0040, 1, 20);
        pointLight1.position.set(-5, 5, -5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x0040ff, 1, 20);
        pointLight2.position.set(5, 5, 5);
        this.scene.add(pointLight2);

        // Hemisphere light
        const hemisphereLight = new THREE.HemisphereLight(0x4080ff, 0x404040, 0.5);
        this.scene.add(hemisphereLight);

        // Add light helpers (optional)
        // this.scene.add(new THREE.DirectionalLightHelper(directionalLight, 2));
    }

    createObjects() {
        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2c3e50,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Grid helper
        const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222);
        this.scene.add(gridHelper);

        // Animated cube
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff6b6b,
            roughness: 0.5,
            metalness: 0.5
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-3, 2, 0);
        cube.castShadow = true;
        this.scene.add(cube);
        this.animatedObjects.push({
            mesh: cube,
            type: 'rotate',
            speed: { x: 0.01, y: 0.02, z: 0.01 }
        });

        // Animated sphere
        const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4ecdc4,
            roughness: 0.3,
            metalness: 0.7
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 2, 0);
        sphere.castShadow = true;
        this.scene.add(sphere);
        this.animatedObjects.push({
            mesh: sphere,
            type: 'bounce',
            speed: 2,
            amplitude: 2
        });

        // Animated torus
        const torusGeometry = new THREE.TorusGeometry(0.8, 0.3, 16, 100);
        const torusMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffe66d,
            roughness: 0.4,
            metalness: 0.6
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.set(3, 2, 0);
        torus.castShadow = true;
        this.scene.add(torus);
        this.animatedObjects.push({
            mesh: torus,
            type: 'rotate',
            speed: { x: 0.02, y: 0.01, z: 0.03 }
        });

        // Animated cone
        const coneGeometry = new THREE.ConeGeometry(0.6, 1.5, 32);
        const coneMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xa8e6cf,
            roughness: 0.5,
            metalness: 0.4
        });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.set(-6, 1, -3);
        cone.castShadow = true;
        this.scene.add(cone);
        this.animatedObjects.push({
            mesh: cone,
            type: 'orbit',
            speed: 1,
            radius: 4,
            center: new THREE.Vector3(0, 2, 0)
        });

        // Animated cylinder
        const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
        const cylinderMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff6b9d,
            roughness: 0.6,
            metalness: 0.3
        });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.set(6, 1, 3);
        cylinder.castShadow = true;
        this.scene.add(cylinder);
        this.animatedObjects.push({
            mesh: cylinder,
            type: 'scale',
            speed: 2,
            minScale: 0.5,
            maxScale: 1.5
        });

        // Particles system
        this.createParticles();
    }

    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 30;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(particles);

        this.animatedObjects.push({
            mesh: particles,
            type: 'particles',
            speed: 0.5
        });
    }

    updateAnimations() {
        const time = this.clock.getElapsedTime();

        this.animatedObjects.forEach(obj => {
            switch (obj.type) {
                case 'rotate':
                    obj.mesh.rotation.x += obj.speed.x;
                    obj.mesh.rotation.y += obj.speed.y;
                    obj.mesh.rotation.z += obj.speed.z;
                    break;

                case 'bounce':
                    obj.mesh.position.y = obj.amplitude + Math.abs(Math.sin(time * obj.speed)) * obj.amplitude;
                    break;

                case 'orbit':
                    const angle = time * obj.speed;
                    obj.mesh.position.x = obj.center.x + Math.cos(angle) * obj.radius;
                    obj.mesh.position.z = obj.center.z + Math.sin(angle) * obj.radius;
                    obj.mesh.rotation.y = angle;
                    break;

                case 'scale':
                    const scale = obj.minScale + (Math.sin(time * obj.speed) + 1) / 2 * (obj.maxScale - obj.minScale);
                    obj.mesh.scale.set(scale, scale, scale);
                    break;

                case 'particles':
                    obj.mesh.rotation.y = time * 0.05;
                    break;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.updateAnimations();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    addInfoOverlay() {
        const info = document.createElement('div');
        info.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            color: white;
            background: rgba(0, 0, 0, 0.7);
            padding: 15px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
            z-index: 100;
        `;
        info.innerHTML = `
            <h3 style="margin: 0 0 10px 0;">Three.js Animation Demo</h3>
            <p style="margin: 5px 0;">🎨 5 Animated objects</p>
            <p style="margin: 5px 0;">✨ 1000 particle system</p>
            <p style="margin: 5px 0;">💡 Multiple light sources</p>
            <p style="margin: 5px 0;">🖱️ Orbit controls enabled</p>
            <hr style="border: 1px solid rgba(255,255,255,0.2); margin: 10px 0;">
            <small>Drag to rotate • Scroll to zoom • Right-drag to pan</small>
        `;
        document.body.appendChild(info);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Set body styles
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    
    // Create animation
    new ThreeJSAnimation();
    
    console.log('Three.js animation initialized successfully!');
});

// Export for module usage
export default ThreeJSAnimation;
