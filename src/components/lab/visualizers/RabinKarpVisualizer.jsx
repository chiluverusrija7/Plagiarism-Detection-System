import React from 'react';

export default function RabinKarpVisualizer({ step, pattern }) {
  if (!step) return null;
  const pHash1 = step.algoState?.pHash1 ?? 0;
  const pHash2 = step.algoState?.pHash2 ?? 0;
  const wHash1 = step.algoState?.wHash1 ?? 0;
  const wHash2 = step.algoState?.wHash2 ?? 0;
  const wStart = step.algoState?.windowStart ?? 0;
  const wEnd = step.algoState?.windowEnd ?? 0;
  const isCandidate = step.isCandidate;
  const isVerified = step.isFullMatch;

  return (
    <div className="algo-specific-panel rk-panel">
      <div className="panel-subhead">
        <span className="mono text-muted text-xs">DOUBLE POLYNOMIAL HASH ROLLING WINDOW</span>
        <span className="badge badge-subtle mono text-xs">
          Window: <strong className="text-cyan">[{wStart} .. {wEnd}]</strong>
        </span>
      </div>

      <div className="hash-comparison-grid">
        <div className="hash-card pattern-hash-card">
          <div className="hash-card-title mono text-xs text-muted">TARGET PATTERN HASHES</div>
          <div className="hash-row mono text-xs">
            <span>Primary H₁(P):</span>
            <strong className="text-cyan">{pHash1}</strong>
          </div>
          <div className="hash-row mono text-xs">
            <span>Secondary H₂(P):</span>
            <strong className="text-cyan">{pHash2}</strong>
          </div>
          <div className="hash-footer text-xs text-muted mono">Fixed Fingerprint</div>
        </div>

        <div className="hash-vs-indicator">
          {isCandidate ? (
            <span className="hash-match-pill candidate">HASH MATCH</span>
          ) : (
            <span className="hash-match-pill mismatch">O(1) REJECT</span>
          )}
        </div>

        <div className={`hash-card window-hash-card ${isCandidate ? 'candidate-card' : ''}`}>
          <div className="hash-card-title mono text-xs text-muted">CURRENT WINDOW HASHES</div>
          <div className="hash-row mono text-xs">
            <span>Primary H₁(W):</span>
            <strong className={wHash1 === pHash1 ? 'text-green' : 'text-primary'}>{wHash1}</strong>
          </div>
          <div className="hash-row mono text-xs">
            <span>Secondary H₂(W):</span>
            <strong className={wHash2 === pHash2 ? 'text-green' : 'text-primary'}>{wHash2}</strong>
          </div>
          <div className="hash-footer text-xs text-muted mono">
            {isVerified ? '✓ Exact String Verified' : isCandidate ? '⚠️ Checking Characters...' : 'Rolling in O(1)'}
          </div>
        </div>
      </div>
    </div>
  );
}
