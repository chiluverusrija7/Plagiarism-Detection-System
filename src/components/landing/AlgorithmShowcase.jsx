import './AlgorithmShowcase.css';

export default function AlgorithmShowcase() {
  const algorithms = [
    { name: 'Naïve', desc: 'Baseline comparison', detail: 'O(nm)' },
    { name: 'KMP', desc: 'Linear-time exact pattern matching', detail: 'O(n+m)' },
    { name: 'Z-Algorithm', desc: 'Linear-time matching-region detection', detail: 'O(n+m)' },
    { name: 'Rabin-Karp', desc: 'Rolling hash candidate detection', detail: 'O(n+m)' },
    { name: 'Aho-Corasick', desc: 'Multi-pattern matching', detail: 'O(n+m+z)' },
    { name: 'Suffix Array + LCP', desc: 'Long-range sequence analysis', detail: 'O(n log n)' }
  ];

  return (
    <section className="algorithm-showcase">
      <div className="showcase-header">
        <h2 className="section-title">Six algorithms. One analysis engine.</h2>
      </div>

      <div className="showcase-container">
        <div className="showcase-flow">
          <div className="flow-step">
            <div className="flow-dot"></div>
            <div className="flow-label">Baseline</div>
          </div>
          <div className="flow-line"></div>
          
          <div className="flow-step">
            <div className="flow-dot"></div>
            <div className="flow-label">Pattern Matching</div>
          </div>
          <div className="flow-line"></div>
          
          <div className="flow-step">
            <div className="flow-dot"></div>
            <div className="flow-label">Hash Verification</div>
          </div>
          <div className="flow-line"></div>
          
          <div className="flow-step">
            <div className="flow-dot"></div>
            <div className="flow-label">Multi-Pattern Search</div>
          </div>
          <div className="flow-line"></div>
          
          <div className="flow-step">
            <div className="flow-dot"></div>
            <div className="flow-label">Suffix Analysis</div>
          </div>
          <div className="flow-line"></div>
          
          <div className="flow-step highlight">
            <div className="flow-dot pulse"></div>
            <div className="flow-label">Evidence Fusion</div>
          </div>
        </div>

        <div className="algorithms-grid">
          {algorithms.map((algo, idx) => (
            <div key={idx} className="algo-card glass-panel">
              <div className="algo-card-header">
                <h3 className="algo-name">{algo.name}</h3>
                <span className="algo-complexity mono">{algo.detail}</span>
              </div>
              <p className="algo-desc text-muted">{algo.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
