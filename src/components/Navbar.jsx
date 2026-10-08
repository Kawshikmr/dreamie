import React from 'react';
import { Sparkles, Moon, EyeOff, ShieldCheck, Heart } from 'lucide-react';

export default function Navbar({ onOpenStudio, onOpenScreenFree, childProfile, streak = 5 }) {
  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <div className="brand-logo-wrap">
          <div className="moon-pulse">
            <Moon className="brand-icon" size={24} />
          </div>
          <span className="star-sparkle top-right">✦</span>
          <span className="star-sparkle bottom-left">★</span>
        </div>
        <div className="brand-text">
          <h1 className="brand-title">Dreamie</h1>
          <span className="brand-subtitle">Screen-Free Audio Stories</span>
        </div>
      </div>

      <div className="navbar-actions">
        <div className="child-badge" title="Active Little Dreamer">
          <span className="child-avatar">{childProfile?.avatarEmoji || '🐻'}</span>
          <span className="child-name">{childProfile?.name || 'Little Dreamer'}</span>
          <span className="streak-tag">🌙 {streak}d</span>
        </div>

        <button 
          className="btn-screen-free"
          onClick={onOpenScreenFree}
          title="Turn off screen for sleep while audio continues"
        >
          <EyeOff size={16} />
          <span>Screen-Free</span>
        </button>

        <button 
          className="btn-magic-create"
          onClick={onOpenStudio}
          title="Create a personalized bedtime story"
        >
          <Sparkles size={16} />
          <span>Magic Story</span>
        </button>
      </div>
    </header>
  );
}
