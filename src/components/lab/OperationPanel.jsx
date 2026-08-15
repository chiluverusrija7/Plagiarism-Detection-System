import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function OperationPanel({ step }) {
  const [whyExpanded, setWhyExpanded] = useState(true);
  if (!step) return null;

  const phases = ['INPUT', 'COMPARE', 'DECISION', 'SHIFT', 'MATCH'];
  const currentPhase = step.timelinePhase || 'COMPARE';

  const getPhaseState = (p) => {
    if (p === currentPhase) return 'active';
    const phaseOrder = { 'INPUT': 0, 'COMPARE': 1, 'DECISION': 2, 'SHIFT': 3, 'MATCH': 4 };
    if (phaseOrder[p] < phaseOrder[currentPhase]) return 'passed';
    return 'pending';
  };

  return (
    <div className="operation-panel glass-panel">
      {/* 5-Phase Execution Timeline */}
      <div className="timeline-strip">
        {phases.map((p, idx) => {
          const state = getPhaseState(p);
          return (
            <React.Fragment key={p}>
              <div className={`timeline-step ${state}`}>
                <div className="timeline-node mono">
                  {state === 'passed' ? '✓' : state === 'active' ? '●' : '○'}
                </div>
                <span className="timeline-label mono">{p}</span>
              </div>
              {idx < phases.length - 1 && <div className={`timeline-connector ${state === 'passed' ? 'passed' : ''}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Operation Readout */}
      <div className="operation-readout">
        <div className="operation-headline">
          <span className="operation-badge mono">{step.operationTitle || 'EXECUTION STEP'}</span>
          <span className="operation-desc mono">{step.operationDesc}</span>
        </div>

        {step.decisionDesc && (
          <div className="decision-bar mono text-xs">
            <span className="decision-label">ACTION / DECISION:</span>
            <span className="decision-text">{step.decisionDesc}</span>
          </div>
        )}
      </div>

      {/* "Why this step?" Academic Micro-Explanation */}
      {step.whyThisStep && (
        <div className="why-step-accordion">
          <button className="why-toggle-btn text-xs mono" onClick={() => setWhyExpanded(!whyExpanded)}>
            <div className="flex items-center gap-1">
              <HelpCircle size={14} className="text-cyan" />
              <span>Why this step? (Algorithmic Logic)</span>
            </div>
            {whyExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {whyExpanded && (
            <div className="why-content-box text-xs text-secondary">
              <p>{step.whyThisStep}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
