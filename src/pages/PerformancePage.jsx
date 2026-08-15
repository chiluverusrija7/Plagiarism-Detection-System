import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, Zap, Clock, RefreshCw, ArrowRight, 
  AlertCircle, Cpu, ChevronDown, ChevronUp, Layers, Info 
} from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import './PerformancePage.css';

export default function PerformancePage() {
  const { analysisResult, isOutdated, runAnalysis, engineStatus, isAnalyzing } = useAnalysis();
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (algoName) => {
    setExpandedRows(prev => ({
      ...prev,
      [algoName]: !prev[algoName]
    }));
  };

  if (!analysisResult) {
    return (
      <div className="perf-page">
        <div className="empty-perf-card glass-panel text-center p-8 max-w-lg mx-auto mt-8">
          <Cpu size={40} className="text-cyan mx-auto mb-3" />
          <h2 className="empty-title mono">NO PERFORMANCE TELEMETRY RECORDED</h2>
          <p className="empty-desc text-secondary text-xs mt-2">
            Run an analysis from the workspace to record live <code>System.nanoTime()</code> profiling metrics across the Java string algorithm engine.
          </p>
          <Link to="/analyze" className="btn-accent inline-flex items-center gap-2 mono text-xs mt-4">
            <span>Open Analysis Workspace</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // Exactly 7 aggregated algorithm summaries from Java
  const summaries = analysisResult.algorithmSummaries && analysisResult.algorithmSummaries.length > 0
    ? analysisResult.algorithmSummaries
    : (analysisResult.performanceMetrics || []);

  // Calculate authoritative live totals directly across the 7 algorithm summaries
  let totalTimeNs = 0;
  let totalComparisons = 0;
  let totalPreTimeNs = 0;

  summaries.forEach(s => {
    totalTimeNs += (s.totalExecutionTimeNs || s.executionTimeNs || 0);
    totalComparisons += (s.totalComparisons || s.comparisons || 0);
    totalPreTimeNs += (s.totalPreprocessingTimeNs || s.preprocessingTimeNs || 0);
  });

  // Calculate actual single-pattern search passes (Naïve, KMP, Z, Rabin-Karp)
  const singlePatternSearches = summaries
    .filter(s => s.workloadType === 'SINGLE_PATTERN')
    .reduce((acc, s) => acc + (s.patternCount || 0), 0);

  const totalTimeMs = (totalTimeNs / 1_000_000).toFixed(4);
  const totalPreTimeMs = (totalPreTimeNs / 1_000_000).toFixed(4);

  // Maximum values for relative bar chart width calculations
  const maxTimeNs = Math.max(...summaries.map(s => s.totalExecutionTimeNs || s.executionTimeNs || 1), 1);
  const maxComparisons = Math.max(...summaries.map(s => s.totalComparisons || s.comparisons || 1), 1);

  // Total distinct patterns extracted from reference material
  const extractedPatternsCount = summaries.find(s => s.workloadType === 'SINGLE_PATTERN')?.patternCount || 
                                 summaries[0]?.patternCount || 1;

  return (
    <div className="perf-page">
      {/* 1. HEADER & STATUS */}
      <div className="perf-header">
        <div>
          <div className="perf-eyebrow mono text-xs text-cyan">
            <span>JVM EXECUTION PROFILER</span>
            <span className="telemetry-badge mono text-xs">System.nanoTime()</span>
          </div>
          <h1 className="workspace-title">Performance Analytics</h1>
          <p className="text-muted text-xs mono mt-1">
            Live measured computational benchmarks across all 7 string matching and indexing architectures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="status-badge mono text-xs">
            <div className={`status-dot ${engineStatus === 'CONNECTED' ? 'green' : 'amber'}`}></div>
            {engineStatus === 'CONNECTED' ? 'JAVA ENGINE LIVE' : 'ENGINE STANDALONE'}
          </div>
        </div>
      </div>

      {/* Outdated Notice */}
      {isOutdated && (
        <div className="outdated-warning-banner glass-panel">
          <div className="flex items-center gap-2 text-amber text-xs mono">
            <AlertCircle size={16} />
            <span><strong>BENCHMARKS OUTDATED:</strong> Target document or references modified since last run.</span>
          </div>
          <button 
            className="btn-accent small-btn mono text-xs" 
            onClick={() => runAnalysis()}
            disabled={isAnalyzing}
          >
            <RefreshCw size={13} className={isAnalyzing ? 'animate-spin' : ''} />
            <span>Re-profile Algorithms</span>
          </button>
        </div>
      )}

      {/* 2. CURRENT ANALYSIS CONTEXT BAR */}
      <div className="analysis-context-strip glass-panel mono text-xs">
        <div className="context-item">
          <span className="text-muted">Target:</span>
          <span className="font-bold text-primary">{analysisResult.targetDocument.filename}</span>
          <span className="text-muted">({analysisResult.targetDocument.charCount} chars • {analysisResult.targetDocument.wordCount} words)</span>
        </div>
        <div className="context-divider"></div>
        <div className="context-item">
          <span className="text-muted">References:</span>
          <span className="font-bold text-primary">{analysisResult.summaryMetrics.referencesAnalyzed}</span>
        </div>
        <div className="context-divider"></div>
        <div className="context-item">
          <span className="text-muted">Patterns Extracted:</span>
          <span className="font-bold text-cyan">{extractedPatternsCount} search patterns</span>
        </div>
        <div className="context-divider"></div>
        <div className="context-item">
          <span className="text-muted">Single-Pattern Searches:</span>
          <span className="font-bold text-primary">{singlePatternSearches} ({extractedPatternsCount} × 4)</span>
        </div>
        <div className="context-divider"></div>
        <div className="context-item">
          <span className="text-muted">Algorithm Modules:</span>
          <span className="font-bold text-green">7 Architectures</span>
        </div>
      </div>

      {/* 3. UNIFIED SUMMARY METRIC CARDS */}
      <div className="metrics-grid">
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="eyebrow">TOTAL ALGORITHM EXECUTION</span>
            <Clock size={18} className="metric-icon text-cyan" />
          </div>
          <div className="metric-value font-mono">{totalTimeMs}<span className="metric-unit"> ms</span></div>
          <div className="metric-sub mono text-xs text-muted">{(totalTimeNs).toLocaleString()} ns aggregate (sum of 7 modules)</div>
        </div>
        
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="eyebrow">TOTAL COMPARISONS</span>
            <Activity size={18} className="metric-icon text-amber" />
          </div>
          <div className="metric-value font-mono">{totalComparisons.toLocaleString()}</div>
          <div className="metric-sub mono text-xs text-muted">Operational comparisons & transitions across 7 modules</div>
        </div>
        
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="eyebrow">PREPROCESSING TIME</span>
            <Zap size={18} className="metric-icon text-green" />
          </div>
          <div className="metric-value font-mono">{totalPreTimeMs}<span className="metric-unit"> ms</span></div>
          <div className="metric-sub mono text-xs text-muted">{(totalPreTimeNs).toLocaleString()} ns (π/LPS, Trie, Hashes)</div>
        </div>
        
        <div className="metric-card glass-panel">
          <div className="metric-header">
            <span className="eyebrow">SINGLE-PATTERN SEARCHES</span>
            <Layers size={18} className="metric-icon text-cyan" />
          </div>
          <div className="metric-value font-mono">{singlePatternSearches}</div>
          <div className="metric-sub mono text-xs text-muted">{extractedPatternsCount} patterns × 4 single-pattern matchers (+ 1 trie scan)</div>
        </div>
      </div>

      {/* 4. WORKLOAD EXPLANATORY NOTE */}
      <div className="workload-info-banner glass-panel text-xs">
        <div className="flex items-start gap-2.5">
          <Info size={16} className="text-cyan flex-shrink-0 mt-0.5" />
          <div className="text-secondary leading-relaxed">
            <strong className="text-primary">Workload Semantics:</strong> Single-pattern algorithms (Naïve, KMP, Z-Algorithm, Rabin-Karp) execute once per extracted pattern ({extractedPatternsCount} passes each = {singlePatternSearches} total searches). Aho-Corasick processes the entire {extractedPatternsCount}-pattern dictionary through a single multi-pattern automaton traversal. Suffix Array and Kasai LCP construct full lexicographic indices on the document.
          </div>
        </div>
      </div>

      {/* 5. 7-ROW AGGREGATED TELEMETRY TABLE */}
      <div className="perf-table-panel glass-panel">
        <div className="panel-header-strip">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-cyan" />
            <h3 className="section-title-text mono">ALGORITHM PERFORMANCE SUMMARIES (7 MODULES)</h3>
          </div>
          <span className="text-xs text-muted mono">
            Click any row to view individual pattern-level execution passes
          </span>
        </div>

        <div className="table-responsive">
          <table className="telemetry-table mono text-xs">
            <thead>
              <tr>
                <th>Algorithm Architecture</th>
                <th>Workload</th>
                <th>Aggregate Time</th>
                <th>Avg / Pattern</th>
                <th>Preprocessing</th>
                <th>Comparisons</th>
                <th>Verifications / Collisions</th>
                <th className="text-center">Details</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((s, idx) => {
                const name = s.algorithmName || s.algorithm;
                const isExpanded = !!expandedRows[name];
                const execMs = (s.totalExecutionTimeMs ?? s.executionTimeMs ?? 0).toFixed(4);
                const execNs = (s.totalExecutionTimeNs ?? s.executionTimeNs ?? 0).toLocaleString();
                const preNs = (s.totalPreprocessingTimeNs ?? s.preprocessingTimeNs ?? 0).toLocaleString();
                const comps = (s.totalComparisons ?? s.comparisons ?? 0).toLocaleString();
                
                // For single-pattern matchers with multiple patterns, show average per pattern; for multi-pattern trie scan / index structures show N/A
                const avgMs = s.workloadType === 'SINGLE_PATTERN' && s.patternCount > 1 && s.averageTimePerPatternMs 
                  ? `${s.averageTimePerPatternMs.toFixed(4)} ms` 
                  : 'N/A';
                
                const workloadBadge = s.workloadType === 'MULTI_PATTERN'
                  ? `${s.patternCount} patterns (1 trie scan)`
                  : s.workloadType === 'INDEX_STRUCTURE'
                  ? '1 structure pass'
                  : `${s.patternCount || 1} pattern pass${s.patternCount > 1 ? 'es' : ''}`;

                const verifColls = s.exactVerifications !== null && s.exactVerifications !== undefined
                  ? `${s.exactVerifications} verifs / ${s.collisions ?? 0} colls`
                  : 'N/A';

                const rawRuns = s.rawRuns || [];

                return (
                  <React.Fragment key={idx}>
                    <tr 
                      className={`summary-row ${isExpanded ? 'is-expanded-row' : ''}`}
                      onClick={() => toggleRow(name)}
                    >
                      <td className="font-bold text-primary flex items-center gap-2">
                        <span className="algo-indicator-dot"></span>
                        <span>{name}</span>
                      </td>
                      <td className="text-secondary">{workloadBadge}</td>
                      <td className="text-cyan font-bold">
                        {execMs} ms <span className="text-muted font-normal text-2xs">({execNs} ns)</span>
                      </td>
                      <td className="text-muted">{avgMs}</td>
                      <td className="text-muted">{preNs} ns</td>
                      <td className="text-amber font-bold">{comps}</td>
                      <td className="text-muted">{verifColls}</td>
                      <td className="text-center">
                        <button className="expand-toggle-btn text-muted" aria-label="Toggle details">
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Raw Runs Sub-Table */}
                    {isExpanded && (
                      <tr className="expanded-details-row">
                        <td colSpan={8}>
                          <div className="expanded-details-box">
                            <div className="expanded-header flex items-center justify-between mb-2">
                              <span className="font-bold text-xs text-cyan">
                                {name} — Granular Pattern Passes ({rawRuns.length} record{rawRuns.length > 1 ? 's' : ''})
                              </span>
                              <span className="text-muted text-2xs">
                                Individual System.nanoTime() telemetry per search pass
                              </span>
                            </div>

                            {rawRuns.length > 0 ? (
                              <table className="raw-runs-table mono text-2xs">
                                <thead>
                                  <tr>
                                    <th>Pass #</th>
                                    <th>Pattern Size</th>
                                    <th>Execution Time</th>
                                    <th>Preprocessing</th>
                                    <th>Matching Time</th>
                                    <th>Comparisons</th>
                                    <th>Verifications</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {rawRuns.map((r, rIdx) => (
                                    <tr key={rIdx}>
                                      <td className="text-muted">Pass #{String(rIdx + 1).padStart(2, '0')}</td>
                                      <td className="text-secondary">{r.patternSize || '—'} chars</td>
                                      <td className="text-cyan">{r.executionTimeMs?.toFixed(4) || (r.executionTimeNs / 1_000_000).toFixed(4)} ms ({(r.executionTimeNs || 0).toLocaleString()} ns)</td>
                                      <td className="text-muted">{(r.preprocessingTimeNs || 0).toLocaleString()} ns</td>
                                      <td className="text-muted">{(r.matchingTimeNs || 0).toLocaleString()} ns</td>
                                      <td className="text-amber">{(r.comparisons || 0).toLocaleString()}</td>
                                      <td className="text-muted">{r.exactVerifications > 0 ? r.exactVerifications : '—'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-muted text-xs p-2">Single structural execution pass.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. COMPARATIVE BAR VISUALIZATIONS */}
      <div className="perf-charts-grid">
        {/* Chart 1: Execution Time Distribution */}
        <div className="perf-chart-panel glass-panel">
          <div className="panel-header">
            <h3 className="panel-title mono text-xs">Performance by Metric</h3>
            <span className="text-muted mono text-2xs">Across extracted search passes</span>
          </div>
          <div className="chart-bars-list">
            {summaries.map((s, idx) => {
              const name = s.algorithmName || s.algorithm;
              const timeNs = s.totalExecutionTimeNs || s.executionTimeNs || 0;
              const timeMs = (s.totalExecutionTimeMs || s.executionTimeMs || 0).toFixed(4);
              const widthPct = Math.max(4, Math.round((timeNs / maxTimeNs) * 100));
              return (
                <div key={idx} className="chart-bar-item">
                  <div className="bar-meta mono text-xs">
                    <span className="bar-label">{name}</span>
                    <span className="bar-value text-cyan">{timeNs.toLocaleString()} ns ({timeMs} ms)</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill cyan-fill" style={{ width: `${widthPct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Chart 2: Character Comparisons */}
        <div className="perf-chart-panel glass-panel">
          <div className="panel-header">
            <h3 className="panel-title mono text-xs">TOTAL CHARACTER COMPARISONS</h3>
            <span className="text-muted mono text-2xs">Operational comparisons & transitions</span>
          </div>
          <div className="chart-bars-list">
            {summaries.map((s, idx) => {
              const name = s.algorithmName || s.algorithm;
              const comps = s.totalComparisons || s.comparisons || 0;
              const widthPct = comps > 0 ? Math.max(4, Math.round((comps / maxComparisons) * 100)) : 0;
              return (
                <div key={idx} className="chart-bar-item">
                  <div className="bar-meta mono text-xs">
                    <span className="bar-label">{name}</span>
                    <span className="bar-value text-amber">{comps.toLocaleString()} ops</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill amber-fill" style={{ width: `${widthPct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
