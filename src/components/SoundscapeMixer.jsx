import React from 'react';
import { CloudRain, Waves, Wind, Music, Sparkles, Volume2 } from 'lucide-react';

const PRESETS = [
  { id: 'rain', label: 'Cozy Rain', icon: CloudRain, color: '#2bcbba' },
  { id: 'ocean', label: 'Gentle Waves', icon: Waves, color: '#0abde3' },
  { id: 'wind', label: 'Night Breeze', icon: Wind, color: '#54a0ff' },
  { id: 'crickets', label: 'Crickets', icon: Sparkles, color: '#feca57' },
  { id: 'musicbox', label: 'Music Box', icon: Music, color: '#a55eea' },
];

export default function SoundscapeMixer({ 
  activePreset, 
  onTogglePreset, 
  ambientVolume, 
  onChangeVolume 
}) {
  return (
    <div className="soundscape-panel">
      <div className="soundscape-header">
        <div className="soundscape-title-wrap">
          <Sparkles size={16} className="sparkle-icon" />
          <span className="soundscape-title">Sleep Soundscapes</span>
        </div>
        <div className="soundscape-vol-wrap">
          <Volume2 size={15} />
          <input 
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={ambientVolume}
            onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
            className="soundscape-slider"
            aria-label="Soundscape volume"
          />
        </div>
      </div>

      <div className="soundscape-chips">
        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              className={`soundscape-chip ${isActive ? 'active' : ''}`}
              style={{ '--chip-color': preset.color }}
              onClick={() => onTogglePreset(preset.id)}
            >
              <Icon size={14} />
              <span>{preset.label}</span>
              {isActive && <span className="active-dot"></span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
