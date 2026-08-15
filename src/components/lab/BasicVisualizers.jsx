import React from 'react';

export function NaiveVisualizer({ step, text, patterns }) {
  if (!step) return <div className="text-muted">Ready</div>;
  const p0 = patterns[0] || '';

  return (
    <div className="visualizer-content">
      <div className="mono" style={{ fontSize: '1.5rem', letterSpacing: '0.2rem', marginBottom: '1rem' }}>
        {text.split('').map((char, idx) => (
          <span key={idx} style={{ 
            color: step.textIdx === idx ? 'var(--accent-cyan)' : 
                   (step.type === 'match' && idx >= step.start && idx < step.start + step.length) ? '#A0E8AF' : 
                   'var(--text-primary)',
            background: step.textIdx === idx ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
            padding: '2px'
          }}>
            {char}
          </span>
        ))}
      </div>
      {step.type !== 'match' && p0 && (
        <div className="mono" style={{ fontSize: '1.5rem', letterSpacing: '0.2rem', paddingLeft: `${(step.textIdx - step.patternIdx || 0) * 1.5}rem`, transition: 'all 0.3s ease' }}>
          {p0.split('').map((char, idx) => (
            <span key={idx} style={{ 
              color: step.patternIdx === idx ? 'var(--accent-cyan)' : 'var(--text-muted)'
            }}>
              {char}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function KMPVisualizer({ step, text, patterns }) {
  if (!step) return <div className="text-muted">Ready</div>;
  const p0 = patterns[0] || '';

  return (
    <div className="visualizer-content">
      {/* LPS Array Table */}
      {step.lps && (
        <div style={{ marginBottom: '2rem' }}>
          <div className="mono text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>LPS Array:</div>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            {step.lps.map((val, idx) => (
              <div key={idx} style={{ 
                width: '30px', height: '30px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: (step.type.startsWith('lps') && step.i === idx) ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                color: (step.type.startsWith('lps') && step.i === idx) ? '#000' : 'var(--text-primary)',
                border: '1px solid var(--border-light)'
              }}>
                {val}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* String Comparison */}
      <div className="mono" style={{ fontSize: '1.5rem', letterSpacing: '0.2rem', marginBottom: '1rem' }}>
        {text.split('').map((char, idx) => (
          <span key={idx} style={{ 
            color: step.textIdx === idx ? 'var(--accent-cyan)' : 
                   (step.type === 'match' && idx >= step.start && idx < step.start + step.length) ? '#A0E8AF' : 
                   'var(--text-primary)'
          }}>
            {char}
          </span>
        ))}
      </div>
      {step.type !== 'lps-init' && step.type !== 'lps-calc' && step.type !== 'lps-update' && step.type !== 'lps-fallback' && p0 && (
        <div className="mono" style={{ fontSize: '1.5rem', letterSpacing: '0.2rem', paddingLeft: `${((step.textIdx || 0) - (step.patIdx || 0)) * 1.5}rem`, transition: 'padding 0.3s ease' }}>
          {p0.split('').map((char, idx) => (
            <span key={idx} style={{ 
              color: step.patIdx === idx ? 'var(--accent-cyan)' : 'var(--text-muted)'
            }}>
              {char}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function ZVisualizer({ step, text, patterns }) {
  if (!step) return <div className="text-muted">Ready</div>;
  if (!step.combined) return null;

  return (
    <div className="visualizer-content">
      <div className="mono" style={{ fontSize: '1.2rem', letterSpacing: '0.2rem', marginBottom: '1rem' }}>
        {step.combined.split('').map((char, idx) => (
          <span key={idx} style={{ 
            color: idx === step.i ? 'var(--accent-cyan)' :
                   (idx >= step.L && idx <= step.R) ? '#A0E8AF' : 'var(--text-primary)',
            background: (idx >= step.L && idx <= step.R) ? 'rgba(160, 232, 175, 0.1)' : 'transparent',
            textDecoration: char === '\0' ? 'underline' : 'none'
          }}>
            {char === '\0' ? '$' : char}
          </span>
        ))}
      </div>
      
      {step.Z && (
        <div style={{ marginTop: '2rem' }}>
          <div className="mono text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Z Array:</div>
          <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
            {step.Z.map((val, idx) => (
              <div key={idx} style={{ 
                width: '24px', height: '24px', fontSize: '0.8rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step.i === idx ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.05)',
                color: step.i === idx ? '#000' : 'var(--text-primary)',
                border: '1px solid var(--border-light)'
              }}>
                {val}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function GenericVisualizer({ step, text }) {
  if (!step) return <div className="text-muted">Ready</div>;
  return (
    <div className="visualizer-content">
      <div className="mono" style={{ marginBottom: '1rem', wordBreak: 'break-all', opacity: 0.5 }}>
        {text}
      </div>
      {/* Suffix Array and LCP specific mocks for demo */}
      {step.suffixes && (
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {step.suffixes.map((s, idx) => (
            <div key={idx} className="mono" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
              <span className="text-muted" style={{ display: 'inline-block', width: '30px' }}>{s.idx}</span>
              {s.str}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
