import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeSelector.css';

export default function ThemeSelector() {
  const { theme, setTheme, themes, currentThemeObj } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Close popover on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="theme-selector-wrapper" ref={popoverRef}>
      {/* Trigger Button */}
      <button 
        className={`theme-trigger-btn ${isOpen ? 'active-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Theme"
        title={`Current Theme: ${currentThemeObj.name}`}
      >
        <Palette size={16} className="palette-icon" />
        <span 
          className="theme-active-dot"
          style={{ backgroundColor: currentThemeObj.accentColor }}
        ></span>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="theme-popover glass-panel">
          <div className="theme-popover-header mono text-2xs">
            <span>THEME SELECTION</span>
            <span className="theme-count-badge">4 THEMES</span>
          </div>

          <div className="theme-options-list">
            {themes.map((t) => {
              const isActive = t.id === theme;
              return (
                <button
                  key={t.id}
                  className={`theme-option-item ${isActive ? 'active-theme' : ''}`}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="theme-swatch-pills">
                    {t.swatches.map((color, idx) => (
                      <span 
                        key={idx} 
                        className="swatch-dot" 
                        style={{ backgroundColor: color }}
                      ></span>
                    ))}
                  </div>

                  <div className="theme-text-info">
                    <span className="theme-name">{t.name}</span>
                    <span className="theme-tagline mono">{t.tagline}</span>
                  </div>

                  <div className="theme-check-cell">
                    {isActive && <Check size={14} className="check-icon text-cyan" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
