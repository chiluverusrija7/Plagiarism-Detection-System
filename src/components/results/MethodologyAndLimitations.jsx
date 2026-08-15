import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldAlert, GitBranch } from 'lucide-react';

export default function MethodologyAndLimitations() {
  const [methodologyOpen, setMethodologyOpen] = useState(true);

  const pipelineSteps = [
    { step: '01', title: 'Deterministic Preprocessing', desc: 'Normalized whitespace and character case while maintaining strict offset index mapping.' },
    { step: '02', title: 'Exact Pattern Matching', desc: 'Executed KMP with precomputed π arrays to scan for linear-time exact matches.' },
    { step: '03', title: 'Z-Algorithm Prefix Intervals', desc: 'Identified matching sub-intervals via Z-box [L, R] boundary analysis.' },
    { step: '04', title: 'Double Rolling Hash Verification', desc: 'Rabin-Karp double-hash candidates checked with mandatory exact-string verification.' },
    { step: '05', title: 'Multi-Pattern Automaton', desc: 'Aho-Corasick trie traversed dictionary sequences in a single sequential sweep.' },
    { step: '06', title: 'Suffix Array & Kasai LCP', desc: 'Prefix doubling & linear LCP detected long-range structural sequence overlaps.' },
    { step: '07', title: 'Evidence Fusion & Deduplication', desc: 'Consolidated redundant algorithm detections into unified, non-overlapping match regions.' }
  ];

  return (
    <div className="methodology-limitations-section">
      {/* 1. METHODOLOGY ACCORDION */}
      <div className="methodology-card glass-panel">
        <button 
          className="methodology-header-btn"
          onClick={() => setMethodologyOpen(!methodologyOpen)}
        >
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-cyan" />
            <h3 className="section-title-text mono">HOW STRINGXPERT ANALYZED THIS DOCUMENT</h3>
          </div>
          {methodologyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {methodologyOpen && (
          <div className="methodology-body">
            <div className="pipeline-steps-grid">
              {pipelineSteps.map((s) => (
                <div key={s.step} className="pipeline-step-card">
                  <span className="step-number mono text-cyan">{s.step}</span>
                  <div className="step-text-group">
                    <h4 className="step-title mono text-xs">{s.title}</h4>
                    <p className="step-desc text-xs text-muted">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. ACADEMIC INTERPRETATION & LIMITATIONS CARD */}
      <div className="limitations-card glass-panel">
        <div className="limitations-header">
          <ShieldAlert size={16} className="text-amber" />
          <h3 className="section-title-text mono text-amber">INTERPRETING THE FORENSIC RESULT</h3>
        </div>
        <p className="limitations-body text-xs text-secondary">
          Detected textual overlap reflects mathematical sequence correlation between the target text and supplied references. 
          It does not by itself establish plagiarism, intent, or dishonest authorship. Academic attribution, common technical terminology, 
          and properly cited quotations may contribute to overlap scores. Analysis precision is bounded by the quality and completeness of provided reference material.
        </p>
      </div>
    </div>
  );
}
