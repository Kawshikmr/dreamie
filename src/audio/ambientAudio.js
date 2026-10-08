/**
 * Dreamie Web Audio Synthesizer
 * Zero-dependency procedural bedtime soundscape generator.
 * Produces seamless, calming ambient sleep audio (Rain, Ocean, Crickets, Wind, Music Box).
 */

class AmbientSoundEngine {
  constructor() {
    this.ctx = null;
    this.activePreset = null;
    this.masterGain = null;
    this.activeNodes = [];
    this.musicBoxTimer = null;
    this.volume = 0.4;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  stop() {
    if (this.musicBoxTimer) {
      clearInterval(this.musicBoxTimer);
      this.musicBoxTimer = null;
    }

    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // Ignore already stopped nodes
      }
    });
    this.activeNodes = [];
    this.activePreset = null;
  }

  createNoiseBuffer(type = 'pink') {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    } else {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return buffer;
  }

  playRain() {
    this.init();
    this.stop();
    this.activePreset = 'rain';

    const noiseBuffer = this.createNoiseBuffer('pink');
    if (!noiseBuffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter to simulate soft raindrops
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(800, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(120, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    noiseSource.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(rainGain);
    rainGain.connect(this.masterGain);

    noiseSource.start();
    this.activeNodes.push(noiseSource, lowpass, highpass, rainGain);
  }

  playOcean() {
    this.init();
    this.stop();
    this.activePreset = 'ocean';

    const noiseBuffer = this.createNoiseBuffer('pink');
    if (!noiseBuffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Lowpass filter for deep ocean sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    // LFO for wave ebb and flow (~0.1Hz = 10 second wave cycle)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.09, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.45, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    noiseSource.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);

    noiseSource.start();
    lfo.start();
    this.activeNodes.push(noiseSource, filter, lfo, lfoGain, waveGain);
  }

  playWind() {
    this.init();
    this.stop();
    this.activePreset = 'wind';

    const noiseBuffer = this.createNoiseBuffer('brown');
    if (!noiseBuffer) return;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);

    // Subtle gentle sweep
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.6, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);

    noiseSource.start();
    lfo.start();
    this.activeNodes.push(noiseSource, filter, lfo, lfoGain, windGain);
  }

  playCrickets() {
    this.init();
    this.stop();
    this.activePreset = 'crickets';

    // Night crickets using fast pulsed carrier frequencies
    const carrier = this.ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(4600, this.ctx.currentTime);

    const modulator = this.ctx.createOscillator();
    modulator.type = 'sawtooth';
    modulator.frequency.setValueAtTime(45, this.ctx.currentTime);

    const modGain = this.ctx.createGain();
    modGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    const rhythmOsc = this.ctx.createOscillator();
    rhythmOsc.type = 'square';
    rhythmOsc.frequency.setValueAtTime(2.5, this.ctx.currentTime);

    const cricketGain = this.ctx.createGain();
    cricketGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    rhythmOsc.connect(cricketGain.gain);

    carrier.connect(cricketGain);
    cricketGain.connect(this.masterGain);

    carrier.start();
    modulator.start();
    rhythmOsc.start();
    this.activeNodes.push(carrier, modulator, modGain, rhythmOsc, cricketGain);
  }

  playMusicBox() {
    this.init();
    this.stop();
    this.activePreset = 'musicbox';

    // Soothing pentatonic notes (C4, D4, E4, G4, A4, C5)
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33];
    let noteIdx = 0;

    const playChime = () => {
      if (!this.ctx || this.activePreset !== 'musicbox') return;

      const freq = notes[noteIdx % notes.length];
      noteIdx = (noteIdx + Math.floor(Math.random() * 2) + 1) % notes.length;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 2.6);
    };

    // Trigger gentle chime every ~2 seconds
    playChime();
    this.musicBoxTimer = setInterval(playChime, 2200);
  }

  playPreset(preset) {
    if (this.activePreset === preset) {
      this.stop();
      return false;
    }

    switch (preset) {
      case 'rain': this.playRain(); break;
      case 'ocean': this.playOcean(); break;
      case 'wind': this.playWind(); break;
      case 'crickets': this.playCrickets(); break;
      case 'musicbox': this.playMusicBox(); break;
      default: this.stop(); return false;
    }
    return true;
  }
}

export const ambientSound = new AmbientSoundEngine();
