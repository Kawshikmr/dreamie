import React from 'react';
import { Moon, Award, Calendar, Heart, Shield, Sparkles } from 'lucide-react';

export default function ParentDashboard({ 
  childProfile, 
  onUpdateProfile, 
  streak = 5, 
  totalMinutes = 48 
}) {
  return (
    <div className="parent-dash-card">
      <div className="dash-header">
        <div className="dash-badge">
          <Moon size={16} />
          <span>Bedtime Sleep Sanctuary</span>
        </div>
        <span className="screen-free-guarantee">100% Screen-Free Safe</span>
      </div>

      <div className="dash-metrics-grid">
        <div className="metric-box">
          <span className="metric-num">🌙 {streak}</span>
          <span className="metric-label">Calm Bedtimes in a Row</span>
        </div>
        <div className="metric-box">
          <span className="metric-num">🎧 {totalMinutes}m</span>
          <span className="metric-label">Peaceful Audio Listened</span>
        </div>
        <div className="metric-box">
          <span className="metric-num">✨ 0m</span>
          <span className="metric-label">Blue-Light Screen Time</span>
        </div>
      </div>

      <div className="child-selector-bar">
        <span className="selector-title">Little Dreamer:</span>
        <div className="child-pills">
          <button className="child-pill active">
            <span>{childProfile?.avatarEmoji || '🐻'}</span>
            <span>{childProfile?.name || 'Maya'} ({childProfile?.age || 5}y)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
