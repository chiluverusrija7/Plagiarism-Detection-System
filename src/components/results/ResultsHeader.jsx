import React, { useState } from 'react';
import { Download, Check, FileText } from 'lucide-react';

export default function ResultsHeader({ result }) {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="results-header-strip">
      <div className="header-left-col">
        <div className="results-eyebrow mono">
          <span className="eyebrow-dot"></span>
          <span>ANALYSIS REPORT</span>
          <span className="demo-badge mono text-xs">UI PREVIEW</span>
        </div>
        <h1 className="results-main-title">Analysis Results</h1>
        <div className="results-meta-line mono text-xs text-muted">
          <span className="flex items-center gap-1 text-secondary">
            <FileText size={13} className="text-cyan" />
            <span>Target: <strong>{result.targetDocument.filename}</strong></span>
          </span>
          <span className="divider">•</span>
          <span>Analysis ID: <strong>{result.analysisId}</strong></span>
          <span className="divider">•</span>
          <span>Status: <strong className="text-green">COMPLETED</strong></span>
        </div>
      </div>

      <div className="header-right-col">
        <button 
          className="btn-secondary export-report-btn mono text-xs"
          onClick={handleExport}
          title="Export forensic analysis summary"
        >
          {exported ? (
            <>
              <Check size={14} className="text-green" />
              <span>Report Exported (Preview)</span>
            </>
          ) : (
            <>
              <Download size={14} />
              <span>Export Report</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
