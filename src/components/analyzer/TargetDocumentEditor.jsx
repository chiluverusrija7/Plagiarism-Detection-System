import React, { useRef } from 'react';
import { UploadCloud, Trash2, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export default function TargetDocumentEditor({
  text,
  setText,
  charCount,
  wordCount,
  lineCount,
  loadSample,
  clearTarget
}) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setText(content);
      }
    };
    reader.readAsText(file);
  };

  const lines = text.split('\n');

  return (
    <div className="target-document-panel glass-panel">
      {/* 1. EDITOR TOOLBAR */}
      <div className="editor-panel-header">
        <div className="editor-title-group">
          <FileText size={16} className="text-cyan" />
          <h2 className="editor-title mono">TARGET DOCUMENT</h2>
        </div>

        <div className="editor-toolbar-actions">
          {/* Metric Chips */}
          <div className="editor-metric-chips mono text-xs">
            <span className="metric-chip">{charCount} CHARS</span>
            <span className="metric-chip">{wordCount} WORDS</span>
            <span className="metric-chip">{lineCount} LINES</span>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons-group">
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".txt,.md,.json,.csv"
              onChange={handleFileUpload}
            />
            <button 
              className="toolbar-action-btn mono text-xs" 
              onClick={() => fileInputRef.current?.click()}
              title="Upload text document (.txt, .md, .json)"
            >
              <UploadCloud size={13} />
              <span>Upload</span>
            </button>
            <button 
              className="toolbar-action-btn mono text-xs" 
              onClick={loadSample}
              title="Load sample forensic target text"
            >
              <Sparkles size={13} className="text-cyan" />
              <span>Sample</span>
            </button>
            <button 
              className="toolbar-action-btn mono text-xs text-muted" 
              onClick={clearTarget}
              title="Clear editor contents"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. FORENSIC EDITOR SURFACE WITH LINE NUMBERS */}
      <div className="forensic-editor-viewport">
        {/* Subtle Line Numbers Gutter */}
        <div className="editor-line-gutter mono text-xs">
          {Array.from({ length: Math.max(lineCount, 8) }, (_, i) => (
            <div key={i} className="gutter-line-number">
              {String(i + 1).padStart(2, '0')}
            </div>
          ))}
        </div>

        {/* Textarea Input Surface */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste target document text here, or drag & drop a .txt file..."
          className="forensic-textarea mono"
          spellCheck={false}
        />
      </div>

      {/* 3. DOCUMENT METADATA STRIP */}
      <div className="editor-footer-strip">
        <div className="doc-readiness mono text-xs">
          {charCount > 0 ? (
            <span className="flex items-center gap-1 text-green">
              <CheckCircle2 size={13} /> DOCUMENT READY
            </span>
          ) : (
            <span className="text-muted">ENTER OR PASTE TARGET TEXT</span>
          )}
        </div>

        <div className="doc-stats mono text-xs text-muted">
          <span>Encoding: UTF-8</span>
          <span className="divider">•</span>
          <span>Single Target</span>
        </div>
      </div>
    </div>
  );
}
