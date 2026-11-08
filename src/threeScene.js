import * as THREE from 'three';
import { audioManager } from './audio.js';

export class ThreeSceneManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05050a, 0.0035);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 0, 40);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.clock = new THREE.Clock();

    // Scene groups
    this.worldGroup = new THREE.Group();
    this.scene.add(this.worldGroup);

    this.cityGroup = new THREE.Group();
    this.planeGroup = new THREE.Group();
    this.blastGroup = new THREE.Group();
    this.freefallGroup = new THREE.Group();

    this.worldGroup.add(this.cityGroup);
    this.worldGroup.add(this.planeGroup);
    this.worldGroup.add(this.blastGroup);
    this.worldGroup.add(this.freefallGroup);

    // States
    this.currentMode = 'intro'; // 'intro', 'chase', 'combat', 'plane', 'qte', 'blast', 'freefall', 'end'
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.cameraShake = 0;
    this.freeCam = false;

    // References to particle systems
    this.flameParticles = null;
    this.emberParticles = null;
    this.shockwaveRings = [];
    this.cloudPlanes = [];
    this.speedLines = null;

    this.initLights();
    this.initCityChase();
    this.initCargoPlane();
    this.initDemonSlayerBlast();
    this.initFreefallSky();

    this.setupEvents();
    this.setMode('intro');
  }

  initLights() {
    this.ambientLight = new THREE.AmbientLight(0x1a1a24, 1.2);
    this.scene.add(this.ambientLight);

    // Red warning strobe inside plane
    this.redStrobe = new THREE.PointLight(0xff1e42, 4, 120);
    this.redStrobe.position.set(0, 8, -10);
    this.scene.add(this.redStrobe);

    // Moon directional light
    this.moonLight = new THREE.DirectionalLight(0xa6c8ff, 1.5);
    this.moonLight.position.set(50, 100, 50);
    this.scene.add(this.moonLight);

    // Blast primary light
    this.blastLight = new THREE.PointLight(0xff9900, 0, 300);
    this.blastLight.position.set(0, 0, -20);
    this.scene.add(this.blastLight);
  }

  /* ---------------- Scene 1: Neon City & Highway Chase ---------------- */
  initCityChase() {
    // Neon speed streaks
    const count = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 6);
    const colors = new Float32Array(count * 6);

    const c1 = new THREE.Color(0x00f0ff);
    const c2 = new THREE.Color(0xff1e42);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 60 - 10;
      const z = (Math.random() - 0.5) * 400;
      const len = 15 + Math.random() * 35;

      positions[i * 6 + 0] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;

      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z + len;

      const col = Math.random() > 0.4 ? c1 : c2;
      colors[i * 6 + 0] = col.r;
      colors[i * 6 + 1] = col.g;
      colors[i * 6 + 2] = col.b;
      colors[i * 6 + 3] = col.r;
      colors[i * 6 + 4] = col.g;
      colors[i * 6 + 5] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.speedLines = new THREE.LineSegments(geometry, material);
    this.cityGroup.add(this.speedLines);

    // Distant Neon Skyscraper blocks
    for (let i = 0; i < 40; i++) {
      const h = 40 + Math.random() * 90;
      const w = 15 + Math.random() * 20;
      const bGeo = new THREE.BoxGeometry(w, h, w);
      const wireGeo = new THREE.WireframeGeometry(bGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x00f0ff : 0x9d4edd,
        transparent: true,
        opacity: 0.18
      });
      const tower = new THREE.LineSegments(wireGeo, wireMat);
      const side = Math.random() > 0.5 ? 1 : -1;
      tower.position.set(side * (50 + Math.random() * 80), h / 2 - 40, (Math.random() - 0.5) * 400);
      this.cityGroup.add(tower);
    }
  }

  /* ---------------- Scene 2: High-Altitude Cargo Plane Ramp ---------------- */
  initCargoPlane() {
    // Fuselage interior rib structure
    const ribMaterial = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      roughness: 0.6,
      metalness: 0.8
    });

    for (let i = 0; i < 12; i++) {
      const zPos = -i * 12;
      const archGeo = new THREE.TorusGeometry(18, 0.8, 8, 24, Math.PI);
      const arch = new THREE.Mesh(archGeo, ribMaterial);
      arch.rotation.x = Math.PI / 2;
      arch.position.set(0, 6, zPos);
      this.planeGroup.add(arch);

      // Floor beams
      const floorGeo = new THREE.BoxGeometry(26, 0.5, 3);
      const floor = new THREE.Mesh(floorGeo, ribMaterial);
      floor.position.set(0, -6, zPos);
      this.planeGroup.add(floor);
    }

    // Open Hydraulic Cargo Bay Ramp tilting into the abyss
    const rampGeo = new THREE.BoxGeometry(24, 0.8, 30);
    const rampMat = new THREE.MeshStandardMaterial({
      color: 0x222633,
      metalness: 0.9,
      roughness: 0.4
    });
    this.cargoRamp = new THREE.Mesh(rampGeo, rampMat);
    this.cargoRamp.position.set(0, -9.5, 12);
    this.cargoRamp.rotation.x = 0.28; // Tilted downwards into open sky
    this.planeGroup.add(this.cargoRamp);

    // Hazard Stripes on ramp edge
    const edgeGeo = new THREE.BoxGeometry(24, 0.9, 2);
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0xff9900 });
    const rampEdge = new THREE.Mesh(edgeGeo, edgeMat);
    rampEdge.position.set(0, 0, 14);
    this.cargoRamp.add(rampEdge);

    // Heavy Titanium Chains hanging at the edge
    this.chainsGroup = new THREE.Group();
    this.chainsGroup.position.set(0, -7, 18);
    for (let c = -1; c <= 1; c += 2) {
      for (let i = 0; i < 9; i++) {
        const linkGeo = new THREE.TorusGeometry(0.8, 0.25, 8, 12);
        const linkMat = new THREE.MeshStandardMaterial({ color: 0x8892a5, metalness: 0.95 });
        const link = new THREE.Mesh(linkGeo, linkMat);
        link.position.set(c * 3.5, -i * 1.1, 0);
        link.rotation.y = (i % 2) * Math.PI / 2;
        this.chainsGroup.add(link);
      }
    }
    this.planeGroup.add(this.chainsGroup);

    // Volumetric cloud layer rushing underneath at 35,000 FT
    const cloudGeo = new THREE.PlaneGeometry(300, 300, 16, 16);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x101422,
      roughness: 0.9,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
      wireframe: false
    });
    for (let i = 0; i < 4; i++) {
      const cMesh = new THREE.Mesh(cloudGeo, cloudMat);
      cMesh.rotation.x = -Math.PI / 2;
      cMesh.position.set(0, -60 - i * 30, (i - 1.5) * 120);
      this.planeGroup.add(cMesh);
      this.cloudPlanes.push(cMesh);
    }
  }

  /* ---------------- Scene 3: DEMON SLAYER APOCALYPTIC BLAST ---------------- */
  initDemonSlayerBlast() {
    // 1. Swirling Incandescent Embers & Flame Petals (Hinokami Kagura Style)
    const emberCount = 3500;
    const emberGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(emberCount * 3);
    const velocities = new Float32Array(emberCount * 3);
    const colors = new Float32Array(emberCount * 3);
    const sizes = new Float32Array(emberCount);

    const cFlame1 = new THREE.Color(0xff1e42); // Crimson
    const cFlame2 = new THREE.Color(0xff9100); // Amber Fire
    const cFlame3 = new THREE.Color(0xffd700); // Gold
    const cFlame4 = new THREE.Color(0xffffff); // Core White

    for (let i = 0; i < emberCount; i++) {
      positions[i * 3 + 0] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = -20;

      // Spherical explosive burst vectors with spiral curl
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 25 + Math.random() * 110;

      velocities[i * 3 + 0] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;

      let chosenColor;
      const rand = Math.random();
      if (rand < 0.25) chosenColor = cFlame4;
      else if (rand < 0.55) chosenColor = cFlame2;
      else if (rand < 0.85) chosenColor = cFlame1;
      else chosenColor = cFlame3;

      colors[i * 3 + 0] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;

      sizes[i] = 2.5 + Math.random() * 8.0;
    }

    emberGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    emberGeo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    emberGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    emberGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom Particle Shader / Point Material
    const pTexture = this.createEmberTexture();
    const emberMat = new THREE.PointsMaterial({
      size: 4.5,
      map: pTexture,
      transparent: true,
      opacity: 0.95,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.emberParticles = new THREE.Points(emberGeo, emberMat);
    this.blastGroup.add(this.emberParticles);

    // 2. Expanding Concentric Shockwave Rings (Dragon Fire shockwaves)
    for (let i = 0; i < 4; i++) {
      const ringGeo = new THREE.RingGeometry(0.1, 1.2, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xff3355 : 0xffaa00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, 0, -20);
      this.blastGroup.add(ring);
      this.shockwaveRings.push(ring);
    }
  }

  createEmberTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,200,80,0.9)');
    grad.addColorStop(0.7, 'rgba(255,40,60,0.4)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /* ---------------- Scene 4: Serene Freefall Through Burning Clouds ---------------- */
  initFreefallSky() {
    // Drifting Sky Debris & Ash
    const ashCount = 1200;
    const ashGeo = new THREE.BufferGeometry();
    const ashPos = new Float32Array(ashCount * 3);
    for (let i = 0; i < ashCount; i++) {
      ashPos[i * 3 + 0] = (Math.random() - 0.5) * 120;
      ashPos[i * 3 + 1] = (Math.random() - 0.5) * 140;
      ashPos[i * 3 + 2] = (Math.random() - 0.5) * 120;
    }
    ashGeo.setAttribute('position', new THREE.BufferAttribute(ashPos, 3));
    const ashMat = new THREE.PointsMaterial({
      size: 2.2,
      color: 0xffa050,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    this.ashParticles = new THREE.Points(ashGeo, ashMat);
    this.freefallGroup.add(this.ashParticles);

    // Glowing Full Moon Sphere in background
    const moonGeo = new THREE.SphereGeometry(22, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xf4f6ff });
    this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
    this.moonMesh.position.set(40, 65, -160);
    this.freefallGroup.add(this.moonMesh);
  }

  setupEvents() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Mobile touch drag parallax
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.mouse.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    }, { passive: true });

    // Phone Gyroscope tilt support
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        this.mouse.targetX = Math.max(-1, Math.min(1, e.gamma / 30));
        this.mouse.targetY = Math.max(-1, Math.min(1, (e.beta - 40) / 30));
      }
    }, { passive: true });
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setMode(mode) {
    this.currentMode = mode;
    console.log(`ThreeScene switching to mode: ${mode}`);

    // Adjust group visibilities and camera positions
    if (mode === 'intro' || mode === 'chase') {
      this.cityGroup.visible = true;
      this.planeGroup.visible = false;
      this.blastGroup.visible = false;
      this.freefallGroup.visible = false;
      this.camera.position.set(0, 5, 45);
      this.camera.lookAt(0, 0, -100);
    } else if (mode === 'combat') {
      this.cityGroup.visible = true;
      this.planeGroup.visible = false;
      this.blastGroup.visible = false;
      this.freefallGroup.visible = false;
      this.camera.position.set(0, 2, 25);
    } else if (mode === 'plane' || mode === 'qte') {
      this.cityGroup.visible = false;
      this.planeGroup.visible = true;
      this.blastGroup.visible = false;
      this.freefallGroup.visible = false;
      this.camera.position.set(0, -2, 32);
      this.camera.lookAt(0, -6, 10);
    } else if (mode === 'blast') {
      this.cityGroup.visible = false;
      this.planeGroup.visible = true;
      this.blastGroup.visible = true;
      this.freefallGroup.visible = false;
      this.triggerDetonation();
    } else if (mode === 'freefall' || mode === 'end') {
      this.cityGroup.visible = false;
      this.planeGroup.visible = false;
      this.blastGroup.visible = false;
      this.freefallGroup.visible = true;
      this.camera.position.set(0, 0, 30);
      this.camera.lookAt(0, 0, 0);
    }
  }

  triggerDetonation() {
    this.cameraShake = 4.5;
    this.blastLight.intensity = 18;
    this.blastTime = 0;

    // Reset ember particles
    if (this.emberParticles) {
      const pos = this.emberParticles.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i] = (Math.random() - 0.5) * 6;
        pos[i + 1] = (Math.random() - 0.5) * 6;
        pos[i + 2] = -15 + (Math.random() - 0.5) * 4;
      }
      this.emberParticles.geometry.attributes.position.needsUpdate = true;
    }

    // Trigger shockwaves
    this.shockwaveRings.forEach((ring, idx) => {
      ring.scale.set(0.1, 0.1, 0.1);
      ring.material.opacity = 1.0;
    });

    // Drop chains
    if (this.chainsGroup) {
      this.chainsGroup.position.y = -40; // Dropped into void
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Mouse parallax smoothing
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Audio-reactive metrics
    audioManager.updateMetrics();
    const bass = audioManager.bassEnergy || 0;

    // Camera shake decay
    if (this.cameraShake > 0.01) {
      this.camera.position.x += (Math.random() - 0.5) * this.cameraShake;
      this.camera.position.y += (Math.random() - 0.5) * this.cameraShake;
      this.cameraShake *= 0.92;
    }

    // Light pulsing to audio
    this.redStrobe.intensity = 2.0 + Math.sin(elapsedTime * 8) * 1.8 + bass * 3;

    // Mode-specific animations
    if (this.currentMode === 'intro' || this.currentMode === 'chase' || this.currentMode === 'combat') {
      if (this.speedLines) {
        const positions = this.speedLines.geometry.attributes.position.array;
        for (let i = 2; i < positions.length; i += 6) {
          positions[i] += (180 + bass * 80) * delta;
          positions[i + 3] += (180 + bass * 80) * delta;
          if (positions[i] > 100) {
            positions[i] -= 400;
            positions[i + 3] -= 400;
          }
        }
        this.speedLines.geometry.attributes.position.needsUpdate = true;
      }
      this.camera.position.x = this.mouse.x * 6;
      this.camera.position.y = 5 + this.mouse.y * 3;
    } else if (this.currentMode === 'plane' || this.currentMode === 'qte') {
      // Wind turbulence on cargo ramp
      this.cargoRamp.rotation.z = Math.sin(elapsedTime * 6) * 0.02 + (Math.random() - 0.5) * 0.01;
      this.cloudPlanes.forEach((cloud, i) => {
        cloud.position.z += (60 + i * 20) * delta;
        if (cloud.position.z > 120) cloud.position.z = -120;
      });
      // Chains swaying in 250 mph wind
      if (this.chainsGroup) {
        this.chainsGroup.rotation.z = Math.sin(elapsedTime * 12) * 0.15;
      }
      this.camera.position.x = this.mouse.x * 4;
      this.camera.position.y = -2 + this.mouse.y * 3;
    } else if (this.currentMode === 'blast') {
      // Expand shockwave rings
      this.shockwaveRings.forEach((ring, idx) => {
        const rate = (65 + idx * 25) * delta;
        ring.scale.x += rate;
        ring.scale.y += rate;
        ring.material.opacity = Math.max(0, ring.material.opacity - delta * 0.65);
      });

      // Expand explosive fire embers
      if (this.emberParticles) {
        const positions = this.emberParticles.geometry.attributes.position.array;
        const velocities = this.emberParticles.geometry.attributes.velocity.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i] * delta;
          positions[i + 1] += velocities[i + 1] * delta;
          positions[i + 2] += velocities[i + 2] * delta;
          // Drag deceleration
          velocities[i] *= 0.985;
          velocities[i + 1] *= 0.985;
          velocities[i + 2] *= 0.985;
        }
        this.emberParticles.geometry.attributes.position.needsUpdate = true;
      }

      this.blastLight.intensity = Math.max(0, this.blastLight.intensity - delta * 6);
    } else if (this.currentMode === 'freefall' || this.currentMode === 'end') {
      // Clouds and ash rushing upwards as hero falls
      if (this.ashParticles) {
        const positions = this.ashParticles.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += (55 + bass * 25) * delta;
          if (positions[i] > 70) positions[i] = -70;
        }
        this.ashParticles.geometry.attributes.position.needsUpdate = true;
      }
      // Gentle camera orbit around the peaceful falling hero
      this.camera.position.x = Math.sin(elapsedTime * 0.4) * 8 + this.mouse.x * 6;
      this.camera.position.y = Math.cos(elapsedTime * 0.4) * 4 + this.mouse.y * 4;
      this.camera.lookAt(0, 0, 0);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
