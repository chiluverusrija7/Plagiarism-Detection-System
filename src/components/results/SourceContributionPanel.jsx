import React from 'react';
import { PieChart } from 'lucide-react';

export default function SourceContributionPanel({ sourceDistribution, activeSourceFilter, onSelectSource }) {
  return (
    <div className="source-distribution-panel glass-panel">
      <div className="panel-title-bar">
        <div className="flex items-center gap-2">
          <PieChart size={15} className="text-cyan" />
          <h3 className="panel-title-text mono">SOURCE CONTRIBUTION</h3>
        </div>
        <span className="source-metric-tag mono text-xs text-muted">Target text %</span>
      </div>

      <p className="panel-sub-desc text-xs text-muted">
        Proportion of target document text associated with each detected reference source.
      </p>

      <div className="source-breakdown-list">
        {sourceDistribution.map((item) => {
          const isSelected = activeSourceFilter === item.sourceId;
          const isUnmatched = item.sourceId === 'UNMATCHED';

          return (
            <div 
              key={item.sourceId} 
              className={`source-row-item ${isSelected ? 'is-active-filter' : ''}`}
              onClick={() => onSelectSource(item.sourceId === activeSourceFilter ? 'ALL' : item.sourceId)}
            >
              <div className="source-meta-line mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="source-color-badge" style={{ backgroundColor: item.color }} />
                  <strong className="source-name-label">{item.name}</strong>
                </div>
                <span className="source-pct-value" style={{ color: isUnmatched ? 'var(--text-muted)' : item.color }}>
                  {item.percentage}%
                </span>
              </div>

              <div className="source-progress-bg">
                <div 
                  className="source-progress-bar"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>

              <div className="source-sub-detail text-xs text-muted mono">
                <span>{item.matchedChars} chars</span>
                {!isUnmatched && (
                  <>
                    <span className="divider">•</span>
                    <span>{item.matchCount} confirmed match</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
