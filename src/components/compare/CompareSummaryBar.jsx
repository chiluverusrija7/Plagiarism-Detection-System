import React from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';

export default function CompareSummaryBar({
  overlapPct = 0,
  originalityPct = 100,
  matchedChars = 0,
  totalChars = 0,
  unmatchedChars = 0,
  matchCount = 0,
  longestMatchChars = 0,
  referencesCount = 0,
  selectedRefName = ''
}) {
  return (
    <div className="compare-summary-instrument-bar glass-panel">
      <div className="instrument-metric-group">
        {/* Matched Target Coverage */}
        <div className="instrument-metric-item">
          <span className="metric-tag mono text-xs text-muted">MATCHED TARGET COVERAGE</span>
          <div className="metric-val mono text-amber font-bold">{overlapPct}%</div>
          <span className="metric-sub mono text-xs text-muted">{matchedChars} / {totalChars} chars</span>
        </div>

        <div className="instrument-divider"></div>

        {/* Textual Originality */}
        <div className="instrument-metric-item">
          <div className="flex items-center gap-1">
            <span className="metric-tag mono text-xs text-muted">TEXTUAL ORIGINALITY</span>
            <span 
              className="text-muted cursor-help" 
              title="Percentage of target text not covered by detected matching regions against the supplied reference. Textual originality is a coverage metric and does not establish authorship."
            >
              <HelpCircle size={11} />
            </span>
          </div>
          <div className="metric-val mono text-cyan font-bold">{originalityPct}%</div>
          <span className="metric-sub mono text-xs text-muted">{unmatchedChars} / {totalChars} chars</span>
        </div>

        <div className="instrument-divider"></div>

        {/* Match Regions */}
        <div className="instrument-metric-item">
          <span className="metric-tag mono text-xs text-muted">MATCH REGIONS</span>
          <div className="metric-val mono text-primary font-bold">{matchCount}</div>
          <span className="metric-sub text-xs text-muted">{matchCount > 0 ? `${matchCount} sequence${matchCount > 1 ? 's' : ''} detected` : 'No overlap'}</span>
        </div>

        <div className="instrument-divider"></div>

        {/* Longest Common */}
        <div className="instrument-metric-item">
          <span className="metric-tag mono text-xs text-muted">LONGEST COMMON</span>
          <div className="metric-val mono text-primary font-bold">{longestMatchChars} <span className="text-xs font-normal">chars</span></div>
          <span className="metric-sub text-xs text-muted">Max continuous alignment</span>
        </div>

        <div className="instrument-divider"></div>

        {/* Active Reference */}
        <div className="instrument-metric-item">
          <span className="metric-tag mono text-xs text-muted">ACTIVE REFERENCE</span>
          <div className="metric-val mono text-primary text-xs font-bold truncate max-w-xs" title={selectedRefName}>
            {selectedRefName || 'None selected'}
          </div>
          <span className="metric-sub text-xs text-muted">1 of {referencesCount} source{referencesCount > 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}
