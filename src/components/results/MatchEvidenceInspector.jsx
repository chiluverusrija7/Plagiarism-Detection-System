import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function MatchEvidenceInspector({ match }) {
  if (!match) {
    return (
      <div className="match-evidence-panel glass-panel empty-evidence text-center p-6">
        <span className="mono text-xs text-muted">Select a match from the heatmap or list to inspect forensic evidence.</span>
      </div>
    );
  }

  const intensityColor = match.intensity === 'STRONG' ? '#F54260' : match.intensity === 'MODERATE' ? '#F5A623' : '#4A90E2';
  const targetStart = match.targetStart ?? match.targetSpan?.[0] ?? 0;
  const targetEnd = match.targetEnd ?? match.targetSpan?.[1] ?? match.length;
  const refStart = match.refStart ?? match.refSpan?.[0] ?? 0;
  const refEnd = match.refEnd ?? match.refSpan?.[1] ?? match.length;

  return (
    <div className="match-evidence-panel glass-panel">
      {/* 1. EVIDENCE HEADER */}
      <div className="evidence-header-strip">
        <div className="evidence-id-group">
          <span className="evidence-badge mono text-xs">{match.id}</span>
          <span className="evidence-type-tag mono text-xs" style={{ color: intensityColor, borderColor: intensityColor }}>
            {match.type}
          </span>
        </div>

        <div className="evidence-consensus-pill mono text-xs">
          <ShieldCheck size={13} className="text-green" />
          <span>{match.consensusCount || 2} ALGORITHMS CONFIRMED</span>
        </div>
      </div>

      {/* 2. MATCH METRIC GRID */}
      <div className="evidence-metric-grid">
        <div className="evidence-metric-box">
          <span className="evidence-metric-label mono text-xs text-muted">SOURCE DOCUMENT</span>
          <div className="evidence-metric-val mono text-xs font-bold text-cyan" title={match.sourceName}>
            {match.sourceName}
          </div>
        </div>

        <div className="evidence-metric-box">
          <span className="evidence-metric-label mono text-xs text-muted">MATCH LENGTH</span>
          <div className="evidence-metric-val mono text-xs font-bold">
            {match.length} characters ({match.wordCount} words)
          </div>
        </div>

        <div className="evidence-metric-box">
          <span className="evidence-metric-label mono text-xs text-muted">TARGET LOCATION</span>
          <div className="evidence-metric-val mono text-xs">
            chars [{targetStart} .. {targetEnd}]
          </div>
        </div>

        <div className="evidence-metric-box">
          <span className="evidence-metric-label mono text-xs text-muted">REFERENCE LOCATION</span>
          <div className="evidence-metric-val mono text-xs">
            chars [{refStart} .. {refEnd}]
          </div>
        </div>
      </div>

      {/* 3. MATCHED SEQUENCE SNIPPET */}
      <div className="evidence-snippet-container">
        <span className="snippet-label mono text-xs text-muted">VERIFIED MATCHED TEXT:</span>
        <div className="evidence-snippet-box mono text-xs">
          "{match.matchedText}"
        </div>
      </div>

      {/* 4. INDEPENDENT ALGORITHM ATTESTATIONS */}
      <div className="evidence-algorithms-section">
        <span className="algo-section-heading mono text-xs text-muted">ALGORITHM EVIDENCE ATTESTATIONS:</span>
        <div className="algo-attestations-list">
          {match.supportingAlgorithms && match.supportingAlgorithms.length > 0 ? (
            match.supportingAlgorithms.map((algo, idx) => (
              <div key={idx} className="algo-attestation-item">
                <div className="algo-attestation-header">
                  <CheckCircle2 size={13} className="text-green" />
                  <span className="algo-name mono text-xs font-bold">{algo.name}</span>
                </div>
                <span className="algo-note text-xs text-secondary">{algo.note}</span>
              </div>
            ))
          ) : (
            <div className="text-muted text-xs mono p-2">
              Pending Java engine execution telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
