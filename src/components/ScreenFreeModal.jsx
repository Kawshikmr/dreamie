import React, { useState } from 'react';
import { Moon, Play, Pause, RotateCcw, X, Volume2 } from 'lucide-react';

export default function ScreenFreeModal({ 
  isOpen, 
  onClose, 
  currentStory, 
  isPlaying, 
  onTogglePlay, 
  onRewind15,
  sleepTimerRemaining 
}) {
  if (!isOpen) return null;

  return (
    <div className="screen-free-overlay" onClick={onTogglePlay}>
      <button 
        className="btn-exit-screen-free"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Wake Screen"
      >
        <X size={20} />
        <span>Wake Screen</span>
      </button>

      <div className="screen-free-center">
        <div className={`breathing-moon ${isPlaying ? 'pulse-slow' : 'paused'}`}>
          <Moon size={72} strokeWidth={1.5} />
        </div>
        
        <h2 className="screen-free-title">
          {currentStory?.title || 'Resting quietly...'}
        </h2>

        <p className="screen-free-hint">
          {isPlaying ? 'Screen is off • Tap anywhere to pause' : 'Paused • Tap anywhere to resume'}
        </p>

        {sleepTimerRemaining && (
          <div className="screen-free-timer-pill">
            <span>Sleep timer: {sleepTimerRemaining}</span>
          </div>
        )}
      </div>

      <div className="screen-free-bottom-bar" onClick={(e) => e.stopPropagation()}>
        <button 
          className="btn-screen-free-control"
          onClick={onRewind15}
          title="Rewind 15 seconds"
        >
          <RotateCcw size={22} />
          <span>-15s</span>
        </button>

        <button 
          className="btn-screen-free-control primary"
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>
      </div>
    </div>
  );
}
