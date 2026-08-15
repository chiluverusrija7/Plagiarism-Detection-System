import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Cpu, Scan, CheckCircle2 } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeAlgo, setActiveAlgo] = useState('Z');
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // Sequences for simulated forensic scan
  const targetChars = ['A', 'L', 'G', 'O', 'R', 'I', 'T', 'H', 'M', 'I', 'C', ' ', 'T', 'E', 'X', 'T'];
  const matchRange = [2, 10]; // "GORITHMI"

  // Slow, looping forensic matching pipeline animation
  useEffect(() => {
    const algos = ['KMP', 'Z', 'RK'];
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
      setActiveAlgo(algos[Math.floor(Math.random() * algos.length)]);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  // Subtle mouse parallax (capped at 2-3px)
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 60;
    const y = (e.clientY - rect.top - rect.height / 2) / 60;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <section 
      className="hero-section" 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
        {/* LEFT COLUMN: HERO TEXT & CTAS */}
        <div className="hero-text-content">
          <div className="eyebrow-badge">
            <span className="eyebrow-pulse-dot"></span>
            <span className="eyebrow-text">ALGORITHMIC TEXT INTELLIGENCE</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-string">STRING</span>
            <span className="title-xpert-wrap">
              <span className="title-xpert">XPERT</span>
              <span className="title-shine"></span>
            </span>
          </h1>
          
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
          
          {/* Action Buttons & Status Detail */}
          <div className="hero-actions-container">
            <div className="hero-actions">
              <Link to="/analyze" className="btn-accent hero-btn-primary">
                <span className="btn-shine-effect"></span>
                <span>Analyze Text</span>
                <ArrowRight size={17} className="btn-arrow-icon" />
              </Link>
              <Link to="/algorithms" className="btn-secondary hero-btn-secondary">
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

        {/* RIGHT COLUMN: FORENSIC MATCH ENGINE VISUALIZATION */}
        <div 
          className="hero-visual"
          style={{
            transform: `perspective(1000px) rotateY(${mouseOffset.x}deg) rotateX(${-mouseOffset.y}deg)`
          }}
        >
          <div className="glass-panel engine-visualization">
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

            {/* Micro Technical Tag */}
            <div className="viz-micro-strip mono text-2xs text-muted">
              <span className="flex items-center gap-1">
                <Scan size={11} className="text-cyan" /> PATTERN SCAN [STAGE 0{activeStep + 1}]
              </span>
              <span className="text-cyan-dim">TARGET SEQUENCE</span>
            </div>
            
            {/* Top Sequence */}
            <div className="viz-sequence top-sequence">
              {targetChars.map((char, i) => {
                const isScanning = activeStep === 1 && i >= activeStep * 3 && i <= activeStep * 3 + 3;
                const isMatched = activeStep >= 2 && i >= matchRange[0] && i <= matchRange[1];
                return (
                  <span 
                    key={i} 
                    className={`char ${isMatched ? 'matched' : isScanning ? 'scanning' : ''}`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
            
            {/* Inter-layer Connectors */}
            <div className="viz-connection-layer">
              <div className={`connection-line ${activeStep >= 1 ? 'active-pulse' : ''}`}></div>
              <div className="connection-arrow">↓</div>
            </div>
            
            {/* Algorithm Module Chips */}
            <div className="viz-algorithms">
              <div className={`algo-node ${activeAlgo === 'KMP' ? 'active' : ''}`}>KMP</div>
              <div className={`algo-node ${activeAlgo === 'Z' ? 'active' : ''}`}>Z</div>
              <div className={`algo-node ${activeAlgo === 'RK' ? 'active' : ''}`}>RK</div>
            </div>
            
            <div className="viz-connection-layer">
              <div className={`connection-line-reverse ${activeStep >= 2 ? 'active-pulse' : ''}`}></div>
              <div className="connection-arrow">↓</div>
            </div>
            
            {/* Bottom Target Sequence with Consolidated Highlight */}
            <div className="viz-sequence bottom-sequence">
              {targetChars.map((char, i) => {
                const isHighlight = i >= matchRange[0] && i <= matchRange[1];
                return (
                  <span 
                    key={i} 
                    className={`char ${isHighlight ? 'highlight' : ''}`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
            
            {/* Engine Footer with Micro-detail */}
            <div className="viz-footer">
              <div className="flex items-center justify-between w-full">
                <span className="evidence-label text-gradient mono text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-cyan" />
                  <span>EVIDENCE FUSION</span>
                </span>
                <span className="mono text-2xs text-muted">CONSENSUS VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
