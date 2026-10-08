import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import StoryCard from './components/StoryCard';
import SeriesView from './components/SeriesView';
import SoundscapeMixer from './components/SoundscapeMixer';
import AudioPlayerDrawer from './components/AudioPlayerDrawer';
import StoryStudioModal from './components/StoryStudioModal';
import ScreenFreeModal from './components/ScreenFreeModal';
import ParentDashboard from './components/ParentDashboard';
import { CURATED_STORIES } from './data/curatedStories';
import { ambientSound } from './audio/ambientAudio';
import { voicePlayer } from './audio/voicePlayer';
import { Sparkles, Moon, Heart, Compass, Star, Volume2, ShieldCheck, Bookmark, BookOpen } from 'lucide-react';
import './App.css';

const CATEGORIES = ['All', 'Animals', 'Bedtime Bravery', 'Fantasy', 'Nature', 'Mythology & Legends', 'Favorites'];

export default function App() {
  const [activeTab, setActiveTab] = useState('series'); // 'series' (10-min sagas) | 'singles'
  const [stories, setStories] = useState(() => {
    const saved = localStorage.getItem('dreamie_custom_stories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...parsed, ...CURATED_STORIES];
      } catch (e) {
        return CURATED_STORIES;
      }
    }
    return CURATED_STORIES;
  });

  const [currentStory, setCurrentStory] = useState(CURATED_STORIES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState({ currentTime: 0, duration: 1, progress: 0 });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('dreamie_favorites');
    return saved ? JSON.parse(saved) : ['story-1', 'story-3'];
  });

  const [childProfile, setChildProfile] = useState(() => {
    const saved = localStorage.getItem('dreamie_child_profile');
    return saved ? JSON.parse(saved) : { name: 'Maya', age: 5, avatarEmoji: '🐻', companion: 'Pip the Star Owl' };
  });

  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isScreenFreeOpen, setIsScreenFreeOpen] = useState(false);
  const [activeSoundscape, setActiveSoundscape] = useState('musicbox');
  const [ambientVolume, setAmbientVolume] = useState(0.35);
  const [selectedVoice, setSelectedVoice] = useState('en-US-JennyNeural');
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(10); // Default to 10 min sleep timer!
  const [sleepTimerSecondsLeft, setSleepTimerSecondsLeft] = useState(0);

  const timerIntervalRef = useRef(null);

  // Bind audio player callbacks
  useEffect(() => {
    voicePlayer.setCallbacks({
      onProgress: (prog) => {
        setPlaybackProgress(prog);
      },
      onStateChange: (state) => {
        setIsPlaying(state.isPlaying);
        setIsBuffering(state.isBuffering);
      }
    });

    ambientSound.setVolume(ambientVolume);
  }, []);

  // Sleep Timer Handler
  useEffect(() => {
    if (sleepTimerMinutes > 0) {
      setSleepTimerSecondsLeft(sleepTimerMinutes * 60);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      timerIntervalRef.current = setInterval(() => {
        setSleepTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setSleepTimerMinutes(0);
            voicePlayer.fadeOutAndStop(20);
            ambientSound.stop();
            setActiveSoundscape(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setSleepTimerSecondsLeft(0);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [sleepTimerMinutes]);

  const formatTimerRemaining = () => {
    if (!sleepTimerSecondsLeft) return null;
    const m = Math.floor(sleepTimerSecondsLeft / 60);
    const s = sleepTimerSecondsLeft % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePlayStory = (story) => {
    if (currentStory?.id === story.id && isPlaying) {
      voicePlayer.togglePlayPause();
      return;
    }

    setCurrentStory(story);
    voicePlayer.playStory(story, selectedVoice);

    // Sync ambient sound preset with story if not already active
    if (story.soundscapePreset && activeSoundscape !== story.soundscapePreset) {
      ambientSound.playPreset(story.soundscapePreset);
      setActiveSoundscape(story.soundscapePreset);
    }
  };

  const handleTogglePlay = () => {
    if (!currentStory) {
      if (stories.length > 0) handlePlayStory(stories[0]);
      return;
    }
    voicePlayer.togglePlayPause();
  };

  const handleToggleSoundscape = (preset) => {
    const isNowPlaying = ambientSound.playPreset(preset);
    setActiveSoundscape(isNowPlaying ? preset : null);
  };

  const handleChangeAmbientVolume = (vol) => {
    setAmbientVolume(vol);
    ambientSound.setVolume(vol);
  };

  const handleToggleFavorite = (storyId) => {
    setFavorites((prev) => {
      const next = prev.includes(storyId) 
        ? prev.filter((id) => id !== storyId) 
        : [...prev, storyId];
      localStorage.setItem('dreamie_favorites', JSON.stringify(next));
      return next;
    });
  };

  const handleStoryCreated = (newStory) => {
    setStories((prev) => {
      const updated = [newStory, ...prev];
      const customOnly = updated.filter((s) => s.isCustom);
      localStorage.setItem('dreamie_custom_stories', JSON.stringify(customOnly));
      return updated;
    });
    handlePlayStory(newStory);
  };

  const filteredStories = stories.filter((story) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Favorites') return favorites.includes(story.id);
    return story.category === selectedCategory;
  });

  return (
    <div className="dreamie-app">
      {/* Background Starlight & Nebula */}
      <div className="celestial-sky">
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="star star-4"></div>
        <div className="star star-5"></div>
        <div className="glow-nebula nebula-top"></div>
        <div className="glow-nebula nebula-bottom"></div>
      </div>

      <div className="app-shell">
        {/* Top Navbar */}
        <Navbar 
          onOpenStudio={() => setIsStudioOpen(true)}
          onOpenScreenFree={() => setIsScreenFreeOpen(true)}
          childProfile={childProfile}
        />

        {/* Mode Switcher: 10-Minute Sagas vs Bedtime Singles */}
        <div className="mode-toggle-dock">
          <button 
            className={`mode-toggle-btn ${activeTab === 'series' ? 'active' : ''}`}
            onClick={() => setActiveTab('series')}
          >
            <Sparkles size={16} />
            <span>🌟 10-Min Serialized Sagas</span>
          </button>
          <button 
            className={`mode-toggle-btn ${activeTab === 'singles' ? 'active' : ''}`}
            onClick={() => setActiveTab('singles')}
          >
            <Moon size={16} />
            <span>🌙 Bedtime Singles</span>
          </button>
        </div>

        {/* Ambient Sleep Soundscape Layer */}
        <SoundscapeMixer 
          activePreset={activeSoundscape}
          onTogglePreset={handleToggleSoundscape}
          ambientVolume={ambientVolume}
          onChangeVolume={handleChangeAmbientVolume}
        />

        {/* MAIN VIEW: 10-Minute Serialized Sagas */}
        {activeTab === 'series' && (
          <SeriesView 
            childProfile={childProfile}
            onPlayEpisode={(epStory) => handlePlayStory(epStory)}
          />
        )}

        {/* MAIN VIEW: Bedtime Singles */}
        {activeTab === 'singles' && (
          <>
            {/* Category Tabs */}
            <div className="category-scroll-bar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'Favorites' ? '❤️ Favorites' : cat}
                </button>
              ))}
            </div>

            {/* Story Grid */}
            <main className="stories-grid-section">
              <div className="stories-grid">
                {filteredStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    isCurrentStory={currentStory?.id === story.id}
                    isPlaying={isPlaying && currentStory?.id === story.id}
                    onPlay={handlePlayStory}
                    isFavorite={favorites.includes(story.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </main>
          </>
        )}

        {/* Parent Sleep Sanctuary Dashboard */}
        <ParentDashboard childProfile={childProfile} />

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-safe-badge">
            <ShieldCheck size={16} />
            <span>Screen-Free Bedtime Audio • Zero Ads • Designed for Deep Child Sleep</span>
          </div>
        </footer>
      </div>

      {/* Floating Audio Player Drawer */}
      <AudioPlayerDrawer
        currentStory={currentStory}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        playbackProgress={playbackProgress}
        onTogglePlay={handleTogglePlay}
        onRewind15={() => voicePlayer.seekRelative(-15)}
        onForward15={() => voicePlayer.seekRelative(15)}
        onSeek={(pct) => voicePlayer.seekPercent(pct)}
        selectedVoice={selectedVoice}
        onChangeVoice={(voiceId) => {
          setSelectedVoice(voiceId);
          if (currentStory) voicePlayer.playStory(currentStory, voiceId);
        }}
        playbackRate={playbackRate}
        onChangeRate={(rate) => {
          setPlaybackRate(rate);
          voicePlayer.setPlaybackRate(rate);
        }}
        onOpenScreenFree={() => setIsScreenFreeOpen(true)}
        sleepTimer={sleepTimerMinutes}
        onSetSleepTimer={(mins) => setSleepTimerMinutes(mins)}
        sleepTimerRemaining={formatTimerRemaining()}
      />

      {/* Magic Story Studio Modal */}
      <StoryStudioModal 
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        onStoryCreated={handleStoryCreated}
        initialProfile={childProfile}
      />

      {/* Screen-Free Blackout Sleep Modal */}
      <ScreenFreeModal
        isOpen={isScreenFreeOpen}
        onClose={() => setIsScreenFreeOpen(false)}
        currentStory={currentStory}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onRewind15={() => voicePlayer.seekRelative(-15)}
        sleepTimerRemaining={formatTimerRemaining()}
      />
    </div>
  );
}
