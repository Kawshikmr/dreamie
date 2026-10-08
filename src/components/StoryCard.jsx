import React from 'react';
import { Play, Pause, Heart, Sparkles, Clock, Compass } from 'lucide-react';

export default function StoryCard({ 
  story, 
  isPlaying, 
  isCurrentStory, 
  onPlay, 
  isFavorite, 
  onToggleFavorite 
}) {
  return (
    <div 
      className={`story-card ${isCurrentStory ? 'active-story' : ''}`}
      style={{ '--card-accent': story.color || '#ff9f43' }}
    >
      <div className="story-card-header">
        <div className="story-hero-icon" style={{ background: story.color || '#ff9f43' }}>
          <span>{story.heroEmoji || '✨'}</span>
        </div>
        <div className="story-tags">
          <span className="pill pill-age">{story.targetAge}</span>
          <span className="pill pill-duration">
            <Clock size={12} />
            {story.duration}
          </span>
          {story.isCustom && (
            <span className="pill pill-custom">
              <Sparkles size={11} /> AI Made
            </span>
          )}
        </div>
        <button 
          className={`btn-fav ${isFavorite ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(story.id);
          }}
          aria-label="Save to favorites"
        >
          <Heart size={16} fill={isFavorite ? '#ff4757' : 'none'} color={isFavorite ? '#ff4757' : 'currentColor'} />
        </button>
      </div>

      <div className="story-card-body" onClick={() => onPlay(story)}>
        <h3 className="story-title">{story.title}</h3>
        <p className="story-tagline">{story.tagline || story.moral}</p>
        
        <div className="story-moral-box">
          <span className="moral-label">Virtue:</span>
          <span className="moral-text">{story.theme || 'Kindness'}</span>
        </div>
      </div>

      <div className="story-card-footer">
        <button 
          className={`btn-play-story ${isCurrentStory && isPlaying ? 'playing' : ''}`}
          onClick={() => onPlay(story)}
        >
          {isCurrentStory && isPlaying ? (
            <>
              <Pause size={16} />
              <span>Playing...</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Listen Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
