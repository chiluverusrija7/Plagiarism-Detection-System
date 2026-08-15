import React from 'react';
import { ArrowRightLeft, AlignLeft, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export default function CompareToolbar({
  syncScroll,
  setSyncScroll,
  onAlignMatches,
  references = [],
  selectedRefId,
  onSelectReference,
  matches = [],
  activeMatchIndex,
  onNavigateMatch
}) {
  const currentMatchNumber = matches.length > 0 ? activeMatchIndex + 1 : 0;
  const totalMatches = matches.length;

  return (
    <div className="compare-toolbar-strip">
      <div className="toolbar-left-group">
        {/* Sync Scroll Toggle */}
        <button 
          className={`toolbar-toggle-btn mono text-xs ${syncScroll ? 'is-active' : ''}`}
          onClick={() => setSyncScroll(!syncScroll)}
          title="Toggle proportional scrolling synchronization between documents"
        >
          <ArrowRightLeft size={13} />
          <span>Sync Scroll</span>
        </button>

        {/* Align Matches Button */}
        <button 
          className="toolbar-btn mono text-xs"
          onClick={onAlignMatches}
          disabled={totalMatches === 0}
          title="Scroll both documents to center on the active match"
        >
          <AlignLeft size={13} />
          <span>Align Matches</span>
        </button>

        {/* Reference Switcher Tabs if multiple references */}
        {references.length > 1 && (
          <div className="reference-switcher-group mono text-xs">
            <span className="switcher-label text-muted flex items-center gap-1">
              <Layers size={12} /> Ref:
            </span>
            <div className="switcher-tabs">
              {references.map((r, idx) => (
                <button
                  key={r.id}
                  className={`ref-tab-btn ${selectedRefId === r.id ? 'is-active' : ''}`}
                  onClick={() => onSelectReference(r.id)}
                  title={r.name}
                >
                  REF {String(idx + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Match Stepper Navigator */}
      <div className="toolbar-right-group">
        <div className="match-stepper-box mono text-xs">
          <button 
            className="stepper-nav-btn"
            onClick={() => onNavigateMatch(-1)}
            disabled={totalMatches === 0}
            title="Previous match"
          >
            <ChevronLeft size={14} />
          </button>
          
          <span className="stepper-counter">
            {totalMatches > 0 ? `MATCH ${String(currentMatchNumber).padStart(2, '0')} / ${String(totalMatches).padStart(2, '0')}` : 'NO MATCHES'}
          </span>

          <button 
            className="stepper-nav-btn"
            onClick={() => onNavigateMatch(1)}
            disabled={totalMatches === 0}
            title="Next match"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
