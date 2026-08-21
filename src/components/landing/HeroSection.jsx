import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Cpu, Scan, CheckCircle2, Activity, Zap } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeAlgo, setActiveAlgo] = useState('Z');
  const [comparingPair, setComparingPair] = useState([3, 4]); // 'O' and 'R'
  const [titleLoaded, setTitleLoaded] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0); // 0 (top) -> 1 (scrolled past hero)

  const heroRef = useRef(null);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });
  const scrollTargetRef = useRef(0);
  const scrollCurrentRef = useRef(0);
  const animFrameRef = useRef(null);

  // Sequences for forensic scan
  const targetChars = ['A', 'L', 'G', 'O', 'R', 'I', 'T', 'H', 'M', 'I', 'C', ' ', 'T', 'E', 'X', 'T'];
  const matchRange = [2, 10]; // "GORITHMI"

  const stringChars = ['S', 'T', 'R', 'I', 'N', 'G'];
  const xpertChars = ['X', 'P', 'E', 'R', 'T'];

  const [entrancePhase, setEntrancePhase] = useState('recessed'); // 'recessed' -> 'approaching' -> 'settled' -> 'ready'
  const [activeTitleCharIdx, setActiveTitleCharIdx] = useState(null);
  const [selectedTileIdx, setSelectedTileIdx] = useState(null);

  // 1. Cinematic 3D Hero Entrance Reveal Sequence (1.2s - 1.8s)
  useEffect(() => {
    // 0ms: Recessed in deep 3D space
    // 80ms: Begin smooth forward 3D approach
    const t1 = setTimeout(() => setEntrancePhase('approaching'), 80);
    // 1100ms: Lock in place & trigger studio light sweep
    const t2 = setTimeout(() => setEntrancePhase('settled'), 1100);
    // 1750ms: Settle into continuous interactive 3D physics
    const t3 = setTimeout(() => {
      setEntrancePhase('ready');
      setTitleLoaded(true);
    }, 1750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // 2. Window Scroll Listener with normalized progress
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const heroHeight = heroRef.current.offsetHeight || 800;
      const progress = Math.min(1, Math.max(0, window.scrollY / (heroHeight * 0.8)));
      scrollTargetRef.current = progress;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Continuous Damped Spring Loop for Mouse Parallax & Scroll Depth
  useEffect(() => {
    const updatePhysics = () => {
      const kMouse = 0.06; // Buttery smooth spring damping
      const kScroll = 0.08;

      mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * kMouse;
      mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * kMouse;
      scrollCurrentRef.current += (scrollTargetRef.current - scrollCurrentRef.current) * kScroll;

      const curX = mouseCurrentRef.current.x;
      const curY = mouseCurrentRef.current.y;
      const curScroll = scrollCurrentRef.current;

      // Restrained continuous 3D rotation: rotateX ±2.5°, rotateY ±3.5°
      setRotation({
        y: curX * 3.5,
        x: -curY * 2.5
      });

      setLightPos({
        x: 50 + curX * 35,
        y: 50 + curY * 35
      });

      setScrollProgress(curScroll);

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Looping forensic matching pipeline animation
  useEffect(() => {
    const algos = ['KMP', 'Z', 'RK'];
    const pairs = [
      [3, 4], // O <-> R
      [4, 5], // R <-> I
      [2, 3], // G <-> O
      [5, 6]  // I <-> T
    ];

    const timer = setInterval(() => {
      setActiveStep(prev => {
        const next = (prev + 1) % 4;
        if (next === 1) {
          setComparingPair(pairs[Math.floor(Math.random() * pairs.length)]);
        }
        return next;
      });
      setActiveAlgo(prevAlgo => {
        const remaining = algos.filter(a => a !== prevAlgo);
        return remaining[Math.floor(Math.random() * remaining.length)];
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  // Track mouse coordinates normalized between -1 and +1
  const handleMouseMove = useCallback((e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to +1
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to +1
    mouseTargetRef.current = { 
      x: Math.max(-1, Math.min(1, nx)), 
      y: Math.max(-1, Math.min(1, ny)) 
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseTargetRef.current = { x: 0, y: 0 };
    setActiveTitleCharIdx(null);
  }, []);

  const handleSelectAlgo = (algoName) => {
    setActiveAlgo(algoName);
  };

  const handleButtonMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--btn-light-x', `${x}%`);
    e.currentTarget.style.setProperty('--btn-light-y', `${y}%`);
  };

  const handleTileClick = (index) => {
    setSelectedTileIdx(prev => prev === index ? null : index);
  };

  // Subtle directional extrusion & shadow offsets
  const extX = -rotation.y * 0.8;
  const extY = -rotation.x * 0.8;
  const shadowX = -rotation.y * 1.8;
  const shadowY = Math.max(6, -rotation.x * 1.8 + 8);

  return (
    <section 
      className={`hero-section ${titleLoaded ? 'hero-loaded' : ''} hero-${entrancePhase}`}
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--light-x': `${lightPos.x}%`,
        '--light-y': `${lightPos.y}%`,
        '--rot-y': `${rotation.y}deg`,
        '--rot-x': `${rotation.x}deg`,
        '--ext-x': `${extX}px`,
        '--ext-y': `${extY}px`,
        '--shd-x': `${shadowX}px`,
        '--shd-y': `${shadowY}px`,
        '--scroll-progress': scrollProgress,
        '--hero-z': `${10 + scrollProgress * 14}px`,
        '--hero-scale': `${1 + scrollProgress * 0.015}`,
        '--aura-intensity': `${1 + Math.sin(scrollProgress * Math.PI) * 0.35}`,
        '--engine-z': `${scrollProgress * 16}px`,
        '--engine-scale': `${0.96 + scrollProgress * 0.04}`
      }}
    >
      {/* Background Layers */}
      <div className="hero-background-grid"></div>
      <div className="hero-atmosphere"></div>
      <div className="hero-ambient-glow-center"></div>
      <div className="hero-scan-beam"></div>

      {/* Floating Ambient Data Particles */}
      <div className="ambient-particles" aria-hidden="true">
        <span className="data-particle dp-1"></span>
        <span className="data-particle dp-2"></span>
        <span className="data-particle dp-3"></span>
        <span className="data-particle dp-4"></span>
        <span className="data-particle dp-5"></span>
      </div>
      
      <div className="hero-content">
        {/* LEFT COLUMN: HERO TEXT & PRIMARY 3D TYPOGRAPHY CENTERPIECE */}
        <div className="hero-text-content">
          <div className="eyebrow-badge">
            <span className="eyebrow-pulse-dot"></span>
            <span className="eyebrow-text">ALGORITHMIC TEXT INTELLIGENCE</span>
          </div>
          
          {/* PRIMARY 3D TYPOGRAPHIC CENTERPIECE: STRINGXPERT (CINEMATIC REVEAL) */}
          <div className={`hero-title-stage-3d phase-${entrancePhase}`}>
            <h1 
              className="hero-title-3d-master" 
              aria-label="STRINGXPERT"
            >
              {/* Directional Dynamic Ambient Depth Shadow & Cyan Aura */}
              <span className="title-ambient-depth-shadow" aria-hidden="true">
                STRINGXPERT
              </span>
              <span className="title-cyan-aura" aria-hidden="true"></span>

              {/* STRING 3D Volumetric Segment with Multi-Tier Side Facets */}
              <span className="word-3d-segment string-segment" data-text="STRING">
                <span className="word-face string-face">
                  {stringChars.map((char, i) => {
                    const globalIdx = i;
                    const isFocused = activeTitleCharIdx === globalIdx;
                    const isNeighbor = activeTitleCharIdx !== null && Math.abs(activeTitleCharIdx - globalIdx) === 1;

                    return (
                      <span 
                        key={`str-${i}`}
                        className={`char-3d-block string-char-block ${isFocused ? 'is-char-focused' : ''} ${isNeighbor ? 'is-char-neighbor' : ''}`}
                        onMouseEnter={() => setActiveTitleCharIdx(globalIdx)}
                        data-char={char}
                      >
                        <span className="char-face-layer">{char}</span>
                        <span className="char-side-layer layer-1" aria-hidden="true">{char}</span>
                        <span className="char-side-layer layer-2" aria-hidden="true">{char}</span>
                        <span className="char-side-layer layer-3" aria-hidden="true">{char}</span>
                        <span className="char-side-layer layer-4" aria-hidden="true">{char}</span>
                        <span className="char-bevel-rim" aria-hidden="true"></span>
                      </span>
                    );
                  })}
                </span>
                <span className="word-depth-base string-depth-base" aria-hidden="true">STRING</span>
              </span>

              {/* XPERT 3D Volumetric Segment with Multi-Tier Cyan Side Facets */}
              <span className="word-3d-segment xpert-segment" data-text="XPERT">
                <span className="word-face xpert-face">
                  {xpertChars.map((char, i) => {
                    const globalIdx = stringChars.length + i;
                    const isFocused = activeTitleCharIdx === globalIdx;
                    const isNeighbor = activeTitleCharIdx !== null && Math.abs(activeTitleCharIdx - globalIdx) === 1;

                    return (
                      <span 
                        key={`xpt-${i}`}
                        className={`char-3d-block xpert-char-block ${isFocused ? 'is-char-focused' : ''} ${isNeighbor ? 'is-char-neighbor' : ''}`}
                        onMouseEnter={() => setActiveTitleCharIdx(globalIdx)}
                        data-char={char}
                      >
                        <span className="char-face-layer">{char}</span>
                        <span className="char-side-layer layer-1" aria-hidden="true">{char}</span>
                        <span className="char-side-layer layer-2" aria-hidden="true">{char}</span>
                        <span className="char-side-layer layer-3" aria-hidden="true">{char}</span>
                        <span className="char-side-layer layer-4" aria-hidden="true">{char}</span>
                        <span className="char-bevel-rim" aria-hidden="true"></span>
                      </span>
                    );
                  })}
                </span>
                <span className="word-depth-base xpert-depth-base" aria-hidden="true">XPERT</span>
              </span>

              {/* Controlled Cinematic Studio-Light Sweep Pass (STRING -> XPERT) */}
              <div className="cinematic-light-sweep-beam" aria-hidden="true">
                <span className="light-sweep-core"></span>
              </div>
            </h1>

            {/* 3D Algorithm Data Trace Link connecting Hero Title to Match Engine */}
            <div className="hero-title-data-bridge" aria-hidden="true">
              <div className="bridge-origin-node">
                <Zap size={10} className="text-cyan animate-pulse" />
                <span className="bridge-tag mono">CORE ENGINE STREAM</span>
              </div>
              <div className="bridge-line-track">
                <span className="bridge-energy-pulse"></span>
              </div>
            </div>
          </div>
          
          <p className="hero-subtitle">
            Detect overlap. Measure originality. Understand the evidence.
          </p>
          
          {/* Description with restrained technical highlights */}
          <p className="hero-description text-muted">
            A multi-algorithm text analysis platform that combines <span className="tech-keyword">exact matching</span>, <span className="tech-keyword">hashing</span>, <span className="tech-keyword">multi-pattern search</span>, <span className="tech-keyword">suffix structures</span>, and <span className="tech-keyword">explainable evidence visualization</span>.
          </p>

          {/* Subtle Tech Stack Signal Pipeline */}
          <div className="hero-tech-signal-bar mono text-2xs" aria-label="Algorithm Pipeline">
            <div className="tech-signal-step">
              <span className="signal-node-dot"></span>
              <span className="signal-label">EXACT MATCHING</span>
            </div>
            <span className="signal-connector">→</span>
            <div className="tech-signal-step">
              <span className="signal-node-dot"></span>
              <span className="signal-label">HASHING</span>
            </div>
            <span className="signal-connector">→</span>
            <div className="tech-signal-step">
              <span className="signal-node-dot"></span>
              <span className="signal-label">PATTERN SEARCH</span>
            </div>
            <span className="signal-connector">→</span>
            <div className="tech-signal-step">
              <span className="signal-node-dot"></span>
              <span className="signal-label">SUFFIX STRUCTURES</span>
            </div>
            <span className="signal-connector">→</span>
            <div className="tech-signal-step active-fusion">
              <span className="signal-node-dot pulse"></span>
              <span className="signal-label text-cyan font-bold">EVIDENCE</span>
            </div>
          </div>
          
          {/* Action Buttons with Cursor-Tracking Localized Specular Lighting & Tactile Depth */}
          <div className="hero-actions-container">
            <div className="hero-actions">
              <Link 
                to="/analyze" 
                className="btn-accent hero-btn-primary btn-depth-tactile"
                onMouseMove={handleButtonMouseMove}
              >
                <span className="btn-shine-effect"></span>
                <span>Analyze Text</span>
                <ArrowRight size={17} className="btn-arrow-icon" />
              </Link>
              <Link 
                to="/algorithms" 
                className="btn-secondary hero-btn-secondary btn-depth-secondary"
                onMouseMove={handleButtonMouseMove}
              >
                <Terminal size={17} className="btn-terminal-icon" />
                <span>Explore Algorithms</span>
              </Link>
            </div>

            {/* Forensic System Status Detail */}
            <div className="hero-engine-status-tag mono text-2xs">
              <span className="status-live-dot"></span>
              <span>MULTI-ALGORITHM ENGINE READY</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SECONDARY MATCH ENGINE 3D VISUALIZATION */}
        <div 
          className="hero-visual"
          style={{
            transform: `perspective(1100px) rotateY(${rotation.y * 0.5}deg) rotateX(${rotation.x * 0.5}deg) translateZ(${scrollProgress * 24}px) scale(${0.95 + scrollProgress * 0.05}) translateY(${-scrollProgress * 15}px)`,
            opacity: 0.88 + scrollProgress * 0.12
          }}
        >
          <div className="glass-panel engine-visualization engine-visualization-3d">
            {/* Ambient Bevel Edge Highlights */}
            <div className="panel-3d-bevel"></div>

            {/* Top Engine Header */}
            <div className="viz-header">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-cyan" />
                <span className="mono text-muted text-2xs tracking-widest font-bold">MATCH ENGINE</span>
              </div>
              <div className="engine-status-pill mono text-2xs">
                <span className="status-indicator"></span>
                <span>SYSTEM ACTIVE</span>
              </div>
            </div>

            {/* Micro Technical Tag with Live Comparison Telemetry */}
            <div className="viz-micro-strip mono text-2xs text-muted">
              <span className="flex items-center gap-1.5">
                <Scan size={11} className="text-cyan" />
                <span>PATTERN SCAN [STAGE 0{activeStep + 1}]</span>
                {activeStep === 1 && (
                  <span className="compare-tag-pill mono">
                    {targetChars[comparingPair[0]]} ↔ {targetChars[comparingPair[1]]} COMPARING
                  </span>
                )}
                {selectedTileIdx !== null && (
                  <span className="compare-tag-pill mono text-cyan">
                    [INDEX {String(selectedTileIdx).padStart(2, '0')} PINNED]
                  </span>
                )}
              </span>
              <span className="text-cyan-dim">TARGET SEQUENCE</span>
            </div>
            
            {/* Top Sequence — 3D Character Tiles */}
            <div className="viz-sequence top-sequence-3d">
              {targetChars.map((char, i) => {
                const isComparing = activeStep === 1 && (i === comparingPair[0] || i === comparingPair[1]);
                const isScanning = activeStep === 1 && i >= activeStep * 3 && i <= activeStep * 3 + 3;
                const isMatched = activeStep >= 2 && i >= matchRange[0] && i <= matchRange[1];
                const isUserSelected = selectedTileIdx === i;

                return (
                  <div
                    key={`top-${i}`}
                    onClick={() => handleTileClick(i)}
                    className={`char-tile-3d-wrapper ${
                      isUserSelected
                        ? 'is-selected-tile'
                        : isComparing 
                        ? 'is-comparing' 
                        : isMatched 
                        ? 'is-matched' 
                        : isScanning 
                        ? 'is-scanning' 
                        : ''
                    }`}
                  >
                    <span className="char-tile-index mono">{String(i).padStart(2, '0')}</span>
                    <span className="char-tile-face">
                      {char}
                    </span>
                    <span className="char-tile-shadow" aria-hidden="true"></span>
                  </div>
                );
              })}
            </div>
            
            {/* 3D Active Comparison Arc / Connection Beam */}
            <div className="viz-connection-layer">
              <div className={`connection-line-3d ${activeStep >= 1 ? 'active-pulse' : ''}`}>
                <span className="connection-energy-particle"></span>
              </div>
              <div className="connection-arrow-3d">↓</div>
            </div>
            
            {/* Algorithm Module Chips — Raised 3D Modules with Distinct Physical Engagement */}
            <div className="viz-algorithms-3d">
              {['KMP', 'Z', 'RK'].map((algo) => {
                const isSelected = activeAlgo === algo;
                return (
                  <button
                    key={algo}
                    type="button"
                    onClick={() => handleSelectAlgo(algo)}
                    className={`algo-node-3d ${isSelected ? 'active is-engaged' : 'is-recessed'}`}
                    title={`Select ${algo} Pipeline`}
                  >
                    <span className="algo-node-bezel"></span>
                    <span className="algo-node-label">{algo}</span>
                    {isSelected && <span className="algo-node-glow"></span>}
                  </button>
                );
              })}
            </div>
            
            {/* Secondary Inter-layer Connection */}
            <div className="viz-connection-layer">
              <div className={`connection-line-3d-reverse ${activeStep >= 2 ? 'active-pulse' : ''}`}>
                <span className="connection-energy-particle-reverse"></span>
              </div>
              <div className="connection-arrow-3d">↓</div>
            </div>
            
            {/* Bottom Target Sequence — 3D Highlight Tiles */}
            <div className="viz-sequence bottom-sequence-3d">
              {targetChars.map((char, i) => {
                const isHighlight = i >= matchRange[0] && i <= matchRange[1];
                const isDetectedActive = activeStep >= 2 && isHighlight;
                const isUserSelected = selectedTileIdx === i;

                return (
                  <div
                    key={`bot-${i}`}
                    onClick={() => handleTileClick(i)}
                    className={`char-tile-3d-wrapper bottom-tile ${
                      isUserSelected
                        ? 'is-selected-tile'
                        : isDetectedActive 
                        ? 'is-highlight-detected' 
                        : isHighlight 
                        ? 'is-highlight' 
                        : ''
                    }`}
                    style={{
                      transitionDelay: isDetectedActive ? `${(i - matchRange[0]) * 35}ms` : '0ms'
                    }}
                  >
                    <span className="char-tile-index mono">{String(i).padStart(2, '0')}</span>
                    <span className="char-tile-face">
                      {char}
                    </span>
                    <span className="char-tile-shadow" aria-hidden="true"></span>
                  </div>
                );
              })}
            </div>
            
            {/* Engine Footer with Evidence Fusion Confirmation */}
            <div className="viz-footer">
              <div className="flex items-center justify-between w-full">
                <span className="evidence-label text-gradient mono text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-cyan" />
                  <span>EVIDENCE FUSION</span>
                </span>
                <div className="flex items-center gap-2">
                  <Activity size={12} className="text-cyan" />
                  <span className="mono text-2xs text-muted">CONSENSUS VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


