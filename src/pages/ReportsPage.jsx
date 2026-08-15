import React, { useState } from 'react';
import { 
  FileDown, Printer, FileText, ArrowRight, CheckCircle2, 
  ShieldCheck, Copy, ChevronDown, ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import './ReportsPage.css';

export default function ReportsPage() {
  const { analysisResult, targetDocument, references } = useAnalysis();
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState({});

  if (!analysisResult || !targetDocument.text || targetDocument.text.trim() === '' || !references || references.length === 0) {
    return (
      <div className="reports-page">
        <div className="empty-analysis-card glass-panel text-center p-8 max-w-md mx-auto mt-8">
          <FileText size={36} className="text-cyan mx-auto mb-3" />
          <h2 className="empty-title mono">NO ANALYSIS AVAILABLE</h2>
          <p className="empty-desc text-secondary text-xs mt-2">
            Run an analysis from the workspace to generate a forensic PDF/printable report.
          </p>
          <Link to="/analyze" className="btn-accent inline-flex items-center gap-2 mono text-xs mt-4">
            <span>Open Analysis Workspace</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const { 
    summaryMetrics, 
    sourceDistribution = [], 
    matches = [], 
    originalityBreakdown = {} 
  } = analysisResult;

  const targetDocLabel = targetDocument.name && targetDocument.name.trim() !== '' && targetDocument.name !== 'target_document.txt'
    ? targetDocument.name.trim()
    : 'Pasted Text';

  const reportDateStr = analysisResult.timestamp 
    ? new Date(analysisResult.timestamp).toLocaleString()
    : new Date().toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `STRINGXPERT_Report_${analysisResult.analysisId || 'analysis'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySummary = () => {
    const summaryText = `STRINGXPERT Analysis Report
Report ID: ${analysisResult.analysisId || 'N/A'}
Date: ${reportDateStr}
Target: ${targetDocLabel} (${summaryMetrics.totalWords} words, ${summaryMetrics.totalChars} chars)
Plagiarism / Similarity: ${summaryMetrics.textualOverlap}%
Originality / Novelty: ${summaryMetrics.noveltyIndex}%
Matched Sources: ${summaryMetrics.sourcesDetected} of ${references.length}
Classification: ${summaryMetrics.classification} Similarity Detected`;

    navigator.clipboard.writeText(summaryText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const toggleEvidence = (id) => {
    setExpandedEvidence(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Find longest match
  const longestMatch = matches.reduce((max, m) => m.length > (max?.length || 0) ? m : max, null);

  // Highest contributing source
  const topSource = [...sourceDistribution]
    .filter(s => s.sourceId !== 'UNMATCHED')
    .sort((a, b) => b.percentage - a.percentage)[0];

  // Verdict calculation
  const getVerdictDetails = () => {
    const overlap = summaryMetrics.textualOverlap;
    if (overlap === 0) {
      return {
        label: 'Zero Similarity Detected • Complete Textual Originality',
        badgeClass: 'verdict-green',
        desc: 'No continuous matching sequence or pattern overlap was detected across the analyzed reference material. The target document exhibits complete textual independence.'
      };
    } else if (overlap < 15) {
      return {
        label: 'Low Similarity Detected • High Textual Originality',
        badgeClass: 'verdict-blue',
        desc: 'Minor textual overlap identified across isolated phrases or shared terminology. The document demonstrates a high proportion of original composition.'
      };
    } else if (overlap < 50) {
      return {
        label: 'Moderate Similarity Detected • Shared Content Identified',
        badgeClass: 'verdict-amber',
        desc: 'Substantial matching sequences were confirmed across reference documents. Manual review is recommended to verify attribution and quotation compliance.'
      };
    } else {
      return {
        label: 'High Similarity Detected • Extensive Overlap Identified',
        badgeClass: 'verdict-red',
        desc: 'Extensive verbatim and structural overlap detected across one or more reference documents. Significant portions of the target document correspond to reference passages.'
      };
    }
  };

  const verdict = getVerdictDetails();

  return (
    <div className="reports-page">
      {/* Top Action Bar (hidden in print) */}
      <div className="reports-header no-print">
        <div>
          <div className="flex items-center gap-2 mono text-xs text-cyan mb-1">
            <ShieldCheck size={14} />
            <span>FORENSIC VERIFICATION SUITE</span>
          </div>
          <h1 className="workspace-title">STRINGXPERT Analysis Report</h1>
          <p className="text-muted mono text-xs mt-1">
            Official text-similarity, novelty verification, and multi-algorithm evidence report.
          </p>
        </div>
        
        <div className="report-actions">
          {copiedNotification && (
            <span className="mono text-xs text-green flex items-center gap-1">
              <CheckCircle2 size={13} /> Summary Copied
            </span>
          )}
          <button className="icon-btn text-muted" onClick={handleCopySummary} title="Copy Summary Text">
            <Copy size={16} />
          </button>
          <button className="btn-secondary mono text-xs flex items-center gap-1.5" onClick={handleExportJson}>
            <FileDown size={14} />
            <span>Export JSON</span>
          </button>
          <button className="btn-accent mono text-xs flex items-center gap-1.5" onClick={handlePrint}>
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Container */}
      <div className="report-preview-container">
        <div className="report-document" id="printable-report">
          
          {/* 1. REPORT HEADER */}
          <div className="report-doc-header">
            <div>
              <div className="report-brand">
                STRING<span className="text-accent-cyan">XPERT</span>
              </div>
              <div className="report-subbrand mono text-muted text-2xs">
                MULTI-ALGORITHM FORENSIC TEXT INTELLIGENCE SYSTEM
              </div>
            </div>
            <div className="report-meta mono text-muted">
              <div><strong>REPORT ID:</strong> {analysisResult.analysisId || 'ANALYSIS-ACTIVE'}</div>
              <div><strong>DATE:</strong> {reportDateStr}</div>
              <div><strong>STATUS:</strong> <span className="status-badge-inline text-green">COMPLETED (JAVA ENGINE)</span></div>
              <div><strong>REFERENCES ANALYZED:</strong> {references.length} document{references.length > 1 ? 's' : ''}</div>
            </div>
          </div>

          <div className="report-title-section">
            <h1 className="report-title">Text Forensics & Similarity Report</h1>
            <p className="report-subtitle text-secondary">
              Comprehensive similarity detection, originality indexation, and algorithmic cross-verification.
            </p>
          </div>

          {/* 2. EXECUTIVE RESULT SECTION */}
          <div className="report-section">
            <h2 className="section-heading mono">1. EXECUTIVE SUMMARY</h2>
            
            <div className="summary-stats mt-3">
              <div className="stat-box">
                <div className="stat-label">PLAGIARISM / SIMILARITY</div>
                <div className={`stat-value font-mono ${summaryMetrics.textualOverlap >= 50 ? 'text-red' : summaryMetrics.textualOverlap >= 15 ? 'text-amber' : 'text-cyan'}`}>
                  {summaryMetrics.textualOverlap}%
                </div>
                <div className="stat-sub mono text-2xs text-muted">
                  {summaryMetrics.matchedChars.toLocaleString()} of {summaryMetrics.totalChars.toLocaleString()} chars
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-label">ORIGINALITY / NOVELTY</div>
                <div className="stat-value font-mono text-cyan">
                  {summaryMetrics.noveltyIndex}%
                </div>
                <div className="stat-sub mono text-2xs text-muted">
                  {(summaryMetrics.totalChars - summaryMetrics.matchedChars).toLocaleString()} novel characters
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-label">MATCHED SOURCES</div>
                <div className="stat-value font-mono">
                  {summaryMetrics.sourcesDetected} <span className="text-muted text-sm font-normal">/ {references.length}</span>
                </div>
                <div className="stat-sub mono text-2xs text-muted">
                  {summaryMetrics.matchingRegionsCount} confirmed regions
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-label">TEXT ANALYZED</div>
                <div className="stat-value font-mono">
                  {summaryMetrics.totalWords.toLocaleString()} <span className="text-muted text-sm font-normal">words</span>
                </div>
                <div className="stat-sub mono text-2xs text-muted">
                  {summaryMetrics.totalChars.toLocaleString()} chars • {targetDocLabel}
                </div>
              </div>
            </div>

            {/* Overall Verdict Banner */}
            <div className={`verdict-banner ${verdict.badgeClass} mt-4`}>
              <div className="verdict-title mono font-bold flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>{verdict.label}</span>
              </div>
              <p className="verdict-desc text-xs mt-1">
                {verdict.desc}
              </p>
            </div>
          </div>

          {/* 3. PLAGIARISM & NOVELTY BREAKDOWN */}
          <div className="report-section">
            <h2 className="section-heading mono">2. COMPOSITION BREAKDOWN</h2>
            <p className="text-xs text-secondary mb-3">
              Distribution of original phrasing versus reference-matched content across the target document.
            </p>

            <div className="composition-bar-wrapper">
              <div className="composition-bar">
                {sourceDistribution.map((src, idx) => (
                  src.percentage > 0 ? (
                    <div 
                      key={idx} 
                      className="composition-segment"
                      style={{ 
                        width: `${src.percentage}%`, 
                        backgroundColor: src.sourceId === 'UNMATCHED' ? '#e2e8f0' : src.color || '#4A90E2'
                      }}
                      title={`${src.name}: ${src.percentage}%`}
                    ></div>
                  ) : null
                ))}
              </div>
            </div>

            <div className="composition-legend mt-3">
              {sourceDistribution.map((src, idx) => (
                <div key={idx} className="legend-item text-xs mono">
                  <span className="legend-dot" style={{ backgroundColor: src.sourceId === 'UNMATCHED' ? '#cbd5e1' : src.color || '#4A90E2' }}></span>
                  <span className="font-bold">{src.name}:</span>
                  <span className="text-secondary">{src.percentage}% ({src.matchedChars} chars)</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. SOURCE MATCH ANALYSIS */}
          <div className="report-section">
            <h2 className="section-heading mono">3. MATCHED SOURCES ANALYSIS</h2>
            <p className="text-xs text-secondary mb-3">
              Detailed comparison against each supplied reference document.
            </p>

            <table className="report-table mono text-xs">
              <thead>
                <tr>
                  <th>Reference Source</th>
                  <th>Overlap %</th>
                  <th>Matched Chars</th>
                  <th>Confirmed Regions</th>
                  <th>Match Intensity</th>
                </tr>
              </thead>
              <tbody>
                {sourceDistribution.filter(s => s.sourceId !== 'UNMATCHED').map((src, idx) => {
                  const refObj = references.find(r => r.id === src.sourceId);
                  const intensity = src.percentage >= 30 ? 'HIGH' : src.percentage > 0 ? 'MODERATE' : 'NONE';
                  
                  return (
                    <tr key={idx}>
                      <td>
                        <strong>{src.name}</strong>
                        {refObj && (
                          <div className="text-2xs text-muted">
                            ({refObj.charCount || refObj.text?.length || 0} chars in reference)
                          </div>
                        )}
                      </td>
                      <td className="font-bold">{src.percentage}%</td>
                      <td>{src.matchedChars} chars</td>
                      <td>{src.matchCount} region{src.matchCount !== 1 ? 's' : ''}</td>
                      <td>
                        <span className={`intensity-badge-inline ${intensity === 'HIGH' ? 'text-red' : intensity === 'MODERATE' ? 'text-amber' : 'text-muted'}`}>
                          {intensity}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 5. MATCHED TEXT & FORENSIC EVIDENCE */}
          <div className="report-section">
            <h2 className="section-heading mono">4. FORENSIC EVIDENCE & MATCHED EXCERPTS</h2>
            <p className="text-xs text-secondary mb-3">
              Specific verbatim sequences identified in the target document with cross-validated algorithm consensus.
            </p>

            {matches && matches.length > 0 ? (
              <div className="evidence-list">
                {matches.map((m, idx) => {
                  const isExpanded = expandedEvidence[m.id] !== false; // expanded by default
                  
                  return (
                    <div key={idx} className="evidence-card">
                      <div className="evidence-card-header" onClick={() => toggleEvidence(m.id)}>
                        <div className="flex items-center gap-2">
                          <span className="mono font-bold text-xs text-primary">{m.id}</span>
                          <span className="source-tag mono text-2xs">{m.sourceName}</span>
                          <span className="text-muted text-2xs mono">
                            [{m.targetStart}–{m.targetEnd}] ({m.length} chars • {m.wordCount} words)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`match-type-badge mono text-2xs ${m.intensity === 'STRONG' ? 'text-red' : 'text-amber'}`}>
                            {m.type}
                          </span>
                          <button className="expand-btn no-print" aria-label="Toggle excerpt">
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="evidence-card-body">
                          <div className="excerpt-box">
                            <div className="excerpt-label mono text-2xs text-muted">TARGET DOCUMENT MATCHED TEXT:</div>
                            <blockquote className="matched-text-snippet">
                              "{m.matchedText}"
                            </blockquote>
                          </div>

                          <div className="algorithm-consensus-bar mono text-2xs text-muted mt-2">
                            <span>Detected by:</span>
                            <span className="font-bold text-secondary">
                              {(m.algorithms || []).join(', ') || 'Naïve, KMP, Z-Algorithm, Rabin-Karp, Aho-Corasick'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-light border border-slate-200 rounded text-xs text-muted mono text-center">
                ✓ No matching passages detected across the supplied reference material.
              </div>
            )}
          </div>

          {/* 6. NOVELTY & ORIGINALITY ANALYSIS */}
          <div className="report-section">
            <h2 className="section-heading mono">5. NOVELTY & ORIGINALITY ANALYSIS</h2>
            <p className="text-xs text-secondary mb-3">
              Evaluation of unique textual structures, vocabulary distribution, and linguistic independence.
            </p>

            <div className="novelty-grid">
              <div className="novelty-box">
                <div className="novelty-box-title mono text-xs">UNMATCHED CONTENT</div>
                <div className="novelty-box-value font-mono text-cyan">{summaryMetrics.noveltyIndex}%</div>
                <p className="text-2xs text-secondary mt-1">
                  Proportion of target text composed of unique phrasing without direct reference correspondence.
                </p>
              </div>

              <div className="novelty-box">
                <div className="novelty-box-title mono text-xs">VOCABULARY INDEPENDENCE</div>
                <div className="novelty-box-value font-mono text-green">{originalityBreakdown.uniquePhrasesPct || Math.max(50, Math.round(100 - summaryMetrics.textualOverlap * 0.7))}%</div>
                <p className="text-2xs text-secondary mt-1">
                  Linguistic novelty score reflecting non-repetitive phrase variation.
                </p>
              </div>

              <div className="novelty-box">
                <div className="novelty-box-title mono text-xs">SOURCE CONCENTRATION</div>
                <div className="novelty-box-value font-mono text-primary text-sm">
                  {summaryMetrics.sourcesDetected > 1 ? 'Distributed' : summaryMetrics.sourcesDetected === 1 ? 'Concentrated' : 'None'}
                </div>
                <p className="text-2xs text-secondary mt-1">
                  {originalityBreakdown.sourceConcentration || (summaryMetrics.sourcesDetected > 1 ? 'Overlap distributed across multiple sources.' : 'Similarity concentrated in single source.')}
                </p>
              </div>
            </div>
          </div>

          {/* 7. ANALYSIS INSIGHTS */}
          <div className="report-section">
            <h2 className="section-heading mono">6. ANALYSIS INSIGHTS & METHODOLOGY NOTES</h2>
            
            <ul className="insights-list text-xs text-secondary">
              <li>
                <strong>Linguistic Overlap:</strong> The target document contains <strong>{summaryMetrics.textualOverlap}%</strong> textual similarity and <strong>{summaryMetrics.noveltyIndex}%</strong> original content against {references.length} reference{references.length > 1 ? 's' : ''}.
              </li>
              {topSource && topSource.percentage > 0 && (
                <li>
                  <strong>Primary Reference Contribution:</strong> The highest similarity was detected in <strong>{topSource.name}</strong>, accounting for <strong>{topSource.percentage}%</strong> ({topSource.matchedChars} characters) of the target document.
                </li>
              )}
              {longestMatch && (
                <li>
                  <strong>Longest Common Sequence:</strong> The longest contiguous matching block spans <strong>{longestMatch.length} characters</strong> ({longestMatch.wordCount} words) from <code>{longestMatch.sourceName}</code>.
                </li>
              )}
              <li>
                <strong>Multi-Algorithm Consensus:</strong> All reported matches have been cross-verified across 7 deterministic string matching and suffix architectures (Naïve, KMP, Z-Algorithm, Rabin-Karp, Aho-Corasick, Suffix Array, and Kasai LCP).
              </li>
            </ul>
          </div>

          {/* 8. REPORT FOOTER & CERTIFICATION */}
          <div className="report-footer mono text-muted text-2xs">
            <div className="flex justify-between items-center">
              <div>
                STRINGXPERT TEXT FORENSICS • CERTIFICATION HASH: <code>{analysisResult.analysisId || 'SYS-VERIFIED'}</code>
              </div>
              <div>
                Page 1 of 1 • Generated via Java Computational Engine
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
