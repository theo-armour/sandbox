import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ClimbingGym() {
  const containerRef = useRef(null);
  const [info, setInfo] = useState('Click and drag to look around • Scroll to zoom • Arrow keys/WASD to move');
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f1a);
    scene.fog = new THREE.Fog(0x0f0f1a, 25, 60);
    
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 12);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 15, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -20;
    mainLight.shadow.camera.right = 20;
    mainLight.shadow.camera.top = 20;
    mainLight.shadow.camera.bottom = -20;
    scene.add(mainLight);
    
    // Colored spotlights
    const spotlights = [
      { color: 0xff6b6b, pos: [-8, 10, -5], target: [-10, 5, -12] },
      { color: 0x4ecdc4, pos: [8, 10, -5], target: [10, 5, -12] },
      { color: 0xffe66d, pos: [0, 12, -10], target: [0, 5, -15] },
      { color: 0x9b59b6, pos: [-12, 8, 5], target: [-15, 4, 0] },
      { color: 0x3498db, pos: [12, 8, 5], target: [15, 4, 0] },
    ];
    
    spotlights.forEach(({ color, pos, target }) => {
      const spotlight = new THREE.SpotLight(color, 1.5, 35, Math.PI / 5);
      spotlight.position.set(...pos);
      spotlight.target.position.set(...target);
      spotlight.castShadow = true;
      scene.add(spotlight);
      scene.add(spotlight.target);
    });
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.9 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(50, 50);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0x0a0a12 });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMaterial);
    ceiling.position.set(0, 14, 0);
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);
    
    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x252535, roughness: 0.9 });
    
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 14), wallMaterial);
    backWall.position.set(0, 7, -18);
    backWall.receiveShadow = true;
    scene.add(backWall);
    
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(36, 14), wallMaterial);
    leftWall.position.set(-25, 7, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);
    
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(36, 14), wallMaterial);
    rightWall.position.set(25, 7, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);
    
    // Hold colors
    const holdColors = {
      green: 0x2ecc71, blue: 0x3498db, yellow: 0xf1c40f,
      red: 0xe74c3c, pink: 0xe91e63, white: 0xecf0f1,
      orange: 0xe67e22, purple: 0x9b59b6,
    };
    
    const allHolds = [];
    
    const createHold = (type, x, y, z, color, scale = 1) => {
      let geometry;
      switch(type) {
        case 'jug': geometry = new THREE.SphereGeometry(0.15 * scale, 8, 6); break;
        case 'crimp': geometry = new THREE.BoxGeometry(0.28 * scale, 0.07 * scale, 0.12 * scale); break;
        case 'sloper': geometry = new THREE.SphereGeometry(0.22 * scale, 8, 4); break;
        case 'pinch': geometry = new THREE.CylinderGeometry(0.05 * scale, 0.07 * scale, 0.22 * scale, 6); break;
        default: geometry = new THREE.DodecahedronGeometry(0.12 * scale);
      }
      
      const material = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
      const hold = new THREE.Mesh(geometry, material);
      hold.position.set(x, y, z);
      hold.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5);
      hold.castShadow = true;
      allHolds.push(hold);
      return hold;
    };
    
    const createWallPanel = (width, height, x, y, z, rotationX = 0, rotationY = 0, color = 0x4a4a5a) => {
      const geo = new THREE.BoxGeometry(width, height, 0.4);
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.95 });
      const panel = new THREE.Mesh(geo, mat);
      panel.position.set(x, y, z);
      panel.rotation.x = rotationX;
      panel.rotation.y = rotationY;
      panel.castShadow = true;
      panel.receiveShadow = true;
      scene.add(panel);
      return panel;
    };
    
    const createMat = (width, depth, x, z, color = 0x2196f3) => {
      const geo = new THREE.BoxGeometry(width, 0.35, depth);
      const mat = new THREE.MeshStandardMaterial({ color });
      const crashMat = new THREE.Mesh(geo, mat);
      crashMat.position.set(x, 0.175, z);
      crashMat.receiveShadow = true;
      scene.add(crashMat);
    };
    
    // Main Wall
    createWallPanel(14, 12, 0, 6, -15);
    createWallPanel(14, 3, 0, 11, -13.5, -Math.PI / 5);
    createMat(15, 5, 0, -12);
    
    // Store hold positions for climbing animation
    const mainWallHolds = [];
    const holdTypes = ['jug', 'crimp', 'sloper', 'pinch', 'default'];
    
    const mainWallRoutes = [
      { color: holdColors.green, xOffset: -5, grade: 'V0' },
      { color: holdColors.blue, xOffset: -2, grade: 'V3' },
      { color: holdColors.yellow, xOffset: 1, grade: 'V5' },
      { color: holdColors.red, xOffset: 4, grade: 'V7' },
    ];
    
    mainWallRoutes.forEach((route, routeIdx) => {
      const routeHolds = [];
      for (let i = 0; i < 10; i++) {
        const x = route.xOffset + (Math.random() - 0.5) * 1.5;
        const y = 0.8 + i * 1.1 + (Math.random() - 0.5) * 0.3;
        const z = -14.75;
        const type = holdTypes[Math.floor(Math.random() * holdTypes.length)];
        const hold = createHold(type, x, y, z, route.color, 0.8 + Math.random() * 0.5);
        scene.add(hold);
        routeHolds.push({ x, y, z: z + 0.3 });
      }
      if (routeIdx === 1) mainWallHolds.push(...routeHolds); // Blue route for main climber
    });
    
    // Overhang holds
    for (let i = 0; i < 8; i++) {
      scene.add(createHold('jug', -3 + i * 0.9, 10.5 + Math.random() * 0.8, -13 - Math.random() * 0.5, holdColors.purple, 1.2));
    }
    
    // Slab Wall (Left)
    createWallPanel(10, 11, -18, 5.5, -8, Math.PI / 15, Math.PI / 2, 0x3d3d4d);
    createMat(5, 12, -15, -8, 0x4caf50);
    
    const slabHolds = [];
    for (let i = 0; i < 8; i++) {
      const x = -17.3;
      const y = 1 + i * 1.3;
      const z = -10 + (Math.random() - 0.5) * 6;
      const color = i % 2 === 0 ? holdColors.orange : holdColors.green;
      scene.add(createHold('sloper', x, y, z, color, 0.9));
      slabHolds.push({ x: x + 0.3, y, z });
    }
    
    // Cave Wall (Right)
    createWallPanel(10, 8, 18, 4, -8, -Math.PI / 4, -Math.PI / 2, 0x3a3a4a);
    createWallPanel(10, 4, 16, 9, -6, -Math.PI / 2.2, -Math.PI / 2, 0x3a3a4a);
    createMat(6, 10, 15, -6, 0xf44336);
    
    const caveHolds = [];
    for (let i = 0; i < 12; i++) {
      const x = 17 + Math.random() * 0.5;
      const y = 1.5 + i * 0.7;
      const z = -10 + (Math.random() - 0.5) * 6;
      const color = i < 6 ? holdColors.pink : holdColors.red;
      scene.add(createHold('jug', x, y, z, color, 1.1 + Math.random() * 0.3));
      caveHolds.push({ x: x - 0.3, y, z });
    }
    
    // Roof holds
    for (let i = 0; i < 6; i++) {
      scene.add(createHold('jug', 15.5 + Math.random() * 0.5, 8 + Math.random() * 1.5, -8 + i * 1.2, holdColors.white, 1.3));
    }
    
    // Volumes
    const volumeMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    const volume1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 1.2), volumeMat);
    volume1.position.set(3, 4, -14.5);
    volume1.rotation.z = Math.PI / 10;
    volume1.castShadow = true;
    scene.add(volume1);
    
    const volume2 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2, 4), volumeMat);
    volume2.position.set(-3, 3, -14.3);
    volume2.rotation.x = Math.PI / 2;
    volume2.rotation.z = Math.PI / 4;
    volume2.castShadow = true;
    scene.add(volume2);
    
    for (let i = 0; i < 4; i++) {
      scene.add(createHold('jug', 2.5 + i * 0.6, 3.5 + i * 0.5, -14, holdColors.yellow, 1));
      scene.add(createHold('crimp', -3.5 + i * 0.4, 2.5 + i * 0.4, -13.8, holdColors.blue, 0.9));
    }
    
    // ===== ANIMATED CLIMBER CLASS =====
    class AnimatedClimber {
      constructor(startPos, holdSequence, wallNormal, color = 0x2980b9) {
        this.group = new THREE.Group();
        this.holdSequence = holdSequence;
        this.currentHoldIndex = 0;
        this.wallNormal = wallNormal;
        this.animationPhase = 0;
        this.phaseTime = 0;
        this.cycleSpeed = 0.4;
        
        // Materials
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a574 });
        const shirtMat = new THREE.MeshStandardMaterial({ color });
        const pantsMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0xff5722 });
        const hairMat = new THREE.MeshStandardMaterial({ color: 0x3d2314 });
        
        // Body parts with pivot points for animation
        // Torso (center of body)
        this.torso = new THREE.Group();
        const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.15, 0.5, 8), shirtMat);
        torsoMesh.castShadow = true;
        this.torso.add(torsoMesh);
        this.group.add(this.torso);
        
        // Head
        this.head = new THREE.Group();
        const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), skinMat);
        headMesh.castShadow = true;
        this.head.add(headMesh);
        const hairMesh = new THREE.Mesh(new THREE.SphereGeometry(0.21, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
        hairMesh.position.y = 0.03;
        this.head.add(hairMesh);
        this.head.position.y = 0.45;
        this.torso.add(this.head);
        
        // Hips
        this.hips = new THREE.Group();
        const hipsMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.18, 8), pantsMat);
        this.hips.add(hipsMesh);
        this.hips.position.y = -0.34;
        this.torso.add(this.hips);
        
        // Chalk bag
        const chalkBag = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.1, 8), new THREE.MeshStandardMaterial({ color: 0xe74c3c }));
        chalkBag.position.set(0.12, -0.25, 0.08);
        this.torso.add(chalkBag);
        
        // Arms
        this.createArm(skinMat, shirtMat, 'right');
        this.createArm(skinMat, shirtMat, 'left');
        
        // Legs
        this.createLeg(skinMat, pantsMat, shoeMat, 'right');
        this.createLeg(skinMat, pantsMat, shoeMat, 'left');
        
        // Initial position
        this.group.position.copy(startPos);
        this.baseY = startPos.y;
        
        // Animation state
        this.targetPos = new THREE.Vector3();
        this.currentPos = startPos.clone();
      }
      
      createArm(skinMat, shirtMat, side) {
        const sign = side === 'right' ? 1 : -1;
        
        // Shoulder pivot
        const shoulder = new THREE.Group();
        shoulder.position.set(sign * 0.2, 0.2, 0);
        this.torso.add(shoulder);
        
        // Upper arm
        const upperArm = new THREE.Group();
        const upperArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.3, 6), shirtMat);
        upperArmMesh.position.y = -0.15;
        upperArmMesh.castShadow = true;
        upperArm.add(upperArmMesh);
        shoulder.add(upperArm);
        
        // Elbow pivot
        const elbow = new THREE.Group();
        elbow.position.y = -0.3;
        upperArm.add(elbow);
        
        // Forearm
        const forearm = new THREE.Group();
        const forearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.25, 6), skinMat);
        forearmMesh.position.y = -0.125;
        forearmMesh.castShadow = true;
        forearm.add(forearmMesh);
        
        // Hand
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 5), skinMat);
        hand.position.y = -0.27;
        forearm.add(hand);
        
        elbow.add(forearm);
        
        if (side === 'right') {
          this.rightShoulder = shoulder;
          this.rightUpperArm = upperArm;
          this.rightElbow = elbow;
          this.rightForearm = forearm;
        } else {
          this.leftShoulder = shoulder;
          this.leftUpperArm = upperArm;
          this.leftElbow = elbow;
          this.leftForearm = forearm;
        }
      }
      
      createLeg(skinMat, pantsMat, shoeMat, side) {
        const sign = side === 'right' ? 1 : -1;
        
        // Hip pivot
        const hip = new THREE.Group();
        hip.position.set(sign * 0.08, -0.09, 0);
        this.hips.add(hip);
        
        // Thigh
        const thigh = new THREE.Group();
        const thighMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.05, 0.35, 6), pantsMat);
        thighMesh.position.y = -0.175;
        thighMesh.castShadow = true;
        thigh.add(thighMesh);
        hip.add(thigh);
        
        // Knee pivot
        const knee = new THREE.Group();
        knee.position.y = -0.35;
        thigh.add(knee);
        
        // Calf
        const calf = new THREE.Group();
        const calfMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.32, 6), pantsMat);
        calfMesh.position.y = -0.16;
        calfMesh.castShadow = true;
        calf.add(calfMesh);
        
        // Foot
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.04, 0.14), shoeMat);
        foot.position.set(0, -0.34, 0.03);
        calf.add(foot);
        
        knee.add(calf);
        
        if (side === 'right') {
          this.rightHip = hip;
          this.rightThigh = thigh;
          this.rightKnee = knee;
          this.rightCalf = calf;
        } else {
          this.leftHip = hip;
          this.leftThigh = thigh;
          this.leftKnee = knee;
          this.leftCalf = calf;
        }
      }
      
      update(deltaTime) {
        this.phaseTime += deltaTime * this.cycleSpeed;
        
        // Full climbing cycle phases:
        // 0: Right hand reaching
        // 1: Right hand grabbing, weight shift
        // 2: Left foot moving up
        // 3: Left hand reaching  
        // 4: Left hand grabbing, weight shift
        // 5: Right foot moving up
        
        const cycleProgress = (this.phaseTime % 6);
        const phase = Math.floor(cycleProgress);
        const phaseProgress = cycleProgress - phase;
        
        // Smooth easing
        const ease = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const eased = ease(phaseProgress);
        
        // Move up the wall gradually
        const climbSpeed = 0.15;
        const verticalProgress = (this.phaseTime * climbSpeed) % (this.holdSequence.length * 1.1);
        this.group.position.y = this.baseY + verticalProgress;
        
        // Reset when reaching top
        if (verticalProgress > this.holdSequence.length * 1.0) {
          this.phaseTime = 0;
          this.group.position.y = this.baseY;
        }
        
        // Body sway
        const sway = Math.sin(this.phaseTime * Math.PI) * 0.08;
        this.torso.rotation.z = sway;
        this.torso.position.x = sway * 0.1;
        
        // Breathing
        const breath = Math.sin(this.phaseTime * 4) * 0.01;
        this.torso.scale.set(1 + breath, 1, 1 + breath * 0.5);
        
        // Head looking at next hold
        this.head.rotation.x = -0.2 + Math.sin(this.phaseTime * 2) * 0.1;
        this.head.rotation.y = Math.sin(this.phaseTime * Math.PI) * 0.3;
        
        // Animate limbs based on phase
        switch(phase) {
          case 0: // Right hand reaching up
            this.rightUpperArm.rotation.z = THREE.MathUtils.lerp(0.3, -0.8, eased);
            this.rightUpperArm.rotation.x = THREE.MathUtils.lerp(0.5, 0.2, eased);
            this.rightElbow.rotation.x = THREE.MathUtils.lerp(-1.2, -0.4, eased);
            this.leftUpperArm.rotation.z = -0.5;
            this.leftUpperArm.rotation.x = 0.6;
            this.leftElbow.rotation.x = -1.4;
            break;
            
          case 1: // Right hand grabbing, body pulling up
            this.rightUpperArm.rotation.z = THREE.MathUtils.lerp(-0.8, -0.5, eased);
            this.rightUpperArm.rotation.x = THREE.MathUtils.lerp(0.2, 0.6, eased);
            this.rightElbow.rotation.x = THREE.MathUtils.lerp(-0.4, -1.3, eased);
            this.torso.position.y = eased * 0.1;
            break;
            
          case 2: // Left foot moving up
            this.leftThigh.rotation.x = THREE.MathUtils.lerp(0.3, -0.8, eased);
            this.leftKnee.rotation.x = THREE.MathUtils.lerp(0.2, 1.2, eased);
            this.rightThigh.rotation.x = 0.2;
            this.rightKnee.rotation.x = 0.4;
            break;
            
          case 3: // Left hand reaching up
            this.leftUpperArm.rotation.z = THREE.MathUtils.lerp(-0.5, 0.8, eased);
            this.leftUpperArm.rotation.x = THREE.MathUtils.lerp(0.6, 0.2, eased);
            this.leftElbow.rotation.x = THREE.MathUtils.lerp(-1.4, -0.4, eased);
            this.rightUpperArm.rotation.z = 0.5;
            this.rightUpperArm.rotation.x = 0.6;
            this.rightElbow.rotation.x = -1.4;
            this.leftThigh.rotation.x = -0.8;
            this.leftKnee.rotation.x = 0.6;
            break;
            
          case 4: // Left hand grabbing, body pulling up
            this.leftUpperArm.rotation.z = THREE.MathUtils.lerp(0.8, 0.5, eased);
            this.leftUpperArm.rotation.x = THREE.MathUtils.lerp(0.2, 0.6, eased);
            this.leftElbow.rotation.x = THREE.MathUtils.lerp(-0.4, -1.3, eased);
            this.torso.position.y = 0.1 + eased * 0.1;
            break;
            
          case 5: // Right foot moving up
            this.rightThigh.rotation.x = THREE.MathUtils.lerp(0.2, -0.8, eased);
            this.rightKnee.rotation.x = THREE.MathUtils.lerp(0.4, 1.2, eased);
            this.leftThigh.rotation.x = 0.3;
            this.leftKnee.rotation.x = 0.3;
            this.torso.position.y = 0.2 - eased * 0.2;
            break;
        }
        
        // Add some hip rotation for realism
        this.hips.rotation.y = Math.sin(this.phaseTime * Math.PI) * 0.15;
        this.hips.rotation.x = 0.1;
      }
    }
    
    // ===== DYNO CLIMBER (dynamic jumping movement) =====
    class DynoClimber {
      constructor(startPos, color = 0xe91e63) {
        this.group = new THREE.Group();
        this.phaseTime = 0;
        this.dynoHeight = 1.5;
        this.baseY = startPos.y;
        
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xc4946a });
        const shirtMat = new THREE.MeshStandardMaterial({ color });
        const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e });
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x00bcd4 });
        
        // Simplified body for dyno
        this.torso = new THREE.Group();
        this.torso.add(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.45, 8), shirtMat));
        this.group.add(this.torso);
        
        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), skinMat);
        head.position.y = 0.4;
        this.torso.add(head);
        
        // Arms (will stretch during dyno)
        this.leftArm = this.createSimpleArm(skinMat, shirtMat, -1);
        this.rightArm = this.createSimpleArm(skinMat, shirtMat, 1);
        this.torso.add(this.leftArm);
        this.torso.add(this.rightArm);
        
        // Legs
        this.leftLeg = this.createSimpleLeg(pantsMat, shoeMat, -1);
        this.rightLeg = this.createSimpleLeg(pantsMat, shoeMat, 1);
        this.torso.add(this.leftLeg);
        this.torso.add(this.rightLeg);
        
        this.group.position.copy(startPos);
      }
      
      createSimpleArm(skinMat, shirtMat, side) {
        const arm = new THREE.Group();
        arm.position.set(side * 0.18, 0.15, 0);
        
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.28, 6), shirtMat);
        upper.position.y = -0.14;
        arm.add(upper);
        
        const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.025, 0.24, 6), skinMat);
        lower.position.y = -0.4;
        arm.add(lower);
        
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 5), skinMat);
        hand.position.y = -0.55;
        arm.add(hand);
        
        return arm;
      }
      
      createSimpleLeg(pantsMat, shoeMat, side) {
        const leg = new THREE.Group();
        leg.position.set(side * 0.07, -0.3, 0);
        
        const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.32, 6), pantsMat);
        upper.position.y = -0.16;
        leg.add(upper);
        
        const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.28, 6), pantsMat);
        lower.position.y = -0.46;
        leg.add(lower);
        
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.035, 0.12), shoeMat);
        foot.position.set(0, -0.62, 0.02);
        leg.add(foot);
        
        return leg;
      }
      
      update(deltaTime) {
        this.phaseTime += deltaTime * 0.3;
        
        const cycle = this.phaseTime % 4; // 4 second cycle
        
        if (cycle < 1.5) {
          // Preparation - crouching
          const crouch = Math.sin(cycle * Math.PI / 1.5) * 0.3;
          this.torso.position.y = -crouch * 0.5;
          this.leftLeg.rotation.x = crouch;
          this.rightLeg.rotation.x = crouch;
          this.leftArm.rotation.z = 0.3;
          this.rightArm.rotation.z = -0.3;
          this.leftArm.rotation.x = 0.5;
          this.rightArm.rotation.x = 0.5;
        } else if (cycle < 2.5) {
          // DYNO! Jump phase
          const jumpProgress = (cycle - 1.5);
          const jumpHeight = Math.sin(jumpProgress * Math.PI) * this.dynoHeight;
          
          this.group.position.y = this.baseY + jumpHeight;
          
          // Arms reaching up
          this.leftArm.rotation.z = THREE.MathUtils.lerp(0.3, 0.8, jumpProgress);
          this.rightArm.rotation.z = THREE.MathUtils.lerp(-0.3, -0.8, jumpProgress);
          this.leftArm.rotation.x = THREE.MathUtils.lerp(0.5, -0.3, jumpProgress);
          this.rightArm.rotation.x = THREE.MathUtils.lerp(0.5, -0.3, jumpProgress);
          
          // Legs tucking then extending
          const legTuck = jumpProgress < 0.5 ? jumpProgress * 2 : (1 - jumpProgress) * 2;
          this.leftLeg.rotation.x = 0.3 + legTuck * 0.8;
          this.rightLeg.rotation.x = 0.3 + legTuck * 0.8;
          
          // Body arc
          this.torso.rotation.x = Math.sin(jumpProgress * Math.PI) * -0.3;
        } else {
          // Landing/catching hold
          const landProgress = (cycle - 2.5) / 1.5;
          
          this.group.position.y = this.baseY + this.dynoHeight * (1 - landProgress * 0.9);
          
          // Hanging position
          this.leftArm.rotation.z = 0.2;
          this.rightArm.rotation.z = -0.2;
          this.leftArm.rotation.x = -0.2;
          this.rightArm.rotation.x = -0.2;
          
          // Legs dangling/swinging
          const swing = Math.sin(landProgress * Math.PI * 3) * 0.3 * (1 - landProgress);
          this.leftLeg.rotation.x = 0.1 + swing;
          this.rightLeg.rotation.x = 0.1 - swing;
          
          this.torso.rotation.x = 0;
          this.torso.position.y = 0;
        }
      }
    }
    
    // Create climbers
    const mainClimber = new AnimatedClimber(
      new THREE.Vector3(-2, 2, -14.2),
      mainWallHolds,
      new THREE.Vector3(0, 0, 1),
      0x2980b9
    );
    mainClimber.group.rotation.y = Math.PI;
    scene.add(mainClimber.group);
    
    const slabClimber = new AnimatedClimber(
      new THREE.Vector3(-16.8, 1.5, -6),
      slabHolds,
      new THREE.Vector3(1, 0, 0),
      0x27ae60
    );
    slabClimber.group.rotation.y = -Math.PI / 2;
    slabClimber.cycleSpeed = 0.3; // Slower for slab
    scene.add(slabClimber.group);
    
    const caveClimber = new AnimatedClimber(
      new THREE.Vector3(16.5, 2, -7),
      caveHolds,
      new THREE.Vector3(-1, 0, 0),
      0x9b59b6
    );
    caveClimber.group.rotation.y = Math.PI / 2;
    caveClimber.group.rotation.z = -0.3; // Leaning into overhang
    caveClimber.cycleSpeed = 0.5; // Faster for power climbing
    scene.add(caveClimber.group);
    
    // Dyno climber on main wall
    const dynoClimber = new DynoClimber(
      new THREE.Vector3(3, 4, -14.2),
      0xe91e63
    );
    dynoClimber.group.rotation.y = Math.PI;
    scene.add(dynoClimber.group);
    
    // Gym furniture
    const createBench = (x, z, rotY = 0) => {
      const benchGroup = new THREE.Group();
      const benchMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
      const seat = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 0.6), benchMat);
      seat.position.y = 0.45;
      seat.castShadow = true;
      benchGroup.add(seat);
      [-0.9, 0.9].forEach(xOff => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.45, 0.5), benchMat);
        leg.position.set(xOff, 0.225, 0);
        benchGroup.add(leg);
      });
      benchGroup.position.set(x, 0, z);
      benchGroup.rotation.y = rotY;
      scene.add(benchGroup);
    };
    
    createBench(-8, 5);
    createBench(8, 5);
    createBench(0, 8);
    
    // Signs
    const createSign = (text, x, y, z, color, rotY = 0) => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
      ctx.fillRect(0, 0, 128, 64);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, 64, 44);
      const texture = new THREE.CanvasTexture(canvas);
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.25), new THREE.MeshBasicMaterial({ map: texture }));
      sign.position.set(x, y, z);
      sign.rotation.y = rotY;
      scene.add(sign);
    };
    
    createSign('V0', -5, 0.5, -14.7, holdColors.green);
    createSign('V3', -2, 0.5, -14.7, holdColors.blue);
    createSign('V5', 1, 0.5, -14.7, holdColors.yellow);
    createSign('V7', 4, 0.5, -14.7, holdColors.red);
    createSign('V1', -16.8, 0.5, -5, holdColors.orange, Math.PI / 2);
    createSign('V6', 16.8, 0.5, -10, holdColors.pink, -Math.PI / 2);
    
    // Pillar
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 14, 12), new THREE.MeshStandardMaterial({ color: 0x34495e }));
    pillar.position.set(0, 7, 0);
    pillar.castShadow = true;
    scene.add(pillar);
    
    // Camera controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraAngleY = 0;
    let cameraAngleX = 0;
    const keys = { forward: false, backward: false, left: false, right: false };
    
    const onMouseDown = (e) => { isDragging = true; previousMousePosition = { x: e.clientX, y: e.clientY }; };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      cameraAngleY -= (e.clientX - previousMousePosition.x) * 0.005;
      cameraAngleX -= (e.clientY - previousMousePosition.y) * 0.005;
      cameraAngleX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraAngleX));
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e) => {
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(forward, -e.deltaY * 0.01);
    };
    
    const onKeyDown = (e) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) keys.forward = true;
      if (['ArrowDown', 's', 'S'].includes(e.key)) keys.backward = true;
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) keys.left = true;
      if (['ArrowRight', 'd', 'D'].includes(e.key)) keys.right = true;
    };
    const onKeyUp = (e) => {
      if (['ArrowUp', 'w', 'W'].includes(e.key)) keys.forward = false;
      if (['ArrowDown', 's', 'S'].includes(e.key)) keys.backward = false;
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) keys.left = false;
      if (['ArrowRight', 'd', 'D'].includes(e.key)) keys.right = false;
    };
    
    // Touch controls
    const onTouchStart = (e) => { if (e.touches.length === 1) { isDragging = true; previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }; } };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      cameraAngleY -= (e.touches[0].clientX - previousMousePosition.x) * 0.005;
      cameraAngleX -= (e.touches[0].clientY - previousMousePosition.y) * 0.005;
      cameraAngleX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, cameraAngleX));
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };
    
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);
    renderer.domElement.addEventListener('touchstart', onTouchStart);
    renderer.domElement.addEventListener('touchmove', onTouchMove);
    renderer.domElement.addEventListener('touchend', onTouchEnd);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    
    // Animation loop
    let lastTime = performance.now();
    const animate = () => {
      requestAnimationFrame(animate);
      
      const now = performance.now();
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;
      
      // Movement
      const speed = 0.12;
      if (keys.forward) { camera.position.x -= Math.sin(cameraAngleY) * speed; camera.position.z -= Math.cos(cameraAngleY) * speed; }
      if (keys.backward) { camera.position.x += Math.sin(cameraAngleY) * speed; camera.position.z += Math.cos(cameraAngleY) * speed; }
      if (keys.left) { camera.position.x -= Math.cos(cameraAngleY) * speed; camera.position.z += Math.sin(cameraAngleY) * speed; }
      if (keys.right) { camera.position.x += Math.cos(cameraAngleY) * speed; camera.position.z -= Math.sin(cameraAngleY) * speed; }
      
      camera.position.x = Math.max(-22, Math.min(22, camera.position.x));
      camera.position.z = Math.max(-16, Math.min(16, camera.position.z));
      camera.position.y = Math.max(1.5, Math.min(10, camera.position.y));
      
      camera.rotation.order = 'YXZ';
      camera.rotation.y = cameraAngleY;
      camera.rotation.x = cameraAngleX;
      
      // Update all climbers
      mainClimber.update(deltaTime);
      slabClimber.update(deltaTime);
      caveClimber.update(deltaTime);
      dynoClimber.update(deltaTime);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white p-3 text-center border-b border-gray-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
          🧗 Summit Climbing Gym
        </h1>
        <p className="text-xs text-gray-400 mt-1">{info}</p>
      </div>
      <div ref={containerRef} className="flex-1" tabIndex={0} />
      <div className="bg-gray-800 p-2 border-t border-gray-700">
        <div className="flex justify-center gap-3 text-xs flex-wrap">
          <span className="font-semibold text-gray-400">Watch the climbers!</span>
          <span className="text-cyan-400">🧍 4 animated climbers</span>
          <span className="text-pink-400">🚀 Dyno move on main wall</span>
        </div>
      </div>
    </div>
  );
}
