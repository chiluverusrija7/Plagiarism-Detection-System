import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, FileText, ArrowRight } from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import ResultsHeader from '../components/results/ResultsHeader';
import ResultsSummaryHero from '../components/results/ResultsSummaryHero';
import TextHeatmapViewer from '../components/results/TextHeatmapViewer';
import SourceContributionPanel from '../components/results/SourceContributionPanel';
import MatchEvidenceInspector from '../components/results/MatchEvidenceInspector';
import DetectedMatchesList from '../components/results/DetectedMatchesList';
import AlgorithmEvidenceSummary from '../components/results/AlgorithmEvidenceSummary';
import TextualOriginalityPanel from '../components/results/TextualOriginalityPanel';
import PerformanceTelemetryPanel from '../components/results/PerformanceTelemetryPanel';
import MethodologyAndLimitations from '../components/results/MethodologyAndLimitations';
import ReportSummaryBar from '../components/results/ReportSummaryBar';
import './ResultsPage.css';

export default function ResultsPage() {
  const { analysisResult, references, isOutdated, runAnalysis } = useAnalysis();
  
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [activeSourceFilter, setActiveSourceFilter] = useState('ALL');

  // Reset selected match when analysisResult changes
  useEffect(() => {
    if (analysisResult && analysisResult.matches && analysisResult.matches.length > 0) {
      setSelectedMatchId(analysisResult.matches[0].id);
    } else {
      setSelectedMatchId(null);
    }
  }, [analysisResult]);

  // Handle empty or missing analysis
  if (!analysisResult || !references || references.length === 0) {
    return (
      <div className="results-page">
        <div className="empty-analysis-card glass-panel text-center">
          <div className="empty-analysis-icon">
            <FileText size={36} className="text-cyan" />
          </div>
          <h2 className="empty-title mono">NO ACTIVE ANALYSIS AVAILABLE</h2>
          <p className="empty-desc text-secondary text-xs mt-2 max-w-md mx-auto">
            Similarity results are generated dynamically from your target document and reference material. 
            Add at least one reference document and run analysis to inspect textual overlap.
          </p>
          <Link to="/analyze" className="btn-accent inline-flex items-center gap-2 mono text-xs mt-4">
            <span>Open Analysis Workspace</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const selectedMatch = analysisResult.matches?.find(m => m.id === selectedMatchId) || analysisResult.matches?.[0] || null;

  const handleSelectMatch = (matchId) => {
    setSelectedMatchId(matchId);
    const targetMatch = analysisResult.matches?.find(m => m.id === matchId);
    if (targetMatch && activeSourceFilter !== 'ALL' && targetMatch.sourceId !== activeSourceFilter) {
      setActiveSourceFilter('ALL');
    }
  };

  const handleSelectSource = (sourceId) => {
    setActiveSourceFilter(sourceId);
    if (sourceId !== 'ALL' && sourceId !== 'UNMATCHED') {
      const matchForSource = analysisResult.matches?.find(m => m.sourceId === sourceId);
      if (matchForSource) {
        setSelectedMatchId(matchForSource.id);
      }
    }
  };

  return (
    <div className="results-page">
      {/* Outdated Analysis Warning Banner */}
      {isOutdated && (
        <div className="outdated-warning-banner glass-panel">
          <div className="flex items-center gap-2 text-amber text-xs mono">
            <AlertCircle size={16} />
            <span><strong>ANALYSIS OUTDATED:</strong> Target document or reference material has changed since last analysis.</span>
          </div>
          <button 
            className="btn-accent small-btn mono text-xs" 
            onClick={() => runAnalysis()}
          >
            <RefreshCw size={13} />
            <span>Re-run Analysis</span>
          </button>
        </div>
      )}

      {/* 1. REPORT HEADER */}
      <ResultsHeader result={analysisResult} />

      {/* 2. SUMMARY HERO CARD */}
      <ResultsSummaryHero result={analysisResult} />

      {/* 3. CORE TWO-COLUMN FORENSIC WORKSPACE */}
      <div className="results-core-grid">
        {/* Left: Interactive Text Heatmap */}
        <div className="core-grid-left">
          <TextHeatmapViewer 
            heatmapSegments={analysisResult.heatmapSegments}
            selectedMatchId={selectedMatchId}
            onSelectMatch={handleSelectMatch}
            activeSourceFilter={activeSourceFilter}
            setActiveSourceFilter={setActiveSourceFilter}
            references={references}
          />
        </div>

        {/* Right: Source Contribution & Match Evidence */}
        <div className="core-grid-right">
          <SourceContributionPanel 
            sourceDistribution={analysisResult.sourceDistribution}
            activeSourceFilter={activeSourceFilter}
            onSelectSource={handleSelectSource}
          />

          <MatchEvidenceInspector 
            match={selectedMatch}
            onSelectMatch={handleSelectMatch}
          />
        </div>
      </div>

      {/* 4. DETECTED MATCHES TABLE */}
      <DetectedMatchesList 
        matches={analysisResult.matches}
        selectedMatchId={selectedMatchId}
        onSelectMatch={handleSelectMatch}
        activeSourceFilter={activeSourceFilter}
      />

      {/* 5. ALGORITHM EVIDENCE SUMMARY */}
      <AlgorithmEvidenceSummary 
        algorithmEvidenceSummary={analysisResult.algorithmEvidenceSummary}
      />

      {/* 6. TEXTUAL ORIGINALITY & REPETITION */}
      <TextualOriginalityPanel 
        originalityBreakdown={analysisResult.originalityBreakdown}
      />

      {/* 7. PERFORMANCE TELEMETRY */}
      <PerformanceTelemetryPanel 
        performanceTelemetry={analysisResult.algorithmSummaries || analysisResult.performanceMetrics || analysisResult.performanceTelemetry}
      />

      {/* 8. METHODOLOGY & LIMITATIONS */}
      <MethodologyAndLimitations />

      {/* 9. BOTTOM SUMMARY RECAP BAR */}
      <ReportSummaryBar result={analysisResult} />
    </div>
  );
}
