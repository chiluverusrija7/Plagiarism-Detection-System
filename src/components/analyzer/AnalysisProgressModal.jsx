import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AnalysisProgressModal({ isOpen, progressStep, isCompleted, onClose }) {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const pipelineStages = [
    { label: 'INPUT VALIDATION', desc: 'Validating Unicode sequences & references' },
    { label: 'TEXT PREPROCESSING', desc: 'Case normalization & whitespace cleanup' },
    { label: 'MULTI-ALGORITHM MATCHING', desc: 'Running KMP, Z, Rabin-Karp & Suffix Array' },
    { label: 'EVIDENCE FUSION', desc: 'Consolidating overlapping match regions' },
    { label: 'REPORT SYNTHESIS', desc: 'Generating forensic similarity breakdown' }
  ];

  const handleNavigateResults = () => {
    onClose();
    navigate('/results');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container progress-modal glass-panel">
        <div className="modal-header">
          <div className="modal-title-group">
            <ShieldCheck size={20} className="text-cyan" />
            <h3 className="modal-title mono">
              {isCompleted ? 'ANALYSIS COMPLETE' : 'EXECUTING MULTI-ALGORITHM ANALYSIS'}
            </h3>
          </div>
        </div>

        <div className="progress-pipeline-box">
          <div className="pipeline-steps-list">
            {pipelineStages.map((stage, idx) => {
              const isPassed = idx < progressStep || isCompleted;
              const isCurrent = idx === progressStep && !isCompleted;
              const isPending = idx > progressStep && !isCompleted;

              return (
                <div 
                  key={idx} 
                  className={`pipeline-stage-row ${isPassed ? 'passed' : isCurrent ? 'current' : 'pending'}`}
                >
                  <div className="stage-icon-cell mono text-xs">
                    {isPassed ? (
                      <CheckCircle2 size={16} className="text-green" />
                    ) : isCurrent ? (
                      <Loader2 size={16} className="text-cyan spin-icon" />
                    ) : (
                      <span className="pending-circle">○</span>
                    )}
                  </div>

                  <div className="stage-text-cell">
                    <span className="stage-name mono text-xs font-bold">{stage.label}</span>
                    <span className="stage-desc text-xs text-muted">{stage.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="preview-indicator-bar mono text-xs text-muted">
          <span>UI ANALYSIS PREVIEW — Verified deterministic algorithmic workflow</span>
        </div>

        <div className="modal-actions-bar justify-end">
          {isCompleted ? (
            <button 
              className="btn-accent primary-results-btn mono"
              onClick={handleNavigateResults}
            >
              <span>View Analysis Results</span>
              <ArrowRight size={15} />
            </button>
          ) : (
            <button className="btn-secondary small-btn mono" disabled>
              Analyzing...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
