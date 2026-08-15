import React from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';

export default function AlgorithmEvidenceSummary({ algorithmEvidenceSummary }) {
  return (
    <div className="algorithm-evidence-panel glass-panel">
      <div className="panel-header-strip">
        <div className="title-group">
          <Cpu size={16} className="text-cyan" />
          <h3 className="section-title-text mono">ALGORITHM EVIDENCE & VERIFICATION FINDINGS</h3>
        </div>
        <span className="subtitle-tag text-xs text-muted">
          Multi-algorithm detection breakdown across all 7 string matching and suffix architectures.
        </span>
      </div>

      <div className="algo-evidence-grid">
        {algorithmEvidenceSummary.map((algo, idx) => (
          <div key={idx} className="algo-evidence-card">
            <div className="card-top-row">
              <div className="algo-identity">
                <CheckCircle2 size={14} className="text-green" />
                <h4 className="algo-title mono text-xs">{algo.name}</h4>
              </div>
              <span className="algo-status-badge mono text-xs">{algo.status}</span>
            </div>

            <div className="algo-role-line mono text-xs text-muted">
              <span>Role: <strong>{algo.role}</strong></span>
            </div>

            <p className="algo-finding-text text-xs text-secondary">
              {algo.findings}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
