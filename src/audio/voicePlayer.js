/**
 * Dreamie Voice Narration Player
 * Supports Edge-TTS Neural Audio via backend and seamless Web Speech API offline fallback.
 */

class VoiceNarrationPlayer {
  constructor() {
    this.audioElement = new Audio();
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.mode = 'idle'; // 'audio_file' | 'synth' | 'idle'
    this.isPlaying = false;
    this.isBuffering = false;
    this.playbackRate = 1.0;
    this.volume = 1.0;
    this.currentStory = null;
    this.selectedVoice = 'en-US-JennyNeural';
    this.onProgressCallback = null;
    this.onStateChangeCallback = null;

    // Audio element bindings
    this.audioElement.addEventListener('timeupdate', () => {
      if (this.onProgressCallback) {
        this.onProgressCallback({
          currentTime: this.audioElement.currentTime,
          duration: this.audioElement.duration || 1,
          progress: (this.audioElement.currentTime / (this.audioElement.duration || 1)) * 100
        });
      }
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.mode = 'idle';
      this._notifyState();
    });

    this.audioElement.addEventListener('waiting', () => {
      this.isBuffering = true;
      this._notifyState();
    });

    this.audioElement.addEventListener('canplay', () => {
      this.isBuffering = false;
      this._notifyState();
    });
  }

  setCallbacks({ onProgress, onStateChange }) {
    this.onProgressCallback = onProgress;
    this.onStateChangeCallback = onStateChange;
  }

  _notifyState() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({
        isPlaying: this.isPlaying,
        isBuffering: this.isBuffering,
        mode: this.mode,
        playbackRate: this.playbackRate,
        volume: this.volume
      });
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.audioElement.volume = this.volume;
    this._notifyState();
  }

  setPlaybackRate(rate) {
    this.playbackRate = rate;
    this.audioElement.playbackRate = rate;
    if (this.currentUtterance) {
      this.currentUtterance.rate = rate;
    }
    this._notifyState();
  }

  async playStory(story, voiceId = 'en-US-JennyNeural') {
    this.stop();
    this.currentStory = story;
    this.selectedVoice = voiceId;
    this.isBuffering = true;
    this._notifyState();

    // 1. First attempt: call Backend Edge-TTS
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: story.story,
          voice: voiceId,
          rate: '-8%' // Bedtime soothing pace
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioUrl) {
          this.mode = 'audio_file';
          this.audioElement.src = data.audioUrl;
          this.audioElement.playbackRate = this.playbackRate;
          this.audioElement.volume = this.volume;
          await this.audioElement.play();
          this.isPlaying = true;
          this.isBuffering = false;
          this._notifyState();
          return;
        }
      }
    } catch (err) {
      console.warn('[Dreamie] Edge-TTS backend unreachable, using Web Speech API fallback', err);
    }

    // 2. Fallback: Browser Web Speech API
    this.playWithWebSpeech(story.story);
  }

  playWithWebSpeech(text) {
    if (!this.synth) return;
    this.synth.cancel();

    this.mode = 'synth';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.playbackRate * 0.88; // Slightly slower for bedtime
    utterance.pitch = 1.0;

    // Pick best available English voice in browser
    const voices = this.synth.getVoices();
    const friendlyVoice = voices.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Google') || 
      v.name.includes('Jenny') || 
      v.name.includes('Samantha') || 
      (v.lang.startsWith('en') && v.name.includes('Female'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (friendlyVoice) utterance.voice = friendlyVoice;

    utterance.onstart = () => {
      this.isPlaying = true;
      this.isBuffering = false;
      this._notifyState();
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.mode = 'idle';
      this._notifyState();
    };

    utterance.onerror = () => {
      this.isPlaying = false;
      this.isBuffering = false;
      this._notifyState();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  togglePlayPause() {
    if (this.mode === 'audio_file') {
      if (this.isPlaying) {
        this.audioElement.pause();
        this.isPlaying = false;
      } else {
        this.audioElement.play();
        this.isPlaying = true;
      }
      this._notifyState();
    } else if (this.mode === 'synth' && this.synth) {
      if (this.synth.speaking) {
        if (this.synth.paused) {
          this.synth.resume();
          this.isPlaying = true;
        } else {
          this.synth.pause();
          this.isPlaying = false;
        }
        this._notifyState();
      }
    }
  }

  seekRelative(seconds) {
    if (this.mode === 'audio_file' && this.audioElement.duration) {
      this.audioElement.currentTime = Math.max(0, Math.min(this.audioElement.duration, this.audioElement.currentTime + seconds));
    }
  }

  seekPercent(percent) {
    if (this.mode === 'audio_file' && this.audioElement.duration) {
      this.audioElement.currentTime = (percent / 100) * this.audioElement.duration;
    }
  }

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if (this.synth) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.isBuffering = false;
    this.mode = 'idle';
    this._notifyState();
  }

  fadeOutAndStop(durationSeconds = 15) {
    if (!this.isPlaying) return;
    const initialVol = this.audioElement.volume;
    const steps = 30;
    const intervalTime = (durationSeconds * 1000) / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const factor = 1 - (stepCount / steps);
      this.setVolume(initialVol * factor);

      if (stepCount >= steps) {
        clearInterval(timer);
        this.stop();
        this.setVolume(initialVol); // Reset for next time
      }
    }, intervalTime);
  }
}

export const voicePlayer = new VoiceNarrationPlayer();
