import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BodyRegion, UrgencyLevel } from '../types/health';
import { BodyMap2D } from './BodyMap2D';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  Eye,
  Layers,
  Activity,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Flame,
  Radio,
  Compass,
} from 'lucide-react';

interface BodyAvatar3DProps {
  symptomRegions: {
    region: BodyRegion;
    urgency: UrgencyLevel;
    symptomNamesHindi: string[];
  }[];
  onSelectRegion?: (region: BodyRegion) => void;
  selectedRegion?: BodyRegion | null;
}

interface RegionPosition {
  pos: [number, number, number];
  nameHindi: string;
  nameEng: string;
}

const REGION_COORDS: Record<BodyRegion, RegionPosition> = {
  head: { pos: [0, 1.45, 0], nameHindi: 'सिर एवं मस्तिष्क', nameEng: 'Head & Brain' },
  neck: { pos: [0, 1.08, 0], nameHindi: 'गला एवं थायरॉइड', nameEng: 'Neck & Throat' },
  chest: { pos: [0, 0.65, 0.08], nameHindi: 'छाती, हृदय एवं फेफड़े', nameEng: 'Chest, Heart & Lungs' },
  abdomen: { pos: [0, 0.12, 0.06], nameHindi: 'पेट एवं आंतरिक पाचन अंग', nameEng: 'Abdomen & Digestive Organs' },
  back: { pos: [0, 0.45, -0.15], nameHindi: 'पीठ एवं रीढ़ की हड्डी', nameEng: 'Back & Spine' },
  arms: { pos: [0.65, 0.5, 0], nameHindi: 'बाँहें एवं हाथ', nameEng: 'Arms & Hands' },
  legs: { pos: [0.24, -0.75, 0], nameHindi: 'पैर, घुटने एवं जोड़', nameEng: 'Legs, Knees & Joints' },
  skin: { pos: [0, 0.4, 0.3], nameHindi: 'त्वचा (संपूर्ण शरीर)', nameEng: 'Skin & Body Surface' },
  general: { pos: [0, 0.7, 0], nameHindi: 'संपूर्ण शरीर (बुखार/कमजोरी)', nameEng: 'Generalized Body' },
};

export const BodyAvatar3D: React.FC<BodyAvatar3DProps> = ({
  symptomRegions,
  onSelectRegion,
  selectedRegion,
}) => {
  const [viewMode, setViewMode] = useState<'3d' | 'sketchfab' | '2d'>('3d');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(false);
  const [activeRegionInfo, setActiveRegionInfo] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const bodyGroupRef = useRef<THREE.Group | null>(null);
  const heartMeshRef = useRef<THREE.Mesh | null>(null);
  const beaconRingsRef = useRef<THREE.Mesh[]>([]);
  const regionMeshesRef = useRef<Map<BodyRegion, THREE.Mesh[]>>(new Map());
  const redZonedMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  const sketchfabModelId = '9b0b079953b840bc9a13f524b60041e4';
  const sketchfabEmbedUrl = `https://sketchfab.com/models/${sketchfabModelId}/embed?autostart=1&preload=1&ui_theme=dark&autospin=0.1&ui_hint=2`;
  const sketchfabDirectUrl = `https://sketchfab.com/3d-models/animated-full-human-body-anatomy-${sketchfabModelId}`;

  // Check if a region is harmed / red-zoned
  const isRegionHarmed = (region: BodyRegion): boolean => {
    return symptomRegions.some(
      (sr) =>
        sr.region === region ||
        (region === 'chest' && sr.region === 'general') ||
        (region === 'head' && sr.region === 'general')
    );
  };

  const getHarmedSymptoms = (region: BodyRegion): string[] => {
    const found = symptomRegions.find((sr) => sr.region === region);
    if (found) return found.symptomNamesHindi;
    if (region === 'chest' || region === 'head') {
      const gen = symptomRegions.find((sr) => sr.region === 'general');
      if (gen) return gen.symptomNamesHindi;
    }
    return [];
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    }
  };

  // Build and Initialize Three.js Anatomical 3D Model
  useEffect(() => {
    if (viewMode !== '3d' || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 320;
    const height = 440;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d16); // Deep clinical sci-fi dark
    scene.fog = new THREE.FogExp2(0x090d16, 0.08);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 4.4);
    cameraRef.current = camera;

    // 3. Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch {
      setViewMode('2d');
      return;
    }

    // 4. Orbit Controls (360° Drag & Smooth Interaction)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.6;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI * 0.92;
    controls.minPolarAngle = Math.PI * 0.08;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xecfeff, 1.4);
    keyLight.position.set(3, 4, 3.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x0284c7, 1.1);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    const redWarningLight = new THREE.PointLight(0xef4444, 1.8, 8);
    redWarningLight.position.set(0, 0.6, 1.8);
    scene.add(redWarningLight);

    // Studio medical floor grid
    const grid = new THREE.GridHelper(5, 12, 0x0284c7, 0x1e293b);
    grid.position.y = -1.65;
    scene.add(grid);

    // 6. Body Group
    const bodyGroup = new THREE.Group();
    bodyGroupRef.current = bodyGroup;
    scene.add(bodyGroup);

    const meshMap = new Map<BodyRegion, THREE.Mesh[]>();
    const redMaterials: THREE.MeshStandardMaterial[] = [];
    const beaconRings: THREE.Mesh[] = [];

    // Factory to create anatomical body parts
    const addPart = (
      geo: THREE.BufferGeometry,
      region: BodyRegion,
      pos: [number, number, number],
      rot?: [number, number, number],
      scale?: [number, number, number],
      isTranslucentSkin = false
    ) => {
      const harmed = isRegionHarmed(region);
      const isSelected = selectedRegion === region;

      let mat: THREE.MeshStandardMaterial;

      if (isTranslucentSkin) {
        // Outer anatomical silhouette shell
        mat = new THREE.MeshStandardMaterial({
          color: harmed ? 0xf87171 : 0x38bdf8,
          emissive: harmed ? 0xef4444 : 0x0284c7,
          emissiveIntensity: harmed ? 0.35 : 0.08,
          transparent: true,
          opacity: harmed ? 0.45 : 0.22,
          roughness: 0.2,
          metalness: 0.1,
          wireframe: false,
        });
      } else if (harmed) {
        // RED ZONE CRITICAL / HARMED MATERIAL
        mat = new THREE.MeshStandardMaterial({
          color: 0xdc2626, // Crimson red
          emissive: 0xef4444, // Bright red glow
          emissiveIntensity: isSelected ? 0.95 : 0.65,
          roughness: 0.28,
          metalness: 0.35,
        });
        redMaterials.push(mat);
      } else {
        // Normal anatomical medical teal-slate
        mat = new THREE.MeshStandardMaterial({
          color: 0x475569, // Clinical Slate
          emissive: 0x0f172a,
          emissiveIntensity: 0.05,
          roughness: 0.45,
          metalness: 0.2,
        });
      }

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      if (rot) mesh.rotation.set(...rot);
      if (scale) mesh.scale.set(...scale);
      mesh.userData = { region, isHarmed: harmed };
      bodyGroup.add(mesh);

      const existing = meshMap.get(region) || [];
      existing.push(mesh);
      meshMap.set(region, existing);

      return mesh;
    };

    // --- ANATOMICAL CONSTRUCTION ---

    // 1. HEAD & BRAIN (सिर एवं मस्तिष्क)
    // Cranium
    addPart(new THREE.SphereGeometry(0.33, 32, 28), 'head', [0, 1.48, 0], [0, 0, 0], [0.92, 1.08, 0.96]);
    // Jaw & Chin
    addPart(new THREE.CylinderGeometry(0.18, 0.12, 0.24, 20), 'head', [0, 1.25, 0.06]);
    // Left Brain Hemisphere
    addPart(new THREE.SphereGeometry(0.16, 24, 20), 'head', [-0.08, 1.5, 0.01], [0, 0, 0], [0.85, 0.95, 1.15]);
    // Right Brain Hemisphere
    addPart(new THREE.SphereGeometry(0.16, 24, 20), 'head', [0.08, 1.5, 0.01], [0, 0, 0], [0.85, 0.95, 1.15]);

    // 2. NECK & THROAT (गला एवं थायरॉइड)
    addPart(new THREE.CylinderGeometry(0.13, 0.15, 0.24, 24), 'neck', [0, 1.08, 0]);
    // Trachea / Thyroid contour
    addPart(new THREE.TorusGeometry(0.11, 0.025, 12, 24), 'neck', [0, 1.08, 0.04], [Math.PI / 2, 0, 0]);

    // 3. CHEST & THORAX (छाती, पसलियां, हृदय और फेफड़े)
    // Ribcage / Pectoral Thorax
    addPart(new THREE.CylinderGeometry(0.46, 0.38, 0.62, 32), 'chest', [0, 0.68, 0], [0, 0, 0], [1.1, 1.0, 0.88]);
    // Sternum (Breastbone)
    addPart(new THREE.BoxGeometry(0.08, 0.42, 0.05), 'chest', [0, 0.72, 0.18]);
    // Clavicles (Collarbones)
    addPart(new THREE.CylinderGeometry(0.03, 0.03, 0.72, 16), 'chest', [0, 0.96, 0.08], [0, 0, Math.PI / 2]);

    // INTERNAL ORGAN: PULSING HEART (हृदय)
    const heartGeo = new THREE.DodecahedronGeometry(0.13, 1);
    const heartMat = new THREE.MeshStandardMaterial({
      color: isRegionHarmed('chest') ? 0xff0000 : 0xe11d48,
      emissive: isRegionHarmed('chest') ? 0xef4444 : 0xbe123c,
      emissiveIntensity: isRegionHarmed('chest') ? 0.9 : 0.45,
      roughness: 0.3,
      metalness: 0.4,
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.position.set(-0.06, 0.68, 0.09);
    heartMesh.scale.set(1.0, 1.25, 0.85);
    bodyGroup.add(heartMesh);
    heartMeshRef.current = heartMesh;

    // Aorta arch on top of heart
    addPart(new THREE.TorusGeometry(0.06, 0.022, 12, 16, Math.PI * 0.9), 'chest', [-0.05, 0.82, 0.07], [0, 0, -0.4]);

    // INTERNAL ORGANS: LUNGS (फेफड़े)
    // Left Lung
    addPart(new THREE.CapsuleGeometry(0.12, 0.28, 16, 16), 'chest', [-0.22, 0.68, 0.03], [0, 0, 0.08], [0.95, 1, 0.7]);
    // Right Lung
    addPart(new THREE.CapsuleGeometry(0.12, 0.28, 16, 16), 'chest', [0.22, 0.68, 0.03], [0, 0, -0.08], [0.95, 1, 0.7]);

    // 4. ABDOMEN & DIGESTIVE SYSTEM (पेट एवं आंतरिक अंग)
    // Abdominal Torso Wall
    addPart(new THREE.CylinderGeometry(0.38, 0.42, 0.52, 32), 'abdomen', [0, 0.16, 0], [0, 0, 0], [1.05, 1.0, 0.85]);
    // Stomach (आमाशय)
    addPart(new THREE.TorusGeometry(0.12, 0.06, 16, 24, Math.PI * 0.85), 'abdomen', [0.08, 0.26, 0.1], [0, 0, 0.5]);
    // Liver (यकृत)
    addPart(new THREE.BoxGeometry(0.24, 0.14, 0.12), 'abdomen', [-0.14, 0.28, 0.08], [0, 0, -0.15]);
    // Intestines (आंतें)
    addPart(new THREE.TorusGeometry(0.16, 0.05, 14, 28), 'abdomen', [0, 0.02, 0.09], [Math.PI / 2, 0, 0]);

    // 5. SPINE & BACK (रीढ़ की हड्डी एवं पीठ)
    for (let i = 0; i < 9; i++) {
      addPart(new THREE.CylinderGeometry(0.045, 0.045, 0.05, 16), 'back', [0, 0.15 + i * 0.1, -0.16], [Math.PI / 2, 0, 0]);
    }
    // Shoulder blades (Scapulae)
    addPart(new THREE.BoxGeometry(0.22, 0.26, 0.02), 'back', [-0.22, 0.76, -0.16], [0, 0.2, 0.1]);
    addPart(new THREE.BoxGeometry(0.22, 0.26, 0.02), 'back', [0.22, 0.76, -0.16], [0, -0.2, -0.1]);

    // 6. ARMS & HANDS (बाँहें एवं हाथ)
    // Left Shoulder & Arm
    addPart(new THREE.SphereGeometry(0.12, 20, 20), 'arms', [-0.58, 0.86, 0]);
    addPart(new THREE.CylinderGeometry(0.095, 0.085, 0.46, 20), 'arms', [-0.64, 0.6, 0], [0, 0, 0.1]);
    addPart(new THREE.SphereGeometry(0.08, 16, 16), 'arms', [-0.69, 0.34, 0]);
    addPart(new THREE.CylinderGeometry(0.08, 0.065, 0.44, 20), 'arms', [-0.73, 0.1, 0], [0, 0, 0.08]);
    addPart(new THREE.BoxGeometry(0.06, 0.14, 0.04), 'arms', [-0.75, -0.18, 0]);

    // Right Shoulder & Arm
    addPart(new THREE.SphereGeometry(0.12, 20, 20), 'arms', [0.58, 0.86, 0]);
    addPart(new THREE.CylinderGeometry(0.095, 0.085, 0.46, 20), 'arms', [0.64, 0.6, 0], [0, 0, -0.1]);
    addPart(new THREE.SphereGeometry(0.08, 16, 16), 'arms', [0.69, 0.34, 0]);
    addPart(new THREE.CylinderGeometry(0.08, 0.065, 0.44, 20), 'arms', [0.73, 0.1, 0], [0, 0, -0.08]);
    addPart(new THREE.BoxGeometry(0.06, 0.14, 0.04), 'arms', [0.75, -0.18, 0]);

    // 7. PELVIS & LEGS (श्रोणि, पैर, घुटने एवं जोड़)
    // Pelvic girdle
    addPart(new THREE.CylinderGeometry(0.42, 0.32, 0.32, 28), 'legs', [0, -0.22, 0], [0, 0, 0], [1.1, 1, 0.85]);

    // Left Leg
    addPart(new THREE.CylinderGeometry(0.14, 0.11, 0.62, 24), 'legs', [-0.22, -0.62, 0], [0, 0, -0.04]);
    // Left Knee Patella (joint)
    addPart(new THREE.SphereGeometry(0.1, 20, 20), 'legs', [-0.24, -0.98, 0.03]);
    addPart(new THREE.CylinderGeometry(0.1, 0.085, 0.62, 24), 'legs', [-0.25, -1.34, 0]);
    // Left Foot
    addPart(new THREE.BoxGeometry(0.12, 0.08, 0.28), 'legs', [-0.25, -1.68, 0.08]);

    // Right Leg
    addPart(new THREE.CylinderGeometry(0.14, 0.11, 0.62, 24), 'legs', [0.22, -0.62, 0], [0, 0, 0.04]);
    // Right Knee Patella (joint)
    addPart(new THREE.SphereGeometry(0.1, 20, 20), 'legs', [0.24, -0.98, 0.03]);
    addPart(new THREE.CylinderGeometry(0.1, 0.085, 0.62, 24), 'legs', [0.25, -1.34, 0]);
    // Right Foot
    addPart(new THREE.BoxGeometry(0.12, 0.08, 0.28), 'legs', [0.25, -1.68, 0.08]);

    // 8. TRANSLUCENT ANATOMICAL SILHOUETTE (Glass Outer Shell)
    addPart(new THREE.CapsuleGeometry(0.49, 1.15, 24, 24), 'chest', [0, 0.44, 0], undefined, undefined, true);

    // 9. 3D BEACON ALERT RINGS FOR HARMED PARTS
    symptomRegions.forEach((sr) => {
      const coord = REGION_COORDS[sr.region];
      if (!coord) return;

      const ringGeo = new THREE.TorusGeometry(0.38, 0.02, 16, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        transparent: true,
        opacity: 0.85,
        wireframe: true,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(...coord.pos);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.userData = { isBeacon: true, basePos: coord.pos };
      bodyGroup.add(ringMesh);
      beaconRings.push(ringMesh);
    });

    regionMeshesRef.current = meshMap;
    redZonedMaterialsRef.current = redMaterials;
    beaconRingsRef.current = beaconRings;

    // 10. ANIMATION LOOP
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Controls update
      controls.update();

      // Auto-spin if enabled
      if (isAutoSpin && bodyGroupRef.current) {
        bodyGroupRef.current.rotation.y += 0.008;
      }

      // PULSING RED ZONE SHADER EFFECT
      const redPulse = 0.55 + 0.45 * Math.sin(elapsed * 4.2);
      redMaterials.forEach((m) => {
        m.emissiveIntensity = redPulse;
      });

      // HEARTBEAT PULSE ANIMATION
      if (heartMeshRef.current) {
        const beat = 1 + 0.08 * Math.sin(elapsed * 7.5);
        heartMeshRef.current.scale.set(beat, beat * 1.25, beat * 0.85);
      }

      // HARMED ZONE 3D BEACON EXPANSION ANIMATION
      beaconRings.forEach((ring, idx) => {
        const wave = (elapsed * 1.5 + idx * 0.6) % 1;
        const scale = 0.8 + wave * 0.8;
        ring.scale.set(scale, scale, scale);
        (ring.material as THREE.MeshBasicMaterial).opacity = (1 - wave) * 0.9;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 11. RESIZE HANDLER
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 440;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [viewMode, symptomRegions, selectedRegion, isAutoSpin]);

  // Camera presets
  const focusCameraOn = (pos: [number, number, number], targetY: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(pos[0], pos[1], pos[2]);
    controlsRef.current.target.set(0, targetY, 0);
    controlsRef.current.update();
  };

  const setFrontView = () => focusCameraOn([0, 0.25, 4.4], 0.2);
  const setBackView = () => focusCameraOn([0, 0.25, -4.4], 0.2);
  const setChestView = () => focusCameraOn([0, 0.7, 2.2], 0.68);
  const setHeadView = () => focusCameraOn([0, 1.5, 1.8], 1.48);
  const setAbdomenView = () => focusCameraOn([0, 0.15, 2.2], 0.15);

  const getRegionHindiName = (reg: BodyRegion): string => {
    return REGION_COORDS[reg]?.nameHindi || reg;
  };

  const harmedRegionsList = symptomRegions;

  return (
    <div
      ref={containerRef}
      className={`w-full bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl space-y-4 text-white ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto bg-slate-950 p-6' : ''
      }`}
    >
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-900/50">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>3D शारीरिक एनाटॉमी & रेड ज़ोन दृश्य</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-600 text-white shadow-sm shadow-red-900">
                  RED ZONED
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                प्रभावित व दर्द वाले शारीरिक अंग जीवंत <span className="text-red-400 font-bold">लाल रंग (Red Zoned)</span> में चमक रहे हैं
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === '3d'
                ? 'bg-red-600 text-white shadow-md shadow-red-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>3D रेड ज़ोन मॉडल</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('sketchfab')}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'sketchfab'
                ? 'bg-red-600 text-white shadow-md shadow-red-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sketchfab एनाटॉमी</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              viewMode === '2d'
                ? 'bg-red-600 text-white shadow-md shadow-red-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D मानचित्र</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Three.js Interactive 3D Model with Active Red-Zoning */}
      {viewMode === '3d' && (
        <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
          {/* Top Bar inside 3D Viewer */}
          <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Red Zone Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-red-500/40 text-red-200 text-xs font-bold pointer-events-auto shadow-lg shadow-black/50">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              <span>
                {harmedRegionsList.length > 0
                  ? `${harmedRegionsList.length} शारीरिक अंग रेड ज़ोन (हार्म) में हैं`
                  : 'कोई गंभीर अंग प्रभावित नहीं है'}
              </span>
            </div>

            {/* Quick Actions (Fullscreen, Auto-spin) */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsAutoSpin(!isAutoSpin)}
                className={`p-2 rounded-xl backdrop-blur-md border text-xs font-semibold shadow-md transition-all flex items-center gap-1 ${
                  isAutoSpin
                    ? 'bg-red-600 text-white border-red-400 shadow-red-900'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                }`}
                title="360° निरंतर घुमाव (Auto-Spin)"
              >
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">360° स्वतः घुमाव</span>
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md text-white border border-slate-700/60 shadow-md transition-all"
                title={isFullscreen ? 'सामान्य दृश्य' : 'फुलस्क्रीन में देखें'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Three.js Canvas Mount Container */}
          <div
            ref={mountRef}
            className="w-full h-96 sm:h-[480px] md:h-[520px] cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
          />

          {/* Floating Camera Angle Selector (Right Side) */}
          <div className="absolute top-16 right-3 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold px-1 text-center">
              कैमरा
            </span>
            <button
              onClick={setFrontView}
              className="text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors text-left"
              title="सामने का दृश्य"
            >
              सामने
            </button>
            <button
              onClick={setBackView}
              className="text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors text-left"
              title="पीठ / रीढ़ का दृश्य"
            >
              पीठ (Back)
            </button>
            <button
              onClick={setHeadView}
              className="text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors text-left"
              title="सिर एवं मस्तिष्क ज़ूम"
            >
              सिर (Head)
            </button>
            <button
              onClick={setChestView}
              className="text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors text-left"
              title="छाती एवं हृदय ज़ूम"
            >
              छाती (Chest)
            </button>
            <button
              onClick={setAbdomenView}
              className="text-[11px] px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors text-left"
              title="पेट एवं पाचन अंग"
            >
              पेट (Abdomen)
            </button>
            <button
              onClick={setFrontView}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center"
              title="रीसेट करें"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Interactive Hint */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-300 text-[11px] font-medium pointer-events-auto shadow-md">
              💡 360° घुमाने के लिए खींचें • ज़ूम करने के लिए स्क्रॉल करें • रेड ज़ोन अंग पर क्लिक करें
            </span>
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="inline-flex items-center gap-1 text-[11px] text-red-400 font-bold bg-slate-900/90 px-2.5 py-1 rounded-full border border-red-500/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                लाल: प्रभावित अंग (Harmed)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                स्लेटी: सामान्य
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Sketchfab Animated Anatomy Model */}
      {viewMode === 'sketchfab' && (
        <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg">
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white text-[11px] font-semibold pointer-events-auto">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sketchfab 3D Animated Full Anatomy</span>
            </span>
            <a
              href={sketchfabDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-white border border-slate-700 text-xs font-medium pointer-events-auto"
            >
              <span>Sketchfab पर खोलें</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <iframe
            title="Animated Full Human Body Anatomy"
            src={sketchfabEmbedUrl}
            className="w-full h-80 sm:h-[480px] md:h-[520px] border-0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
        </div>
      )}

      {/* Mode 3: 2D Body Map */}
      {viewMode === '2d' && (
        <BodyMap2D
          symptomRegions={symptomRegions}
          onSelectRegion={onSelectRegion}
          selectedRegion={selectedRegion}
        />
      )}

      {/* Interactive Harmed Red Zone Part Badges & Details */}
      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wide flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
            <span>पहचाने गए रेड ज़ोन शारीरिक अंग (Harmed Body Parts):</span>
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {harmedRegionsList.length > 0 ? `${harmedRegionsList.length} अंग चिह्नित` : 'कोई अंग प्रभावित नहीं'}
          </span>
        </div>

        {harmedRegionsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {harmedRegionsList.map((sr, idx) => {
              const isSelected = selectedRegion === sr.region;
              const coord = REGION_COORDS[sr.region];
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    onSelectRegion?.(sr.region);
                    setActiveRegionInfo(
                      `${getRegionHindiName(sr.region)}: ${sr.symptomNamesHindi.join(', ')}`
                    );
                    if (coord && viewMode === '3d') {
                      focusCameraOn([coord.pos[0] * 1.5, coord.pos[1], coord.pos[2] + 2.2], coord.pos[1]);
                    }
                  }}
                  className={`text-left p-3 rounded-2xl border transition-all flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-red-950/80 border-red-500 shadow-lg shadow-red-950 ring-2 ring-red-500'
                      : 'bg-slate-950 hover:bg-red-950/40 border-red-900/50 hover:border-red-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-red-300 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                      <span>{getRegionHindiName(sr.region)}</span>
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                      रेड ज़ोन
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    दर्ज लक्षण: <span className="text-red-200 font-semibold">{sr.symptomNamesHindi.join(', ')}</span>
                  </p>

                  <span className="text-[10px] text-red-400 font-medium mt-1 flex items-center gap-1">
                    🎯 3D में इस अंग पर केंद्रित करने के लिए क्लिक करें →
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
            आपके द्वारा दर्ज किए गए लक्षणों में कोई स्थानीय अंग क्षति या आपातकालीन लक्षण नहीं पाया गया है।
          </div>
        )}
      </div>

      {/* Clinical Disclaimer */}
      <div className="text-center text-[11px] text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
        "3D रेड ज़ोन मॉडल आपके दर्ज किए गए लक्षणों के आधार पर प्रभावित शारीरिक क्षेत्रों को प्रदर्शित करता है। यह नैदानिक सीटी-स्कैन अथवा प्रयोगशाला रिपोर्ट नहीं है।"
      </div>
    </div>
  );
};
