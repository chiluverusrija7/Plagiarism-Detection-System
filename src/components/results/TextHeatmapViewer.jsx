import React from 'react';
import { Filter } from 'lucide-react';

export default function TextHeatmapViewer({
  heatmapSegments = [],
  selectedMatchId,
  onSelectMatch,
  activeSourceFilter,
  setActiveSourceFilter,
  references = []
}) {
  const filterOptions = [
    { id: 'ALL', label: 'ALL SOURCES' },
    ...references.map((r, idx) => ({
      id: r.id,
      label: `REF ${String(idx + 1).padStart(2, '0')}`,
      fullName: r.name
    }))
  ];

  return (
    <div className="text-heatmap-panel glass-panel">
      {/* 1. HEATMAP HEADER & DYNAMIC SOURCE FILTERS */}
      <div className="heatmap-panel-header">
        <div className="heatmap-title-group">
          <h2 className="heatmap-title mono">TEXT HEATMAP</h2>
          <span className="heatmap-subtitle text-xs text-muted">Click any highlighted passage to inspect evidence.</span>
        </div>

        {references.length > 1 && (
          <div className="heatmap-filters-bar mono text-xs">
            <span className="filter-icon-tag text-muted"><Filter size={12} /></span>
            {filterOptions.map(f => (
              <button 
                key={f.id}
                className={`filter-btn ${activeSourceFilter === f.id ? 'active' : ''}`}
                onClick={() => setActiveSourceFilter(f.id)}
                title={f.fullName || f.label}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. HEATMAP TEXT SURFACE */}
      <div className="heatmap-reading-surface">
        <div className="heatmap-body-text">
          {heatmapSegments.length === 0 ? (
            <span className="text-muted text-xs mono">No text loaded.</span>
          ) : (
            heatmapSegments.map((segment, idx) => {
              if (segment.type === 'unmatched') {
                return <span key={idx} className="text-unmatched">{segment.text}</span>;
              }

              const isFiltered = activeSourceFilter !== 'ALL' && segment.sourceId !== activeSourceFilter;
              const isSelected = selectedMatchId === segment.matchId;

              if (isFiltered) {
                return <span key={idx} className="text-filtered-dim">{segment.text}</span>;
              }

              const intensityClass = segment.intensity === 'STRONG'
                ? 'highlight-strong'
                : segment.intensity === 'MODERATE'
                ? 'highlight-moderate'
                : 'highlight-possible';

              return (
                <mark
                  key={idx}
                  className={`heatmap-match-span ${intensityClass} ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onSelectMatch(segment.matchId)}
                  title={`Match: ${segment.matchId} • Click to inspect evidence`}
                >
                  {segment.text}
                  <span className="match-tag-badge mono">
                    {segment.sourceName ? segment.sourceName.substring(0, 10) + '...' : 'MATCH'}
                  </span>
                </mark>
              );
            })
          )}
        </div>
      </div>

      {/* 3. DEFENSIVE ACADEMIC LEGEND */}
      <div className="heatmap-legend-footer">
        <div className="legend-items-row mono text-xs">
          <div className="legend-pill">
            <span className="legend-color-dot strong-dot"></span>
            <span>Strong Overlap</span>
          </div>
          <div className="legend-pill">
            <span className="legend-color-dot moderate-dot"></span>
            <span>Moderate Overlap</span>
          </div>
          <div className="legend-pill">
            <span className="legend-color-dot possible-dot"></span>
            <span>Possible Overlap</span>
          </div>
          <div className="legend-pill">
            <span className="legend-color-dot unmatched-dot"></span>
            <span>Unmatched Text</span>
          </div>
        </div>

        <div className="legend-disclaimer text-xs text-muted">
          Highlight intensity reflects algorithmic sequence correlation, not a determination of intent.
        </div>
      </div>
    </div>
  );
}
