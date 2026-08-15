import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileText, Check } from 'lucide-react';

export default function AddReferenceModal({ isOpen, onClose, onAdd }) {
  const [tab, setTab] = useState('paste'); // 'paste' | 'upload'
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || !text.trim()) {
      setError('Reference text cannot be empty.');
      return;
    }
    const success = onAdd(name, text);
    if (success) {
      setName('');
      setText('');
      setError('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setText(content);
        setError('');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container glass-panel">
        <div className="modal-header">
          <div className="modal-title-group">
            <FileText size={18} className="text-cyan" />
            <h3 className="modal-title mono">ADD REFERENCE MATERIAL</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-mode-tabs mono text-xs">
          <button 
            className={`modal-tab ${tab === 'paste' ? 'active' : ''}`}
            onClick={() => setTab('paste')}
          >
            Paste Text Reference
          </button>
          <button 
            className={`modal-tab ${tab === 'upload' ? 'active' : ''}`}
            onClick={() => setTab('upload')}
          >
            Upload Document File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-body">
          <div className="form-field">
            <label className="mono text-xs text-muted">REFERENCE NAME / SOURCE LABEL</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Research_Paper_Excerpt.txt"
              className="modal-input mono text-xs"
            />
          </div>

          {tab === 'upload' ? (
            <div 
              className="modal-dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".txt,.md,.json,.csv"
                onChange={handleFileUpload}
              />
              <UploadCloud size={32} className="text-cyan mb-2" />
              <span className="mono text-xs text-primary font-bold">Choose a file or drag & drop</span>
              <span className="text-xs text-muted mt-1">Supported: .txt, .md, .json, .csv</span>
              {text && (
                <div className="loaded-file-badge mono text-xs text-green mt-3">
                  <Check size={14} /> Loaded: {name} ({text.length} chars)
                </div>
              )}
            </div>
          ) : (
            <div className="form-field">
              <label className="mono text-xs text-muted">REFERENCE CONTENT</label>
              <textarea 
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Paste the source literature or reference text to compare against..."
                className="modal-textarea mono text-xs"
                rows={6}
              />
            </div>
          )}

          {error && (
            <div className="modal-error-message mono text-xs text-danger">
              ⚠️ {error}
            </div>
          )}

          <div className="modal-actions-bar">
            <button type="button" className="btn-secondary small-btn mono" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-accent small-btn mono">
              + Add Reference
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
