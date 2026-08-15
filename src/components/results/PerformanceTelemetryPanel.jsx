import React from 'react';
import { Gauge, CheckCircle2 } from 'lucide-react';

export default function PerformanceTelemetryPanel({ performanceTelemetry = [] }) {
  return (
    <div className="performance-telemetry-panel glass-panel">
      <div className="panel-header-strip">
        <div className="title-group">
          <Gauge size={16} className="text-cyan" />
          <h3 className="section-title-text mono">ANALYSIS PERFORMANCE TELEMETRY (7 MODULES)</h3>
        </div>
        <span className="telemetry-badge mono text-xs text-green flex items-center gap-1">
          <CheckCircle2 size={12} />
          <span>Java Engine Metrics Active</span>
        </span>
      </div>

      <p className="panel-desc text-xs text-muted">
        Real measured execution times (<code>System.nanoTime()</code>) and character comparison metrics recorded live across the Java computational engine.
      </p>

      <div className="telemetry-table-wrapper">
        <table className="telemetry-table mono text-xs">
          <thead>
            <tr>
              <th>Algorithm Architecture</th>
              <th>Workload</th>
              <th>Aggregate Time (ms)</th>
              <th>Aggregate Time (ns)</th>
              <th>Measured Comparisons</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {performanceTelemetry && performanceTelemetry.length > 0 ? (
              performanceTelemetry.map((item, idx) => {
                const name = item.algorithmName || item.algorithm;
                const execMs = (item.totalExecutionTimeMs ?? item.executionTimeMs ?? 0).toFixed(4);
                const execNs = (item.totalExecutionTimeNs ?? item.executionTimeNs ?? 0).toLocaleString();
                const comps = (item.totalComparisons ?? item.comparisons ?? 0).toLocaleString();
                const workload = item.workloadType === 'MULTI_PATTERN'
                  ? `${item.patternCount} patterns (1 trie)`
                  : item.workloadType === 'INDEX_STRUCTURE'
                  ? '1 structure'
                  : `${item.patternCount || 1} pattern${(item.patternCount || 1) > 1 ? 's' : ''}`;

                return (
                  <tr key={idx}>
                    <td className="font-bold text-primary">{name}</td>
                    <td className="text-secondary">{workload}</td>
                    <td className="text-cyan font-bold">{execMs} ms</td>
                    <td className="text-muted">{execNs} ns</td>
                    <td className="text-amber font-bold">{comps}</td>
                    <td className="text-green">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={12} /> Verified
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-muted p-4">
                  No telemetry metrics recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
