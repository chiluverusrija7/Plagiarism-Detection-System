import React from 'react';

export default function MetricsPanel({ step, currentStep, totalSteps, algorithm }) {
  const comparisons = step?.metrics?.comparisons ?? 0;
  const matches = step?.metrics?.matches ?? 0;
  const shifts = step?.metrics?.shifts ?? 0;
  const progressPercent = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;

  return (
    <div className="metrics-panel glass-panel">
      <div className="panel-title-bar">
        <span className="mono text-xs text-muted">LIVE INSTRUMENTATION</span>
        <span className="live-tag mono text-xs"><span className="pulse-dot"></span> TELEMETRY</span>
      </div>

      <div className="metrics-grid">
        <div className="metric-cell">
          <span className="metric-label mono">STEP</span>
          <div className="metric-value mono">
            {String(currentStep + 1).padStart(2, '0')} <span className="metric-sub">/ {String(totalSteps || 1).padStart(2, '0')}</span>
          </div>
        </div>

        <div className="metric-cell">
          <span className="metric-label mono">COMPARISONS</span>
          <div className="metric-value mono text-cyan">
            {String(comparisons).padStart(2, '0')}
          </div>
        </div>

        <div className="metric-cell">
          <span className="metric-label mono">MATCHES</span>
          <div className="metric-value mono text-green">
            {String(matches).padStart(2, '0')}
          </div>
        </div>

        <div className="metric-cell">
          <span className="metric-label mono">SHIFTS / STEPS</span>
          <div className="metric-value mono text-primary">
            {String(shifts).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="metrics-footer mono text-xs text-muted">
        <span>Execution Progress: <strong>{progressPercent}%</strong></span>
      </div>
    </div>
  );
}
