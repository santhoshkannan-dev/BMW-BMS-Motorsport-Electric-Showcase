"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { audioEngine } from "./AudioEngine";

export interface CarConfig {
  paintColor: string;
  paintName: string;
  caliperColor: string;
  rimColor: string;
  rimName: string;
  driveMode: "comfort" | "sport" | "warp";
  headlightsOn: boolean;
  activeHotspot: number | null;
  cameraPreset: "showcase" | "front" | "side" | "rear" | "wheel" | "top";
}

interface ThreeCarCanvasProps {
  config: CarConfig;
  onSelectHotspot: (index: number | null) => void;
  isWarpSpeed: boolean;
}

export default function ThreeCarCanvas({
  config,
  onSelectHotspot,
  isWarpSpeed,
}: ThreeCarCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // References to dynamic car meshes & materials
  const carBodyMaterialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const caliperMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const rimMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const headlightMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const underglowLightRef = useRef<THREE.PointLight | null>(null);
  const warpParticlesRef = useRef<THREE.Points | null>(null);
  const realCarGroupRef = useRef<THREE.Group | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Camera animation target & position lerping
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(5.2, 2.2, 5.4));
  const targetCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.75, 0));
  const currentCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.75, 0));

  // Mouse orbit controls
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const orbitSpherical = useRef({ radius: 7.5, theta: 0.85, phi: 1.25 });
  const isUserInteracting = useRef(false);
  const userInteractTimeout = useRef<NodeJS.Timeout | null>(null);

  // 3D Hotspot world coordinates on the real BMW M4
  const hotspotPositions = [
    { id: 0, title: "BMW Laserlight", pos: new THREE.Vector3(0.78, 0.72, 2.15), desc: "Adaptive Matrix LED with 600m high-beam range" },
    { id: 1, title: "Iconic Kidney Grille", pos: new THREE.Vector3(0, 0.68, 2.38), desc: "Signature frameless active aerodynamic double-kidney grille" },
    { id: 2, title: "M Carbon Ceramic Brakes", pos: new THREE.Vector3(1.05, 0.44, 1.4), desc: "400mm perforated ceramic composite discs with 6-piston calipers" },
    { id: 3, title: "Carbon Fiber Aerokit", pos: new THREE.Vector3(0, 1.45, 0.05), desc: "Lightweight CFR carbon roof lowering center of gravity" },
    { id: 4, title: "M Quad Exhaust & Diffuser", pos: new THREE.Vector3(0, 0.6, -2.3), desc: "Motorsport rear diffuser with dual twin chrome exhaust outlets" },
  ];

  const [screenHotspots, setScreenHotspots] = useState<{ id: number; title: string; x: number; y: number; visible: boolean }[]>([]);

  // Update camera target based on preset
  useEffect(() => {
    switch (config.cameraPreset) {
      case "showcase":
        targetCamPos.current.set(5.2, 2.1, 5.4);
        targetCamLook.current.set(0, 0.75, 0);
        orbitSpherical.current = { radius: 7.5, theta: 0.85, phi: 1.25 };
        break;
      case "front":
        targetCamPos.current.set(0, 1.1, 5.2);
        targetCamLook.current.set(0, 0.7, 1.5);
        orbitSpherical.current = { radius: 5.2, theta: 0.0, phi: 1.36 };
        break;
      case "side":
        targetCamPos.current.set(6.4, 1.3, 0);
        targetCamLook.current.set(0, 0.7, 0);
        orbitSpherical.current = { radius: 6.4, theta: Math.PI / 2, phi: 1.35 };
        break;
      case "rear":
        targetCamPos.current.set(-3.5, 1.5, -5.2);
        targetCamLook.current.set(0, 0.75, -1.0);
        orbitSpherical.current = { radius: 6.2, theta: 3.8, phi: 1.32 };
        break;
      case "wheel":
        targetCamPos.current.set(2.4, 0.55, 1.7);
        targetCamLook.current.set(1.05, 0.42, 1.35);
        orbitSpherical.current = { radius: 2.8, theta: 0.95, phi: 1.42 };
        break;
      case "top":
        targetCamPos.current.set(0.1, 8.2, 0.1);
        targetCamLook.current.set(0, 0.6, 0);
        orbitSpherical.current = { radius: 8.2, theta: 0.1, phi: 0.1 };
        break;
    }
  }, [config.cameraPreset]);

  // Update Paint Color dynamically
  useEffect(() => {
    const color = new THREE.Color(config.paintColor);
    carBodyMaterialsRef.current.forEach((mat) => {
      mat.color.copy(color);
      mat.needsUpdate = true;
    });
  }, [config.paintColor]);

  // Update Caliper Color
  useEffect(() => {
    const color = new THREE.Color(config.caliperColor);
    caliperMaterialsRef.current.forEach((mat) => {
      mat.color.copy(color);
      mat.needsUpdate = true;
    });
  }, [config.caliperColor]);

  // Update Rim Color
  useEffect(() => {
    const color = new THREE.Color(config.rimColor);
    rimMaterialsRef.current.forEach((mat) => {
      mat.color.copy(color);
      mat.needsUpdate = true;
    });
  }, [config.rimColor]);

  // Update Headlights & Underglow
  useEffect(() => {
    headlightMaterialsRef.current.forEach((mat) => {
      if (config.headlightsOn) {
        mat.emissive.set(0x00f0ff);
        mat.emissiveIntensity = 3.5;
      } else {
        mat.emissive.set(0x000000);
        mat.emissiveIntensity = 0;
      }
      mat.needsUpdate = true;
    });

    if (underglowLightRef.current) {
      underglowLightRef.current.intensity = config.headlightsOn
        ? config.driveMode === "sport"
          ? 4.5
          : 3.0
        : 0;
      underglowLightRef.current.color.set(
        config.driveMode === "sport"
          ? 0xe21b22
          : config.driveMode === "warp"
          ? 0x00f0ff
          : 0x0066b1
      );
    }
  }, [config.headlightsOn, config.driveMode]);

  // Initialize Three.js scene & load authentic BMW 3D model
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x05070c);
    scene.fog = new THREE.FogExp2(0x05070c, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(5.2, 2.2, 5.4);
    camera.lookAt(0, 0.75, 0);

    // 3. Renderer attached directly to canvas element
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // 4. Photorealistic Studio HDRI Environment Reflection
    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(environment).texture;
    scene.environment = envTexture;

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Key front-top spotlight
    const keySpot = new THREE.SpotLight(0xffffff, 5.0);
    keySpot.position.set(6, 9, 6);
    keySpot.angle = Math.PI / 4;
    keySpot.penumbra = 0.6;
    keySpot.castShadow = true;
    keySpot.shadow.bias = -0.0004;
    keySpot.shadow.mapSize.width = 2048;
    keySpot.shadow.mapSize.height = 2048;
    scene.add(keySpot);

    // Rim cyan light
    const rimCyan = new THREE.DirectionalLight(0x00f0ff, 2.2);
    rimCyan.position.set(-6, 4, -6);
    scene.add(rimCyan);

    // Front blue fill
    const fillBlue = new THREE.DirectionalLight(0x0044bb, 1.8);
    fillBlue.position.set(-5, 3, 5);
    scene.add(fillBlue);

    // Soft overhead light
    const overheadLight = new THREE.PointLight(0xffffff, 3.0, 20);
    overheadLight.position.set(0, 6, 0);
    scene.add(overheadLight);

    // Underglow neon ground light
    const underglow = new THREE.PointLight(0x0066b1, 3.5, 7);
    underglow.position.set(0, 0.15, 0);
    underglowLightRef.current = underglow;
    scene.add(underglow);

    // 6. Showroom Floor & Stage
    const stageRadius = 5.4;
    const stageGeo = new THREE.CylinderGeometry(stageRadius, stageRadius + 0.35, 0.1, 64);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x090e17,
      roughness: 0.15,
      metalness: 0.88,
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = -0.05;
    stage.receiveShadow = true;
    scene.add(stage);

    // Concentric glowing stage ring 1
    const ring1Geo = new THREE.RingGeometry(stageRadius - 0.08, stageRadius, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.002;
    scene.add(ring1);

    // Concentric glowing stage ring 2
    const ring2Geo = new THREE.RingGeometry(3.6, 3.66, 64);
    const ring2 = new THREE.Mesh(ring2Geo, ringMat);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.002;
    scene.add(ring2);

    // Outer Floor
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x04060a,
      roughness: 0.28,
      metalness: 0.75,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.11;
    floor.receiveShadow = true;
    scene.add(floor);

    // Showroom grid
    const grid = new THREE.GridHelper(40, 40, 0x002f6c, 0x08101e);
    grid.position.y = -0.1;
    scene.add(grid);

    // Realistic Contact Shadow beneath vehicle
    const shadowGeo = new THREE.PlaneGeometry(5.4, 2.8);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext("2d")!;
    const grad = sctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, "rgba(0,0,0,0.92)");
    grad.addColorStop(0.5, "rgba(0,0,0,0.5)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.9,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    scene.add(shadowPlane);

    // 7. Ambient Micro-Dust Particles
    const dustCount = 200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 16;
      dustPositions[i + 1] = Math.random() * 6;
      dustPositions[i + 2] = (Math.random() - 0.5) * 16;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // 8. Warp Mode Particles
    const warpCount = 600;
    const warpGeo = new THREE.BufferGeometry();
    const warpPositions = new Float32Array(warpCount * 3);
    const warpSpeeds = new Float32Array(warpCount);
    for (let i = 0; i < warpCount; i++) {
      warpPositions[i * 3] = (Math.random() - 0.5) * 14;
      warpPositions[i * 3 + 1] = Math.random() * 5 + 0.1;
      warpPositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      warpSpeeds[i] = Math.random() * 0.8 + 0.4;
    }
    warpGeo.setAttribute("position", new THREE.BufferAttribute(warpPositions, 3));
    const warpMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.08,
      transparent: true,
      opacity: 0,
    });
    const warpParticles = new THREE.Points(warpGeo, warpMat);
    warpParticlesRef.current = warpParticles;
    scene.add(warpParticles);

    // 9. LOAD AUTHENTIC REAL BMW M4 COMPETITION 3D MODEL
    const loader = new GLTFLoader();

    carBodyMaterialsRef.current = [];
    caliperMaterialsRef.current = [];
    rimMaterialsRef.current = [];
    headlightMaterialsRef.current = [];

    loader.load(
      "/models/bmw.glb",
      (gltf) => {
        const carModel = gltf.scene;
        realCarGroupRef.current = carModel;

        // Auto-center and normalize size
        const box = new THREE.Box3().setFromObject(carModel);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 4.8 / maxDim;
        carModel.scale.setScalar(targetScale);

        carModel.position.x = -center.x * targetScale;
        carModel.position.y = -box.min.y * targetScale; // place wheels directly onto floor y = 0
        carModel.position.z = -center.z * targetScale;

        // Traverse meshes and configure materials
        carModel.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            const mat = child.material;
            const matName = (mat?.name || "").toLowerCase();

            // A. Car Body Paint (hood, doors, fenders, quarter panels, bumpers)
            if (
              matName.includes("body") ||
              matName.includes("white41") ||
              matName.includes("livery") ||
              matName.includes("zx1") ||
              matName.includes("ff41")
            ) {
              const bodyPaint = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(config.paintColor),
                metalness: 0.88,
                roughness: 0.16,
                clearcoat: 1.0,
                clearcoatRoughness: 0.05,
                reflectivity: 0.95,
                envMapIntensity: 2.4,
              });
              child.material = bodyPaint;
              carBodyMaterialsRef.current.push(bodyPaint);
            }
            // B. Tinted Glass & Windows
            else if (matName.includes("window") || matName.includes("glass")) {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0x09101c,
                metalness: 0.15,
                roughness: 0.04,
                transmission: 0.88,
                transparent: true,
                opacity: 0.8,
                envMapIntensity: 2.5,
              });
            }
            // C. Brake Calipers
            else if (matName.includes("caliper")) {
              const calMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(config.caliperColor),
                metalness: 0.85,
                roughness: 0.25,
                envMapIntensity: 1.8,
              });
              child.material = calMat;
              caliperMaterialsRef.current.push(calMat);
            }
            // D. Alloy Rims
            else if (matName.includes("rim") || matName.includes("wheel")) {
              const rimMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(config.rimColor),
                metalness: 0.92,
                roughness: 0.18,
                envMapIntensity: 2.2,
              });
              child.material = rimMat;
              rimMaterialsRef.current.push(rimMat);
            }
            // E. Headlights & LED DRLs
            else if (matName.includes("headlight") || matName.includes("led") || matName.includes("light51")) {
              const headMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: new THREE.Color(config.headlightsOn ? 0x00f0ff : 0x000000),
                emissiveIntensity: config.headlightsOn ? 3.5 : 0,
                roughness: 0.1,
                metalness: 0.8,
              });
              child.material = headMat;
              headlightMaterialsRef.current.push(headMat);
            }
            // F. Taillights
            else if (matName.includes("redlight") || matName.includes("tail")) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xff1028,
                emissive: new THREE.Color(0xff1525),
                emissiveIntensity: 2.2,
                roughness: 0.18,
              });
            }
            // G. Carbon Fiber & Trims (Grille, Diffuser, Splitter)
            else if (matName.includes("black") || matName.includes("grill") || matName.includes("pillar")) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x111317,
                metalness: 0.65,
                roughness: 0.32,
                envMapIntensity: 1.5,
              });
            }
          }
        });

        scene.add(carModel);
        setIsLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (error) => {
        console.error("Error loading BMW GLB:", error);
        setIsLoading(false);
      }
    );

    // 10. Interactive Mouse / Touch Orbit Controls
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      isUserInteracting.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
      if (userInteractTimeout.current) clearTimeout(userInteractTimeout.current);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      prevMouse.current = { x: e.clientX, y: e.clientY };

      orbitSpherical.current.theta -= dx * 0.006;
      orbitSpherical.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.04, orbitSpherical.current.phi - dy * 0.005));

      const { radius, theta, phi } = orbitSpherical.current;
      targetCamPos.current.x = radius * Math.sin(phi) * Math.sin(theta);
      targetCamPos.current.y = radius * Math.cos(phi);
      targetCamPos.current.z = radius * Math.sin(phi) * Math.cos(theta);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      userInteractTimeout.current = setTimeout(() => {
        isUserInteracting.current = false;
      }, 5000);
    };

    const handleWheel = (e: WheelEvent) => {
      orbitSpherical.current.radius = Math.max(3.2, Math.min(12.0, orbitSpherical.current.radius + e.deltaY * 0.004));
      const { radius, theta, phi } = orbitSpherical.current;
      targetCamPos.current.x = radius * Math.sin(phi) * Math.sin(theta);
      targetCamPos.current.y = radius * Math.cos(phi);
      targetCamPos.current.z = radius * Math.sin(phi) * Math.cos(theta);
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("wheel", handleWheel, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 11. Animation Loop with performance.now()
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Camera Lerp
      camera.position.lerp(targetCamPos.current, 0.06);
      currentCamLook.current.lerp(targetCamLook.current, 0.06);
      camera.lookAt(currentCamLook.current);

      // Auto Turntable Orbit when user is idle in showcase mode
      if (!isUserInteracting.current && config.cameraPreset === "showcase") {
        orbitSpherical.current.theta += delta * 0.12;
        const { radius, theta, phi } = orbitSpherical.current;
        targetCamPos.current.x = radius * Math.sin(phi) * Math.sin(theta);
        targetCamPos.current.y = radius * Math.cos(phi);
        targetCamPos.current.z = radius * Math.sin(phi) * Math.cos(theta);
      }

      // Floating dust particles
      const dPositions = dustGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < dustCount * 3; i += 3) {
        dPositions[i] += delta * 0.15;
        if (dPositions[i] > 6) dPositions[i] = 0.1;
      }
      dustGeo.attributes.position.needsUpdate = true;

      // Warp Hyperspace Particles
      if (warpParticlesRef.current) {
        const wMat = warpParticlesRef.current.material as THREE.PointsMaterial;
        const targetOpacity = isWarpSpeed ? 0.9 : 0;
        wMat.opacity += (targetOpacity - wMat.opacity) * 0.1;

        if (wMat.opacity > 0.02) {
          const wPositions = warpGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < warpCount; i++) {
            wPositions[i * 3 + 2] += delta * (isWarpSpeed ? 45.0 : 5.0) * warpSpeeds[i];
            if (wPositions[i * 3 + 2] > 15) {
              wPositions[i * 3 + 2] = -25;
            }
          }
          warpGeo.attributes.position.needsUpdate = true;
        }
      }

      // Hotspots screen coordinates tracking
      const newScreenHotspots = hotspotPositions.map((hs) => {
        const tempV = hs.pos.clone();
        tempV.project(camera);
        const isBehind = tempV.z > 1.0;
        const x = (tempV.x * 0.5 + 0.5) * width;
        const y = (-(tempV.y * 0.5) + 0.5) * height;
        return {
          id: hs.id,
          title: hs.title,
          x,
          y,
          visible: !isBehind && x >= 0 && x <= width && y >= 0 && y <= height,
        };
      });
      setScreenHotspots(newScreenHotspots);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("wheel", handleWheel);
      pmremGenerator.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="canvas-container"
      ref={containerRef}
      style={{ cursor: isDragging.current ? "grabbing" : "grab", position: "relative", width: "100%", height: "100%" }}
    >
      {/* Three.js Direct Canvas */}
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

      {/* Loading Progress State */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#04060a",
            zIndex: 40,
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              border: "3px solid rgba(0, 240, 255, 0.2)",
              borderTopColor: "var(--bmw-cyan)",
              animation: "pulseGlow 1s ease-in-out infinite",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.1em", color: "#ffffff", marginBottom: "4px" }}>
              LOADING REAL 3D BMW M4 COMPETITION
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--bmw-cyan)", fontWeight: 600 }}>
              {loadProgress > 0 ? `${loadProgress}% ASSETS INITIALIZED` : "PREPARING STUDIO ENVIRONMENT..."}
            </div>
          </div>
        </div>
      )}

      {/* 3D Hotspot Interactive Marker Pins */}
      {!isLoading && screenHotspots.map((hs) => {
        if (!hs.visible) return null;
        const isSelected = config.activeHotspot === hs.id;
        return (
          <button
            key={hs.id}
            onClick={() => {
              audioEngine.playClick(900);
              onSelectHotspot(isSelected ? null : hs.id);
            }}
            style={{
              position: "absolute",
              left: `${hs.x}px`,
              top: `${hs.y}px`,
              transform: "translate(-50%, -50%)",
              zIndex: 20,
              background: isSelected ? "var(--bmw-cyan)" : "rgba(10, 15, 25, 0.85)",
              color: isSelected ? "#05070b" : "#ffffff",
              border: `1.5px solid ${isSelected ? "#ffffff" : "var(--bmw-cyan)"}`,
              borderRadius: "50%",
              width: isSelected ? "32px" : "24px",
              height: isSelected ? "32px" : "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: isSelected ? "0 0 20px #00f0ff" : "0 0 10px rgba(0, 240, 255, 0.4)",
              transition: "all 0.25s ease",
            }}
            title={hs.title}
          >
            <span style={{ fontSize: "11px", fontWeight: "bold" }}>{hs.id + 1}</span>
          </button>
        );
      })}
    </div>
  );
}
