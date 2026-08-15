import React from 'react';
import AlgorithmPlaygroundHeader from './AlgorithmPlaygroundHeader';
import SequenceGrid from './SequenceGrid';
import OperationPanel from './OperationPanel';
import MetricsPanel from './MetricsPanel';
import InsightPanel from './InsightPanel';

// Specific Visualizers
import NaiveVisualizer from './visualizers/NaiveVisualizer';
import KMPVisualizer from './visualizers/KMPVisualizer';
import ZVisualizer from './visualizers/ZVisualizer';
import RabinKarpVisualizer from './visualizers/RabinKarpVisualizer';
import AhoCorasickVisualizer from './visualizers/AhoCorasickVisualizer';
import SuffixArrayVisualizer from './visualizers/SuffixArrayVisualizer';
import LCPVisualizer from './visualizers/LCPVisualizer';

export default function AlgorithmPlayground({
  algorithm,
  status,
  currentStep,
  totalSteps,
  stepData,
  text,
  patterns
}) {
  const p0 = patterns?.[0] || '';
  const isIdle = status === 'IDLE';

  const renderAlgoSpecificVisualizer = () => {
    switch (algorithm) {
      case 'naive':
        return <NaiveVisualizer step={stepData} text={text} pattern={p0} />;
      case 'kmp':
        return <KMPVisualizer step={stepData} pattern={p0} />;
      case 'z':
        return <ZVisualizer step={stepData} pattern={p0} />;
      case 'rk':
        return <RabinKarpVisualizer step={stepData} pattern={p0} />;
      case 'ac':
        return <AhoCorasickVisualizer step={stepData} patterns={patterns} />;
      case 'sa':
        return <SuffixArrayVisualizer step={stepData} text={text} />;
      case 'lcp':
        return <LCPVisualizer step={stepData} text={text} />;
      default:
        return null;
    }
  };

  return (
    <div className="algorithm-playground-container">
      {/* 1. TOP HEADER & TELEMETRY BAR */}
      <AlgorithmPlaygroundHeader 
        algorithm={algorithm}
        status={status}
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepData={stepData}
      />

      {/* 2. MAIN VISUALIZATION WORKSPACE */}
      <div className="playground-canvas glass-panel">
        {isIdle ? (
          <div className="playground-empty-state">
            <div className="empty-pulse-icon">⚡</div>
            <h3 className="empty-title">Ready for Step-by-Step Execution</h3>
            <p className="empty-desc text-muted text-xs">
              Click <strong className="text-cyan">Run</strong> to play the automated execution sequence, or use <strong className="text-cyan">Step</strong> to advance the algorithm one comparison at a time.
            </p>
            <div className="empty-preview-sequence mono text-xs mt-3">
              <span>T: [ {text.substring(0, 12)}... ]</span>
              {p0 && <span className="ml-3">P: [ {p0} ]</span>}
            </div>
          </div>
        ) : (
          <div className="active-visualization-flow">
            {/* Primary Sequence Grid */}
            <SequenceGrid 
              text={text}
              pattern={p0}
              step={stepData}
              algorithm={algorithm}
            />

            {/* Algorithm-Specific Sub-Visualizer */}
            {renderAlgoSpecificVisualizer()}
          </div>
        )}
      </div>

      {/* 3. LOWER MULTI-ZONE INSTRUMENTATION */}
      {!isIdle && (
        <div className="playground-lower-grid">
          {/* Zone A: Operation & 5-Phase Timeline */}
          <div className="lower-grid-main">
            <OperationPanel step={stepData} />
          </div>

          {/* Zone B: Live Metrics & Academic Insight */}
          <div className="lower-grid-side">
            <MetricsPanel 
              step={stepData}
              currentStep={currentStep}
              totalSteps={totalSteps}
              algorithm={algorithm}
            />
            <InsightPanel algorithm={algorithm} />
          </div>
        </div>
      )}
    </div>
  );
}
