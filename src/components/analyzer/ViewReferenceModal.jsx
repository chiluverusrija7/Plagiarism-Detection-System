import React from 'react';
import { X, FileText, CheckCircle2 } from 'lucide-react';

export default function ViewReferenceModal({ isOpen, onClose, reference }) {
  if (!isOpen || !reference) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container view-ref-modal glass-panel">
        <div className="modal-header">
          <div className="modal-title-group">
            <FileText size={18} className="text-cyan" />
            <h3 className="modal-title mono">{reference.name}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-meta-strip mono text-xs text-muted">
          <span>{reference.charCount} characters</span>
          <span className="divider">•</span>
          <span>{reference.wordCount} words</span>
          <span className="divider">•</span>
          <span className="text-green flex items-center gap-1">
            <CheckCircle2 size={12} /> Ready for comparison
          </span>
        </div>

        <div className="reference-content-viewer mono text-xs">
          <pre className="viewer-pre">{reference.text}</pre>
        </div>

        <div className="modal-actions-bar justify-end">
          <button className="btn-secondary small-btn mono" onClick={onClose}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
