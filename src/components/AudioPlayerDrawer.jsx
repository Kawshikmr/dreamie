import React, { useState } from 'react';
import { 
  Play, Pause, RotateCcw, RotateCw, Volume2, Moon, 
  ChevronDown, ChevronUp, BookOpen, Clock, Sparkles, EyeOff
} from 'lucide-react';

const VOICES = [
  { id: 'en-US-JennyNeural', name: 'Cozy Mom Jenny', flag: '🇺🇸' },
  { id: 'en-US-AnaNeural', name: 'Sweet Fairy Ana', flag: '🧚' },
  { id: 'en-US-ChristopherNeural', name: 'Storyteller Chris', flag: '📖' },
  { id: 'en-IN-NeerjaNeural', name: 'Neerja (Indian Tales)', flag: '🇮🇳' },
  { id: 'en-GB-SoniaNeural', name: 'Classic Bedtime Sonia', flag: '🇬🇧' },
];

const TIMER_OPTIONS = [
  { label: 'Off', minutes: 0 },
  { label: '5m', minutes: 5 },
  { label: '10m', minutes: 10 },
  { label: '15m', minutes: 15 },
  { label: '30m', minutes: 30 },
];

export default function AudioPlayerDrawer({
  currentStory,
  isPlaying,
  isBuffering,
  playbackProgress,
  onTogglePlay,
  onRewind15,
  onForward15,
  onSeek,
  selectedVoice,
  onChangeVoice,
  playbackRate,
  onChangeRate,
  onOpenScreenFree,
  sleepTimer,
  onSetSleepTimer,
  sleepTimerRemaining
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadAlong, setShowReadAlong] = useState(false);

  if (!currentStory) return null;

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`player-drawer ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Top Drag / Expand Bar */}
      <div className="drawer-handle-bar" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="drawer-handle-pill"></div>
        <button className="btn-expand-toggle" aria-label="Toggle player expand">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>

      {/* Mini Player Bar */}
      <div className="mini-player-row">
        <div className="mini-story-info" onClick={() => setIsExpanded(true)}>
          <div className="mini-hero-avatar">
            <span>{currentStory.heroEmoji || '✨'}</span>
          </div>
          <div className="mini-story-meta">
            <h4 className="mini-title">{currentStory.title}</h4>
            <span className="mini-tagline">{currentStory.theme || 'Bedtime Story'}</span>
          </div>
        </div>

        <div className="mini-controls">
          <button 
            className="btn-mini-screen-free"
            onClick={onOpenScreenFree}
            title="Screen-Free Blackout Mode"
          >
            <EyeOff size={16} />
          </button>

          <button 
            className="btn-mini-play"
            onClick={onTogglePlay}
            disabled={isBuffering}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isBuffering ? (
              <Sparkles size={16} className="spin-slow" />
            ) : isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar (Visible in both mini and expanded) */}
      <div className="player-progress-container">
        <input 
          type="range"
          min="0"
          max="100"
          step="0.5"
          value={playbackProgress?.progress || 0}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="progress-slider"
          aria-label="Story audio progress"
        />
        <div className="progress-timestamps">
          <span>{formatTime(playbackProgress?.currentTime)}</span>
          {sleepTimerRemaining && (
            <span className="timer-badge">🌙 Sleep in {sleepTimerRemaining}</span>
          )}
          <span>{formatTime(playbackProgress?.duration)}</span>
        </div>
      </div>

      {/* Expanded Controls & Panels */}
      {isExpanded && (
        <div className="expanded-content">
          {/* Main Transport Buttons */}
          <div className="transport-controls">
            <button 
              className="btn-transport" 
              onClick={onRewind15}
              title="Rewind 15 seconds"
            >
              <RotateCcw size={22} />
              <span className="transport-label">-15s</span>
            </button>

            <button 
              className="btn-transport-play"
              onClick={onTogglePlay}
              disabled={isBuffering}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isBuffering ? (
                <Sparkles size={28} className="spin-slow" />
              ) : isPlaying ? (
                <Pause size={32} />
              ) : (
                <Play size={32} />
              )}
            </button>

            <button 
              className="btn-transport" 
              onClick={onForward15}
              title="Skip ahead 15 seconds"
            >
              <RotateCw size={22} />
              <span className="transport-label">+15s</span>
            </button>
          </div>

          {/* Quick Settings Bar: Speed & Sleep Timer & Voice */}
          <div className="player-settings-grid">
            {/* Speed toggle */}
            <div className="setting-box">
              <span className="setting-title">Pacing</span>
              <div className="speed-pills">
                {[0.8, 1.0, 1.1].map((rate) => (
                  <button
                    key={rate}
                    className={`btn-speed ${playbackRate === rate ? 'active' : ''}`}
                    onClick={() => onChangeRate(rate)}
                  >
                    {rate === 0.8 ? 'Sleep 0.8x' : `${rate}x`}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep Timer */}
            <div className="setting-box">
              <span className="setting-title">
                <Clock size={13} />
                <span>Sleep Timer</span>
              </span>
              <div className="speed-pills">
                {TIMER_OPTIONS.map((item) => (
                  <button
                    key={item.minutes}
                    className={`btn-speed ${sleepTimer === item.minutes ? 'active' : ''}`}
                    onClick={() => onSetSleepTimer(item.minutes)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Voice Selector */}
          <div className="voice-selector-row">
            <span className="setting-title">Bedtime Narrator:</span>
            <div className="voice-chips">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  className={`voice-chip ${selectedVoice === v.id ? 'active' : ''}`}
                  onClick={() => onChangeVoice(v.id)}
                >
                  <span>{v.flag}</span>
                  <span>{v.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Read Along Script Toggle */}
          <div className="read-along-section">
            <button 
              className="btn-toggle-script"
              onClick={() => setShowReadAlong(!showReadAlong)}
            >
              <BookOpen size={16} />
              <span>{showReadAlong ? 'Hide Story Script' : 'Read-Along Words'}</span>
            </button>

            {showReadAlong && (
              <div className="story-transcript-box">
                <h3 className="transcript-title">{currentStory.title}</h3>
                {currentStory.story.split('\n\n').map((para, i) => (
                  <p key={i} className="transcript-para">{para}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
