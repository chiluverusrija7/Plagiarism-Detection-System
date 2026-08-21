import React from 'react';

export default function SequenceGrid({ text, pattern, step, algorithm }) {
  if (!text) return null;
  const isPatternAlgo = ['naive', 'kmp', 'z', 'rk'].includes(algorithm);
  const textChars = text.split('');
  const patChars = pattern ? pattern.split('') : [];

  const activeTextIdx = step?.textIdx ?? -1;
  const activePatIdx = step?.patternIdx ?? -1;
  const offset = step?.offset ?? 0;
  const matchedIndices = step?.matchedIndices || [];
  const isMismatch = step?.isMismatch;
  const isFullMatch = step?.isFullMatch;

  return (
    <div className="sequence-track-workspace">
      {/* 1. TEXT SEQUENCE TRACK */}
      <div className="track-container text-track depth-rail-layer">
        <div className="track-label-bar">
          <span className="track-label mono">TARGET TEXT (T)</span>
          <span className="track-meta mono text-xs text-muted">{text.length} characters</span>
        </div>

        <div className="cells-scroll-wrapper">
          <div className="cells-row">
            {textChars.map((char, idx) => {
              const isCurrent = idx === activeTextIdx;
              const isMatched = matchedIndices.includes(idx);
              const cellStatus = isCurrent && isMismatch 
                ? 'cell-mismatch' 
                : isFullMatch && isMatched
                ? 'cell-full-match'
                : isMatched 
                ? 'cell-matched' 
                : isCurrent 
                ? 'cell-comparing' 
                : 'cell-default';

              return (
                <div key={`t-${idx}`} className={`char-cell-wrapper ${cellStatus}`}>
                  <span className="cell-index mono">{String(idx).padStart(2, '0')}</span>
                  <div className="char-box mono">
                    <span className="char-box-inner">{char}</span>
                    <span className="char-cell-shadow" aria-hidden="true"></span>
                  </div>
                  {isCurrent && <div className="active-pointer">▲</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. PHYSICAL PATTERN ALIGNMENT TRACK (For pattern-based algorithms) */}
      {isPatternAlgo && patChars.length > 0 && (
        <div className="track-container pattern-track depth-rail-layer">
          <div className="track-label-bar">
            <span className="track-label mono">PATTERN WINDOW (P)</span>
            <span className="track-meta mono text-xs text-muted">
              Offset: <strong className="text-cyan">{offset}</strong> (T[{offset} .. {Math.min(text.length - 1, offset + patChars.length - 1)}])
            </span>
          </div>

          <div className="cells-scroll-wrapper">
            <div 
              className="pattern-alignment-wrapper"
              style={{
                transform: `translateX(${offset * 44}px)`,
                transition: 'transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
            >
              <div className="cells-row pattern-row">
                {patChars.map((char, idx) => {
                  const isCurrent = idx === activePatIdx;
                  const isMatched = matchedIndices.includes(offset + idx);
                  const cellStatus = isCurrent && isMismatch 
                    ? 'cell-mismatch' 
                    : isFullMatch 
                    ? 'cell-full-match'
                    : isMatched 
                    ? 'cell-matched' 
                    : isCurrent 
                    ? 'cell-comparing' 
                    : 'cell-default';

                  return (
                    <div key={`p-${idx}`} className={`char-cell-wrapper pattern-cell ${cellStatus}`}>
                      <span className="cell-index mono">{String(idx).padStart(2, '0')}</span>
                      <div className="char-box mono">
                        <span className="char-box-inner">{char}</span>
                        <span className="char-cell-shadow" aria-hidden="true"></span>
                      </div>
                      {isCurrent && <div className="active-pointer-top">▼</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
