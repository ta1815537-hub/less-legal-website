import { useEffect, useRef } from 'react';

export function useAutoScroll(speed = 0.5) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    let isInteracting = false;
    let wheelTimeout: NodeJS.Timeout;

    // Touch handling
    const startTouch = () => { isInteracting = true; };
    const stopTouch = () => { isInteracting = false; };
    
    // Wheel handling
    const handleWheel = () => {
      isInteracting = true;
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        isInteracting = false;
      }, 150);
    };

    // Mouse Drag handling
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isInteracting = true;
      isDragging = true;
      startX = e.pageX - el.offsetLeft;
      startScrollLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };

    const handleMouseLeave = () => {
      isInteracting = false;
      isDragging = false;
      el.style.cursor = '';
    };

    const handleMouseUp = () => {
      isInteracting = false;
      isDragging = false;
      el.style.cursor = '';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5; // multiplier for slightly faster manual drag
      el.scrollLeft = startScrollLeft - walk;
    };

    el.addEventListener('touchstart', startTouch, { passive: true });
    el.addEventListener('touchend', stopTouch);
    el.addEventListener('touchcancel', stopTouch);
    el.addEventListener('wheel', handleWheel, { passive: true });
    
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mousemove', handleMouseMove);

    let accumulatedScroll = el.scrollLeft;

    const scroll = () => {
      if (!isInteracting) {
        accumulatedScroll += speed;
        if (accumulatedScroll >= el.scrollWidth / 2) {
          accumulatedScroll -= el.scrollWidth / 2;
        } else if (accumulatedScroll <= 0) {
          accumulatedScroll += el.scrollWidth / 2;
        }
        el.scrollLeft = accumulatedScroll;
      } else {
        accumulatedScroll = el.scrollLeft;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      el.removeEventListener('touchstart', startTouch);
      el.removeEventListener('touchend', stopTouch);
      el.removeEventListener('touchcancel', stopTouch);
      el.removeEventListener('wheel', handleWheel);
      
      el.removeEventListener('mousedown', handleMouseDown);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseup', handleMouseUp);
      el.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(wheelTimeout);
    };
  }, [speed]);

  return scrollRef;
}
