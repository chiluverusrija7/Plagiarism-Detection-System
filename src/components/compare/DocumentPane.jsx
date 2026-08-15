import React, { useRef, useState, useEffect } from 'react';
import { Copy, Check, Maximize2, Minimize2, FileText } from 'lucide-react';
import { buildDocumentSpans } from './compareUtils';

export default function DocumentPane({
  title,
  subtitle,
  documentType = 'target', // 'target' | 'reference'
  documentName = '',
  text = '',
  matches = [],
  activeMatchId,
  onSelectMatch,
  scrollRef,
  onScroll,
  accentColor = 'cyan'
}) {
  const [copied, setCopied] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;
  const lineCount = text.trim() === '' ? 0 : text.split(/\r\n|\r|\n/).length;

  const isReference = documentType === 'reference';
  const spans = buildDocumentSpans(text, matches, isReference);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`document-pane-container glass-panel ${documentType}-pane ${isFocused ? 'is-focused-pane' : ''}`}>
      {/* Pane Header */}
      <div className="pane-header-strip">
        <div className="pane-header-left">
          <span className={`pane-badge mono text-xs ${documentType}-badge`}>
            {documentType === 'target' ? 'DOCUMENT A: TARGET' : 'DOCUMENT B: REFERENCE'}
          </span>
          <div className="pane-title-group">
            <h3 className="pane-doc-name mono text-xs font-bold text-primary truncate max-w-sm" title={documentName}>
              {documentName || (documentType === 'target' ? 'target_document.txt' : 'reference.txt')}
            </h3>
            <span className="pane-metrics-tag mono text-xs text-muted">
              {wordCount} words • {charCount} chars • {lineCount} lines
            </span>
          </div>
        </div>

        <div className="pane-header-actions flex items-center gap-1">
          <button 
            className="pane-icon-btn text-muted" 
            onClick={handleCopy} 
            title="Copy document text"
          >
            {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
          </button>
          <button 
            className="pane-icon-btn text-muted" 
            onClick={() => setIsFocused(!isFocused)} 
            title={isFocused ? "Restore dual view" : "Focus pane"}
          >
            {isFocused ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>

      {/* Pane Reading Surface */}
      <div 
        className="pane-reading-surface" 
        ref={scrollRef}
        onScroll={onScroll}
      >
        <div className="pane-body-text">
          {text.trim() === '' ? (
            <div className="empty-pane-msg text-center text-muted mono text-xs p-8">
              No document text available.
            </div>
          ) : (
            spans.map((span, idx) => {
              if (span.type === 'unmatched') {
                return (
                  <span key={idx} className="span-unmatched">
                    {span.text}
                  </span>
                );
              }

              const isActive = activeMatchId === span.matchId;
              const intensityClass = span.intensity === 'STRONG'
                ? 'match-strong'
                : span.intensity === 'MODERATE'
                ? 'match-moderate'
                : 'match-possible';

              return (
                <mark
                  key={idx}
                  id={`match-span-${documentType}-${span.matchId}`}
                  className={`compare-match-mark ${intensityClass} ${isActive ? 'is-active-match' : ''}`}
                  onClick={() => onSelectMatch(span.matchId)}
                  title={`Match: ${span.matchId} • Click to cross-reference`}
                >
                  {span.text}
                  <span className="match-num-tag mono text-xs">{span.matchId}</span>
                </mark>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
