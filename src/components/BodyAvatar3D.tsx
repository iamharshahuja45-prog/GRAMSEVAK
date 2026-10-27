import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BodyRegion, UrgencyLevel } from '../types/health';
import { BodyMap2D } from './BodyMap2D';
import { RotateCcw, ZoomIn, ZoomOut, Eye, Layers } from 'lucide-react';

interface BodyAvatar3DProps {
  symptomRegions: {
    region: BodyRegion;
    urgency: UrgencyLevel;
    symptomNamesHindi: string[];
  }[];
  onSelectRegion?: (region: BodyRegion) => void;
  selectedRegion?: BodyRegion | null;
}

export const BodyAvatar3D: React.FC<BodyAvatar3DProps> = ({
  symptomRegions,
  onSelectRegion,
  selectedRegion,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isFrontView, setIsFrontView] = useState<boolean>(true);
  const [activeRegionInfo, setActiveRegionInfo] = useState<string | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const meshesRef = useRef<Map<BodyRegion, THREE.Mesh[]>>(new Map());

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        setViewMode('2d');
      }
    } catch {
      setWebglSupported(false);
      setViewMode('2d');
    }
  }, []);

  const getRegionColorHex = (region: BodyRegion): number => {
    const found = symptomRegions.find((r) => r.region === region);
    if (!found) return 0xcfd8dc; // Clean soft medical grey/slate
    if (found.urgency === 'RED') return 0xef4444; // Red
    return 0xf59e0b; // Yellow / Amber
  };

  useEffect(() => {
    if (viewMode !== '3d' || !webglSupported || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 300;
    const height = 360;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8fafc);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);
    cameraRef.current = camera;

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch {
      setWebglSupported(false);
      setViewMode('2d');
      return;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.75);
    dirLight1.position.set(2, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x94a3b8, 0.4);
    dirLight2.position.set(-2, -2, -2);
    scene.add(dirLight2);

    // Humanoid Body Group
    const bodyGroup = new THREE.Group();
    groupRef.current = bodyGroup;
    scene.add(bodyGroup);

    const meshMap = new Map<BodyRegion, THREE.Mesh[]>();

    const createPart = (
      geo: THREE.BufferGeometry,
      region: BodyRegion,
      pos: [number, number, number]
    ) => {
      const color = getRegionColorHex(region);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.35,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.userData = { region };
      bodyGroup.add(mesh);

      const existing = meshMap.get(region) || [];
      existing.push(mesh);
      meshMap.set(region, existing);
      return mesh;
    };

    // 1. Head (सिर)
    createPart(new THREE.SphereGeometry(0.35, 32, 32), 'head', [0, 1.45, 0]);

    // 2. Neck (गला)
    createPart(new THREE.CylinderGeometry(0.14, 0.16, 0.22, 24), 'neck', [0, 1.1, 0]);

    // 3. Chest / Upper Torso (छाती)
    createPart(new THREE.CylinderGeometry(0.48, 0.42, 0.65, 32), 'chest', [0, 0.68, 0]);

    // 4. Abdomen / Lower Torso (पेट)
    createPart(new THREE.CylinderGeometry(0.42, 0.44, 0.55, 32), 'abdomen', [0, 0.1, 0]);

    // 5. Arms (बाँहें)
    createPart(new THREE.CylinderGeometry(0.12, 0.1, 0.85, 20), 'arms', [-0.64, 0.55, 0]);
    createPart(new THREE.CylinderGeometry(0.12, 0.1, 0.85, 20), 'arms', [0.64, 0.55, 0]);

    // 6. Legs & Joints (पैर एवं जोड़)
    createPart(new THREE.CylinderGeometry(0.15, 0.12, 1.25, 24), 'legs', [-0.24, -0.78, 0]);
    createPart(new THREE.CylinderGeometry(0.15, 0.12, 1.25, 24), 'legs', [0.24, -0.78, 0]);

    meshesRef.current = meshMap;

    // Interactive Drag to Rotate
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMousePos = { x: clientX, y: clientY };
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !groupRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - prevMousePos.x;
      groupRef.current.rotation.y += deltaX * 0.015;
      prevMousePos.x = clientX;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    domEl.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const newWidth = container.clientWidth;
      cameraRef.current.aspect = newWidth / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domEl.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      if (renderer) {
        renderer.dispose();
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [viewMode, webglSupported]);

  // Update mesh colors when symptomRegions or selectedRegion changes
  useEffect(() => {
    if (viewMode !== '3d' || !groupRef.current) return;

    meshesRef.current.forEach((meshes, region) => {
      const color = getRegionColorHex(region);
      const isSelected = selectedRegion === region;
      meshes.forEach((mesh) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.color.setHex(color);
        mat.emissive.setHex(isSelected ? 0x334155 : 0x000000);
      });
    });
  }, [symptomRegions, selectedRegion, viewMode]);

  // Controls
  const rotateTo = (front: boolean) => {
    if (!groupRef.current) return;
    setIsFrontView(front);
    groupRef.current.rotation.y = front ? 0 : Math.PI;
  };

  const handleZoom = (inDir: boolean) => {
    if (!cameraRef.current) return;
    const delta = inDir ? -0.5 : 0.5;
    cameraRef.current.position.z = Math.min(Math.max(cameraRef.current.position.z + delta, 3.2), 7.5);
  };

  const resetView = () => {
    if (!groupRef.current || !cameraRef.current) return;
    groupRef.current.rotation.set(0, 0, 0);
    cameraRef.current.position.set(0, 0, 5.2);
    setIsFrontView(true);
  };

  const handleSelectRegion = (region: BodyRegion) => {
    onSelectRegion?.(region);
    const found = symptomRegions.find((r) => r.region === region);
    if (found && found.symptomNamesHindi.length > 0) {
      setActiveRegionInfo(`${found.symptomNamesHindi.join(', ')} (${found.urgency === 'RED' ? 'तत्काल ध्यान' : 'सावधानी'})`);
    } else {
      setActiveRegionInfo('इस भाग के लिए कोई विशेष लक्षण नहीं बताया गया है');
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>मानव शरीर लक्षण दृश्य (Human Body Avatar)</span>
          </h3>
          <p className="text-xs text-slate-500">
            दी गई जानकारी के अनुसार प्रभावित अंगों का रंगीन प्रदर्शन
          </p>
        </div>

        {/* View mode toggle (3D / 2D) */}
        {webglSupported && (
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('3d')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === '3d'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3D मॉडल
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === '2d'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2D मानचित्र
            </button>
          </div>
        )}
      </div>

      {/* Main Avatar Area */}
      {viewMode === '3d' && webglSupported ? (
        <div className="relative w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
          {/* 3D Canvas Container */}
          <div
            ref={mountRef}
            className="w-full h-80 sm:h-96 cursor-grab active:cursor-grabbing flex justify-center items-center"
          />

          {/* Interactive Floating 3D Controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 bg-white/90 backdrop-blur-sm p-1.5 rounded-xl shadow-md border border-slate-200">
            <button
              onClick={() => rotateTo(!isFrontView)}
              title={isFrontView ? 'पीछे का दृश्य देखें' : 'सामने का दृश्य देखें'}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
              aria-label="दृश्य बदलें"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(true)}
              title="बड़ा करें (Zoom In)"
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
              aria-label="बड़ा करें"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(false)}
              title="छोटा करें (Zoom Out)"
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
              aria-label="छोटा करें"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              title="रीसेट करें"
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
              aria-label="दृश्य रीसेट करें"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Rotation hint indicator */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-slate-600 border border-slate-200 select-none shadow-sm">
            💡 घुमाने के लिए उंगली या माउस से खींचें ({isFrontView ? 'सामने का दृश्य' : 'पीछे का दृश्य'})
          </div>
        </div>
      ) : (
        <BodyMap2D
          symptomRegions={symptomRegions}
          onSelectRegion={handleSelectRegion}
          selectedRegion={selectedRegion}
        />
      )}

      {/* Selected Region Feedback */}
      {activeRegionInfo && (
        <div className="mt-3 p-2.5 bg-slate-100 rounded-xl text-xs text-slate-700 text-center font-medium">
          {activeRegionInfo}
        </div>
      )}

      {/* Color Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500 inline-block shadow-sm"></span>
          <span className="text-slate-700 font-medium">लाल: तत्काल सहायता</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block shadow-sm"></span>
          <span className="text-slate-700 font-medium">पीला: सावधानी आवश्यक</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-slate-300 inline-block"></span>
          <span className="text-slate-600">स्लेटी: कोई लक्षण नहीं</span>
        </div>
      </div>

      {/* Mandatory Clinical Disclaimer */}
      <div className="mt-3 text-center text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl">
        "यह चित्र केवल आपकी दी गई जानकारी को दर्शाता है। इससे यह प्रमाणित नहीं होता कि शरीर पूरी तरह स्वस्थ है।"
      </div>
    </div>
  );
};
