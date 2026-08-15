import React from 'react';
import { Sparkles, Repeat, BarChart3 } from 'lucide-react';

export default function TextualOriginalityPanel({ originalityBreakdown }) {
  return (
    <div className="originality-breakdown-panel glass-panel">
      <div className="panel-header-strip">
        <div className="title-group">
          <Sparkles size={16} className="text-cyan" />
          <h3 className="section-title-text mono">TEXTUAL ORIGINALITY & REPETITION BREAKDOWN</h3>
        </div>
        <span className="subtitle-tag text-xs text-muted">
          Distinguishing independent phrasing from external overlap and internal self-repetition.
        </span>
      </div>

      <div className="originality-grid">
        {/* Metric 1: Unmatched Content */}
        <div className="originality-metric-box">
          <span className="metric-header-label mono text-xs text-muted">UNMATCHED ORIGINAL CONTENT</span>
          <div className="metric-val-large mono text-cyan">{originalityBreakdown.unmatchedContentPct}%</div>
          <p className="metric-desc text-xs text-secondary">
            Proportion of text showing no match against any supplied reference documents.
          </p>
        </div>

        {/* Metric 2: Unique Phrases */}
        <div className="originality-metric-box">
          <span className="metric-header-label mono text-xs text-muted">UNIQUE VOCABULARY DENSITY</span>
          <div className="metric-val-large mono text-primary">{originalityBreakdown.uniquePhrasesPct}%</div>
          <p className="metric-desc text-xs text-secondary">
            High diversity of lexical n-grams and unborrowed phrasal constructions.
          </p>
        </div>

        {/* Metric 3: Internal Repetition */}
        <div className="originality-metric-box repetition-box">
          <div className="flex items-center justify-between">
            <span className="metric-header-label mono text-xs text-muted">INTERNAL REPETITION</span>
            <span className="badge badge-subtle mono text-xs">{originalityBreakdown.internalRepetitionPct}% OF TEXT</span>
          </div>
          <div className="repeated-phrase-card mt-2">
            <div className="flex items-center gap-2 mono text-xs text-secondary">
              <Repeat size={13} className="text-amber" />
              <span>Repeated Phrase ({originalityBreakdown.repeatedOccurrences}×):</span>
            </div>
            <strong className="mono text-xs text-amber mt-1 d-block">
              "{originalityBreakdown.repeatedPhrase}"
            </strong>
          </div>
          <p className="metric-desc text-xs text-muted mt-2">
            Self-repetition within the target document itself, isolated from external source overlap.
          </p>
        </div>
      </div>
    </div>
  );
}
