import React from 'react';
import { Sliders, Check } from 'lucide-react';

export default function AnalysisConfigBar({ config, setConfig }) {
  const toggleCase = () => {
    setConfig(prev => ({ ...prev, caseSensitive: !prev.caseSensitive }));
  };

  const toggleWhitespace = () => {
    setConfig(prev => ({ ...prev, normalizeWhitespace: !prev.normalizeWhitespace }));
  };

  const setSuite = (suite) => {
    setConfig(prev => ({ ...prev, algorithmSuite: suite }));
  };

  return (
    <div className="analysis-config-panel glass-panel">
      <div className="config-header">
        <Sliders size={14} className="text-cyan" />
        <span className="config-title mono text-xs">ANALYSIS CONFIGURATION</span>
      </div>

      <div className="config-options-row">
        {/* Case Sensitivity Option */}
        <div className="config-item">
          <span className="config-label mono text-xs text-muted">CASE SENSITIVITY:</span>
          <button 
            className={`config-toggle-btn mono text-xs ${config.caseSensitive ? 'active' : ''}`}
            onClick={toggleCase}
          >
            {config.caseSensitive ? (
              <>
                <Check size={12} className="text-cyan" />
                <span>Preserve Case (Strict)</span>
              </>
            ) : (
              <span>Ignore Case (Normalized)</span>
            )}
          </button>
        </div>

        {/* Whitespace Normalization Option */}
        <div className="config-item">
          <span className="config-label mono text-xs text-muted">WHITESPACE:</span>
          <button 
            className={`config-toggle-btn mono text-xs ${config.normalizeWhitespace ? 'active' : ''}`}
            onClick={toggleWhitespace}
          >
            {config.normalizeWhitespace ? (
              <>
                <Check size={12} className="text-cyan" />
                <span>Normalize Whitespace</span>
              </>
            ) : (
              <span>Exact Whitespace</span>
            )}
          </button>
        </div>

        {/* Algorithm Suite Option */}
        <div className="config-item">
          <span className="config-label mono text-xs text-muted">MATCHING SCOPE:</span>
          <div className="segmented-suite-toggle mono text-xs">
            <button 
              className={`suite-btn ${config.algorithmSuite === 'full' ? 'active' : ''}`}
              onClick={() => setSuite('full')}
            >
              Full Suite (KMP+Z+RK+LCP)
            </button>
            <button 
              className={`suite-btn ${config.algorithmSuite === 'fast' ? 'active' : ''}`}
              onClick={() => setSuite('fast')}
            >
              Fast Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
