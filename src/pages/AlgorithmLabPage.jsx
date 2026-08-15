import React from 'react';
import { useAlgorithmLab } from '../components/lab/useAlgorithmLab';
import AlgorithmSelector from '../components/lab/AlgorithmSelector';
import LabInputs from '../components/lab/LabInputs';
import LabControls from '../components/lab/LabControls';
import AlgorithmPlayground from '../components/lab/AlgorithmPlayground';
import AlgorithmOutput from '../components/lab/AlgorithmOutput';
import './AlgorithmLabPage.css';

export default function AlgorithmLabPage() {
  const {
    algorithm, setAlgorithm,
    status,
    currentStep, totalSteps, stepData, allSteps,
    text, setText,
    patterns, setPatterns,
    runVisualization, pauseVisualization, stepVisualization, resetVisualization
  } = useAlgorithmLab();

  return (
    <div className="algo-lab-page">
      {/* 1. REFINED PAGE HEADER */}
      <div className="lab-page-hero">
        <div className="hero-eyebrow mono">
          <span className="eyebrow-dot"></span>
          <span>ALGORITHM LAB</span>
        </div>
        <h1 className="hero-main-title">See the algorithm think.</h1>
        <p className="hero-description">
          Inspect matching, shifting, hashing, traversal, and suffix analysis step-by-step with real-time academic telemetry.
        </p>
      </div>

      {/* 2. REFINED ALGORITHM SELECTOR WITH MICRO-DESCRIPTIONS */}
      <div className="glass-panel algo-selector-card">
        <AlgorithmSelector 
          algorithm={algorithm} 
          setAlgorithm={setAlgorithm} 
          status={status}
          resetVisualization={resetVisualization}
        />
      </div>

      {/* 3. INPUT WORKSPACE & EXECUTION CONTROLS */}
      <div className="glass-panel input-controls-master-card">
        <div className="workspace-flex-layout">
          <div className="inputs-column">
            <LabInputs 
              algorithm={algorithm}
              text={text}
              setText={setText}
              patterns={patterns}
              setPatterns={setPatterns}
              status={status}
            />
          </div>
          
          <div className="controls-column">
            <div className="controls-header">
              <span className="mono text-xs text-muted">CONTROLS</span>
            </div>
            <LabControls 
              status={status}
              runVisualization={runVisualization}
              pauseVisualization={pauseVisualization}
              stepVisualization={stepVisualization}
              resetVisualization={resetVisualization}
            />
          </div>
        </div>
      </div>

      {/* 4. UPGRADED MULTI-ZONE ALGORITHM PLAYGROUND */}
      <AlgorithmPlayground 
        algorithm={algorithm}
        status={status}
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepData={stepData}
        text={text}
        patterns={patterns}
      />

      {/* 5. COMPLETED SUMMARY CARD */}
      {status === 'COMPLETED' && (
        <AlgorithmOutput 
          algorithm={algorithm}
          status={status}
          allSteps={allSteps}
          patterns={patterns}
          resetVisualization={resetVisualization}
        />
      )}
    </div>
  );
}
