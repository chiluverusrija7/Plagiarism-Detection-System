import React, { useState } from 'react';

export default function SuffixArrayVisualizer({ step, text }) {
  const [hoveredSuffix, setHoveredSuffix] = useState(null);
  if (!step) return null;

  const suffixes = step.algoState?.suffixes || [];
  const phase = step.algoState?.phase || 'complete';

  return (
    <div className="algo-specific-panel sa-panel">
      <div className="panel-subhead">
        <span className="mono text-muted text-xs">LEXICOGRAPHICAL SUFFIX ARRAY ORDERING</span>
        <span className="badge badge-cyan text-xs">Phase: {phase.toUpperCase()}</span>
      </div>

      <div className="sa-table-container">
        <table className="sa-table mono text-xs">
          <thead>
            <tr>
              <th>Rank (i)</th>
              <th>Start Index (SA[i])</th>
              <th>Suffix String</th>
              <th>Preview in Text</th>
            </tr>
          </thead>
          <tbody>
            {suffixes.map((s, r) => {
              const isHovered = hoveredSuffix === s.index;
              return (
                <tr 
                  key={r} 
                  className={`sa-row ${isHovered ? 'sa-hovered' : ''}`}
                  onMouseEnter={() => setHoveredSuffix(s.index)}
                  onMouseLeave={() => setHoveredSuffix(null)}
                >
                  <td className="text-cyan font-bold">{String(s.rank ?? r).padStart(2, '0')}</td>
                  <td className="text-primary font-bold">{String(s.index).padStart(2, '0')}</td>
                  <td className="suffix-cell">{s.suffix}</td>
                  <td className="text-muted text-xs">
                    {text.substring(0, s.index)}
                    <strong className="text-cyan">{text.substring(s.index)}</strong>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
