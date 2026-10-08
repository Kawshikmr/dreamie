import React, { useState } from 'react';
import { X, Sparkles, Wand2, Moon, Heart, Compass, Shuffle, Check } from 'lucide-react';

const AVATARS = [
  { id: 'bear', emoji: '🐻', name: 'Sleepy Bear' },
  { id: 'astronaut', emoji: '🚀', name: 'Star Explorer' },
  { id: 'fox', emoji: '🦊', name: 'Cozy Fox' },
  { id: 'owl', emoji: '🦉', name: 'Gentle Owl' },
  { id: 'bunny', emoji: '🐰', name: 'Cloud Bunny' },
  { id: 'mermaid', emoji: '🧜‍♀️', name: 'Coral Mermaid' },
];

const THEMES = [
  { id: 'Kindness', label: 'Kindness & Helping', emoji: '💖' },
  { id: 'Courage', label: 'Bravery & Night Peace', emoji: '🦁' },
  { id: 'Sharing', label: 'Sharing with Friends', emoji: '🤝' },
  { id: 'Sleep', label: 'Deep Sweet Dreams', emoji: '🌙' },
  { id: 'Gratitude', label: 'Loving My Family', emoji: '🙏' },
  { id: 'Curiosity', label: 'Loving Nature', emoji: '🌿' },
];

const SETTINGS = [
  { id: 'Enchanted Forest', label: 'Whispering Forest', emoji: '🌲' },
  { id: 'Starlit Galaxy', label: 'Starlit Galaxy & Cloud Train', emoji: '✨' },
  { id: 'Coral Lagoon', label: 'Warm Ocean Reef', emoji: '🌊' },
  { id: 'Cozy Treehouse', label: 'Cozy Mountain Treehouse', emoji: '🏡' },
  { id: 'Indian Folktale Kingdom', label: 'Golden Kingdom of Folktales', emoji: '🦚' },
];

const RANDOM_NAMES = ['Maya', 'Aarav', 'Leo', 'Mia', 'Oliver', 'Ananya', 'Lucas', 'Zara'];
const RANDOM_COMPANIONS = ['a golden puppy named Pip', 'a soft blanket named Fluffy', 'a pocket robot named Bolt', 'a sleepy kitten named Luna'];

export default function StoryStudioModal({ isOpen, onClose, onStoryCreated, initialProfile }) {
  const [childName, setChildName] = useState(initialProfile?.name || 'Maya');
  const [childAge, setChildAge] = useState(initialProfile?.age || 5);
  const [avatar, setAvatar] = useState('bear');
  const [companion, setCompanion] = useState('a little puppy named Pip');
  const [theme, setTheme] = useState('Kindness');
  const [setting, setSetting] = useState('Enchanted Forest');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSurpriseMe = () => {
    const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    const randomComp = RANDOM_COMPANIONS[Math.floor(Math.random() * RANDOM_COMPANIONS.length)];
    const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)].id;
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)].id;
    const randomSetting = SETTINGS[Math.floor(Math.random() * SETTINGS.length)].id;

    setChildName(randomName);
    setCompanion(randomComp);
    setAvatar(randomAvatar);
    setTheme(randomTheme);
    setSetting(randomSetting);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!childName.trim()) {
      setErrorMsg('Please enter your child’s name!');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');

    try {
      const selectedAvatarObj = AVATARS.find(a => a.id === avatar);
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName: childName.trim(),
          childAge: Number(childAge),
          character: selectedAvatarObj?.name || 'Sleepy Hero',
          companion: companion.trim(),
          theme,
          setting
        })
      });

      if (!res.ok) {
        throw new Error('Server returned an error');
      }

      const data = await res.json();
      
      const newStory = {
        id: `custom-${Date.now()}`,
        title: data.title || `${childName}'s Bedtime Journey`,
        tagline: data.moral || `A peaceful bedtime tale about ${theme.toLowerCase()}.`,
        targetAge: `${childAge} years`,
        duration: data.estimated_duration || '4 mins',
        theme,
        category: 'Personalized',
        hero: childName,
        heroEmoji: selectedAvatarObj?.emoji || '✨',
        companion,
        color: '#ff9f43',
        moral: data.moral,
        story: data.story,
        isCustom: true
      };

      onStoryCreated(newStory);
      onClose();
    } catch (err) {
      console.error('[Dreamie] Story generation failed:', err);
      // Fallback local creation so user is never blocked
      const fallbackStory = {
        id: `custom-${Date.now()}`,
        title: `${childName} and the Whispering Stars`,
        tagline: `A comforting bedtime adventure about ${theme.toLowerCase()}.`,
        targetAge: `${childAge} years`,
        duration: '4 mins',
        theme,
        category: 'Personalized',
        hero: childName,
        heroEmoji: '✨',
        companion,
        color: '#54a0ff',
        moral: `When you share ${theme.toLowerCase()}, the sweetest dreams follow.`,
        story: `Once upon a quiet twilight, ${childName} was cuddled up in bed with ${companion}. Outside the window, the soft night wind was whispering sweet lullabies across the sleepy world.\n\n"Look, ${childName}," whispered ${companion}. High in the indigo sky, the moon was smiling down, casting a silver path of light.\n\nTogether, they took slow, calming breaths: breathe in the sweet starlight... breathe out the busy day.\n\nEverything in ${setting} was drifting peacefully off to sleep. And as ${childName} closed their eyes, their heart felt warm with ${theme.toLowerCase()}.\n\nGoodnight, brave ${childName}. Have the sweetest, calmest dreams.`,
        isCustom: true
      };
      onStoryCreated(fallbackStory);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="sparkle-badge">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="modal-title">Magic Story Studio</h2>
              <p className="modal-subtitle">Make your little one the hero of tonight’s dream</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="modal-body">
          {/* Surprise Me shortcut */}
          <div className="quick-random-bar">
            <span>Need inspiration quickly?</span>
            <button type="button" className="btn-surprise-me" onClick={handleSurpriseMe}>
              <Shuffle size={14} />
              <span>Surprise Me!</span>
            </button>
          </div>

          {/* Child Name & Age */}
          <div className="form-row-duo">
            <div className="form-group flex-2">
              <label className="form-label">Hero's Name</label>
              <input
                type="text"
                className="input-text"
                placeholder="e.g. Maya, Aarav, Leo..."
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Age ({childAge})</label>
              <input
                type="range"
                min="2"
                max="9"
                step="1"
                value={childAge}
                onChange={(e) => setChildAge(Number(e.target.value))}
                className="range-slider"
              />
            </div>
          </div>

          {/* Character Archetype */}
          <div className="form-group">
            <label className="form-label">Choose Avatar</label>
            <div className="avatar-grid">
              {AVATARS.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`avatar-card ${avatar === item.id ? 'selected' : ''}`}
                  onClick={() => setAvatar(item.id)}
                >
                  <span className="avatar-emoji">{item.emoji}</span>
                  <span className="avatar-name">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Companion / Pet */}
          <div className="form-group">
            <label className="form-label">Companion or Favorite Toy</label>
            <input
              type="text"
              className="input-text"
              placeholder="e.g. a golden puppy named Pip, my cozy teddy bear..."
              value={companion}
              onChange={(e) => setCompanion(e.target.value)}
            />
          </div>

          {/* Life Virtue / Theme */}
          <div className="form-group">
            <label className="form-label">Bedtime Moral & Virtue</label>
            <div className="pill-grid">
              {THEMES.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`choice-pill ${theme === item.id ? 'active' : ''}`}
                  onClick={() => setTheme(item.id)}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dream World / Setting */}
          <div className="form-group">
            <label className="form-label">Dream Setting</label>
            <div className="pill-grid">
              {SETTINGS.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`choice-pill ${setting === item.id ? 'active' : ''}`}
                  onClick={() => setSetting(item.id)}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {errorMsg && <p className="form-error">{errorMsg}</p>}

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-create-submit"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Wand2 size={18} className="spin-slow" />
                  <span>Weaving Bedtime Magic...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Create {childName}’s Bedtime Story</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
