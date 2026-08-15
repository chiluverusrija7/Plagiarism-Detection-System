import React from 'react';

export default function ZVisualizer({ step, pattern }) {
  if (!step) return null;
  const combined = step.algoState?.combined || '';
  const Z = step.algoState?.Z || [];
  const L = step.algoState?.L ?? 0;
  const R = step.algoState?.R ?? 0;
  const currentI = step.algoState?.currentI ?? 0;

  return (
    <div className="algo-specific-panel z-panel">
      <div className="panel-subhead">
        <span className="mono text-muted text-xs">Z-BOX INTERVAL [L, R] & Z-ARRAY</span>
        <div className="z-box-badge mono text-xs">
          <span>Active Z-Box: </span>
          <strong className="text-cyan">[{L}, {R}]</strong>
          <span className="text-muted ml-2">(Width: {Math.max(0, R - L + 1)})</span>
        </div>
      </div>

      <div className="z-strip-wrapper">
        <div className="z-strip-scroll">
          <div className="z-strip-row">
            <div className="z-row-label mono text-xs text-muted">Index</div>
            {combined.split('').map((_, idx) => (
              <div key={`idx-${idx}`} className={`z-cell index-cell mono ${idx === currentI ? 'active-col' : ''}`}>
                {String(idx).padStart(2, '0')}
              </div>
            ))}
          </div>

          <div className="z-strip-row">
            <div className="z-row-label mono text-xs text-muted">String</div>
            {combined.split('').map((char, idx) => {
              const inZBox = idx >= L && idx <= R && R > 0;
              const isSep = char === '$';
              return (
                <div 
                  key={`char-${idx}`} 
                  className={`z-cell char-cell mono ${inZBox ? 'in-zbox' : ''} ${isSep ? 'separator-cell' : ''} ${idx === currentI ? 'current-z-char' : ''}`}
                >
                  {char}
                </div>
              );
            })}
          </div>

          <div className="z-strip-row">
            <div className="z-row-label mono text-xs text-cyan">Z-Array</div>
            {combined.split('').map((_, idx) => {
              const val = Z[idx] !== undefined && Z[idx] > 0 ? Z[idx] : (idx === 0 ? '-' : '0');
              const isMatch = Z[idx] === pattern?.length;
              return (
                <div 
                  key={`z-${idx}`} 
                  className={`z-cell val-cell mono ${idx === currentI ? 'highlight-z' : ''} ${isMatch ? 'match-z' : ''}`}
                >
                  {val}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
