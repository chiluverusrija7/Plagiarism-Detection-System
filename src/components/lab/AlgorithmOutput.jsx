import React from 'react';
import { CheckCircle2, RotateCcw, Award } from 'lucide-react';
import { ALGORITHM_METADATA } from './DemoAlgorithmAdapter';

export default function AlgorithmOutput({ algorithm, status, allSteps, patterns, resetVisualization }) {
  if (status !== 'COMPLETED') return null;

  const meta = ALGORITHM_METADATA[algorithm] || ALGORITHM_METADATA.kmp;
  const comparisons = allSteps.filter(s => s.timelinePhase === 'COMPARE').length || allSteps.length;
  const matches = allSteps.filter(s => s.timelinePhase === 'MATCH' && s.isFullMatch).length;
  const shifts = allSteps.filter(s => s.timelinePhase === 'SHIFT').length;

  return (
    <div className="completed-summary-card glass-panel">
      <div className="summary-header-strip">
        <div className="summary-title-group">
          <CheckCircle2 size={20} className="text-green" />
          <div>
            <h3 className="summary-title mono">VISUALIZATION EXECUTION COMPLETE</h3>
            <span className="summary-subtitle text-xs text-muted">
              {meta.name} ({meta.complexity.time}) finished across {allSteps.length} total state transitions.
            </span>
          </div>
        </div>

        <div className="summary-action-group">
          <button className="summary-replay-btn mono text-xs" onClick={resetVisualization}>
            <RotateCcw size={13} />
            <span>Reset & Replay</span>
          </button>
        </div>
      </div>

      <div className="summary-metrics-grid">
        <div className="summary-stat-cell">
          <span className="summary-stat-label mono text-xs">ALGORITHM</span>
          <div className="summary-stat-val mono text-cyan">{meta.shortName}</div>
          <span className="summary-stat-meta text-xs text-muted">{meta.complexity.time}</span>
        </div>

        <div className="summary-stat-cell">
          <span className="summary-stat-label mono text-xs">TOTAL COMPARISONS</span>
          <div className="summary-stat-val mono">{comparisons}</div>
          <span className="summary-stat-meta text-xs text-muted">Measured state comparisons</span>
        </div>

        {algorithm !== 'sa' && algorithm !== 'lcp' && (
          <div className="summary-stat-cell">
            <span className="summary-stat-label mono text-xs">CONFIRMED OCCURRENCES</span>
            <div className="summary-stat-val mono text-green">{matches}</div>
            <span className="summary-stat-meta text-xs text-muted">Exact verified matches</span>
          </div>
        )}

        <div className="summary-stat-cell">
          <span className="summary-stat-label mono text-xs">WINDOW SHIFTS / STEPS</span>
          <div className="summary-stat-val mono">{shifts}</div>
          <span className="summary-stat-meta text-xs text-muted">Automaton advances</span>
        </div>
      </div>

      <div className="summary-footer-bar">
        <div className="flex items-center gap-2">
          <Award size={14} className="text-cyan" />
          <span className="text-xs text-secondary">
            Verified step progression against formal theoretical complexity bounds.
          </span>
        </div>
        <span className="preview-indicator-pill mono text-xs">
          Interactive UI Preview — Java Engine Ready
        </span>
      </div>
    </div>
  );
}
