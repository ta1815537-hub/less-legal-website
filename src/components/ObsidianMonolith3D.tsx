import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ObsidianMonolith3DProps {
  language?: 'hi' | 'en';
}

export const ObsidianMonolith3D: React.FC<ObsidianMonolith3DProps> = ({ language = 'en' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const isHindi = language === 'hi';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    // Scene setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 6.2);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Root Group for smooth inertia and rotation
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- 1. PROCEDURAL OBSIDIAN MONOLITH GEOMETRY ---
    // Tall, chiseled architectural prism (law & digital certainty)
    const monolithWidth = 1.35;
    const monolithHeight = 2.85;
    const monolithDepth = 0.55;
    const monolithGeometry = new THREE.BoxGeometry(
      monolithWidth,
      monolithHeight,
      monolithDepth,
      32,
      64,
      16
    );

    // Custom obsidian material with physical sheen and high-refraction depth
    const obsidianMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0a0c12),
      emissive: new THREE.Color(0x030708),
      roughness: 0.12,
      metalness: 0.88,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
      ior: 1.52,
    });

    const monolithMesh = new THREE.Mesh(monolithGeometry, obsidianMaterial);
    monolithMesh.castShadow = true;
    monolithMesh.receiveShadow = true;
    rootGroup.add(monolithMesh);

    // --- 2. SUBTLE TECHNOLOGICAL ETCHINGS (Precision Precision Circuits) ---
    // Sleek geometric grid lines chiseled into the dark mineral surface
    const edgesGeometry = new THREE.EdgesGeometry(monolithGeometry, 25);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x22c55e),
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const edgesMesh = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    rootGroup.add(edgesMesh);

    // Floating cryptographic / legal geometric ring surrounding the monolith
    const ringGeometry = new THREE.TorusGeometry(1.6, 0.012, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x22c55e),
      emissive: new THREE.Color(0x15803d),
      emissiveIntensity: 0.45,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.65
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI * 0.42;
    ringMesh.position.y = -0.15;
    rootGroup.add(ringMesh);

    // Secondary subtle horizontal datum ring
    const secondaryRingGeometry = new THREE.TorusGeometry(1.85, 0.008, 16, 120);
    const secondaryRingMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x6ee7b7),
      transparent: true,
      opacity: 0.28
    });
    const secondaryRingMesh = new THREE.Mesh(secondaryRingGeometry, secondaryRingMaterial);
    secondaryRingMesh.rotation.x = Math.PI * 0.48;
    secondaryRingMesh.position.y = 0.25;
    rootGroup.add(secondaryRingMesh);

    // Subtle internal core pulse glow
    const coreGeometry = new THREE.BoxGeometry(
      monolithWidth * 0.92,
      monolithHeight * 0.94,
      monolithDepth * 0.88
    );
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x10b981),
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    rootGroup.add(coreMesh);

    // --- 3. STUDIO CINEMATIC LIGHTING ---
    // Ambient soft fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Key Light: Crisp cool architectural directional light
    const keyLight = new THREE.DirectionalLight(0xf8fafc, 2.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Rim Light: Emerald/Mint statutory highlight on monolith bevels
    const rimLight = new THREE.DirectionalLight(0x22c55e, 3.2);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    // Bottom Bounce: Warm subtle gold/stone floor reflection
    const floorBounce = new THREE.DirectionalLight(0xe2e8f0, 0.9);
    floorBounce.position.set(0, -4, 2);
    scene.add(floorBounce);

    // Soft ground shadow plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlaneGeometry = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowPlaneMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeometry, shadowPlaneMaterial);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.75;
    scene.add(shadowPlane);

    // --- 4. INTERACTION & FLOATING PHYSICS ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        mouseX = (touch.clientX - rect.left) / rect.width - 0.5;
        mouseY = (touch.clientY - rect.top) / rect.height - 0.5;
      }
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Handle Resize
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newW = container.clientWidth || 480;
      const newH = container.clientHeight || 480;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // Intersection Observer to stop render loop when scrolled off viewport
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    intersectionObserver.observe(container);

    setIsLoaded(true);

    // --- 5. RENDER LOOP ---
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Continuous gentle floating sine-wave motion
      const floatY = Math.sin(elapsedTime * 0.9) * 0.08;
      rootGroup.position.y = floatY;

      // Dynamic floating tilt + user mouse inertia
      targetRotationY = elapsedTime * 0.18 + mouseX * 0.45;
      targetRotationX = Math.sin(elapsedTime * 0.5) * 0.06 - mouseY * 0.35;

      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.05;

      // Orbit the rings in counter-rotations
      ringMesh.rotation.z = -elapsedTime * 0.22;
      secondaryRingMesh.rotation.z = elapsedTime * 0.16;

      // Gentle shadow breathing
      shadowPlane.scale.setScalar(1 + floatY * 0.6);

      // Subtle pulse on emissive edge opacity
      edgesMaterial.opacity = 0.3 + Math.sin(elapsedTime * 1.5) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Memory cleanup
      monolithGeometry.dispose();
      obsidianMaterial.dispose();
      edgesGeometry.dispose();
      edgesMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      secondaryRingGeometry.dispose();
      secondaryRingMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      shadowPlaneGeometry.dispose();
      shadowPlaneMaterial.dispose();
      shadowTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none overflow-visible">
      {/* Subtle Studio Backlight (Cinematic Depth) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-[320px] h-[320px] rounded-full bg-emerald-500/10 blur-[80px]" />
      </div>

      {/* Three.js Canvas Container */}
      <div 
        ref={containerRef} 
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="3D Obsidian Monolith: Law & Cyber Security Visual"
      />

      {/* Refined unboxed editorial caption: Zero pills */}
      <div className="absolute -bottom-4 inset-x-0 flex items-center justify-center gap-2 text-[11px] font-mono tracking-wider uppercase text-stone-400 dark:text-stone-400 pointer-events-none">
        <span>{isHindi ? 'विधिक एवं तकनीकी सुरक्षा' : 'Statutory & Digital Security'}</span>
        <span aria-hidden="true">·</span>
        <span className="text-emerald-500 font-semibold">{isHindi ? 'सुरक्षित प्रमाणीकरण' : 'Zero-Tamper System'}</span>
      </div>
    </div>
  );
};
