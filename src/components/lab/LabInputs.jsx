import React from 'react';
import { Plus, Trash2, RotateCcw, Sparkles } from 'lucide-react';

export default function LabInputs({ algorithm, text, setText, patterns, setPatterns, status }) {
  const isRunning = status !== 'IDLE' && status !== 'ERROR';
  const isPatternAlgo = ['naive', 'kmp', 'z', 'rk'].includes(algorithm);
  
  const handleAddPattern = () => {
    setPatterns([...patterns, '']);
  };

  const handleRemovePattern = (idx) => {
    const newPatterns = [...patterns];
    newPatterns.splice(idx, 1);
    setPatterns(newPatterns);
  };

  const handlePatternChange = (idx, value) => {
    const newPatterns = [...patterns];
    newPatterns[idx] = value;
    setPatterns(newPatterns);
  };

  const loadSample = () => {
    if (algorithm === 'ac') {
      setText('USHERS AND FISHERS HEAR HER VOICE');
      setPatterns(['HER', 'HEAR', 'SHE', 'FISH']);
    } else if (algorithm === 'sa' || algorithm === 'lcp') {
      setText('BANANAS');
    } else {
      setText('ABABCABABCABAB');
      setPatterns(['ABABCABAB']);
    }
  };

  const handleClear = () => {
    setText('');
    setPatterns(['']);
  };

  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lineCount = text.trim() === '' ? 0 : text.split(/\r\n|\r|\n/).length;
  const pattern0 = patterns[0] || '';

  return (
    <div className="lab-inputs-workspace">
      {/* 1. PRIMARY TEXT EDITOR SURFACE */}
      <div className="editor-card text-input-card">
        <div className="editor-card-header">
          <div className="header-left">
            <span className="card-label-tag mono">TARGET TEXT SEQUENCE</span>
          </div>

          <div className="header-right">
            {/* Metric Chips */}
            <div className="metric-chips-group mono text-xs">
              <span className="chip-pill">{charCount} CHARS</span>
              <span className="chip-pill">{wordCount} WORDS</span>
              <span className="chip-pill">{lineCount} LINES</span>
            </div>

            {/* Quick Action Toolbar */}
            <div className="editor-mini-toolbar">
              <button 
                className="toolbar-btn text-xs mono" 
                onClick={loadSample} 
                disabled={isRunning}
                title="Load standard demonstration test sequence"
              >
                <Sparkles size={12} className="text-cyan" />
                <span>Sample</span>
              </button>
              <button 
                className="toolbar-btn text-xs mono" 
                onClick={handleClear} 
                disabled={isRunning}
                title="Clear input text"
              >
                <RotateCcw size={12} />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        <div className="editor-input-wrapper">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isRunning}
            placeholder="Type or paste target text sequence to analyze..."
            className="editor-textarea mono"
            rows={3}
            spellCheck={false}
          />
        </div>
      </div>

      {/* 2. DEDICATED PATTERN INPUT CARD */}
      {isPatternAlgo && (
        <div className="editor-card pattern-input-card">
          <div className="editor-card-header">
            <div className="header-left">
              <span className="card-label-tag mono">SEARCH PATTERN (P)</span>
            </div>
            <div className="header-right">
              <span className="chip-pill mono text-xs">{pattern0.length} CHARS</span>
            </div>
          </div>

          <div className="pattern-input-wrapper">
            <input 
              type="text" 
              value={pattern0}
              onChange={(e) => handlePatternChange(0, e.target.value)}
              disabled={isRunning}
              placeholder="Enter search pattern (e.g. BABC)..."
              className="editor-input mono" 
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* 3. AHO-CORASICK MULTI-PATTERN DICTIONARY CARD */}
      {algorithm === 'ac' && (
        <div className="editor-card pattern-dictionary-card">
          <div className="editor-card-header">
            <div className="header-left">
              <span className="card-label-tag mono">PATTERN DICTIONARY ({patterns.length})</span>
            </div>
            <div className="header-right">
              <button 
                className="add-pattern-btn text-xs mono" 
                onClick={handleAddPattern} 
                disabled={isRunning}
              >
                <Plus size={13} />
                <span>Add Pattern</span>
              </button>
            </div>
          </div>

          <div className="dictionary-items-list">
            {patterns.map((p, idx) => (
              <div key={idx} className="dictionary-item-row">
                <span className="dict-idx-badge mono text-xs">P{idx + 1}</span>
                <input 
                  type="text" 
                  value={p}
                  onChange={(e) => handlePatternChange(idx, e.target.value)}
                  disabled={isRunning}
                  placeholder={`Pattern ${idx + 1}...`}
                  className="editor-input mono" 
                  spellCheck={false}
                />
                {patterns.length > 1 && (
                  <button 
                    className="delete-pattern-btn" 
                    onClick={() => handleRemovePattern(idx)}
                    disabled={isRunning}
                    title="Remove pattern"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INFORMATIONAL SINGLE-SEQUENCE BANNER FOR SUFFIX ARRAY & LCP */}
      {(algorithm === 'sa' || algorithm === 'lcp') && (
        <div className="editor-card single-sequence-info-card">
          <div className="info-content">
            <span className="info-icon text-cyan">ℹ</span>
            <div className="info-text">
              <span className="info-title mono text-xs">STRUCTURAL ANALYSIS MODE</span>
              <p className="info-desc text-xs text-muted">
                {algorithm === 'sa' 
                  ? 'Suffix Array operates directly on the entire string, sorting all suffixes lexicographically.'
                  : 'Kasai LCP constructs the adjacent longest common prefix array from the Suffix Array in O(n) linear time.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Message */}
      {status === 'ERROR' && (
        <div className="editor-error-banner mono text-xs">
          <span>⚠️ Validation Error: Please provide a valid target text and search pattern before running.</span>
        </div>
      )}
    </div>
  );
}
