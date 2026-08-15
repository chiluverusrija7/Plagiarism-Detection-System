import React from 'react';

export default function KMPVisualizer({ step, pattern }) {
  if (!step) return null;
  const lps = step.algoState?.lps || [];
  const currentPatJ = step.algoState?.patJ ?? step.patternIdx ?? 0;
  const lpsI = step.algoState?.lpsI ?? -1;

  return (
    <div className="algo-specific-panel kmp-panel">
      <div className="panel-subhead">
        <span className="mono text-muted text-xs">KMP LPS / FAILURE FUNCTION (π TABLE)</span>
        <span className="badge badge-cyan text-xs">O(m) Precomputed Fallbacks</span>
      </div>

      <div className="lps-table-container">
        <div className="lps-grid">
          <div className="lps-header-cell mono text-xs text-muted">Index (j)</div>
          {pattern?.split('').map((_, idx) => (
            <div key={`idx-${idx}`} className={`lps-cell index-cell mono ${idx === currentPatJ ? 'active-col' : ''}`}>
              {String(idx).padStart(2, '0')}
            </div>
          ))}

          <div className="lps-header-cell mono text-xs text-muted">Pattern P[j]</div>
          {pattern?.split('').map((char, idx) => (
            <div key={`char-${idx}`} className={`lps-cell char-cell mono ${idx === currentPatJ ? 'active-char' : ''}`}>
              {char}
            </div>
          ))}

          <div className="lps-header-cell mono text-xs text-cyan">LPS π[j]</div>
          {pattern?.split('').map((_, idx) => {
            const val = lps[idx] !== undefined ? lps[idx] : '-';
            const isActive = idx === currentPatJ || idx === lpsI;
            return (
              <div key={`lps-${idx}`} className={`lps-cell val-cell mono ${isActive ? 'highlight-lps' : ''}`}>
                {val}
              </div>
            );
          })}
        </div>
      </div>

      {step.timelinePhase === 'SHIFT' && (
        <div className="kmp-decision-callout">
          <div className="callout-icon">⚡</div>
          <div className="callout-content text-xs mono">
            <span className="callout-title text-cyan">INTELLIGENT KMP SKIP APPLIED:</span>
            <span>Fallback to <code>j = LPS[{currentPatJ}] = {lps[currentPatJ - 1] ?? 0}</code>. No text backtracking required!</span>
          </div>
        </div>
      )}
    </div>
  );
}
