import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeDAIRobotLegalShowcaseProps {
  language?: 'hi' | 'en';
  className?: string;
}

export const ThreeDAIRobotLegalShowcase: React.FC<ThreeDAIRobotLegalShowcaseProps> = ({
  language = 'en',
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isHindi = language === 'hi';
  const [emotion, setEmotion] = useState<'neutral' | 'smile' | 'sad' | 'laugh'>('neutral');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 340;
    let height = container.clientHeight || 340;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. High-End Studio Lighting for White Ceramic Material
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    blueRimLight.position.set(-4, 3, -2);
    scene.add(blueRimLight);

    const bottomFillLight = new THREE.DirectionalLight(0xe0f2fe, 1.2);
    bottomFillLight.position.set(0, -3, 2);
    scene.add(bottomFillLight);

    // 3. Materials
    // Glossy Pure White Ceramic Shell (Apple/Eve aesthetic)
    const ceramicWhiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.9,
    });

    // Dark Glossy Visor Screen Face
    const darkVisorMat = new THREE.MeshPhysicalMaterial({
      color: 0x050b14,
      roughness: 0.08,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.95,
    });

    // Elegant Cyber Accents
    const silverTrimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.2,
    });

    const cyberBlueGlowMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });

    // Vivid Organic Cyan AI Eye Material
    const glowingEyeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    const glowingEyePupilMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    // 4. Main Spherical Cute AI Robot Head Group (Floating Pod - No Neck)
    const robotHeadGroup = new THREE.Group();
    scene.add(robotHeadGroup);

    // -- Outer Pure White Spherical Shell (Clean Curved Oval Head)
    const outerShellGeo = new THREE.SphereGeometry(1.2, 48, 48);
    outerShellGeo.scale(1.0, 1.08, 0.98);
    const outerShell = new THREE.Mesh(outerShellGeo, ceramicWhiteMat);
    robotHeadGroup.add(outerShell);

    // -- Glossy Dark Visor Screen (Face Mask)
    const visorGeo = new THREE.SphereGeometry(1.18, 36, 36, 0, Math.PI * 2, 0, Math.PI * 0.42);
    visorGeo.scale(0.88, 0.76, 0.95);
    const visor = new THREE.Mesh(visorGeo, darkVisorMat);
    visor.rotation.x = Math.PI * 0.46;
    visor.position.set(0, 0.04, 0.28);
    robotHeadGroup.add(visor);

    // -- Visor Chrome Inset Bezel
    const visorBezelGeo = new THREE.TorusGeometry(0.85, 0.03, 16, 48);
    visorBezelGeo.scale(1.0, 0.82, 1.0);
    const visorBezel = new THREE.Mesh(visorBezelGeo, silverTrimMat);
    visorBezel.position.set(0, 0.04, 1.04);
    robotHeadGroup.add(visorBezel);

    // -- Side Audio Pods (Cute Minimalist Floating White Ear Cups)
    const earGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.16, 32);
    earGeo.rotateZ(Math.PI / 2);
    
    const leftEar = new THREE.Mesh(earGeo, ceramicWhiteMat);
    leftEar.position.set(-1.22, 0.05, 0.0);
    robotHeadGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, ceramicWhiteMat);
    rightEar.position.set(1.22, 0.05, 0.0);
    robotHeadGroup.add(rightEar);

    // -- Ear Ambient Glow Rings
    const earRingGeo = new THREE.TorusGeometry(0.24, 0.03, 16, 32);
    earRingGeo.rotateY(Math.PI / 2);

    const leftEarRing = new THREE.Mesh(earRingGeo, cyberBlueGlowMat);
    leftEarRing.position.set(-1.31, 0.05, 0.0);
    robotHeadGroup.add(leftEarRing);

    const rightEarRing = new THREE.Mesh(earRingGeo, cyberBlueGlowMat);
    rightEarRing.position.set(1.31, 0.05, 0.0);
    robotHeadGroup.add(rightEarRing);

    // 5. Animated Expressive AI Eyes (with Human-like Blinking & Micro-Glances)
    // Left Eye Container
    const leftEyeGroup = new THREE.Group();
    leftEyeGroup.position.set(-0.36, 0.08, 1.15);
    robotHeadGroup.add(leftEyeGroup);

    // Left Eye Outer Glow Iris (Pill / Oval shape)
    const irisGeo = new THREE.CapsuleGeometry(0.13, 0.16, 16, 16);
    irisGeo.rotateZ(Math.PI * 0.04);
    const leftIris = new THREE.Mesh(irisGeo, glowingEyeMat);
    leftEyeGroup.add(leftIris);

    // Left Eye Sparkle Pupil
    const pupilGeo = new THREE.SphereGeometry(0.05, 16, 16);
    const leftPupil = new THREE.Mesh(pupilGeo, glowingEyePupilMat);
    leftPupil.position.set(-0.03, 0.05, 0.08);
    leftEyeGroup.add(leftPupil);

    // Right Eye Container
    const rightEyeGroup = new THREE.Group();
    rightEyeGroup.position.set(0.36, 0.08, 1.15);
    robotHeadGroup.add(rightEyeGroup);

    const rightIrisGeo = new THREE.CapsuleGeometry(0.13, 0.16, 16, 16);
    rightIrisGeo.rotateZ(-Math.PI * 0.04);
    const rightIris = new THREE.Mesh(rightIrisGeo, glowingEyeMat);
    rightEyeGroup.add(rightIris);

    const rightPupil = new THREE.Mesh(pupilGeo, glowingEyePupilMat);
    rightPupil.position.set(-0.03, 0.05, 0.08);
    rightEyeGroup.add(rightPupil);

    // Cute Cheerful Digital Blush Nodes (Subtle cyan glow below eyes)
    const blushMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.35,
    });
    const blushGeo = new THREE.CapsuleGeometry(0.04, 0.1, 12, 12);
    blushGeo.rotateZ(Math.PI / 2);

    const leftBlush = new THREE.Mesh(blushGeo, blushMat);
    leftBlush.position.set(-0.46, -0.15, 1.08);
    robotHeadGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, blushMat);
    rightBlush.position.set(0.46, -0.15, 1.08);
    robotHeadGroup.add(rightBlush);

    // -- Glowing Interactive Digital Mouth Group
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, -0.18, 1.15);
    robotHeadGroup.add(mouthGroup);

    const mouthGlowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    // 1. Neutral Mouth: Slim straight horizontal line/capsule
    const neutralMouthGeo = new THREE.CapsuleGeometry(0.012, 0.08, 10, 10);
    neutralMouthGeo.rotateZ(Math.PI / 2);
    const neutralMouth = new THREE.Mesh(neutralMouthGeo, mouthGlowMat);
    mouthGroup.add(neutralMouth);

    // 2. Smile Mouth: Curved torus segment bent upwards
    const smileMouthGeo = new THREE.TorusGeometry(0.06, 0.015, 12, 24, Math.PI);
    smileMouthGeo.rotateZ(Math.PI); // bends upwards like a smile
    const smileMouth = new THREE.Mesh(smileMouthGeo, mouthGlowMat);
    smileMouth.position.set(0, 0.02, 0);
    smileMouth.visible = false;
    mouthGroup.add(smileMouth);

    // 3. Sad Mouth: Curved torus segment bent downwards (naraj)
    const sadMouthGeo = new THREE.TorusGeometry(0.06, 0.015, 12, 24, Math.PI);
    const sadMouth = new THREE.Mesh(sadMouthGeo, mouthGlowMat);
    sadMouth.position.set(0, -0.01, 0);
    sadMouth.visible = false;
    mouthGroup.add(sadMouth);

    // 4. Laugh Mouth: Wide open cheerful ellipse (hasna)
    const laughMouthGeo = new THREE.SphereGeometry(0.038, 16, 16);
    laughMouthGeo.scale(2.0, 1.0, 0.5);
    const laughMouth = new THREE.Mesh(laughMouthGeo, mouthGlowMat);
    laughMouth.visible = false;
    mouthGroup.add(laughMouth);

    // Emotion Engine Controller
    let currentEmotion: 'neutral' | 'smile' | 'sad' | 'laugh' = 'neutral';
    let emotionEyeScaleY = 1.0;

    const setRobotEmotion = (emotion: 'neutral' | 'smile' | 'sad' | 'laugh') => {
      currentEmotion = emotion;
      setEmotion(emotion);
      neutralMouth.visible = emotion === 'neutral';
      smileMouth.visible = emotion === 'smile';
      sadMouth.visible = emotion === 'sad';
      laughMouth.visible = emotion === 'laugh';

      // Slight eyebrow or eye expression adjustment
      if (emotion === 'laugh') {
        emotionEyeScaleY = 0.55; // Cute squint
      } else if (emotion === 'smile') {
        emotionEyeScaleY = 0.9;
      } else if (emotion === 'sad') {
        emotionEyeScaleY = 1.15; // Slanted look
      } else {
        emotionEyeScaleY = 1.0;
      }
    };

    // Default friendly smile expression
    setRobotEmotion('smile');

    // 6. Cybernetic Quantum Particle Field (AI Neural Energy)
    const particleCount = 36;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 1.7 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;
      particlePos[i] = radius * Math.cos(theta) * Math.cos(phi);
      particlePos[i + 1] = radius * Math.sin(phi);
      particlePos[i + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(particleCloud);

    // 7. Interactive Tracking & Organic Eye Blink Engine
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      targetRotationY = mouseX * 0.42;
      targetRotationX = -mouseY * 0.28;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Blink State Machine
    let lastBlinkTime = 0;
    let nextBlinkInterval = 3.0; // 3 seconds
    let isBlinking = false;
    let blinkStartTime = 0;
    const blinkDuration = 0.16; // 160ms realistic blink

    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Damped Head Rotation towards mouse
      robotHeadGroup.rotation.y += (targetRotationY - robotHeadGroup.rotation.y) * 0.08;
      robotHeadGroup.rotation.x += (targetRotationX - robotHeadGroup.rotation.x) * 0.08;

      // Gentle Anti-Gravity Floating Levitation
      robotHeadGroup.position.y = Math.sin(elapsed * 1.6) * 0.08;
      robotHeadGroup.position.x = Math.cos(elapsed * 0.8) * 0.03;

      // Realistic Human Blink Calculation
      if (!isBlinking && elapsed - lastBlinkTime > nextBlinkInterval) {
        isBlinking = true;
        blinkStartTime = elapsed;
      }

      let currentBlinkScaleY = 1.0;
      if (isBlinking) {
        const blinkProgress = (elapsed - blinkStartTime) / blinkDuration;
        if (blinkProgress >= 1.0) {
          isBlinking = false;
          lastBlinkTime = elapsed;
          // Randomize next blink between 2.5s and 5.0s, with a 20% chance of quick double-blink
          nextBlinkInterval = Math.random() < 0.2 ? 0.35 : 2.5 + Math.random() * 2.5;
          currentBlinkScaleY = 1.0;
        } else {
          // Smooth sine curve for eyelid closing and opening
          currentBlinkScaleY = Math.max(0.04, 1.0 - Math.sin(blinkProgress * Math.PI) * 0.96);
        }
      }

      // Combine blink scale and emotional expression scale beautifully
      leftEyeGroup.scale.y = emotionEyeScaleY * currentBlinkScaleY;
      rightEyeGroup.scale.y = emotionEyeScaleY * currentBlinkScaleY;

      // Keep aspect ratio scaling stable on X axis
      if (currentEmotion === 'laugh') {
        leftEyeGroup.scale.x = 1.25;
        rightEyeGroup.scale.x = 1.25;
      } else {
        leftEyeGroup.scale.x = 1.0;
        rightEyeGroup.scale.x = 1.0;
      }

      // Micro Saccade Eye Glances
      const glanceX = Math.sin(elapsed * 1.2) * 0.02;
      const glanceY = Math.cos(elapsed * 0.9) * 0.015;
      leftEyeGroup.position.x = -0.36 + glanceX;
      leftEyeGroup.position.y = 0.08 + glanceY;
      rightEyeGroup.position.x = 0.36 + glanceX;
      rightEyeGroup.position.y = 0.08 + glanceY;

      // Particle Cloud Subtle Orbit
      particleCloud.rotation.y = elapsed * 0.12;
      particleCloud.rotation.x = Math.sin(elapsed * 0.08) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize Observer
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 340;
      height = container.clientHeight || 340;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

     return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D Canvas Stage */}
      <div 
        ref={mountRef} 
        className="w-[280px] h-[280px] xs:w-[320px] xs:h-[320px] sm:w-[360px] sm:h-[360px] lg:w-[390px] lg:h-[390px] relative z-10 cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
