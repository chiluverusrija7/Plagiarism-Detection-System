import React from 'react';
import { ALGORITHM_METADATA } from './DemoAlgorithmAdapter';

export default function InsightPanel({ algorithm }) {
  const meta = ALGORITHM_METADATA[algorithm] || ALGORITHM_METADATA.kmp;

  return (
    <div className="insight-panel glass-panel">
      <div className="panel-title-bar">
        <span className="mono text-xs text-muted">ACADEMIC INSIGHT</span>
        <span className="badge badge-subtle mono text-xs">{meta.shortName}</span>
      </div>

      <div className="insight-content">
        <p className="insight-body text-xs text-secondary">{meta.insight}</p>
        
        <div className="complexity-grid mono text-xs mt-3">
          <div className="complexity-item">
            <span className="text-muted">Time:</span>
            <strong className="text-cyan">{meta.complexity.time}</strong>
          </div>
          <div className="complexity-item">
            <span className="text-muted">Space:</span>
            <strong>{meta.complexity.space}</strong>
          </div>
          <div className="complexity-item">
            <span className="text-muted">Preprocess:</span>
            <strong>{meta.complexity.preprocessing}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
