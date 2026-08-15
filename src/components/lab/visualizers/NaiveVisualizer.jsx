import React from 'react';

export default function NaiveVisualizer({ step, text, pattern }) {
  if (!step) return null;
  const currentI = step.algoState?.currentI ?? 0;
  const currentJ = step.algoState?.currentJ ?? 0;
  const state = step.algoState?.state || 'init';

  return (
    <div className="algo-specific-panel naive-panel">
      <div className="panel-subhead">
        <span className="mono text-muted text-xs">NAÏVE COMPARISON INSPECTOR</span>
        <span className="badge badge-subtle">
          Window Offset: <strong className="text-cyan">{step.offset ?? 0}</strong>
        </span>
      </div>

      <div className="comparison-indicator-box">
        <div className="char-compare-card">
          <span className="char-role">TEXT T[{currentI + currentJ}]</span>
          <span className={`char-symbol ${step.isMismatch ? 'mismatch-text' : step.isFullMatch ? 'match-text' : 'active-text'}`}>
            '{text[currentI + currentJ] ?? ' '}'
          </span>
        </div>

        <div className="compare-relation">
          {step.isMismatch ? (
            <span className="relation-tag mismatch">≠ (MISMATCH)</span>
          ) : step.isFullMatch ? (
            <span className="relation-tag full-match">≡ (FULL MATCH)</span>
          ) : (
            <span className="relation-tag match">↔ (COMPARING)</span>
          )}
        </div>

        <div className="char-compare-card">
          <span className="char-role">PATTERN P[{currentJ}]</span>
          <span className={`char-symbol ${step.isMismatch ? 'mismatch-text' : step.isFullMatch ? 'match-text' : 'active-text'}`}>
            '{pattern?.[currentJ] ?? ' '}'
          </span>
        </div>
      </div>

      <div className="naive-stat-row text-xs text-muted mono">
        <span>Window Shift Penalty: <strong>+1 position per mismatch</strong></span>
        <span>Redundant Comparisons: <strong>Likely high on repetitive text</strong></span>
      </div>
    </div>
  );
}
