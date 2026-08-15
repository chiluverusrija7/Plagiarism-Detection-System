import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, RefreshCw, FileText, SplitSquareVertical } from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext';
import CompareHeader from '../components/compare/CompareHeader';
import CompareSummaryBar from '../components/compare/CompareSummaryBar';
import CompareToolbar from '../components/compare/CompareToolbar';
import DocumentPane from '../components/compare/DocumentPane';
import CompareEvidenceInspector from '../components/compare/CompareEvidenceInspector';
import './ComparePage.css';

export default function ComparePage() {
  const {
    targetDocument,
    references,
    analysisResult,
    isOutdated,
    runAnalysis,
    isAnalyzing
  } = useAnalysis();

  const [selectedRefId, setSelectedRefId] = useState(null);
  const [activeMatchId, setActiveMatchId] = useState(null);
  const [syncScroll, setSyncScroll] = useState(true);

  const paneARef = useRef(null);
  const paneBRef = useRef(null);
  const isSyncingScrollRef = useRef(false);

  // Initialize selected reference
  useEffect(() => {
    if (references && references.length > 0) {
      if (!selectedRefId || !references.find(r => r.id === selectedRefId)) {
        setSelectedRefId(references[0].id);
      }
    } else {
      setSelectedRefId(null);
    }
  }, [references, selectedRefId]);

  const selectedRef = references?.find(r => r.id === selectedRefId) || references?.[0] || null;

  // Filter matches for the currently selected reference
  const relevantMatches = (analysisResult?.matches || []).filter(m => 
    selectedRef ? m.sourceId === selectedRef.id : true
  );

  // Reset/sync active match when reference changes
  useEffect(() => {
    if (relevantMatches.length > 0) {
      setActiveMatchId(relevantMatches[0].id);
    } else {
      setActiveMatchId(null);
    }
  }, [selectedRefId, analysisResult]);

  const activeMatchIndex = relevantMatches.findIndex(m => m.id === activeMatchId);
  const activeMatch = activeMatchIndex !== -1 ? relevantMatches[activeMatchIndex] : relevantMatches[0] || null;

  // Calculate dynamic metrics for this specific reference comparison via interval union
  const targetCharCount = targetDocument.text.length;
  let longestMatchChars = 0;
  
  const intervals = [];
  relevantMatches.forEach(m => {
    if (m.length > longestMatchChars) longestMatchChars = m.length;
    intervals.push([m.targetStart, m.targetEnd]);
  });

  intervals.sort((a, b) => a[0] - b[0]);
  const mergedIntervals = [];
  intervals.forEach(curr => {
    if (mergedIntervals.length === 0) {
      mergedIntervals.push([...curr]);
    } else {
      const prev = mergedIntervals[mergedIntervals.length - 1];
      if (curr[0] <= prev[1]) {
        prev[1] = Math.max(prev[1], curr[1]);
      } else {
        mergedIntervals.push([...curr]);
      }
    }
  });

  let matchedChars = 0;
  mergedIntervals.forEach(inter => {
    matchedChars += (inter[1] - inter[0]);
  });
  matchedChars = Math.min(targetCharCount, matchedChars);

  const unmatchedChars = Math.max(0, targetCharCount - matchedChars);
  const overlapPct = targetCharCount > 0 
    ? Math.round(((matchedChars * 100.0) / targetCharCount) * 10.0) / 10.0 
    : 0.0;
  const originalityPct = Math.max(0.0, Math.round((100.0 - overlapPct) * 10.0) / 10.0);

  // 1. Proportional Synchronized Scrolling
  const handleScrollA = () => {
    if (!syncScroll || isSyncingScrollRef.current || !paneARef.current || !paneBRef.current) return;
    isSyncingScrollRef.current = true;
    const a = paneARef.current;
    const b = paneBRef.current;
    const maxA = a.scrollHeight - a.clientHeight;
    const maxB = b.scrollHeight - b.clientHeight;
    if (maxA > 0 && maxB > 0) {
      const ratio = a.scrollTop / maxA;
      b.scrollTop = ratio * maxB;
    }
    setTimeout(() => { isSyncingScrollRef.current = false; }, 40);
  };

  const handleScrollB = () => {
    if (!syncScroll || isSyncingScrollRef.current || !paneARef.current || !paneBRef.current) return;
    isSyncingScrollRef.current = true;
    const a = paneARef.current;
    const b = paneBRef.current;
    const maxA = a.scrollHeight - a.clientHeight;
    const maxB = b.scrollHeight - b.clientHeight;
    if (maxA > 0 && maxB > 0) {
      const ratio = b.scrollTop / maxB;
      a.scrollTop = ratio * maxA;
    }
    setTimeout(() => { isSyncingScrollRef.current = false; }, 40);
  };

  // 2. Align Matches to Center
  const handleAlignMatches = useCallback(() => {
    if (!activeMatchId) return;
    const elA = document.getElementById(`match-span-target-${activeMatchId}`);
    const elB = document.getElementById(`match-span-reference-${activeMatchId}`);

    if (elA && paneARef.current) {
      elA.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (elB && paneBRef.current) {
      elB.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeMatchId]);

  // 3. Select Match and Scroll corresponding pane
  const handleSelectMatch = (matchId) => {
    setActiveMatchId(matchId);
    setTimeout(() => {
      const elA = document.getElementById(`match-span-target-${matchId}`);
      const elB = document.getElementById(`match-span-reference-${matchId}`);
      if (elA && paneARef.current) {
        elA.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (elB && paneBRef.current) {
        elB.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  // 4. Step through matches
  const handleNavigateMatch = (delta) => {
    if (relevantMatches.length === 0) return;
    let nextIdx = activeMatchIndex + delta;
    if (nextIdx < 0) nextIdx = relevantMatches.length - 1;
    if (nextIdx >= relevantMatches.length) nextIdx = 0;

    const nextMatch = relevantMatches[nextIdx];
    if (nextMatch) {
      handleSelectMatch(nextMatch.id);
    }
  };

  // Empty Analysis State
  if (!analysisResult || !targetDocument.text.trim() || references.length === 0) {
    return (
      <div className="compare-page">
        <div className="empty-compare-card glass-panel text-center p-8 max-w-lg mx-auto mt-8">
          <SplitSquareVertical size={40} className="text-cyan mx-auto mb-3" />
          <h2 className="empty-title mono">NO ACTIVE COMPARISON AVAILABLE</h2>
          <p className="empty-desc text-secondary text-xs mt-2">
            Side-by-side alignment requires an analyzed target document and at least one reference document. 
            Run an analysis from the workspace to trace matching text regions.
          </p>
          <Link to="/analyze" className="btn-accent inline-flex items-center gap-2 mono text-xs mt-4">
            <span>Open Analysis Workspace</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="compare-page">
      {/* 1. HEADER & STATUS */}
      <CompareHeader 
        analysisId={analysisResult.analysisId}
        isOutdated={isOutdated}
      />

      {/* Outdated Notice */}
      {isOutdated && (
        <div className="outdated-warning-banner glass-panel">
          <div className="flex items-center gap-2 text-amber text-xs mono">
            <AlertCircle size={16} />
            <span><strong>ANALYSIS OUTDATED:</strong> Target document or reference material modified since last run.</span>
          </div>
          <button 
            className="btn-accent small-btn mono text-xs" 
            onClick={() => runAnalysis()}
            disabled={isAnalyzing}
          >
            <RefreshCw size={13} className={isAnalyzing ? 'animate-spin' : ''} />
            <span>Re-run Analysis</span>
          </button>
        </div>
      )}

      {/* 2. TOP SUMMARY INSTRUMENT BAR */}
      <CompareSummaryBar 
        overlapPct={overlapPct}
        originalityPct={originalityPct}
        matchedChars={matchedChars}
        totalChars={targetCharCount}
        unmatchedChars={unmatchedChars}
        matchCount={relevantMatches.length}
        longestMatchChars={longestMatchChars}
        referencesCount={references.length}
        selectedRefName={selectedRef?.name}
      />

      {/* 3. TOOLBAR WITH CONTROLS & MATCH STEPPER */}
      <CompareToolbar 
        syncScroll={syncScroll}
        setSyncScroll={setSyncScroll}
        onAlignMatches={handleAlignMatches}
        references={references}
        selectedRefId={selectedRefId}
        onSelectReference={setSelectedRefId}
        matches={relevantMatches}
        activeMatchIndex={activeMatchIndex}
        onNavigateMatch={handleNavigateMatch}
      />

      {/* 4. DUAL DOCUMENT READING PANES */}
      <div className="compare-workspace-grid">
        {/* Document A (Target) */}
        <DocumentPane 
          documentType="target"
          documentName={targetDocument.name}
          text={targetDocument.text}
          matches={relevantMatches}
          activeMatchId={activeMatchId}
          onSelectMatch={handleSelectMatch}
          scrollRef={paneARef}
          onScroll={handleScrollA}
          accentColor="cyan"
        />

        {/* Document B (Reference) */}
        <DocumentPane 
          documentType="reference"
          documentName={selectedRef?.name || 'reference.txt'}
          text={selectedRef?.text || ''}
          matches={relevantMatches}
          activeMatchId={activeMatchId}
          onSelectMatch={handleSelectMatch}
          scrollRef={paneBRef}
          onScroll={handleScrollB}
          accentColor="amber"
        />
      </div>

      {/* 5. FORENSIC EVIDENCE INSPECTOR */}
      <CompareEvidenceInspector 
        activeMatch={activeMatch}
        totalMatches={relevantMatches.length}
        selectedRefName={selectedRef?.name}
      />
    </div>
  );
}
