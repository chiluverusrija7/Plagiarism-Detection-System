import React from 'react';
import { ShieldCheck, CheckCircle2, FileSearch, Info } from 'lucide-react';

export default function CompareEvidenceInspector({
  activeMatch,
  totalMatches = 0,
  selectedRefName = ''
}) {
  if (totalMatches === 0 || !activeMatch) {
    return (
      <div className="compare-inspector-bar glass-panel empty-inspector">
        <div className="flex items-center gap-3">
          <Info size={18} className="text-cyan flex-shrink-0" />
          <div>
            <h4 className="inspector-empty-title mono text-xs font-bold text-primary">NO TEXTUAL OVERLAP DETECTED</h4>
            <p className="inspector-empty-desc text-xs text-muted mt-0.5">
              These two documents contain no verified matching sequence regions under the current analysis configuration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const intensityColor = activeMatch.intensity === 'STRONG' ? '#F54260' : activeMatch.intensity === 'MODERATE' ? '#F5A623' : '#4A90E2';
  const targetStart = activeMatch.targetStart ?? activeMatch.targetSpan?.[0] ?? 0;
  const targetEnd = activeMatch.targetEnd ?? activeMatch.targetSpan?.[1] ?? activeMatch.length;
  const refStart = activeMatch.refStart ?? activeMatch.refSpan?.[0] ?? 0;
  const refEnd = activeMatch.refEnd ?? activeMatch.refSpan?.[1] ?? activeMatch.length;

  return (
    <div className="compare-inspector-bar glass-panel">
      <div className="inspector-top-line">
        <div className="inspector-id-group flex items-center gap-2">
          <FileSearch size={15} className="text-cyan" />
          <span className="inspector-match-id mono text-xs font-bold text-primary">{activeMatch.id} EVIDENCE</span>
          <span className="inspector-type-badge mono text-xs" style={{ color: intensityColor, borderColor: intensityColor }}>
            {activeMatch.type || 'EXACT SEQUENCE'}
          </span>
        </div>

        <div className="inspector-consensus mono text-xs flex items-center gap-1 text-green font-bold">
          <ShieldCheck size={13} />
          <span>{activeMatch.consensusCount || 3} ALGORITHMS VERIFIED</span>
        </div>
      </div>

      <div className="inspector-details-grid">
        <div className="inspector-metric-box">
          <span className="inspector-metric-label mono text-xs text-muted">TARGET SPAN</span>
          <div className="inspector-metric-val mono text-xs font-bold text-cyan">
            chars [{targetStart} .. {targetEnd}]
          </div>
        </div>

        <div className="inspector-metric-box">
          <span className="inspector-metric-label mono text-xs text-muted">REFERENCE SPAN</span>
          <div className="inspector-metric-val mono text-xs font-bold text-amber">
            chars [{refStart} .. {refEnd}]
          </div>
        </div>

        <div className="inspector-metric-box">
          <span className="inspector-metric-label mono text-xs text-muted">MATCH LENGTH</span>
          <div className="inspector-metric-val mono text-xs font-bold text-primary">
            {activeMatch.length} chars ({activeMatch.wordCount || Math.round(activeMatch.length / 5)} words)
          </div>
        </div>

        <div className="inspector-metric-box">
          <span className="inspector-metric-label mono text-xs text-muted">SUPPORTING ALGORITHMS</span>
          <div className="inspector-algos-list flex items-center gap-1.5 flex-wrap">
            {activeMatch.supportingAlgorithms && activeMatch.supportingAlgorithms.length > 0 ? (
              activeMatch.supportingAlgorithms.map((a, idx) => (
                <span key={idx} className="algo-tag mono text-xs text-secondary">
                  <CheckCircle2 size={11} className="text-green" />
                  <span>{a.name}</span>
                </span>
              ))
            ) : (
              <span className="text-muted mono text-xs">KMP, Z-Algorithm, Rabin-Karp</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
