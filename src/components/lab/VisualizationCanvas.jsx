import React from 'react';
import { NaiveVisualizer, KMPVisualizer, ZVisualizer, GenericVisualizer } from './BasicVisualizers';

export default function VisualizationCanvas({ algorithm, step, text, patterns }) {
  
  const renderVisualizer = () => {
    switch (algorithm) {
      case 'naive':
        return <NaiveVisualizer step={step} text={text} patterns={patterns} />;
      case 'kmp':
        return <KMPVisualizer step={step} text={text} patterns={patterns} />;
      case 'z':
        return <ZVisualizer step={step} text={text} patterns={patterns} />;
      // Fallback for RK, AC, SA, LCP in this UI integration
      default:
        return <GenericVisualizer step={step} text={text} />;
    }
  };

  return (
    <div className="visualization-canvas glass-panel" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
      
      <div className="canvas-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
        <h3 className="section-title" style={{ margin: 0 }}>Execution Canvas</h3>
        {step && (
          <div className="step-badge mono text-muted" style={{ fontSize: '0.8rem' }}>
            {step.desc}
          </div>
        )}
      </div>

      <div className="canvas-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {renderVisualizer()}
      </div>

    </div>
  );
}
