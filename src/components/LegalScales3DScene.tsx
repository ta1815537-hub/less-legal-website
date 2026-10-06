import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LegalScales3DSceneProps {
  language?: 'hi' | 'en';
  className?: string;
}

export const LegalScales3DScene: React.FC<LegalScales3DSceneProps> = ({
  language = 'en',
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGlError, setHasWebGlError] = useState(false);
  const isHindi = language === 'hi';

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Verify WebGL safely
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGlError(true);
        return;
      }
    } catch {
      setHasWebGlError(true);
      return;
    }

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.25, 4.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
    } catch {
      setHasWebGlError(true);
      return;
    }

    // 2. Main Sculptural Group
    const sculpture = new THREE.Group();
    sculpture.position.set(0, -0.15, 0);
    scene.add(sculpture);

    // 3. Studio Lighting Rig (Cinematic, Photorealistic, No Cheap Neon)
    // Ambient soft hemisphere
    const hemiLight = new THREE.HemisphereLight(0x1e293b, 0x080c14, 1.2);
    scene.add(hemiLight);

    // Studio Key Light (Neutral-warm soft flood)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 3.2);
    keyLight.position.set(3.5, 4.5, 3.5);
    scene.add(keyLight);

    // Subtle Fill Light (Deep slate tone)
    const fillLight = new THREE.DirectionalLight(0x64748b, 1.4);
    fillLight.position.set(-3.5, 1.5, 2.5);
    scene.add(fillLight);

    // Studio Rim / Hair Light (Antique champagne rim)
    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.6);
    rimLight.position.set(-1.0, 4.0, -3.2);
    scene.add(rimLight);

    // Subtle low bounce from floor
    const bounceLight = new THREE.DirectionalLight(0x0f172a, 0.8);
    bounceLight.position.set(0, -3.0, 1.0);
    scene.add(bounceLight);

    // 4. Photorealistic Physical Materials
    // Brushed Antique Gold / Brass for Judicial Scales
    const brushedBrass = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd4af37),
      metalness: 0.94,
      roughness: 0.22,
      envMapIntensity: 1.2,
    });

    // Dark Titanium / Gunmetal for mechanical armature
    const darkTitanium = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1e2430),
      metalness: 0.88,
      roughness: 0.28,
    });

    // Honed Black Obsidian / Marble for Pedestal
    const honedObsidian = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x0b0e14),
      metalness: 0.35,
      roughness: 0.18,
    });

    // Optical Crystal Glass Shield with realistic thickness and refraction
    const opticalGlass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf0fdf4),
      transparent: true,
      opacity: 0.65,
      roughness: 0.04,
      metalness: 0.08,
      transmission: 0.88,
      ior: 1.54,
      thickness: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.75,
    });

    // Subtle emerald legal seal accent
    const emeraldSealMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x047857),
      metalness: 0.6,
      roughness: 0.25,
    });

    // 5. Build Unified Sculptural Composition

    // A. Contact Shadow Plane on the floor (anchors the sculpture physically)
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    gradient.addColorStop(0.45, 'rgba(0, 0, 0, 0.35)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const shadowTexture = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.38, 0);
    sculpture.add(shadowMesh);

    // B. Monolithic Sculpted Plinth / Pedestal
    // Tier 1: Heavy beveled circular base
    const plinth1 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.12, 48), honedObsidian);
    plinth1.position.set(0, -1.3, 0);
    sculpture.add(plinth1);

    // Tier 2: Brushed titanium stepped ring
    const plinth2 = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.82, 0.08, 48), darkTitanium);
    plinth2.position.set(0, -1.2, 0);
    sculpture.add(plinth2);

    // Tier 3: Polished brass inset bezel
    const plinthRing = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.015, 16, 48), brushedBrass);
    plinthRing.rotation.x = Math.PI / 2;
    plinthRing.position.set(0, -1.15, 0);
    sculpture.add(plinthRing);

    // C. Optical Crystal Security Shield (Integrated structural backdrop)
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 1.4);
    shieldShape.quadraticCurveTo(1.05, 1.28, 1.05, 0.2);
    shieldShape.quadraticCurveTo(1.0, -0.85, 0, -1.35);
    shieldShape.quadraticCurveTo(-1.0, -0.85, -1.05, 0.2);
    shieldShape.quadraticCurveTo(-1.05, 1.28, 0, 1.4);

    const shieldExtrude = new THREE.ExtrudeGeometry(shieldShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    });
    shieldExtrude.center();
    const shieldMesh = new THREE.Mesh(shieldExtrude, opticalGlass);
    shieldMesh.position.set(0, 0.05, -0.12);
    sculpture.add(shieldMesh);

    // Delicate Brass Bezel Edge along the glass shield
    const shieldBezelGeo = new THREE.RingGeometry(1.12, 1.15, 48);
    const shieldBezel = new THREE.Mesh(shieldBezelGeo, brushedBrass);
    shieldBezel.position.set(0, 0.05, -0.09);
    sculpture.add(shieldBezel);

    // D. Central Judicial Column / Spine
    const colGeom = new THREE.CylinderGeometry(0.065, 0.085, 2.1, 32);
    const colMesh = new THREE.Mesh(colGeom, darkTitanium);
    colMesh.position.set(0, -0.15, 0.08);
    sculpture.add(colMesh);

    // Column Brass Collars (Machined details)
    const collar1 = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.018, 16, 32), brushedBrass);
    collar1.rotation.x = Math.PI / 2;
    collar1.position.set(0, 0.45, 0.08);
    sculpture.add(collar1);

    const collar2 = collar1.clone();
    collar2.position.set(0, -0.55, 0.08);
    sculpture.add(collar2);

    // Column Finial (Precision sphere)
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), brushedBrass);
    finial.position.set(0, 0.95, 0.08);
    sculpture.add(finial);

    // E. Articulated Balance Beam Mechanism
    const beamGroup = new THREE.Group();
    beamGroup.position.set(0, 0.88, 0.08);
    sculpture.add(beamGroup);

    // Main Tapered Horizontal Fulcrum Beam
    const beamGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.3, 32);
    const beamMesh = new THREE.Mesh(beamGeo, brushedBrass);
    beamMesh.rotation.z = Math.PI / 2;
    beamGroup.add(beamMesh);

    // Fulcrum Pivot Cap
    const fulcrumCap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 24), darkTitanium);
    fulcrumCap.rotation.x = Math.PI / 2;
    beamGroup.add(fulcrumCap);

    // Left and Right End Knobs
    const knobL = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 20), brushedBrass);
    knobL.position.set(-1.15, 0, 0);
    beamGroup.add(knobL);

    const knobR = knobL.clone();
    knobR.position.set(1.15, 0, 0);
    beamGroup.add(knobR);

    // Precision Suspension Rods & Weighing Dishes
    const buildSuspensionPan = (xPos: number) => {
      const panGroup = new THREE.Group();
      panGroup.position.set(xPos, 0, 0);

      // 3 Fine Brass Suspension Rods
      const rodRadius = 0.28;
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const rodGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.75, 8);
        const rod = new THREE.Mesh(rodGeo, brushedBrass);
        rod.position.set(
          (Math.cos(angle) * rodRadius) / 2,
          -0.36,
          (Math.sin(angle) * rodRadius) / 2
        );
        rod.rotation.z = -Math.cos(angle) * 0.16;
        rod.rotation.x = Math.sin(angle) * 0.16;
        panGroup.add(rod);
      }

      // Honed Precision Dish
      const dishGeo = new THREE.CylinderGeometry(0.32, 0.20, 0.05, 32);
      const dish = new THREE.Mesh(dishGeo, brushedBrass);
      dish.position.set(0, -0.74, 0);
      panGroup.add(dish);

      // Dark Titanium Inlay Core
      const dishInlay = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.012, 24), darkTitanium);
      dishInlay.position.set(0, -0.71, 0);
      panGroup.add(dishInlay);

      return panGroup;
    };

    const panLeft = buildSuspensionPan(-1.14);
    beamGroup.add(panLeft);

    const panRight = buildSuspensionPan(1.14);
    beamGroup.add(panRight);

    // F. The Digital Trust Core (Obsidian & Emerald Judicial Lock Mechanism)
    const lockGroup = new THREE.Group();
    lockGroup.position.set(0, 0.05, 0.22);
    sculpture.add(lockGroup);

    // Heavy Chamfered Lock Body
    const lockShape = new THREE.Shape();
    const lw = 0.38, lh = 0.42, lr = 0.06;
    lockShape.moveTo(-lw/2 + lr, -lh/2);
    lockShape.lineTo(lw/2 - lr, -lh/2);
    lockShape.quadraticCurveTo(lw/2, -lh/2, lw/2, -lh/2 + lr);
    lockShape.lineTo(lw/2, lh/2 - lr);
    lockShape.quadraticCurveTo(lw/2, lh/2, lw/2 - lr, lh/2);
    lockShape.lineTo(-lw/2 + lr, lh/2);
    lockShape.quadraticCurveTo(-lw/2, lh/2, -lw/2, lh/2 - lr);
    lockShape.lineTo(-lw/2, -lh/2 + lr);
    lockShape.quadraticCurveTo(-lw/2, -lh/2, -lw/2 + lr, -lh/2);

    const lockGeom = new THREE.ExtrudeGeometry(lockShape, {
      depth: 0.11,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    lockGeom.center();
    const lockBody = new THREE.Mesh(lockGeom, honedObsidian);
    lockGroup.add(lockBody);

    // Solid Brushed Brass Lock Shackle
    const shackleGeom = new THREE.TorusGeometry(0.13, 0.032, 16, 32, Math.PI);
    const shackleMesh = new THREE.Mesh(shackleGeom, brushedBrass);
    shackleMesh.rotation.z = Math.PI;
    shackleMesh.position.set(0, 0.26, 0);
    lockGroup.add(shackleMesh);

    // Official Emerald Legal Seal Inset
    const sealDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 24), emeraldSealMaterial);
    sealDisc.rotation.x = Math.PI / 2;
    sealDisc.position.set(0, 0, 0.065);
    lockGroup.add(sealDisc);

    // Precision Keyway
    const keyway = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 0.01), brushedBrass);
    keyway.position.set(0, -0.01, 0.076);
    lockGroup.add(keyway);

    // 6. Realistic Subtle Animation Loop (Weighted, Tangible, Never Video-Game Like)
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Weighted mouse tilt with heavy damping (inertial product feel)
      targetRotY = mouseX * 0.28;
      targetRotX = -mouseY * 0.18;

      sculpture.rotation.y += (targetRotY - sculpture.rotation.y) * 0.035;
      sculpture.rotation.x += (targetRotX - sculpture.rotation.x) * 0.035;

      // Slow breathing motion (very subtle, physical)
      sculpture.position.y = -0.15 + Math.sin(elapsedTime * 0.5) * 0.035;

      // Subtle dynamic poise of the judicial scales
      const tipAngle = Math.sin(elapsedTime * 0.4) * 0.025;
      beamGroup.rotation.z = tipAngle;
      panLeft.rotation.z = -tipAngle;
      panRight.rotation.z = -tipAngle;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      shieldExtrude.dispose();
      brushedBrass.dispose();
      opticalGlass.dispose();
      honedObsidian.dispose();
      darkTitanium.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full max-w-[480px] aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Fallback for low-end devices without WebGL */}
      {hasWebGlError ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center rounded-3xl bg-slate-900/60 border border-stone-800 shadow-2xl backdrop-blur-md">
          <div className="w-24 h-24 rounded-full bg-slate-800/80 border border-stone-700 flex items-center justify-center text-3xl mb-4">
            ⚖️
          </div>
          <div className="text-white font-bold text-base tracking-tight">
            {isHindi ? 'विधिक न्याय व डिजिटल सुरक्षा' : 'Scales of Justice & Digital Security'}
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Advocate Anurag Gurauli · High Court
          </p>
        </div>
      ) : (
        <>
          {/* Natural Vignette & Soft Atmospheric Rim Light behind Sculpture */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div className="w-[300px] sm:w-[380px] h-[300px] sm:h-[380px] rounded-full bg-radial from-[#d4af37]/8 via-slate-800/20 to-transparent blur-3xl pointer-events-none" />
          </div>

          {/* Three.js Studio Canvas */}
          <div 
            ref={mountRef} 
            className="w-full h-full flex items-center justify-center cursor-default"
            style={{ touchAction: 'pan-y' }}
          />
        </>
      )}
    </div>
  );
};
