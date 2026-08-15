import './WorkflowTimeline.css';

export default function WorkflowTimeline() {
  const steps = [
    { num: '01', title: 'INPUT', desc: 'Ingest reference documents and target text.' },
    { num: '02', title: 'PREPROCESS', desc: 'Clean, normalize, and construct suffix structures.' },
    { num: '03', title: 'MATCH', desc: 'Execute parallel multi-algorithm pattern detection.' },
    { num: '04', title: 'VERIFY', desc: 'Validate candidates using rolling hashes.' },
    { num: '05', title: 'FUSE EVIDENCE', desc: 'Combine algorithm outputs into unified matches.' },
    { num: '06', title: 'EXPLAIN', desc: 'Generate visual highlighting and source attribution.' },
    { num: '07', title: 'REPORT', desc: 'Produce forensic analysis and novelty metrics.' },
  ];

  return (
    <section className="workflow-section">
      <div className="workflow-container">
        <h2 className="section-title" style={{ textAlign: "center", marginBottom: "6rem" }}>
          The Analysis Workflow
        </h2>
        
        <div className="timeline-wrapper">
          <div className="timeline-connector"></div>
          
          <div className="timeline-steps">
            {steps.map((step, idx) => (
              <div key={idx} className="timeline-step">
                <div className="step-number mono">{step.num}</div>
                <div className="step-content glass-panel">
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-desc text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
