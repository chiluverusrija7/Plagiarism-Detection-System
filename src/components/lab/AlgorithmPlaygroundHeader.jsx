import React from 'react';
import { ALGORITHM_METADATA } from './DemoAlgorithmAdapter';

export default function AlgorithmPlaygroundHeader({ algorithm, status, currentStep, totalSteps, stepData }) {
  const meta = ALGORITHM_METADATA[algorithm] || ALGORITHM_METADATA.kmp;
  const progress = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;

  const getStatusBadge = () => {
    switch (status) {
      case 'RUNNING':
        return <span className="status-pill running"><span className="pulse-dot"></span> RUNNING</span>;
      case 'PAUSED':
        return <span className="status-pill paused">Ⅱ PAUSED</span>;
      case 'COMPLETED':
        return <span className="status-pill completed">✓ COMPLETE</span>;
      case 'ERROR':
        return <span className="status-pill error">✕ ERROR</span>;
      default:
        return <span className="status-pill ready">● READY</span>;
    }
  };

  return (
    <div className="playground-header-bar glass-panel">
      <div className="playground-title-zone">
        <div className="playground-eyebrow">
          <span className="badge badge-accent mono">ALGORITHM PLAYGROUND</span>
          <span className="complexity-tag mono text-xs">{meta.complexity.time}</span>
        </div>
        <h2 className="algorithm-name">{meta.name}</h2>
        <p className="algorithm-subtitle text-muted text-xs">{meta.subtitle}</p>
      </div>

      <div className="playground-status-zone">
        <div className="status-wrapper">
          {getStatusBadge()}
          <span className="step-counter-badge mono text-xs">
            STEP <strong>{String(currentStep + 1).padStart(2, '0')}</strong> / {String(totalSteps || 1).padStart(2, '0')}
          </span>
        </div>

        <div className="progress-track-wrapper">
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-label mono text-xs text-muted">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
