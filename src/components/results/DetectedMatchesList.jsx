import React from 'react';
import { ListFilter, ChevronRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function DetectedMatchesList({
  matches = [],
  selectedMatchId,
  onSelectMatch,
  activeSourceFilter
}) {
  const filteredMatches = activeSourceFilter === 'ALL'
    ? matches
    : matches.filter(m => m.sourceId === activeSourceFilter);

  return (
    <div className="detected-matches-panel glass-panel">
      <div className="panel-header-strip">
        <div className="title-group">
          <ListFilter size={16} className="text-cyan" />
          <h3 className="section-title-text mono">DETECTED MATCHES ({filteredMatches.length})</h3>
        </div>
        <span className="subtitle-tag text-xs text-muted">
          Chronological match regions found across target document.
        </span>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="no-matches-box p-4 text-center text-muted mono text-xs">
          <CheckCircle2 size={24} className="text-green mx-auto mb-2 opacity-60" />
          <span>NO MATCHES DETECTED FOR CURRENT SELECTION</span>
        </div>
      ) : (
        <div className="matches-table-wrapper">
          <table className="matches-forensic-table mono text-xs">
            <thead>
              <tr>
                <th>ID</th>
                <th>Source Reference</th>
                <th>Type</th>
                <th>Length</th>
                <th>Consensus</th>
                <th>Target Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map(m => {
                const isSelected = selectedMatchId === m.id;
                const intensityColor = m.intensity === 'STRONG' ? '#F54260' : m.intensity === 'MODERATE' ? '#F5A623' : '#4A90E2';

                return (
                  <tr 
                    key={m.id} 
                    className={`match-row ${isSelected ? 'active-match-row' : ''}`}
                    onClick={() => onSelectMatch(m.id)}
                  >
                    <td className="font-bold text-cyan">{m.id}</td>
                    <td className="source-cell" title={m.sourceName}>
                      <span className="source-full-name">{m.sourceName}</span>
                    </td>
                    <td>
                      <span className="type-badge" style={{ color: intensityColor, borderColor: intensityColor }}>
                        {m.type}
                      </span>
                    </td>
                    <td>{m.length} chars ({m.wordCount} words)</td>
                    <td>
                      <span className="consensus-badge flex items-center gap-1 text-green font-bold">
                        <ShieldCheck size={12} /> {m.consensusCount} Alg
                      </span>
                    </td>
                    <td className="text-muted">chars [{m.targetStart} .. {m.targetEnd}]</td>
                    <td>
                      <button className="row-inspect-btn text-xs text-cyan">
                        <span>Inspect</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
