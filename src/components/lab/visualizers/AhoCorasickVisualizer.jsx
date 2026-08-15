import React from 'react';

export default function AhoCorasickVisualizer({ step, patterns }) {
  if (!step) return null;
  const activeNode = step.algoState?.activeNode || 'ROOT';
  const matchedPattern = step.algoState?.matchedPattern;
  const pats = step.algoState?.patterns || patterns || [];

  return (
    <div className="algo-specific-panel ac-panel">
      <div className="panel-subhead">
        <span className="mono text-muted text-xs">AHO-CORASICK TRIE & BFS FAILURE-LINK AUTOMATON</span>
        <span className="badge badge-cyan text-xs">Simultaneous Multi-Pattern Search</span>
      </div>

      <div className="ac-trie-visual-box">
        {/* SVG representation of Trie with Failure links */}
        <div className="trie-graph-wrapper">
          <svg viewBox="0 0 500 200" className="trie-svg">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(0, 229, 255, 0.4)" />
              </marker>
              <marker id="fail-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(245, 166, 35, 0.5)" />
              </marker>
            </defs>

            {/* Trie Edges */}
            <line x1="250" y1="30" x2="150" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <line x1="250" y1="30" x2="350" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <line x1="150" y1="85" x2="100" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <line x1="150" y1="85" x2="200" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <line x1="350" y1="85" x2="350" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

            {/* Dotted Failure Links */}
            <path d="M 200 150 Q 250 120 250 45" fill="none" stroke="rgba(245, 166, 35, 0.4)" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#fail-arrow)" />
            <path d="M 350 150 Q 280 110 250 45" fill="none" stroke="rgba(245, 166, 35, 0.4)" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#fail-arrow)" />

            {/* Nodes */}
            {/* ROOT */}
            <g transform="translate(250, 30)">
              <circle r="18" className={`trie-node-circle ${activeNode === 'ROOT' ? 'active-trie-node' : ''}`} />
              <text textAnchor="middle" dy="4" className="trie-node-text mono">ROOT</text>
            </g>

            {/* Level 1: H & S */}
            <g transform="translate(150, 85)">
              <circle r="16" className="trie-node-circle" />
              <text textAnchor="middle" dy="4" className="trie-node-text mono">H</text>
            </g>
            <g transform="translate(350, 85)">
              <circle r="16" className="trie-node-circle" />
              <text textAnchor="middle" dy="4" className="trie-node-text mono">S</text>
            </g>

            {/* Level 2: E, I, H */}
            <g transform="translate(100, 150)">
              <circle r="16" className="trie-node-circle terminal" />
              <text textAnchor="middle" dy="4" className="trie-node-text mono">E</text>
            </g>
            <g transform="translate(200, 150)">
              <circle r="16" className="trie-node-circle" />
              <text textAnchor="middle" dy="4" className="trie-node-text mono">I</text>
            </g>
            <g transform="translate(350, 150)">
              <circle r="16" className="trie-node-circle terminal" />
              <text textAnchor="middle" dy="4" className="trie-node-text mono">H</text>
            </g>
          </svg>
        </div>

        <div className="ac-dictionary-sidebar">
          <div className="mono text-xs text-muted mb-2">REFERENCE DICTIONARY:</div>
          <div className="ac-pattern-list">
            {pats.map((p, idx) => (
              <div key={idx} className={`ac-pattern-tag mono text-xs ${matchedPattern === p ? 'active-match' : ''}`}>
                <span className="text-muted">P{idx + 1}:</span> <strong>{p}</strong>
                {matchedPattern === p && <span className="matched-indicator">✓ HIT</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
