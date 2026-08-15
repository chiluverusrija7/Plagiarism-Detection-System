import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import AnalyzerHeader from '../components/analyzer/AnalyzerHeader';
import TargetDocumentEditor from '../components/analyzer/TargetDocumentEditor';
import ReferenceManager from '../components/analyzer/ReferenceManager';
import AnalysisConfigBar from '../components/analyzer/AnalysisConfigBar';
import AnalysisReadinessBar from '../components/analyzer/AnalysisReadinessBar';
import AddReferenceModal from '../components/analyzer/AddReferenceModal';
import ViewReferenceModal from '../components/analyzer/ViewReferenceModal';
import AnalysisProgressModal from '../components/analyzer/AnalysisProgressModal';
import './AnalyzerPage.css';

export default function AnalyzerPage() {
  const navigate = useNavigate();
  const {
    targetText,
    setTargetText,
    targetCharCount,
    targetWordCount,
    targetLineCount,
    references,
    addReference,
    deleteReference,
    config,
    setConfig,
    runAnalysis,
    loadSampleData,
    clearTarget,
    isReadyToAnalyze
  } = useAnalysis();

  const [activeModal, setActiveModal] = useState(null); // 'ADD_REF' | 'VIEW_REF' | 'ANALYSIS_PROGRESS' | null
  const [selectedRef, setSelectedRef] = useState(null);
  const [analysisPhase, setAnalysisPhase] = useState('IDLE');
  const [analysisProgressStep, setAnalysisProgressStep] = useState(0);

  const viewReference = useCallback((ref) => {
    setSelectedRef(ref);
    setActiveModal('VIEW_REF');
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleStartAnalysis = useCallback(async () => {
    if (!targetText.trim() || references.length === 0) return;
    
    // 1. Open progress modal and animate phases
    setAnalysisPhase('ANALYZING');
    setAnalysisProgressStep(0);
    setActiveModal('ANALYSIS_PROGRESS');

    const progressTimer = setInterval(() => {
      setAnalysisProgressStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 400);

    try {
      // 2. Run real Java engine execution
      await runAnalysis();
      clearInterval(progressTimer);
      setAnalysisProgressStep(4);
      setAnalysisPhase('COMPLETED');
    } catch (err) {
      clearInterval(progressTimer);
      setAnalysisPhase('COMPLETED');
    }
  }, [targetText, references, runAnalysis]);

  return (
    <div className="analyzer-page">
      {/* 1. TOP HEADER & STATUS BAR */}
      <AnalyzerHeader 
        isReadyToAnalyze={isReadyToAnalyze}
        startAnalysis={handleStartAnalysis}
        charCount={targetCharCount}
        refCount={references.length}
      />

      {/* 2. 65% / 35% WORKSPACE SPLIT */}
      <div className="workspace-main-grid">
        {/* Left (~65%): Target Document Editor */}
        <div className="workspace-grid-target">
          <TargetDocumentEditor 
            text={targetText}
            setText={setTargetText}
            charCount={targetCharCount}
            wordCount={targetWordCount}
            lineCount={targetLineCount}
            loadSample={loadSampleData}
            clearTarget={clearTarget}
          />
        </div>

        {/* Right (~35%): Reference Material Manager */}
        <div className="workspace-grid-reference">
          <ReferenceManager 
            references={references}
            deleteReference={deleteReference}
            viewReference={viewReference}
            openAddModal={() => setActiveModal('ADD_REF')}
          />
        </div>
      </div>

      {/* 3. ANALYSIS CONFIGURATION PANEL */}
      <AnalysisConfigBar 
        config={config}
        setConfig={setConfig}
      />

      {/* 4. BOTTOM READINESS & PRIMARY ACTION BAR */}
      <AnalysisReadinessBar 
        charCount={targetCharCount}
        referencesCount={references.length}
        isReadyToAnalyze={isReadyToAnalyze}
        startAnalysis={handleStartAnalysis}
      />

      {/* 5. MODALS & OVERLAYS */}
      <AddReferenceModal 
        isOpen={activeModal === 'ADD_REF'}
        onClose={closeModal}
        onAdd={addReference}
      />

      <ViewReferenceModal 
        isOpen={activeModal === 'VIEW_REF'}
        onClose={closeModal}
        reference={selectedRef}
      />

      <AnalysisProgressModal 
        isOpen={activeModal === 'ANALYSIS_PROGRESS'}
        progressStep={analysisProgressStep}
        isCompleted={analysisPhase === 'COMPLETED'}
        onClose={closeModal}
      />
    </div>
  );
}
