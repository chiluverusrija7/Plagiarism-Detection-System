import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, ArrowRight } from 'lucide-react';

export default function ReportSummaryBar({ result }) {
  const { summaryMetrics, targetDocument } = result;

  return (
    <div className="report-summary-bar glass-panel">
      <div className="summary-recap-grid mono text-xs">
        <div className="recap-item">
          <span className="recap-label text-muted">TARGET DOCUMENT:</span>
          <strong className="text-primary">{targetDocument.wordCount} words ({targetDocument.charCount} chars)</strong>
        </div>

        <div className="recap-item">
          <span className="recap-label text-muted">REFERENCES ANALYZED:</span>
          <strong className="text-primary">{summaryMetrics.referencesAnalyzed} sources</strong>
        </div>

        <div className="recap-item">
          <span className="recap-label text-muted">MATCHED TARGET TEXT:</span>
          <strong className="text-amber">{summaryMetrics.matchedWords} words ({summaryMetrics.textualOverlap}%)</strong>
        </div>

        <div className="recap-item">
          <span className="recap-label text-muted">TEXTUAL ORIGINALITY:</span>
          <strong className="text-cyan">{summaryMetrics.noveltyIndex}%</strong>
        </div>
      </div>

      <div className="summary-nav-actions">
        <Link to="/analyze" className="btn-secondary small-btn mono text-xs">
          <RotateCcw size={13} />
          <span>New Analysis</span>
        </Link>
        <Link to="/compare" className="btn-accent small-btn mono text-xs">
          <span>Compare Side-by-Side</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
