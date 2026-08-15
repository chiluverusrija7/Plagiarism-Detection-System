import React from 'react';
import { Play, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AnalyzerHeader({ isReadyToAnalyze, startAnalysis, charCount, refCount }) {
  return (
    <div className="analyzer-header-strip">
      <div className="header-left-col">
        <div className="analyzer-eyebrow mono">
          <span className="eyebrow-dot"></span>
          <span>TEXT ANALYSIS WORKSPACE</span>
        </div>
        <h1 className="analyzer-title">Analysis Workspace</h1>
        <p className="analyzer-desc text-secondary text-xs">
          Compare your document against reference material and inspect textual overlap with multi-algorithm precision.
        </p>
      </div>

      <div className="header-right-col">
        <div className="system-status-indicator">
          {isReadyToAnalyze ? (
            <span className="status-pill ready-pill mono text-xs">
              <ShieldCheck size={14} className="text-green" />
              <span>READY FOR ANALYSIS</span>
            </span>
          ) : (
            <span className="status-pill pending-pill mono text-xs">
              <AlertCircle size={14} className="text-muted" />
              <span>{charCount === 0 ? 'AWAITING TARGET TEXT' : 'AWAITING REFERENCE'}</span>
            </span>
          )}
        </div>

        <button 
          className="btn-accent header-run-btn"
          onClick={startAnalysis}
          disabled={!isReadyToAnalyze}
          title={isReadyToAnalyze ? "Execute multi-algorithm comparison" : "Add target text and at least 1 reference"}
        >
          <Play size={15} className="fill-current" />
          <span className="mono font-bold">Run Analysis</span>
        </button>
      </div>
    </div>
  );
}
