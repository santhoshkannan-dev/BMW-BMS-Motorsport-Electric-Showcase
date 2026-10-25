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
  const grilleGlowMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const underglowLightRef = useRef<THREE.PointLight | null>(null);
  const ceilingLightsRef = useRef<THREE.Group | null>(null);
  const warpParticlesRef = useRef<THREE.Points | null>(null);
  const realCarGroupRef = useRef<THREE.Group | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Default camera target - Front 3/4 low cinematic angle matching the reference studio photo
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(3.6, 1.45, 3.8));
  const targetCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.72, 0.3));
  const currentCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.72, 0.3));

  // Mouse orbit controls
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const orbitSpherical = useRef({ radius: 5.4, theta: 0.76, phi: 1.32 });
  const isUserInteracting = useRef(false);
  const userInteractTimeout = useRef<NodeJS.Timeout | null>(null);

  // 3D Hotspot world coordinates on the BMW M4 / Vision M
  const hotspotPositions = [
    { id: 0, title: "BMW Laserlight", pos: new THREE.Vector3(0.78, 0.72, 2.15), desc: "Adaptive Matrix LED with 600m high-beam laser range" },
    { id: 1, title: "Illuminated Contour Grille", pos: new THREE.Vector3(0, 0.68, 2.38), desc: "Signature frameless active aerodynamic double-kidney grille with neon cyan illumination" },
    { id: 2, title: "M Carbon Ceramic Brakes", pos: new THREE.Vector3(1.05, 0.44, 1.4), desc: "400mm perforated ceramic composite discs with 6-piston calipers" },
    { id: 3, title: "Carbon Fiber Aerokit", pos: new THREE.Vector3(0, 1.45, 0.05), desc: "Lightweight CFR carbon roof lowering center of gravity" },
    { id: 4, title: "M Quad Exhaust & Diffuser", pos: new THREE.Vector3(0, 0.6, -2.3), desc: "Motorsport rear diffuser with dual twin chrome exhaust outlets" },
  ];

  const [screenHotspots, setScreenHotspots] = useState<{ id: number; title: string; x: number; y: number; visible: boolean }[]>([]);

  // Update camera target based on preset
  useEffect(() => {
    switch (config.cameraPreset) {
      case "showcase":
        // Cinematic 3/4 hero view matching reference image
        targetCamPos.current.set(3.6, 1.45, 3.8);
        targetCamLook.current.set(0, 0.72, 0.3);
        orbitSpherical.current = { radius: 5.4, theta: 0.76, phi: 1.32 };
        break;
      case "front":
        targetCamPos.current.set(0, 1.05, 4.6);
        targetCamLook.current.set(0, 0.68, 1.5);
        orbitSpherical.current = { radius: 4.6, theta: 0.0, phi: 1.38 };
        break;
      case "side":
        targetCamPos.current.set(6.2, 1.25, 0);
        targetCamLook.current.set(0, 0.68, 0);
        orbitSpherical.current = { radius: 6.2, theta: Math.PI / 2, phi: 1.35 };
        break;
      case "rear":
        targetCamPos.current.set(-3.2, 1.45, -4.8);
        targetCamLook.current.set(0, 0.72, -1.0);
        orbitSpherical.current = { radius: 5.8, theta: 3.8, phi: 1.32 };
        break;
      case "wheel":
        targetCamPos.current.set(2.2, 0.52, 1.6);
        targetCamLook.current.set(1.05, 0.42, 1.35);
        orbitSpherical.current = { radius: 2.6, theta: 0.95, phi: 1.42 };
        break;
      case "top":
        targetCamPos.current.set(0.1, 7.8, 0.1);
        targetCamLook.current.set(0, 0.6, 0);
        orbitSpherical.current = { radius: 7.8, theta: 0.1, phi: 0.1 };
        break;
    }
  }, [config.cameraPreset]);

  // Update Paint Color dynamically across all body panels
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

  // Update Headlights, Illuminated Grille & Neon Underglow
  useEffect(() => {
    headlightMaterialsRef.current.forEach((mat) => {
      if (config.headlightsOn) {
        mat.emissive.set(0x00f0ff);
        mat.emissiveIntensity = 4.0;
      } else {
        mat.emissive.set(0x000000);
        mat.emissiveIntensity = 0;
      }
      mat.needsUpdate = true;
    });

    if (grilleGlowMaterialRef.current) {
      if (config.headlightsOn) {
        grilleGlowMaterialRef.current.emissive.set(0x00f0ff);
        grilleGlowMaterialRef.current.emissiveIntensity = 3.8;
      } else {
        grilleGlowMaterialRef.current.emissive.set(0x002244);
        grilleGlowMaterialRef.current.emissiveIntensity = 0.5;
      }
      grilleGlowMaterialRef.current.needsUpdate = true;
    }

    if (underglowLightRef.current) {
      underglowLightRef.current.intensity = config.headlightsOn
        ? config.driveMode === "sport"
          ? 4.5
          : 3.5
        : 0;
      underglowLightRef.current.color.set(
        config.driveMode === "sport"
          ? 0xe21b22
          : config.driveMode === "warp"
          ? 0x00f0ff
          : 0x00f0ff
      );
    }
  }, [config.headlightsOn, config.driveMode]);

  // Initialize Three.js scene & load authentic BMW in luxury studio
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x040609);
    scene.fog = new THREE.FogExp2(0x040609, 0.028);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(3.6, 1.45, 3.8);
    camera.lookAt(0, 0.72, 0.3);

    // 3. Renderer with ACES Filmic tone mapping
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // 4. HDRI Studio Environment
    const environment = new RoomEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(environment).texture;
    scene.environment = envTexture;

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Main Key front softbox light
    const keySpot = new THREE.SpotLight(0xffffff, 4.5);
    keySpot.position.set(4, 7, 5);
    keySpot.angle = Math.PI / 4;
    keySpot.penumbra = 0.6;
    keySpot.castShadow = true;
    keySpot.shadow.bias = -0.0004;
    keySpot.shadow.mapSize.width = 2048;
    keySpot.shadow.mapSize.height = 2048;
    scene.add(keySpot);

    // Fill cyan rim light from back-left
    const rimCyan = new THREE.DirectionalLight(0x00f0ff, 2.8);
    rimCyan.position.set(-6, 5, -5);
    scene.add(rimCyan);

    // Warm ambient accent from luxury office side
    const warmLoungeLight = new THREE.PointLight(0xffaa55, 1.8, 16);
    warmLoungeLight.position.set(-7, 3, 2);
    scene.add(warmLoungeLight);

    // Subtle blue fill from front-right
    const fillBlue = new THREE.DirectionalLight(0x0066cc, 1.5);
    fillBlue.position.set(5, 3, 3);
    scene.add(fillBlue);

    // Neon cyan ground underglow
    const underglow = new THREE.PointLight(0x00f0ff, 3.5, 8);
    underglow.position.set(0, 0.15, 0);
    underglowLightRef.current = underglow;
    scene.add(underglow);

    // 6. BUILD LUXURY ARCHITECTURAL SHOWROOM (Matching Reference Image)
    const studioGroup = new THREE.Group();

    // A. Dark Polished Epoxy Concrete Floor
    const floorGeo = new THREE.PlaneGeometry(50, 50);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x070a0f,
      roughness: 0.14,
      metalness: 0.9,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    studioGroup.add(floor);

    // B. Floor Projected Typographic Graphics: "BMW VISION M" & "///M CONCEPT"
    const floorCanvas = document.createElement("canvas");
    floorCanvas.width = 1024;
    floorCanvas.height = 512;
    const fctx = floorCanvas.getContext("2d")!;
    fctx.clearRect(0, 0, 1024, 512);

    // Left text: BMW VISION M
    fctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    fctx.fillStyle = "rgba(230, 245, 255, 0.85)";
    fctx.fillText("BMW VISION M", 80, 280);

    // Right text: ///M CONCEPT
    // Draw M stripes
    const barW = 10;
    const barH = 34;
    const barY = 246;
    fctx.save();
    fctx.transform(1, 0, -0.28, 1, 0, 0); // slant M stripes
    fctx.fillStyle = "#0066b1"; // Light Blue
    fctx.fillRect(630, barY, barW, barH);
    fctx.fillStyle = "#002f6c"; // Dark Blue
    fctx.fillRect(644, barY, barW, barH);
    fctx.fillStyle = "#e21b22"; // Red
    fctx.fillRect(658, barY, barW, barH);
    fctx.restore();

    fctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    fctx.fillStyle = "#ffffff";
    fctx.fillText("M CONCEPT", 680, 280);

    const floorDecalTex = new THREE.CanvasTexture(floorCanvas);
    const floorDecalGeo = new THREE.PlaneGeometry(5.2, 2.6);
    const floorDecalMat = new THREE.MeshBasicMaterial({
      map: floorDecalTex,
      transparent: true,
      opacity: 0.9,
    });
    const floorDecal = new THREE.Mesh(floorDecalGeo, floorDecalMat);
    floorDecal.rotation.x = -Math.PI / 2;
    floorDecal.position.set(-0.15, 0.003, 2.5);
    studioGroup.add(floorDecal);

    // C. Overhead Suspended Geometric Cyan Neon Tube Beams (Matching Reference Image)
    const ceilingGroup = new THREE.Group();
    ceilingLightsRef.current = ceilingGroup;

    const neonMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const beamRadius = 0.04;

    // Helper to create glowing linear light bar
    const createNeonBar = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
      const p1 = new THREE.Vector3(x1, y1, z1);
      const p2 = new THREE.Vector3(x2, y2, z2);
      const dist = p1.distanceTo(p2);
      const barGeo = new THREE.CylinderGeometry(beamRadius, beamRadius, dist, 16);
      const bar = new THREE.Mesh(barGeo, neonMat);

      bar.position.copy(p1).add(p2).multiplyScalar(0.5);
      bar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
      ceilingGroup.add(bar);

      const light = new THREE.PointLight(0x00f0ff, 1.8, 8);
      light.position.copy(bar.position);
      ceilingGroup.add(light);
    };

    // Overhead Outer Rectangular Light Loop (visible in camera frame at y = 2.9)
    createNeonBar(-3.8, 2.85, -4.2, 3.8, 2.85, -4.2);
    createNeonBar(3.8, 2.85, -4.2, 3.8, 2.85, 3.8);
    createNeonBar(3.8, 2.85, 3.8, -3.8, 2.85, 3.8);
    createNeonBar(-3.8, 2.85, 3.8, -3.8, 2.85, -4.2);

    // Upper Accent Rectangular Light Loop (y = 3.6)
    createNeonBar(-2.5, 3.6, -2.5, 2.5, 3.6, -2.5);
    createNeonBar(2.5, 3.6, -2.5, 2.5, 3.6, 2.8);
    createNeonBar(2.5, 3.6, 2.8, -2.5, 3.6, 2.8);
    createNeonBar(-2.5, 3.6, 2.8, -2.5, 3.6, -2.5);

    studioGroup.add(ceilingGroup);

    // D. Architectural Showroom Background Walls & Glass Partitions
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x141822, metalness: 0.85, roughness: 0.35 });
    const glassPartitionMat = new THREE.MeshPhysicalMaterial({
      color: 0x0d1522,
      metalness: 0.3,
      roughness: 0.08,
      transmission: 0.8,
      transparent: true,
      opacity: 0.65,
    });

    // Back architectural structural columns (I-beams)
    [-6, -2, 2, 6].forEach((xPos) => {
      const colGeo = new THREE.BoxGeometry(0.35, 8, 0.35);
      const col = new THREE.Mesh(colGeo, steelMat);
      col.position.set(xPos, 4, -7.5);
      studioGroup.add(col);
    });

    // Horizontal ceiling cross-girders
    const girderGeo = new THREE.BoxGeometry(16, 0.3, 0.3);
    const girder1 = new THREE.Mesh(girderGeo, steelMat);
    girder1.position.set(0, 6.2, -7.5);
    studioGroup.add(girder1);

    // Tinted Glass Office Partition Wall on the left (as in reference image)
    const glassWallGeo = new THREE.BoxGeometry(0.08, 5, 12);
    const glassWall = new THREE.Mesh(glassWallGeo, glassPartitionMat);
    glassWall.position.set(-6.5, 2.5, 0);
    studioGroup.add(glassWall);

    // Black frame for glass wall
    const wallFrameGeo = new THREE.BoxGeometry(0.12, 0.12, 12);
    const wallFrameTop = new THREE.Mesh(wallFrameGeo, steelMat);
    wallFrameTop.position.set(-6.5, 5.0, 0);
    studioGroup.add(wallFrameTop);

    // Ambient illuminated back wall panels (right side in reference photo)
    const backPanelGeo = new THREE.PlaneGeometry(3.5, 4.5);
    const backPanelMat = new THREE.MeshBasicMaterial({ color: 0x0a203c });
    const backPanel = new THREE.Mesh(backPanelGeo, backPanelMat);
    backPanel.position.set(5.5, 2.6, -7.4);
    studioGroup.add(backPanel);

    const backPanelLight = new THREE.PointLight(0x0088ff, 2.0, 8);
    backPanelLight.position.set(5.5, 2.6, -7.0);
    studioGroup.add(backPanelLight);

    // Soft Contact Shadow Plane directly beneath the vehicle
    const shadowGeo = new THREE.PlaneGeometry(5.4, 2.8);
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext("2d")!;
    const grad = sctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, "rgba(0,0,0,0.92)");
    grad.addColorStop(0.5, "rgba(0,0,0,0.48)");
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
    shadowPlane.position.y = 0.002;
    studioGroup.add(shadowPlane);

    scene.add(studioGroup);

    // 7. Ambient Micro-Dust Particles
    const dustCount = 180;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 16;
      dustPositions[i + 1] = Math.random() * 5 + 0.2;
      dustPositions[i + 2] = (Math.random() - 0.5) * 16;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.03,
      transparent: true,
      opacity: 0.5,
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

        // Create unified luxury automotive body paint shader
        const unifiedBodyPaint = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(config.paintColor),
          metalness: 0.9,
          roughness: 0.14,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04,
          reflectivity: 0.98,
          envMapIntensity: 2.8,
        });
        carBodyMaterialsRef.current.push(unifiedBodyPaint);

        // Traverse meshes and configure materials
        carModel.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            const mat = child.material;
            const matName = (mat?.name || "").toLowerCase();

            // A. Car Body Paint - MUST catch all exterior body panels!
            // Including Object_8 (Mesheswhite41Mtl), Object_23 (Meshesbody151Mtl), livery, ff41, zx1
            if (
              matName.includes("body") ||
              matName.includes("white41") ||
              matName.includes("livery") ||
              matName.includes("zx1") ||
              matName.includes("ff41") ||
              child.name === "Object_8" ||
              child.name === "Object_23" ||
              child.name === "Object_28" ||
              child.name === "Object_30"
            ) {
              child.material = unifiedBodyPaint;
            }
            // B. Iconic Kidney Grille with Neon Cyan Contour Glow (Matching Reference Image)
            else if (matName.includes("grill") || child.name === "Object_5") {
              const grilleMat = new THREE.MeshStandardMaterial({
                color: 0x00f0ff,
                emissive: new THREE.Color(0x00f0ff),
                emissiveIntensity: 4.8,
                metalness: 0.8,
                roughness: 0.1,
              });
              child.material = grilleMat;
              grilleGlowMaterialRef.current = grilleMat;
            }
            // Radiator behind grille (dark metallic black)
            else if (matName.includes("raidiator") || matName.includes("radiator") || child.name === "Object_9") {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x05070a,
                metalness: 0.9,
                roughness: 0.6,
              });
            }
            // C. Tinted Glass & Windows
            else if (matName.includes("window") || matName.includes("glass") || child.name === "Object_25") {
              child.material = new THREE.MeshPhysicalMaterial({
                color: 0x08101a,
                metalness: 0.15,
                roughness: 0.04,
                transmission: 0.88,
                transparent: true,
                opacity: 0.8,
                envMapIntensity: 2.8,
              });
            }
            // D. Brake Calipers
            else if (matName.includes("caliper") || child.name === "Object_32") {
              const calMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(config.caliperColor),
                metalness: 0.85,
                roughness: 0.25,
                envMapIntensity: 1.8,
              });
              child.material = calMat;
              caliperMaterialsRef.current.push(calMat);
            }
            // E. Alloy Rims
            else if (matName.includes("rim") || matName.includes("wheel") || child.name === "Object_33" || child.name === "Object_34") {
              const rimMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color(config.rimColor),
                metalness: 0.94,
                roughness: 0.16,
                envMapIntensity: 2.5,
              });
              child.material = rimMat;
              rimMaterialsRef.current.push(rimMat);
            }
            // F. Laserlights & LED DRLs (Matching Reference Image)
            else if (matName.includes("headlight") || matName.includes("led") || child.name === "Object_13" || child.name === "Object_22") {
              const headMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                emissive: new THREE.Color(0x00f0ff),
                emissiveIntensity: 4.2,
                roughness: 0.1,
                metalness: 0.7,
              });
              child.material = headMat;
              headlightMaterialsRef.current.push(headMat);
            }
            // G. Taillights
            else if (matName.includes("redlight") || matName.includes("tail") || child.name === "Object_17" || child.name === "Object_29") {
              child.material = new THREE.MeshStandardMaterial({
                color: 0xff1028,
                emissive: new THREE.Color(0xff1525),
                emissiveIntensity: 2.4,
                roughness: 0.18,
              });
            }
            // H. Carbon Fiber & Black Trims (Roof, Pillars, Mirrors, Diffuser)
            else if (matName.includes("black") || matName.includes("pillar") || child.name === "Object_4" || child.name === "Object_11" || child.name === "Object_24") {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x0f1115,
                metalness: 0.7,
                roughness: 0.3,
                envMapIntensity: 1.8,
              });
            }
          }
        });

        // Add 2 real Projector Headlight Spotlights shining forward
        const headSpotL = new THREE.SpotLight(0x00f0ff, 4.5, 20, Math.PI / 6, 0.4);
        headSpotL.position.set(-0.75, 0.7, 2.3);
        headSpotL.target.position.set(-1.0, 0, 10);
        carModel.add(headSpotL);
        carModel.add(headSpotL.target);

        const headSpotR = new THREE.SpotLight(0x00f0ff, 4.5, 20, Math.PI / 6, 0.4);
        headSpotR.position.set(0.75, 0.7, 2.3);
        headSpotR.target.position.set(1.0, 0, 10);
        carModel.add(headSpotR);
        carModel.add(headSpotR.target);

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

      orbitSpherical.current.theta -= dx * 0.0055;
      orbitSpherical.current.phi = Math.max(0.12, Math.min(Math.PI / 2 - 0.04, orbitSpherical.current.phi - dy * 0.0045));

      const { radius, theta, phi } = orbitSpherical.current;
      targetCamPos.current.x = radius * Math.sin(phi) * Math.sin(theta);
      targetCamPos.current.y = radius * Math.cos(phi);
      targetCamPos.current.z = radius * Math.sin(phi) * Math.cos(theta);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      userInteractTimeout.current = setTimeout(() => {
        isUserInteracting.current = false;
      }, 6000);
    };

    const handleWheel = (e: WheelEvent) => {
      orbitSpherical.current.radius = Math.max(2.8, Math.min(10.0, orbitSpherical.current.radius + e.deltaY * 0.004));
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

    // 11. Animation Render Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth Camera Lerp
      camera.position.lerp(targetCamPos.current, 0.055);
      currentCamLook.current.lerp(targetCamLook.current, 0.055);
      camera.lookAt(currentCamLook.current);

      // Gentle subtle turntable breathe if idle
      if (!isUserInteracting.current && config.cameraPreset === "showcase") {
        orbitSpherical.current.theta += delta * 0.08;
        const { radius, theta, phi } = orbitSpherical.current;
        targetCamPos.current.x = radius * Math.sin(phi) * Math.sin(theta);
        targetCamPos.current.y = radius * Math.cos(phi);
        targetCamPos.current.z = radius * Math.sin(phi) * Math.cos(theta);
      }

      // Floating dust particles
      const dPositions = dustGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < dustCount * 3; i += 3) {
        dPositions[i] += delta * 0.12;
        if (dPositions[i] > 5) dPositions[i] = 0.2;
      }
      dustGeo.attributes.position.needsUpdate = true;

      // Warp Mode Hyperspace Particles
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
              INITIALIZING BMW VISION M STUDIO
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--bmw-cyan)", fontWeight: 600 }}>
              {loadProgress > 0 ? `${loadProgress}% ASSETS INITIALIZED` : "PREPARING ARCHITECTURAL LIGHTING..."}
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
