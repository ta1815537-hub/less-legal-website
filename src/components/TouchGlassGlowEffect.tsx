import React, { useEffect, useRef } from 'react';

interface GlassPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  decay: number;
  kind: 'press-ring' | 'glide-sheen';
}

export const TouchGlassGlowEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pulsesRef = useRef<GlassPulse[]>([]);
  const isInteractingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const syncSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncSize();
    window.addEventListener('resize', syncSize, { passive: true });

    const renderFrame = () => {
      ctx.clearRect(0, 0, width, height);
      const list = pulsesRef.current;

      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];

        if (p.kind === 'press-ring') {
          p.radius += (p.maxRadius - p.radius) * 0.16;
          p.alpha -= p.decay;
        } else {
          p.radius += (p.maxRadius - p.radius) * 0.12;
          p.alpha -= p.decay;
        }

        if (p.alpha <= 0.008) {
          list.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        if (p.kind === 'press-ring') {
          // Tempered obsidian-glass soft specular core with subtle crimson edge refraction
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, p.radius));
          grad.addColorStop(0, `rgba(248, 250, 252, ${p.alpha * 0.24})`);
          grad.addColorStop(0.45, `rgba(220, 38, 38, ${p.alpha * 0.14})`);
          grad.addColorStop(0.8, `rgba(148, 163, 184, ${p.alpha * 0.06})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, p.radius), 0, Math.PI * 2);
          ctx.fill();

          // Precision hairline glass press ring
          ctx.strokeStyle = `rgba(226, 232, 240, ${p.alpha * 0.42})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, p.radius * 0.72), 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Subtle frosted glass refraction sheen following finger/scroll glide
          const sheen = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(1, p.radius));
          sheen.addColorStop(0, `rgba(226, 232, 240, ${p.alpha * 0.18})`);
          sheen.addColorStop(0.5, `rgba(220, 38, 38, ${p.alpha * 0.09})`);
          sheen.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = sheen;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, p.radius), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (list.length > 0) {
        rafRef.current = requestAnimationFrame(renderFrame);
      } else {
        rafRef.current = null;
      }
    };

    const ensureLoop = () => {
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(renderFrame);
      }
    };

    const pushPulse = (x: number, y: number, kind: GlassPulse['kind']) => {
      pulsesRef.current.push({
        x,
        y,
        radius: kind === 'press-ring' ? 8 : 18,
        maxRadius: kind === 'press-ring' ? 42 : 48,
        alpha: kind === 'press-ring' ? 0.65 : 0.36,
        decay: kind === 'press-ring' ? 0.028 : 0.032,
        kind
      });

      if (pulsesRef.current.length > 18) {
        pulsesRef.current.splice(0, pulsesRef.current.length - 18);
      }

      ensureLoop();
    };

    const handleTouchStart = (e: TouchEvent) => {
      isInteractingRef.current = true;
      const touch = e.touches[0];
      if (!touch) return;
      lastPosRef.current = { x: touch.clientX, y: touch.clientY, time: performance.now() };
      pushPulse(touch.clientX, touch.clientY, 'press-ring');
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const now = performance.now();
      const last = lastPosRef.current;
      if (last) {
        const dist = Math.hypot(touch.clientX - last.x, touch.clientY - last.y);
        if (dist < 14 && now - last.time < 28) return;
      }
      lastPosRef.current = { x: touch.clientX, y: touch.clientY, time: now };
      pushPulse(touch.clientX, touch.clientY, 'glide-sheen');
    };

    const handleTouchEnd = () => {
      isInteractingRef.current = false;
      lastPosRef.current = null;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      isInteractingRef.current = true;
      lastPosRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
      pushPulse(e.clientX, e.clientY, 'press-ring');
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !isInteractingRef.current) return;
      const now = performance.now();
      const last = lastPosRef.current;
      if (last) {
        const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
        if (dist < 16 && now - last.time < 32) return;
      }
      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now };
      pushPulse(e.clientX, e.clientY, 'glide-sheen');
    };

    const handlePointerUp = () => {
      isInteractingRef.current = false;
      lastPosRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    return () => {
      window.removeEventListener('resize', syncSize);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[9999] pointer-events-none w-full h-full"
      style={{
        mixBlendMode: 'screen',
        willChange: 'transform, opacity'
      }}
    />
  );
};
