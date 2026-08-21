import React, { useEffect, useState, useRef } from 'react';
import './WorkflowTimeline.css';

export default function WorkflowTimeline() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const steps = [
    { num: '01', title: 'INPUT', desc: 'Ingest reference documents and target text.' },
    { num: '02', title: 'PREPROCESS', desc: 'Clean, normalize, and construct suffix structures.' },
    { num: '03', title: 'MATCH', desc: 'Execute parallel multi-algorithm pattern detection.' },
    { num: '04', title: 'VERIFY', desc: 'Validate candidates using rolling hashes.' },
    { num: '05', title: 'FUSE EVIDENCE', desc: 'Combine algorithm outputs into unified matches.' },
    { num: '06', title: 'EXPLAIN', desc: 'Generate visual highlighting and source attribution.' },
    { num: '07', title: 'REPORT', desc: 'Produce forensic analysis and novelty metrics.' },
  ];

  // Scroll tracking to activate steps in sequence
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;

      if (rect.top <= windowHeight * 0.8 && rect.bottom >= windowHeight * 0.2) {
        const progress = Math.min(1, Math.max(0, (windowHeight * 0.8 - rect.top) / (rect.height * 0.8)));
        const idx = Math.min(steps.length - 1, Math.floor(progress * steps.length));
        setActiveStepIndex(idx);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps.length]);

  // Intersection Observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`workflow-section ${isVisible ? 'is-revealed' : ''}`} ref={sectionRef}>
      <div className="workflow-glow-bg" aria-hidden="true"></div>

      <div className="workflow-container">
        <div className="workflow-header">
          <div className="workflow-eyebrow mono text-2xs text-cyan">
            <span className="eyebrow-pip"></span>
            <span>END-TO-END PIPELINE</span>
          </div>
          <h2 className="section-title">The Analysis Workflow</h2>
        </div>
        
        <div className="timeline-wrapper timeline-wrapper-3d">
          <div className="timeline-connector">
            <div 
              className="timeline-connector-fill" 
              style={{
                width: `${((activeStepIndex + 1) / steps.length) * 100}%`
              }}
            ></div>
          </div>
          
          <div className="timeline-steps">
            {steps.map((step, idx) => {
              const isActive = idx <= activeStepIndex;
              const isCurrent = idx === activeStepIndex;

              return (
                <div 
                  key={idx} 
                  className={`timeline-step ${isActive ? 'is-active' : ''} ${isCurrent ? 'is-current' : ''}`}
                  style={{
                    transitionDelay: `${idx * 45}ms`
                  }}
                >
                  <div className="step-number mono">
                    {step.num}
                    {isCurrent && <span className="step-beacon-ring"></span>}
                  </div>
                  <div className="step-content step-content-3d glass-panel">
                    <div className="step-card-bevel"></div>
                    <h4 className="step-title">{step.title}</h4>
                    <p className="step-desc text-muted">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

