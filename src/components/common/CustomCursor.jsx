import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState('default'); // 'default' | 'interactive' | 'inspect' | 'hidden'
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const mainCursorRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef([
    { x: -100, y: -100 },
    { x: -100, y: -100 },
    { x: -100, y: -100 }
  ]);
  const trailElementsRef = useRef([]);
  const animFrameRef = useRef(null);

  useEffect(() => {
    // Only enable on desktop pointer devices with fine pointer
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || prefersReducedMotion) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);

    const handleMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      const target = e.target;
      if (!target) return;

      const isInspectTitle = target.closest('.hero-title-stage-3d, .hero-title-3d-master, .word-3d-segment, .char-3d-letter');
      const isInteractive = target.closest('button, a, input, textarea, select, .algo-node-3d, .char-tile-3d-wrapper, .algo-card, .evidence-flow-card, .timeline-step, .nav-link, .hero-btn-primary, .hero-btn-secondary');

      if (isInspectTitle) {
        setCursorType('inspect');
      } else if (isInteractive) {
        setCursorType('interactive');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseDown = () => setIsPointerDown(true);
    const handleMouseUp = () => setIsPointerDown(false);
    const handleMouseLeave = () => setCursorType('hidden');

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Spring loop for smooth trailing particles
    const animateTrail = () => {
      if (mainCursorRef.current) {
        mainCursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }

      // Smooth lerp trail
      let prevX = posRef.current.x;
      let prevY = posRef.current.y;

      for (let i = 0; i < trailRef.current.length; i++) {
        const factor = 0.28 - i * 0.05;
        trailRef.current[i].x += (prevX - trailRef.current[i].x) * factor;
        trailRef.current[i].y += (prevY - trailRef.current[i].y) * factor;

        prevX = trailRef.current[i].x;
        prevY = trailRef.current[i].y;

        if (trailElementsRef.current[i]) {
          trailElementsRef.current[i].style.transform = `translate3d(${trailRef.current[i].x}px, ${trailRef.current[i].y}px, 0)`;
        }
      }

      animFrameRef.current = requestAnimationFrame(animateTrail);
    };

    animFrameRef.current = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!isEnabled || cursorType === 'hidden') return null;

  return (
    <div className="custom-cursor-container" aria-hidden="true">
      {/* Trailing Particles */}
      {trailRef.current.map((_, i) => (
        <div
          key={i}
          ref={(el) => (trailElementsRef.current[i] = el)}
          className={`cursor-trail-dot trail-dot-${i + 1}`}
        />
      ))}

      {/* Main Cursor Head */}
      <div
        ref={mainCursorRef}
        className={`custom-cursor-head cursor-${cursorType} ${isPointerDown ? 'cursor-pressed' : ''}`}
      >
        <div className="cursor-ring">
          {cursorType === 'inspect' && (
            <>
              <span className="inspect-crosshair-h"></span>
              <span className="inspect-crosshair-v"></span>
              <span className="inspect-depth-pip"></span>
            </>
          )}
        </div>
        <div className="cursor-dot"></div>
      </div>
    </div>
  );
}
