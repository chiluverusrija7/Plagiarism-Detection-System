import { useState, useCallback, useRef, useEffect } from 'react';
import { generateDemoSteps } from './DemoAlgorithmAdapter';

export function useAlgorithmLab() {
  const [algorithm, setAlgorithm] = useState('naive');
  const [status, setStatus] = useState('IDLE'); // IDLE, RUNNING, PAUSED, COMPLETED, ERROR
  const [currentStep, setCurrentStep] = useState(0);
  const [demoData, setDemoData] = useState([]);
  
  const [text, setText] = useState('ABABCABABCAB');
  const [patterns, setPatterns] = useState(['BABC']);
  
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const runVisualization = useCallback(() => {
    if (!text) {
      setStatus('ERROR');
      return;
    }
    if (['naive', 'kmp', 'z', 'rk'].includes(algorithm) && (!patterns[0] || patterns[0] === '')) {
      setStatus('ERROR');
      return;
    }
    if (algorithm === 'ac' && patterns.filter(p => p !== '').length === 0) {
      setStatus('ERROR');
      return;
    }

    const steps = generateDemoSteps(algorithm, text, patterns.filter(p => p !== ''));
    setDemoData(steps);
    setCurrentStep(0);
    setStatus('RUNNING');
  }, [algorithm, text, patterns]);

  const pauseVisualization = useCallback(() => {
    if (status === 'RUNNING') {
      setStatus('PAUSED');
      clearTimer();
    } else if (status === 'PAUSED') {
      setStatus('RUNNING');
    }
  }, [status, clearTimer]);

  const stepVisualization = useCallback(() => {
    if (status === 'IDLE' || status === 'ERROR') return;
    setStatus('PAUSED');
    clearTimer();
    setCurrentStep(prev => {
      const next = prev + 1;
      if (next >= demoData.length) {
        setStatus('COMPLETED');
        return prev;
      }
      return next;
    });
  }, [status, demoData, clearTimer]);

  const resetVisualization = useCallback(() => {
    clearTimer();
    setStatus('IDLE');
    setCurrentStep(0);
    setDemoData([]);
  }, [clearTimer]);

  // Handle the interval for 'RUNNING' state
  useEffect(() => {
    if (status === 'RUNNING') {
      timerRef.current = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= demoData.length - 1) {
            clearTimer();
            setStatus('COMPLETED');
            return demoData.length - 1;
          }
          return next;
        });
      }, 1000); // 1 step per second
    } else {
      clearTimer();
    }
    return () => clearTimer();
  }, [status, demoData.length, clearTimer]);

  return {
    algorithm,
    setAlgorithm,
    status,
    currentStep,
    totalSteps: demoData.length,
    stepData: demoData[currentStep] || null,
    allSteps: demoData,
    text,
    setText,
    patterns,
    setPatterns,
    runVisualization,
    pauseVisualization,
    stepVisualization,
    resetVisualization
  };
}
