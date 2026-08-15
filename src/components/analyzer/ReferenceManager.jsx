import React from 'react';
import { Plus, FileText, Trash2, Eye, GitCompare, Layers } from 'lucide-react';

export default function ReferenceManager({
  references,
  deleteReference,
  viewReference,
  openAddModal
}) {
  return (
    <div className="reference-manager-panel glass-panel">
      {/* 1. PANEL HEADER */}
      <div className="reference-panel-header">
        <div className="ref-title-group">
          <Layers size={16} className="text-cyan" />
          <h2 className="ref-panel-title mono">REFERENCE MATERIAL</h2>
          <span className="ref-count-badge mono text-xs">
            {references.length} {references.length === 1 ? 'SOURCE' : 'SOURCES'}
          </span>
        </div>

        <button 
          className="btn-secondary add-ref-btn mono text-xs"
          onClick={openAddModal}
        >
          <Plus size={14} />
          <span>Add Reference</span>
        </button>
      </div>

      <div className="ref-panel-subheader text-xs text-muted">
        Sources to cross-compare against the target document for sequence overlap.
      </div>

      {/* 2. REFERENCE LIST OR EMPTY STATE */}
      <div className="reference-items-container">
        {references.length === 0 ? (
          <div className="ref-empty-state">
            <div className="converging-docs-icon">
              <GitCompare size={32} className="text-cyan" />
            </div>
            <h3 className="empty-state-title mono">No reference material yet</h3>
            <p className="empty-state-desc text-xs text-secondary">
              Add comparison documents or paste reference text to establish the baseline for plagiarism & similarity analysis.
            </p>
            <button 
              className="btn-secondary small-btn mono text-xs mt-3"
              onClick={openAddModal}
            >
              <Plus size={13} /> Add First Reference
            </button>
          </div>
        ) : (
          <div className="ref-cards-grid">
            {references.map((ref, idx) => (
              <div key={ref.id} className="reference-card glass-panel">
                <div className="ref-card-header">
                  <div className="ref-id-badge mono text-xs">
                    <span className="text-cyan">◈</span> REF {String(idx + 1).padStart(2, '0')}
                  </div>
                  <span className="ref-time-tag text-xs text-muted mono">{ref.addedAt}</span>
                </div>

                <div className="ref-name-title font-medium" title={ref.name}>
                  {ref.name}
                </div>

                <div className="ref-card-metrics mono text-xs text-muted">
                  <span>{ref.charCount} chars</span>
                  <span className="divider">•</span>
                  <span>{ref.wordCount} words</span>
                </div>

                <div className="ref-preview-snippet text-xs text-secondary">
                  "{ref.text.substring(0, 75)}..."
                </div>

                <div className="ref-card-actions">
                  <button 
                    className="card-action-btn view-btn text-xs mono"
                    onClick={() => viewReference(ref)}
                    title="View full reference text"
                  >
                    <Eye size={12} />
                    <span>View</span>
                  </button>
                  <button 
                    className="card-action-btn delete-btn text-xs mono text-muted"
                    onClick={() => deleteReference(ref.id)}
                    title="Remove reference source"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
