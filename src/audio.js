// Web Audio Engine: Music Player + Real-Time FFT Analyzer + Cinematic Sound Effects Synthesizer

class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.audioElement = new Audio();
    this.audioElement.src = '/loser.m4a';
    this.audioElement.preload = 'auto';
    this.audioElement.crossOrigin = 'anonymous';

    this.analyser = null;
    this.sourceNode = null;
    this.gainNode = null;
    this.bassFilter = null;

    this.isInitialized = false;
    this.isPlaying = false;
    this.bassBoostActive = true;
    this.volume = 0.85;

    // Real-time analysis buffer
    this.frequencyData = null;
    this.waveformData = null;
    this.bassEnergy = 0;
    this.midEnergy = 0;
    this.trebleEnergy = 0;

    // Wind noise node references
    this.windGain = null;
    this.windFilter = null;
  }

  init() {
    if (this.isInitialized) return;

    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      // Master Gain
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = this.volume;

      // Bass Boost filter
      this.bassFilter = this.audioCtx.createBiquadFilter();
      this.bassFilter.type = 'lowshelf';
      this.bassFilter.frequency.value = 160;
      this.bassFilter.gain.value = this.bassBoostActive ? 6.5 : 0; // Cinematic low-end punch

      // Analyser Node
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      const bufferLength = this.analyser.frequencyBinCount;
      this.frequencyData = new Uint8Array(bufferLength);
      this.waveformData = new Uint8Array(bufferLength);

      // Connect MediaElementSource
      try {
        this.sourceNode = this.audioCtx.createMediaElementSource(this.audioElement);
        this.sourceNode.connect(this.bassFilter);
        this.bassFilter.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
      } catch (err) {
        console.warn("MediaElementSource connection fallback:", err);
      }

      this.initAtmosphericWind();
      this.isInitialized = true;
      console.log("Audio Engine initialized successfully with Loser track.");
    } catch (e) {
      console.error("AudioContext initialization error:", e);
    }
  }

  async play() {
    if (!this.isInitialized) this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
    try {
      await this.audioElement.play();
      this.isPlaying = true;
    } catch (e) {
      console.warn("Autoplay was prevented, waiting for user gesture:", e);
    }
  }

  pause() {
    this.audioElement.pause();
    this.isPlaying = false;
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  seek(fraction) {
    if (this.audioElement.duration) {
      this.audioElement.currentTime = fraction * this.audioElement.duration;
    }
  }

  seekToSeconds(seconds) {
    if (this.audioElement.duration) {
      this.audioElement.currentTime = Math.min(seconds, this.audioElement.duration);
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    } else {
      this.audioElement.volume = this.volume;
    }
  }

  toggleBassBoost() {
    this.bassBoostActive = !this.bassBoostActive;
    if (this.bassFilter && this.audioCtx) {
      this.bassFilter.gain.setTargetAtTime(this.bassBoostActive ? 6.5 : 0, this.audioCtx.currentTime, 0.1);
    }
    return this.bassBoostActive;
  }

  updateMetrics() {
    if (!this.analyser || !this.frequencyData) return;
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.waveformData);

    // Calculate energy bands (0-1 range)
    let bSum = 0, mSum = 0, tSum = 0;
    const len = this.frequencyData.length;
    const bassEnd = Math.floor(len * 0.15);
    const midEnd = Math.floor(len * 0.55);

    for (let i = 0; i < len; i++) {
      const val = this.frequencyData[i] / 255;
      if (i < bassEnd) bSum += val;
      else if (i < midEnd) mSum += val;
      else tSum += val;
    }

    this.bassEnergy = bSum / (bassEnd || 1);
    this.midEnergy = mSum / ((midEnd - bassEnd) || 1);
    this.trebleEnergy = tSum / ((len - midEnd) || 1);
  }

  /* ---------------- Atmospheric High-Altitude Wind Generator ---------------- */
  initAtmosphericWind() {
    if (!this.audioCtx) return;
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    this.windFilter = this.audioCtx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.value = 320;
    this.windFilter.Q.value = 1.8;

    this.windGain = this.audioCtx.createGain();
    this.windGain.gain.value = 0.0001;

    whiteNoise.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.gainNode);
    whiteNoise.start();
  }

  setWindIntensity(intensity, duration = 0.5) {
    if (!this.windGain || !this.audioCtx) return;
    const target = Math.max(0.0001, Math.min(0.35, intensity));
    this.windGain.gain.setTargetAtTime(target, this.audioCtx.currentTime, duration);
    if (this.windFilter) {
      this.windFilter.frequency.setTargetAtTime(280 + intensity * 600, this.audioCtx.currentTime, duration);
    }
  }

  /* ---------------- Synthesized Cinematic Sound Effects ---------------- */

  // Tension Heartbeat (deep sub thump)
  playHeartbeat() {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.18);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.gainNode);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Metallic chains clinking & dropping
  playChainsRattle() {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const freqs = [1200, 1850, 2400, 3100];

    freqs.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() * 200 - 100), now);

      gain.gain.setValueAtTime(0.2, now + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.15);

      osc.connect(gain);
      gain.connect(this.gainNode);
      osc.start(now + idx * 0.03);
      osc.stop(now + idx * 0.03 + 0.18);
    });
  }

  // Heavy chains break and hit floor
  playChainsDrop() {
    this.playChainsRattle();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.gainNode);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Tactical arming beep + mechanical switch click
  playDetonatorClick() {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    // High tech beep
    const beepOsc = this.audioCtx.createOscillator();
    const beepGain = this.audioCtx.createGain();
    beepOsc.type = 'sine';
    beepOsc.frequency.setValueAtTime(2800, now);
    beepGain.gain.setValueAtTime(0.25, now);
    beepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    beepOsc.connect(beepGain);
    beepGain.connect(this.gainNode);
    beepOsc.start(now);
    beepOsc.stop(now + 0.07);

    // Metallic thumb switch click
    const clickOsc = this.audioCtx.createOscillator();
    const clickGain = this.audioCtx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(800, now + 0.07);
    clickOsc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
    clickGain.gain.setValueAtTime(0.4, now + 0.07);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    clickOsc.connect(clickGain);
    clickGain.connect(this.gainNode);
    clickOsc.start(now + 0.07);
    clickOsc.stop(now + 0.15);
  }

  // TITANIC DEMON SLAYER EXPLOSION (Anime Flame Shockwave)
  playDemonSlayerExplosion() {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    // 1. Vacuum / Inhale whoosh right before blast
    const suckOsc = this.audioCtx.createOscillator();
    const suckGain = this.audioCtx.createGain();
    suckOsc.type = 'sine';
    suckOsc.frequency.setValueAtTime(240, now);
    suckOsc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
    suckGain.gain.setValueAtTime(0.3, now);
    suckGain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    suckOsc.connect(suckGain);
    suckGain.connect(this.gainNode);
    suckOsc.start(now);
    suckOsc.stop(now + 0.2);

    // 2. Colossal Sub-Bass Shockwave (30Hz - 60Hz)
    const subOsc = this.audioCtx.createOscillator();
    const subGain = this.audioCtx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(95, now + 0.16);
    subOsc.frequency.exponentialRampToValueAtTime(24, now + 2.2);
    subGain.gain.setValueAtTime(1.0, now + 0.16);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    subOsc.connect(subGain);
    subGain.connect(this.gainNode);
    subOsc.start(now + 0.16);
    subOsc.stop(now + 2.6);

    // 3. Flame Burst Distortion / Roar
    const roarBuffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate * 2.5, this.audioCtx.sampleRate);
    const roarData = roarBuffer.getChannelData(0);
    for (let i = 0; i < roarData.length; i++) {
      roarData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.audioCtx.sampleRate * 0.9));
    }
    const roarSource = this.audioCtx.createBufferSource();
    roarSource.buffer = roarBuffer;

    const roarFilter = this.audioCtx.createBiquadFilter();
    roarFilter.type = 'lowpass';
    roarFilter.frequency.setValueAtTime(3500, now + 0.16);
    roarFilter.frequency.exponentialRampToValueAtTime(200, now + 2.2);

    const roarGain = this.audioCtx.createGain();
    roarGain.gain.setValueAtTime(0.8, now + 0.16);
    roarGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

    roarSource.connect(roarFilter);
    roarFilter.connect(roarGain);
    roarGain.connect(this.gainNode);
    roarSource.start(now + 0.16);

    // 4. Sonic Boom Shackle
    const crackOsc = this.audioCtx.createOscillator();
    const crackGain = this.audioCtx.createGain();
    crackOsc.type = 'sawtooth';
    crackOsc.frequency.setValueAtTime(800, now + 0.16);
    crackOsc.frequency.exponentialRampToValueAtTime(50, now + 0.45);
    crackGain.gain.setValueAtTime(0.65, now + 0.16);
    crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    crackOsc.connect(crackGain);
    crackGain.connect(this.gainNode);
    crackOsc.start(now + 0.16);
    crackOsc.stop(now + 0.55);
  }

  // Gunshot
  playGunshot() {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.gainNode);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Glass shatter
  playGlassShatter() {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2200 + Math.random() * 2500, now + i * 0.02);
      gain.gain.setValueAtTime(0.2, now + i * 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.02 + 0.2);
      osc.connect(gain);
      gain.connect(this.gainNode);
      osc.start(now + i * 0.02);
      osc.stop(now + i * 0.02 + 0.25);
    }
  }
}

export const audioManager = new AudioManager();
