import React from 'react';
import { ALGORITHM_METADATA } from './DemoAlgorithmAdapter';

export default function AlgorithmSelector({ algorithm, setAlgorithm, status, resetVisualization }) {
  const algorithms = [
    { id: 'naive', name: 'Naïve', tag: 'O(nm)' },
    { id: 'kmp', name: 'KMP', tag: 'O(n+m)' },
    { id: 'z', name: 'Z-Algorithm', tag: 'O(n+m)' },
    { id: 'rk', name: 'Rabin-Karp', tag: 'Rolling' },
    { id: 'ac', name: 'Aho-Corasick', tag: 'Trie' },
    { id: 'sa', name: 'Suffix Array', tag: 'O(n log²n)' },
    { id: 'lcp', name: 'LCP Array', tag: 'Kasai O(n)' }
  ];

  const currentMeta = ALGORITHM_METADATA[algorithm] || ALGORITHM_METADATA.kmp;

  const handleTabChange = (id) => {
    if (status !== 'IDLE') {
      resetVisualization();
    }
    setAlgorithm(id);
  };

  return (
    <div className="algo-selector-container">
      {/* 1. SEGMENTED TABS */}
      <div className="algo-segmented-bar">
        {algorithms.map(a => {
          const isActive = algorithm === a.id;
          return (
            <button 
              key={a.id}
              className={`algo-segmented-tab ${isActive ? 'active' : ''}`}
              onClick={() => handleTabChange(a.id)}
            >
              <span className="tab-name">{a.name}</span>
              <span className="tab-tag mono">{a.tag}</span>
            </button>
          );
        })}
      </div>

      {/* 2. DYNAMIC MICRO-DESCRIPTION & COMPLEXITY CHIPS */}
      <div className="algo-context-strip">
        <div className="algo-meta-desc">
          <span className="algo-tag-label mono text-cyan">{currentMeta.shortName}</span>
          <span className="algo-desc-text text-secondary text-xs">{currentMeta.subtitle}</span>
        </div>

        <div className="algo-complexity-chips mono text-xs">
          <div className="chip time-chip">
            <span className="chip-label">TIME</span>
            <strong className="chip-val text-cyan">{currentMeta.complexity.time}</strong>
          </div>
          <div className="chip space-chip">
            <span className="chip-label">SPACE</span>
            <strong className="chip-val">{currentMeta.complexity.space}</strong>
          </div>
          {currentMeta.complexity.preprocessing !== 'None' && (
            <div className="chip prep-chip">
              <span className="chip-label">PREPROCESS</span>
              <strong className="chip-val">{currentMeta.complexity.preprocessing}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
