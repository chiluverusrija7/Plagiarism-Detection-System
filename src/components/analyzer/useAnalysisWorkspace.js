import { useState, useCallback } from 'react';

const SAMPLE_TARGET_TEXT = `Algorithmic text intelligence systems utilize advanced string-matching architectures to analyze document novelty and structural overlap. 
By combining Knuth-Morris-Pratt (KMP), Z-Algorithm, and Rabin-Karp polynomial rolling hashes, modern text engines detect exact repetitions and paraphrased sequences in linear time. 
Furthermore, Suffix Arrays paired with Kasai's Longest Common Prefix (LCP) algorithm enable multi-document cross-matching without requiring quadratic comparison passes.`;

const SAMPLE_REFERENCE_TEXT = `Modern text engines combine Knuth-Morris-Pratt (KMP), Z-Algorithm, and Rabin-Karp polynomial rolling hashes to detect exact repetitions in linear time. 
Suffix Arrays paired with Kasai's Longest Common Prefix algorithm enable rapid sequence overlap discovery across academic literature.`;

export function useAnalysisWorkspace() {
  const [targetText, setTargetText] = useState(SAMPLE_TARGET_TEXT);
  const [references, setReferences] = useState([
    {
      id: 'ref-1',
      name: 'Academic_Literature_Survey_2026.txt',
      text: SAMPLE_REFERENCE_TEXT,
      charCount: SAMPLE_REFERENCE_TEXT.length,
      wordCount: SAMPLE_REFERENCE_TEXT.trim().split(/\s+/).length,
      addedAt: 'Just now'
    }
  ]);

  const [config, setConfig] = useState({
    caseSensitive: false,
    normalizeWhitespace: true,
    algorithmSuite: 'full' // 'full' | 'fast'
  });

  const [activeModal, setActiveModal] = useState(null); // 'ADD_REF' | 'VIEW_REF' | 'ANALYSIS_PROGRESS' | null
  const [selectedRef, setSelectedRef] = useState(null);
  const [analysisPhase, setAnalysisPhase] = useState('IDLE'); // 'IDLE' | 'ANALYZING' | 'COMPLETED'
  const [analysisProgressStep, setAnalysisProgressStep] = useState(0);

  const addReference = useCallback((name, text) => {
    if (!text || !text.trim()) return false;
    const newRef = {
      id: `ref-${Date.now()}`,
      name: name && name.trim() ? name.trim() : `Reference_${String(references.length + 1).padStart(2, '0')}.txt`,
      text: text.trim(),
      charCount: text.trim().length,
      wordCount: text.trim().split(/\s+/).length,
      addedAt: 'Just now'
    };
    setReferences(prev => [...prev, newRef]);
    setActiveModal(null);
    return true;
  }, [references.length]);

  const deleteReference = useCallback((id) => {
    setReferences(prev => prev.filter(r => r.id !== id));
    if (selectedRef && selectedRef.id === id) {
      setSelectedRef(null);
      setActiveModal(null);
    }
  }, [selectedRef]);

  const loadSample = useCallback(() => {
    setTargetText(SAMPLE_TARGET_TEXT);
  }, []);

  const clearTarget = useCallback(() => {
    setTargetText('');
  }, []);

  const startAnalysis = useCallback(() => {
    if (!targetText.trim() || references.length === 0) return;
    setAnalysisPhase('ANALYZING');
    setAnalysisProgressStep(0);
    setActiveModal('ANALYSIS_PROGRESS');

    // Simulate progress phases
    const interval = setInterval(() => {
      setAnalysisProgressStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setAnalysisPhase('COMPLETED');
          return 4;
        }
        return prev + 1;
      });
    }, 600);
  }, [targetText, references.length]);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const viewReference = useCallback((ref) => {
    setSelectedRef(ref);
    setActiveModal('VIEW_REF');
  }, []);

  const charCount = targetText.length;
  const wordCount = targetText.trim() === '' ? 0 : targetText.trim().split(/\s+/).length;
  const lineCount = targetText.trim() === '' ? 0 : targetText.split(/\r\n|\r|\n/).length;

  const isReadyToAnalyze = charCount > 0 && references.length > 0;

  return {
    targetText,
    setTargetText,
    charCount,
    wordCount,
    lineCount,
    references,
    addReference,
    deleteReference,
    config,
    setConfig,
    activeModal,
    setActiveModal,
    selectedRef,
    viewReference,
    closeModal,
    analysisPhase,
    analysisProgressStep,
    loadSample,
    clearTarget,
    startAnalysis,
    isReadyToAnalyze
  };
}
