import React from 'react';
import { Play, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

export default function AnalysisReadinessBar({
  charCount,
  referencesCount,
  isReadyToAnalyze,
  startAnalysis
}) {
  return (
    <div className="analysis-readiness-bar glass-panel">
      <div className="readiness-status-group mono text-xs">
        {/* Step 1: Target Document */}
        <div className="readiness-indicator">
          {charCount > 0 ? (
            <span className="status-item text-green">
              <CheckCircle2 size={14} /> DOCUMENT READY
            </span>
          ) : (
            <span className="status-item text-muted">
              <Circle size={14} /> ADD TARGET TEXT
            </span>
          )}
        </div>

        <span className="connector-arrow text-muted">→</span>

        {/* Step 2: Reference Material */}
        <div className="readiness-indicator">
          {referencesCount > 0 ? (
            <span className="status-item text-green">
              <CheckCircle2 size={14} /> {referencesCount} {referencesCount === 1 ? 'REFERENCE READY' : 'REFERENCES READY'}
            </span>
          ) : (
            <span className="status-item text-muted">
              <Circle size={14} /> ADD REFERENCE
            </span>
          )}
        </div>

        <span className="connector-arrow text-muted">→</span>

        {/* Step 3: Analysis State */}
        <div className="readiness-indicator">
          {isReadyToAnalyze ? (
            <span className="status-item text-cyan font-bold">
              ● READY TO ANALYZE
            </span>
          ) : (
            <span className="status-item text-muted">
              ○ CONFIGURE & RUN
            </span>
          )}
        </div>
      </div>

      <div className="primary-action-group">
        <button 
          className="btn-accent primary-run-analysis-btn"
          onClick={startAnalysis}
          disabled={!isReadyToAnalyze}
        >
          <Play size={16} className="fill-current" />
          <span className="mono font-bold">RUN MULTI-ALGORITHM ANALYSIS</span>
        </button>
      </div>
    </div>
  );
}
