import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { executeJavaAnalysis, checkJavaEngineHealth } from '../services/JavaEngineBridge';
import { computeAnalysisResult } from '../services/AnalysisEngineService';

const AnalysisContext = createContext(null);

const SAMPLE_TARGET_TEXT = `Algorithmic text intelligence systems utilize advanced string-matching architectures to analyze document novelty and structural overlap. 
By combining Knuth-Morris-Pratt (KMP), Z-Algorithm, and Rabin-Karp polynomial rolling hashes, modern text engines detect exact repetitions and paraphrased sequences in linear time. 
Furthermore, Suffix Arrays paired with Kasai's Longest Common Prefix (LCP) algorithm enable multi-document cross-matching without requiring quadratic comparison passes.`;

const SAMPLE_REFERENCE_TEXT = `Modern text engines combine Knuth-Morris-Pratt (KMP), Z-Algorithm, and Rabin-Karp polynomial rolling hashes to detect exact repetitions in linear time. 
Suffix Arrays paired with Kasai's Longest Common Prefix algorithm enable rapid sequence overlap discovery across academic literature.`;

export function AnalysisProvider({ children }) {
  // Clean initial state: completely empty
  const [targetDocument, setTargetDocument] = useState({
    name: '',
    text: ''
  });

  const [references, setReferences] = useState([]);

  const [config, setConfig] = useState({
    caseSensitive: false,
    normalizeWhitespace: true,
    algorithmSuite: 'full'
  });

  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [engineStatus, setEngineStatus] = useState('CHECKING'); // 'CONNECTED' | 'UNAVAILABLE' | 'CHECKING'
  const [engineError, setEngineError] = useState(null);
  const [isOutdated, setIsOutdated] = useState(false);

  // Core execution function calling real Java engine
  const runAnalysis = useCallback(async () => {
    if (!targetDocument.text || !targetDocument.text.trim() || !references || references.length === 0) {
      setAnalysisResult(null);
      return null;
    }

    setIsAnalyzing(true);
    setEngineError(null);

    try {
      // 1. Attempt execution against live Java engine
      const docName = targetDocument.name && targetDocument.name.trim() ? targetDocument.name.trim() : 'target_document.txt';
      const javaResult = await executeJavaAnalysis(
        docName,
        targetDocument.text,
        references,
        config
      );

      if (javaResult) {
        setAnalysisResult(javaResult);
        setEngineStatus('CONNECTED');
        setIsOutdated(false);
        setIsAnalyzing(false);
        return javaResult;
      }
    } catch (err) {
      console.warn('Java engine connection attempt failed:', err.message);
      
      // If Java is unavailable, record engine status
      setEngineStatus('UNAVAILABLE');
      setEngineError('Unable to reach Java computational engine on http://localhost:8085.');
      
      // Fall back to client calculation as safety net if Java daemon is offline
      const clientResult = computeAnalysisResult(
        targetDocument.text,
        targetDocument.name || 'target_document.txt',
        references,
        config
      );
      setAnalysisResult(clientResult);
      setIsOutdated(false);
      setIsAnalyzing(false);
      return clientResult;
    }

    setIsAnalyzing(false);
    return null;
  }, [targetDocument, references, config]);

  // Initial health check on mount (do NOT auto-run analysis with empty state)
  useEffect(() => {
    let mounted = true;
    checkJavaEngineHealth().then(health => {
      if (!mounted) return;
      if (health.connected) {
        setEngineStatus('CONNECTED');
      } else {
        setEngineStatus('UNAVAILABLE');
      }
    });

    return () => { mounted = false; };
  }, []);

  const setTargetText = useCallback((text, name) => {
    setTargetDocument(prev => ({
      name: name !== undefined ? name : (prev.name || (text ? 'target_document.txt' : '')),
      text: text || ''
    }));
    setIsOutdated(true);
  }, []);

  const addReference = useCallback((name, text) => {
    if (!text || !text.trim()) return false;
    const newRef = {
      id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name && name.trim() ? name.trim() : `Reference_${String(references.length + 1).padStart(2, '0')}.txt`,
      text: text.trim(),
      charCount: text.trim().length,
      wordCount: text.trim().split(/\s+/).length,
      addedAt: 'Just now'
    };
    setReferences(prev => [...prev, newRef]);
    setIsOutdated(true);
    return true;
  }, [references.length]);

  const deleteReference = useCallback((id) => {
    setReferences(prev => prev.filter(r => r.id !== id));
    setIsOutdated(true);
  }, []);

  const updateConfig = useCallback((newConfig) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    setIsOutdated(true);
  }, []);

  // Explicit user-triggered sample data loader
  const loadSampleData = useCallback(() => {
    setTargetDocument({
      name: 'research_paper_v2.txt',
      text: SAMPLE_TARGET_TEXT
    });
    setReferences([
      {
        id: 'ref-1',
        name: 'Academic_Literature_Survey_2026.txt',
        text: SAMPLE_REFERENCE_TEXT,
        charCount: SAMPLE_REFERENCE_TEXT.length,
        wordCount: SAMPLE_REFERENCE_TEXT.trim().split(/\s+/).length,
        addedAt: 'Sample'
      }
    ]);
    setIsOutdated(true);
  }, []);

  const clearTarget = useCallback(() => {
    setTargetDocument({ name: '', text: '' });
    setIsOutdated(true);
  }, []);

  const clearAll = useCallback(() => {
    setTargetDocument({ name: '', text: '' });
    setReferences([]);
    setAnalysisResult(null);
    setIsOutdated(false);
  }, []);

  const targetCharCount = targetDocument.text ? targetDocument.text.length : 0;
  const targetWordCount = targetDocument.text && targetDocument.text.trim() !== '' 
    ? targetDocument.text.trim().split(/\s+/).length 
    : 0;
  const targetLineCount = targetDocument.text && targetDocument.text.trim() !== '' 
    ? targetDocument.text.split(/\r\n|\r|\n/).length 
    : 0;

  const isReadyToAnalyze = targetCharCount > 0 && references.length > 0;

  return (
    <AnalysisContext.Provider
      value={{
        targetDocument,
        targetText: targetDocument.text,
        targetFilename: targetDocument.name,
        targetCharCount,
        targetWordCount,
        targetLineCount,
        setTargetText,
        references,
        addReference,
        deleteReference,
        config,
        updateConfig,
        setConfig,
        analysisResult,
        isAnalyzing,
        engineStatus,
        engineError,
        isOutdated,
        runAnalysis,
        loadSampleData,
        clearTarget,
        clearAll,
        isReadyToAnalyze
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
