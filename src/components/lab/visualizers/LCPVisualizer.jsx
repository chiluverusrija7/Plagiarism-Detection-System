import React from 'react';

export default function LCPVisualizer({ step, text }) {
  if (!step) return null;
  const sa = step.algoState?.sa || [];
  const lcp = step.algoState?.lcp || [];
  const activeRank = step.algoState?.activeRank;
  const prevRank = step.algoState?.prevRank;
  const commonPrefix = step.algoState?.commonPrefix;
  const h = step.algoState?.h ?? 0;

  return (
    <div className="algo-specific-panel lcp-panel">
      <div className="panel-subhead">
        <span className="mono text-muted text-xs">KASAI LCP ARRAY & ADJACENT SUFFIX OVERLAP</span>
        {commonPrefix !== undefined && (
          <span className="badge badge-cyan text-xs mono">
            Current Overlap: <strong>"{commonPrefix}" ({h} chars)</strong>
          </span>
        )}
      </div>

      <div className="lcp-table-container">
        <table className="lcp-table mono text-xs">
          <thead>
            <tr>
              <th>Rank</th>
              <th>SA[Rank]</th>
              <th>Suffix</th>
              <th>LCP[Rank]</th>
              <th>Overlap Connection</th>
            </tr>
          </thead>
          <tbody>
            {sa.map((sIdx, r) => {
              const suffixStr = text.substring(sIdx);
              const lcpVal = lcp[r] !== undefined ? lcp[r] : 0;
              const isActive = r === activeRank || r === prevRank;

              return (
                <tr key={r} className={`lcp-row ${isActive ? 'active-lcp-row' : ''}`}>
                  <td className="text-muted">{r}</td>
                  <td className="text-primary font-bold">{sIdx}</td>
                  <td className="suffix-preview">
                    {r > 0 && lcpVal > 0 ? (
                      <>
                        <strong className="text-cyan">{suffixStr.substring(0, lcpVal)}</strong>
                        <span className="text-muted">{suffixStr.substring(lcpVal)}</span>
                      </>
                    ) : (
                      suffixStr
                    )}
                  </td>
                  <td className={`lcp-val ${lcpVal > 0 ? 'has-lcp' : ''}`}>
                    {r === 0 ? '-' : lcpVal}
                  </td>
                  <td className="lcp-bracket-col">
                    {r > 0 && lcpVal > 0 && (
                      <span className="overlap-pill text-xs">
                        ↳ Shares {lcpVal} chars with Rank {r - 1}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
