import React, { useState } from 'react';
import { Download, Check, SplitSquareVertical } from 'lucide-react';

export default function CompareHeader({ analysisId, isOutdated }) {
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="compare-header-strip">
      <div className="header-left">
        <div className="compare-eyebrow mono text-xs text-cyan flex items-center gap-2">
          <SplitSquareVertical size={14} />
          <span>DOCUMENT COMPARISON WORKSTATION</span>
          <span className="live-status-pill mono text-xs">
            <span className="dot"></span>
            {isOutdated ? 'OUTDATED' : 'ANALYSIS SYNCHRONIZED'}
          </span>
        </div>
        <h1 className="compare-main-title">Compare Documents</h1>
        <p className="text-muted text-xs mono mt-1">
          Trace matching regions and sequence alignments across two texts with synchronized evidence.
        </p>
      </div>

      <div className="header-right flex items-center gap-3">
        <button 
          className="btn-secondary export-evidence-btn mono text-xs"
          onClick={handleExport}
          title="Export forensic alignment summary"
        >
          {exported ? (
            <>
              <Check size={14} className="text-green" />
              <span>Evidence Exported</span>
            </>
          ) : (
            <>
              <Download size={14} />
              <span>Export Evidence</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
