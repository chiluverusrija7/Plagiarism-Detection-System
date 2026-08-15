import React, { useEffect, useState, useRef } from 'react';
import { Search, MapPin, FileCheck, ArrowDown, Layers, CheckCircle2 } from 'lucide-react';
import './DifferentiatorSection.css';

export default function DifferentiatorSection() {
  const [activeStage, setActiveStage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Looping signal animation travelling down the pipeline (Stage 0 -> Stage 1 -> Stage 2)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage(prev => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for graceful scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`differentiator-section ${isVisible ? 'is-revealed' : ''}`} ref={sectionRef}>
      <div className="differentiator-glow-bg"></div>
      
      <div className="differentiator-container">
        {/* Header & Subtitle */}
        <div className="differentiator-header">
          <div className="section-eyebrow mono text-xs text-cyan">
            <span className="eyebrow-pip"></span>
            <span>FORENSIC EXPLAINABILITY</span>
          </div>
          
          <h2 className="differentiator-title">
            Not just a similarity score. <span className="text-gradient">Evidence.</span>
          </h2>
          
          <p className="differentiator-desc text-secondary">
            STRINGXPERT moves beyond generic percentages to provide an explainable framework for textual analysis.
          </p>
        </div>

        {/* 3-Stage Forensic Evidence Flow Pipeline */}
        <div className="evidence-pipeline-wrapper">
          {/* Central Animated Signal Track */}
          <div className="pipeline-track-line">
            <div className={`pipeline-signal-pulse stage-${activeStage}`}></div>
          </div>

          <div className="evidence-cards-column">
            
            {/* STAGE 1: WHAT MATCHED */}
            <div className={`evidence-flow-card glass-panel ${activeStage === 0 ? 'card-active-glow' : ''}`}>
              <div className="flow-card-header">
                <div className="flow-badge mono text-xs">
                  <Search size={14} className="text-cyan" />
                  <span>01 • WHAT MATCHED</span>
                </div>
                <span className="mono text-2xs text-muted">SEQUENCE EXTRACTION</span>
              </div>

              <div className="flow-card-body">
                <div className="sequence-visual-box mono text-xs">
                  <span className="text-muted">...system utilizes </span>
                  <span className="text-highlight-cyan">algorithmic text intelligence</span>
                  <span className="text-muted"> architectures to...</span>
                </div>
                <div className="flow-card-meta mono text-2xs text-muted mt-2 flex items-center justify-between">
                  <span>Exact Match Candidate</span>
                  <span className="text-cyan">32 characters</span>
                </div>
              </div>
            </div>

            {/* Connecting Arrow 1 */}
            <div className="pipeline-connector-node">
              <ArrowDown size={14} className={`connector-arrow ${activeStage === 1 ? 'arrow-active' : ''}`} />
            </div>

            {/* STAGE 2: WHERE IT MATCHED */}
            <div className={`evidence-flow-card glass-panel ${activeStage === 1 ? 'card-active-glow' : ''}`}>
              <div className="flow-card-header">
                <div className="flow-badge mono text-xs">
                  <MapPin size={14} className="text-cyan" />
                  <span>02 • WHERE IT MATCHED</span>
                </div>
                <span className="mono text-2xs text-muted">LOCATION MAPPING</span>
              </div>

              <div className="flow-card-body">
                <div className="doc-matrix-visual mono text-2xs">
                  <div className="matrix-row">
                    <span className="line-no">01</span>
                    <span className="matrix-track">
                      <span className="track-segment empty"></span>
                    </span>
                  </div>
                  <div className="matrix-row active-row">
                    <span className="line-no">02</span>
                    <span className="matrix-track">
                      <span className="track-segment filled-cyan"></span>
                    </span>
                  </div>
                  <div className="matrix-row">
                    <span className="line-no">03</span>
                    <span className="matrix-track">
                      <span className="track-segment empty"></span>
                    </span>
                  </div>
                  <div className="matrix-row active-row">
                    <span className="line-no">04</span>
                    <span className="matrix-track">
                      <span className="track-segment filled-cyan wide"></span>
                    </span>
                  </div>
                </div>
                <div className="flow-card-meta mono text-2xs text-muted mt-2 flex items-center justify-between">
                  <span>Target Offset: [Line 02:24 .. 04:56]</span>
                  <span className="text-cyan">Consensus Alignment</span>
                </div>
              </div>
            </div>

            {/* Connecting Arrow 2 */}
            <div className="pipeline-connector-node">
              <ArrowDown size={14} className={`connector-arrow ${activeStage === 2 ? 'arrow-active' : ''}`} />
            </div>

            {/* STAGE 3: WHICH SOURCE MATCHED */}
            <div className={`evidence-flow-card glass-panel ${activeStage === 2 ? 'card-active-glow' : ''}`}>
              <div className="flow-card-header">
                <div className="flow-badge mono text-xs">
                  <FileCheck size={14} className="text-cyan" />
                  <span>03 • WHICH SOURCE MATCHED</span>
                </div>
                <span className="mono text-2xs text-muted">SOURCE ATTRIBUTION</span>
              </div>

              <div className="flow-card-body">
                <div className="source-attribution-visual mono text-xs">
                  <div className="source-row-item">
                    <span className="source-tag-chip">REF_01</span>
                    <span className="source-name-text">Literature_Survey_2026.txt</span>
                  </div>
                  <div className="status-verify-tag flex items-center gap-1 text-2xs text-green">
                    <CheckCircle2 size={12} />
                    <span>Evidence linked & cross-verified</span>
                  </div>
                </div>
                <div className="flow-card-meta mono text-2xs text-muted mt-2 flex items-center justify-between">
                  <span>Corroboration: Multi-Algorithm</span>
                  <span className="text-green font-bold">5 Matchers Confirmed</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
