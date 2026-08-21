import React, { useEffect, useState, useRef } from 'react';
import './AlgorithmShowcase.css';

export default function AlgorithmShowcase() {
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const showcaseRef = useRef(null);

  const algorithms = [
    { name: 'Naïve', desc: 'Baseline comparison', detail: 'O(nm)' },
    { name: 'KMP', desc: 'Linear-time exact pattern matching', detail: 'O(n+m)' },
    { name: 'Z-Algorithm', desc: 'Linear-time matching-region detection', detail: 'O(n+m)' },
    { name: 'Rabin-Karp', desc: 'Rolling hash candidate detection', detail: 'O(n+m)' },
    { name: 'Aho-Corasick', desc: 'Multi-pattern matching', detail: 'O(n+m+z)' },
    { name: 'Suffix Array + LCP', desc: 'Long-range sequence analysis', detail: 'O(n log n)' }
  ];

  const flowSteps = [
    { label: 'Baseline', key: 'naive' },
    { label: 'Pattern Matching', key: 'kmp' },
    { label: 'Hash Verification', key: 'rk' },
    { label: 'Multi-Pattern Search', key: 'ac' },
    { label: 'Suffix Analysis', key: 'sa' },
    { label: 'Evidence Fusion', key: 'fusion', highlight: true }
  ];

  // Scroll-linked flow step activation
  useEffect(() => {
    const handleScroll = () => {
      if (!showcaseRef.current) return;
      const rect = showcaseRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;
      
      // Calculate how far into the section the user has scrolled (0 to 1)
      const topOffset = windowHeight - rect.top;
      const totalDist = windowHeight + rect.height;
      const progress = Math.min(1, Math.max(0, topOffset / totalDist));
      
      // Map progress to active flow step (0 to 5)
      const stepIdx = Math.min(5, Math.floor(progress * 7));
      setActiveFlowIndex(stepIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for section reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (showcaseRef.current) {
      observer.observe(showcaseRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      className={`algorithm-showcase ${isVisible ? 'is-revealed' : ''}`}
      ref={showcaseRef}
    >
      <div className="showcase-glow-atmosphere" aria-hidden="true"></div>

      <div className="showcase-header">
        <div className="showcase-eyebrow mono text-2xs text-cyan">
          <span className="eyebrow-pip"></span>
          <span>COMPUTATIONAL ENGINE</span>
        </div>
        <h2 className="section-title">Six algorithms. One analysis engine.</h2>
      </div>

      <div className="showcase-container">
        {/* 3D Spatial Flow Steps */}
        <div className="showcase-flow showcase-flow-3d" aria-label="Algorithm Pipeline Progression">
          {flowSteps.map((step, idx) => {
            const isActive = idx <= activeFlowIndex;
            const isCurrent = idx === activeFlowIndex;

            return (
              <React.Fragment key={step.key}>
                <div 
                  className={`flow-step ${step.highlight ? 'highlight' : ''} ${isActive ? 'is-active' : ''} ${isCurrent ? 'is-current' : ''}`}
                  style={{
                    transitionDelay: `${idx * 40}ms`
                  }}
                >
                  <div className={`flow-dot ${step.highlight ? 'pulse' : ''}`}></div>
                  <div className="flow-label">{step.label}</div>
                  {isCurrent && <span className="flow-active-beacon"></span>}
                </div>
                {idx < flowSteps.length - 1 && (
                  <div className={`flow-line ${idx < activeFlowIndex ? 'line-filled' : ''}`}>
                    {idx < activeFlowIndex && <span className="flow-line-energy"></span>}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 3D Algorithm Cards with Staggered Depth */}
        <div className="algorithms-grid algorithms-grid-3d">
          {algorithms.map((algo, idx) => (
            <div 
              key={idx} 
              className={`algo-card algo-card-3d glass-panel ${idx === activeFlowIndex ? 'card-focus-depth' : ''}`}
              style={{
                '--card-index': idx,
                transitionDelay: `${idx * 60}ms`
              }}
            >
              <div className="algo-card-bevel"></div>
              <div className="algo-card-header">
                <h3 className="algo-name">{algo.name}</h3>
                <span className="algo-complexity mono">{algo.detail}</span>
              </div>
              <p className="algo-desc text-muted">{algo.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

