import React from 'react';
import { ShieldAlert, Sparkles, FileText, Layers, Info } from 'lucide-react';

export default function ResultsSummaryHero({ result }) {
  const { summaryMetrics } = result;

  return (
    <div className="results-summary-hero-card glass-panel">
      <div className="summary-cards-grid">
        {/* Metric 1: Textual Overlap */}
        <div className="summary-kpi-card overlap-card">
          <div className="kpi-header">
            <span className="kpi-label mono text-xs">TEXTUAL OVERLAP</span>
            <ShieldAlert size={16} className="text-amber" />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-big-number text-amber">{summaryMetrics.textualOverlap}%</span>
            <span className="kpi-classification-badge amber-badge mono text-xs">
              {summaryMetrics.classification}
            </span>
          </div>
          <div className="kpi-progress-track">
            <div 
              className="kpi-progress-fill amber-fill" 
              style={{ width: `${summaryMetrics.textualOverlap}%` }}
            />
          </div>
          <div className="kpi-footer mono text-xs text-muted">
            <span>{summaryMetrics.matchedWords} / {summaryMetrics.totalWords} words matched</span>
          </div>
        </div>

        {/* Metric 2: Textual Originality */}
        <div className="summary-kpi-card originality-card">
          <div className="kpi-header">
            <span className="kpi-label mono text-xs">TEXTUAL ORIGINALITY</span>
            <Sparkles size={16} className="text-cyan" />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-big-number text-cyan">{summaryMetrics.noveltyIndex}%</span>
            <span className="kpi-classification-badge cyan-badge mono text-xs">
              ORIGINALITY
            </span>
          </div>
          <div className="kpi-progress-track">
            <div 
              className="kpi-progress-fill cyan-fill" 
              style={{ width: `${summaryMetrics.noveltyIndex}%` }}
            />
          </div>
          <div className="kpi-footer mono text-xs text-muted">
            <span>{summaryMetrics.totalWords - summaryMetrics.matchedWords} / {summaryMetrics.totalWords} unique words</span>
          </div>
        </div>

        {/* Metric 3: Matched Regions */}
        <div className="summary-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label mono text-xs">MATCHED REGIONS</span>
            <FileText size={16} className="text-muted" />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-big-number text-primary">{summaryMetrics.matchingRegionsCount}</span>
            <span className="kpi-sub-text mono text-xs text-muted">SECTIONS</span>
          </div>
          <div className="kpi-footer mono text-xs text-muted mt-auto">
            <span>{summaryMetrics.matchedChars} / {summaryMetrics.totalChars} characters</span>
          </div>
        </div>

        {/* Metric 4: Reference Sources */}
        <div className="summary-kpi-card">
          <div className="kpi-header">
            <span className="kpi-label mono text-xs">SOURCES DETECTED</span>
            <Layers size={16} className="text-muted" />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-big-number text-primary">{summaryMetrics.sourcesDetected}</span>
            <span className="kpi-sub-text mono text-xs text-muted">OF {summaryMetrics.referencesAnalyzed} ANALYZED</span>
          </div>
          <div className="kpi-footer mono text-xs text-muted mt-auto">
            <span>100% reference coverage</span>
          </div>
        </div>
      </div>

      {/* Qualitative Interpretation Strip */}
      <div className="interpretation-strip">
        <div className="interpretation-content">
          <Info size={15} className="text-cyan flex-shrink-0" />
          <p className="interpretation-text text-xs text-secondary">
            <strong>Forensic Assessment:</strong> {summaryMetrics.interpretation}
          </p>
        </div>
        <div className="disclaimer-tooltip-chip mono text-xs text-muted" title="Textual overlap indicates matching content. It does not by itself establish plagiarism or intent.">
          Defensible Metric
        </div>
      </div>
    </div>
  );
}
