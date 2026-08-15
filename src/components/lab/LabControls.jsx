import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Loader2 } from 'lucide-react';

export default function LabControls({ status, runVisualization, pauseVisualization, stepVisualization, resetVisualization }) {
  const isRunning = status === 'RUNNING';
  const isPaused = status === 'PAUSED';
  const isCompleted = status === 'COMPLETED';
  const isIdle = status === 'IDLE';

  return (
    <div className="lab-controls-horizontal-bar">
      {/* 1. PRIMARY RUN BUTTON */}
      <button 
        className={`control-btn primary-run-btn ${isRunning ? 'is-running' : ''}`}
        onClick={runVisualization}
        disabled={isRunning || isCompleted}
        title="Execute automated step-by-step visualization"
      >
        {isRunning ? (
          <>
            <Loader2 size={15} className="spin-icon text-cyan" />
            <span className="mono">Running...</span>
          </>
        ) : (
          <>
            <Play size={15} className="fill-current" />
            <span className="mono">Run</span>
          </>
        )}
      </button>
      
      {/* 2. STEP BUTTON */}
      <button 
        className="control-btn secondary-control-btn"
        onClick={stepVisualization}
        disabled={isCompleted}
        title="Advance execution by exactly one step"
      >
        <SkipForward size={15} />
        <span className="mono">Step</span>
      </button>
      
      {/* 3. PAUSE / RESUME BUTTON */}
      <button 
        className={`control-btn secondary-control-btn ${isPaused ? 'resume-highlight' : ''}`}
        onClick={pauseVisualization}
        disabled={isIdle || isCompleted}
        title={isPaused ? "Resume visualization sequence" : "Pause current execution"}
      >
        {isPaused ? (
          <>
            <Play size={15} />
            <span className="mono">Resume</span>
          </>
        ) : (
          <>
            <Pause size={15} />
            <span className="mono">Pause</span>
          </>
        )}
      </button>
      
      {/* 4. RESET BUTTON */}
      <button 
        className="control-btn reset-control-btn"
        onClick={resetVisualization}
        title="Reset playground to initial state"
      >
        <RotateCcw size={15} />
        <span className="mono">Reset</span>
      </button>
    </div>
  );
}
