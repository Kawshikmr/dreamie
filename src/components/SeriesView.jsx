import React, { useState } from 'react';
import { Sparkles, Moon, Play, CheckCircle2, Lock, Key, Award, Flame, ChevronRight } from 'lucide-react';
import { BEDTIME_SEASONS, buildPersonalizedSeriesStory } from '../data/seriesData';

export default function SeriesView({ 
  childProfile, 
  onPlayEpisode, 
  activeSeasonId = "season-1" 
}) {
  const [selectedSeasonId, setSelectedSeasonId] = useState(activeSeasonId);
  const [completedEpisodes, setCompletedEpisodes] = useState(() => {
    const saved = localStorage.getItem('dreamie_completed_episodes');
    return saved ? JSON.parse(saved) : [1]; // Episode 1 unlocked by default
  });

  const season = BEDTIME_SEASONS.find(s => s.id === selectedSeasonId) || BEDTIME_SEASONS[0];

  const handleStartEpisode = (ep) => {
    const personalizedStory = buildPersonalizedSeriesStory(
      childProfile?.name || 'Maya',
      childProfile?.companion || 'Pip the Star Owl',
      season,
      ep
    );
    onPlayEpisode(personalizedStory);
  };

  return (
    <div className="series-container">
      {/* Series Hero Card */}
      <div className="series-banner-card">
        <div className="series-meta-tag">
          <Sparkles size={14} />
          <span>Automated 10-Minute Bedtime Saga</span>
        </div>

        <h2 className="series-saga-title">
          {season.title} <span className="child-highlight">ft. {childProfile?.name || 'Maya'}</span>
        </h2>
        <p className="series-saga-tagline">{season.tagline}</p>

        <div className="series-progress-row">
          <div className="series-badge-capsule">
            <span>Mascot: {season.mascot}</span>
            <span>•</span>
            <span>Setting: {season.setting}</span>
          </div>
          <div className="keys-collected-counter">
            <Key size={14} className="key-icon" />
            <span>Keys Collected: {completedEpisodes.length} / {season.episodes.length}</span>
          </div>
        </div>
      </div>

      {/* Season Selector Tabs */}
      <div className="season-tabs">
        {BEDTIME_SEASONS.map(s => (
          <button
            key={s.id}
            className={`season-tab-btn ${selectedSeasonId === s.id ? 'active' : ''}`}
            onClick={() => setSelectedSeasonId(s.id)}
          >
            <span>{s.mascot}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Episodes Road Map */}
      <div className="episodes-roadmap">
        {season.episodes.map((ep, idx) => {
          const isCompleted = completedEpisodes.includes(ep.number);
          const isCurrent = ep.number === (Math.max(...completedEpisodes, 0) + 1) || (ep.number === 1 && completedEpisodes.length === 0);
          const isLocked = !isCompleted && !isCurrent && ep.number > (Math.max(...completedEpisodes, 0) + 1);

          return (
            <div 
              key={ep.number} 
              className={`episode-card ${isCurrent ? 'current-night' : ''} ${isLocked ? 'locked-night' : ''}`}
              onClick={() => !isLocked && handleStartEpisode(ep)}
            >
              <div className="episode-left">
                <div className={`ep-number-badge ${isCompleted ? 'completed' : isCurrent ? 'current' : 'locked'}`}>
                  {isCompleted ? <CheckCircle2 size={18} /> : isLocked ? <Lock size={16} /> : <span>{ep.number}</span>}
                </div>

                <div className="ep-info">
                  <div className="ep-title-row">
                    <h3 className="ep-title">
                      Episode {ep.number}: {ep.title}
                    </h3>
                    <span className="ep-duration">10 mins</span>
                  </div>
                  <p className="ep-summary">{ep.summary}</p>
                  
                  {/* Dream Key Reward */}
                  <div className="ep-dream-key">
                    <Key size={12} />
                    <span>Tonight's Key: <strong>{ep.dreamKey}</strong></span>
                  </div>
                </div>
              </div>

              <div className="episode-right">
                {isLocked ? (
                  <span className="locked-tag">Unlocks Tomorrow</span>
                ) : (
                  <button className="btn-play-ep" onClick={(e) => {
                    e.stopPropagation();
                    handleStartEpisode(ep);
                  }}>
                    <Play size={16} fill="currentColor" />
                    <span>{isCurrent ? "Play Tonight" : "Replay"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
