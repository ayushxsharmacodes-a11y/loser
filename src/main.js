import { createIcons, Play, Pause, Zap, Gauge, Camera, Palette, ShieldAlert, Shield, Users, RotateCcw, BookmarkPlus, PlayCircle, Music } from 'lucide';
import { ThreeSceneManager } from './threeScene.js';
import { audioManager } from './audio.js';
import { CinematicSequencer } from './cinematicSequencer.js';
import { characters } from './charactersData.js';

// Initialize Lucide Icons
function initIcons() {
  createIcons({
    icons: {
      Play,
      Pause,
      Zap,
      Gauge,
      Camera,
      Palette,
      ShieldAlert,
      Shield,
      Users,
      RotateCcw,
      BookmarkPlus,
      PlayCircle,
      Music
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initIcons();

  // DOM Elements
  const canvas = document.getElementById('webgl-canvas');
  const soundOverlay = document.getElementById('sound-overlay');
  const btnStart = document.getElementById('btn-start-experience');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const playIcon = document.getElementById('play-icon');
  const timelineBar = document.getElementById('timeline-bar');
  const timelineFill = document.getElementById('timeline-fill');
  const timeCurrent = document.getElementById('time-current');
  const timeDuration = document.getElementById('time-duration');
  const visualizerCanvas = document.getElementById('audio-visualizer');
  const visualizerCtx = visualizerCanvas ? visualizerCanvas.getContext('2d') : null;

  // Subtitles & HUD Elements
  const subtitlesBox = document.getElementById('subtitles-box');
  const speakerBadge = document.getElementById('speaker-badge');
  const subtitleText = document.getElementById('subtitle-text');
  const hudAltitude = document.getElementById('hud-altitude');
  const hudSpeed = document.getElementById('hud-speed');
  const hudHeart = document.getElementById('hud-heart');
  const hudStatus = document.getElementById('hud-status');
  const qteContainer = document.getElementById('qte-container');
  const detonatorBtn = document.getElementById('detonator-btn');
  const flashFx = document.getElementById('flash-fx');
  const titleRevealScreen = document.getElementById('title-reveal-screen');

  // Dossier Modal Elements
  const dossierModal = document.getElementById('dossier-modal');
  const btnOpenDossier = document.getElementById('btn-open-dossier');
  const btnCloseDossier = document.getElementById('btn-close-dossier');
  const charTabs = document.getElementById('char-tabs');
  const charPortraitContainer = document.getElementById('char-portrait-container');
  const charDetailsContainer = document.getElementById('char-details-container');

  // Director Buttons
  const btnBassBoost = document.getElementById('btn-bass-boost');
  const btnSlowmo = document.getElementById('btn-slowmo');
  const slowmoLabel = document.getElementById('slowmo-label');
  const btnFreecam = document.getElementById('btn-freecam');
  const btnFilter = document.getElementById('btn-filter');
  const filterLabel = document.getElementById('filter-label');
  const btnReplay = document.getElementById('btn-replay');
  const btnReplayReveal = document.getElementById('btn-replay-reveal');
  const btnDossierReveal = document.getElementById('btn-dossier-reveal');
  const btnWishlist = document.getElementById('btn-wishlist');

  // Initialize 3D Engine
  const threeScene = new ThreeSceneManager(canvas);
  threeScene.animate();

  // UI Callbacks for Sequencer
  const uiCallbacks = {
    updateSubtitles: (speaker, text) => {
      if (!speaker && !text) {
        subtitlesBox.style.opacity = '0';
        return;
      }
      subtitlesBox.style.opacity = '1';
      speakerBadge.textContent = speaker;
      subtitleText.textContent = `"${text}"`;
    },
    updateTelemetry: (telem) => {
      if (!telem) return;
      if (telem.alt) hudAltitude.textContent = telem.alt;
      if (telem.speed) hudSpeed.textContent = telem.speed;
      if (telem.heart) hudHeart.textContent = telem.heart;
      if (telem.status) hudStatus.textContent = telem.status;
    },
    showQTE: (active) => {
      if (active) {
        qteContainer.classList.add('active');
      } else {
        qteContainer.classList.remove('active');
      }
    },
    triggerFlash: () => {
      flashFx.style.opacity = '0.95';
      setTimeout(() => {
        flashFx.style.opacity = '0';
      }, 120);
    },
    showEndCard: (visible) => {
      if (visible) {
        titleRevealScreen.classList.add('visible');
      } else {
        titleRevealScreen.classList.remove('visible');
      }
    }
  };

  // Initialize Sequencer
  const sequencer = new CinematicSequencer(threeScene, uiCallbacks);

  // Time Formatter (mm:ss)
  function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // Visualizer Canvas Dimensions
  if (visualizerCanvas) {
    visualizerCanvas.width = 140;
    visualizerCanvas.height = 28;
  }

  // Draw Audio Visualizer Loop
  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    if (!visualizerCtx || !audioManager.frequencyData) return;

    visualizerCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    const bufferLength = audioManager.frequencyData.length;
    const barWidth = 4;
    const barGap = 2;
    const totalBars = Math.floor(visualizerCanvas.width / (barWidth + barGap));
    const step = Math.floor(bufferLength / totalBars);

    for (let i = 0; i < totalBars; i++) {
      const val = audioManager.frequencyData[i * step] || 0;
      const barHeight = Math.max(3, (val / 255) * visualizerCanvas.height);
      const x = i * (barWidth + barGap);
      const y = visualizerCanvas.height - barHeight;

      const grad = visualizerCtx.createLinearGradient(0, y, 0, visualizerCanvas.height);
      grad.addColorStop(0, '#ff1e42');
      grad.addColorStop(1, '#ff9100');
      visualizerCtx.fillStyle = grad;
      visualizerCtx.fillRect(x, y, barWidth, barHeight);
    }
  }
  drawVisualizer();

  // Audio Update Event (Sync Timeline & Sequencer)
  audioManager.audioElement.addEventListener('timeupdate', () => {
    const cur = audioManager.audioElement.currentTime;
    const dur = audioManager.audioElement.duration || 170; // fallback duration
    timeCurrent.textContent = formatTime(cur);
    timeDuration.textContent = formatTime(dur);

    const fraction = dur > 0 ? (cur / dur) : 0;
    timelineFill.style.width = `${fraction * 100}%`;

    sequencer.update(cur, dur);
  });

  // Start Experience Overlay Button (Mouse & Touch)
  const handleStart = async (e) => {
    if (e) e.preventDefault();
    soundOverlay.classList.add('hidden');
    audioManager.init();
    await audioManager.play();
    updatePlayIcon(true);
    if ('vibrate' in navigator) navigator.vibrate(60);
  };
  btnStart.addEventListener('click', handleStart);
  btnStart.addEventListener('touchend', handleStart);

  // Play / Pause Toggle
  function updatePlayIcon(isPlaying) {
    if (isPlaying) {
      btnPlayPause.innerHTML = '<i data-lucide="pause"></i>';
    } else {
      btnPlayPause.innerHTML = '<i data-lucide="play"></i>';
    }
    initIcons();
  }

  btnPlayPause.addEventListener('click', () => {
    const playing = audioManager.togglePlay();
    updatePlayIcon(playing);
    if ('vibrate' in navigator) navigator.vibrate(35);
  });

  // Replay buttons
  function replayExperience() {
    titleRevealScreen.classList.remove('visible');
    sequencer.hasDetonatedQTE = false;
    audioManager.seekToSeconds(0);
    audioManager.play();
    updatePlayIcon(true);
    if ('vibrate' in navigator) navigator.vibrate([40, 40, 80]);
  }

  btnReplay.addEventListener('click', replayExperience);
  btnReplayReveal.addEventListener('click', replayExperience);

  // Timeline Scrubber Click & Drag (Mouse + Touch)
  let isDraggingTimeline = false;
  function handleTimelineScrub(e) {
    const rect = timelineBar.getBoundingClientRect();
    const clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX;
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const fraction = clickX / rect.width;
    timelineFill.style.width = `${fraction * 100}%`;
    audioManager.seek(fraction);
  }

  timelineBar.addEventListener('mousedown', (e) => {
    isDraggingTimeline = true;
    handleTimelineScrub(e);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDraggingTimeline) handleTimelineScrub(e);
  });

  window.addEventListener('mouseup', () => {
    isDraggingTimeline = false;
  });

  // Touch Scrubber for Mobile
  timelineBar.addEventListener('touchstart', (e) => {
    isDraggingTimeline = true;
    handleTimelineScrub(e);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isDraggingTimeline) {
      handleTimelineScrub(e);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDraggingTimeline = false;
  });

  // Interactive QTE Detonator Click & Touch with Haptics
  const handleQTETrigger = (e) => {
    if (e) e.preventDefault();
    if ('vibrate' in navigator) {
      // Powerful triple pulse haptic vibration pattern for phone!
      navigator.vibrate([80, 50, 150, 50, 300]);
    }
    sequencer.triggerQTEAction();
  };

  detonatorBtn.addEventListener('click', handleQTETrigger);
  detonatorBtn.addEventListener('touchstart', handleQTETrigger);

  // Keyboard Shortcuts: Space (QTE or Play), Escape (close modal), D (Dossier)
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (sequencer.isQTEPending) {
        sequencer.triggerQTEAction();
      } else {
        const playing = audioManager.togglePlay();
        updatePlayIcon(playing);
      }
    } else if (e.code === 'Escape') {
      dossierModal.classList.remove('active');
    } else if (e.code === 'KeyD') {
      dossierModal.classList.toggle('active');
    }
  });

  // Director Controls: Bass Boost Toggle
  btnBassBoost.addEventListener('click', () => {
    const active = audioManager.toggleBassBoost();
    btnBassBoost.innerHTML = `<i data-lucide="zap"></i><span>BASS PUNCH: ${active ? 'ON' : 'OFF'}</span>`;
    if (active) {
      btnBassBoost.classList.add('active');
    } else {
      btnBassBoost.classList.remove('active');
    }
    initIcons();
  });

  // Director Controls: Slow-Mo (1x -> 0.25x -> 2.0x)
  let speedModes = [1.0, 0.25, 2.0];
  let speedLabels = ["1.0x SPEED", "0.25x SLOW-MO", "2.0x FAST"];
  let speedIdx = 0;
  btnSlowmo.addEventListener('click', () => {
    speedIdx = (speedIdx + 1) % speedModes.length;
    const rate = speedModes[speedIdx];
    audioManager.audioElement.playbackRate = rate;
    slowmoLabel.textContent = speedLabels[speedIdx];
    btnSlowmo.classList.toggle('active', rate !== 1.0);
  });

  // Director Controls: Free-Cam Toggle
  btnFreecam.addEventListener('click', () => {
    threeScene.freeCam = !threeScene.freeCam;
    btnFreecam.classList.toggle('active', threeScene.freeCam);
  });

  // Director Controls: Visual Filter Presets
  const filters = [
    { name: "CYBER HDR", css: "none" },
    { name: "NEON 2077", css: "hue-rotate(280deg) saturate(1.8) contrast(1.2)" },
    { name: "DEMON SLAYER", css: "saturate(2.2) contrast(1.4) drop-shadow(0 0 10px rgba(255,30,66,0.3))" },
    { name: "NOIR 35MM", css: "grayscale(1) contrast(1.6) brightness(0.9)" }
  ];
  let filterIdx = 0;
  btnFilter.addEventListener('click', () => {
    filterIdx = (filterIdx + 1) % filters.length;
    const chosen = filters[filterIdx];
    canvas.style.filter = chosen.css;
    filterLabel.textContent = chosen.name;
    btnFilter.classList.toggle('active', filterIdx !== 0);
  });

  // Character Dossier Modal Setup
  function renderCharacter(charId) {
    const char = characters.find(c => c.id === charId) || characters[0];

    // Update Tab Buttons
    document.querySelectorAll('.char-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === char.id);
    });

    // Render Portrait SVG
    charPortraitContainer.innerHTML = char.svgPortrait;

    // Render Character Details
    charDetailsContainer.innerHTML = `
      <div>
        <div class="char-alias">${char.alias}</div>
        <h2 class="char-name">${char.name}</h2>
        <div style="font-family:var(--font-cyber); font-size:0.75rem; color:${char.accentColor}; margin-top:0.3rem;">
          ${char.role}
        </div>
      </div>

      <div style="font-style:italic; color:#e0e5f2; border-left:2px solid ${char.accentColor}; padding-left:1rem; font-size:0.95rem;">
        ${char.quote}
      </div>

      <p class="char-bio">${char.bio}</p>

      <div class="char-stats-grid">
        ${Object.entries(char.stats).map(([k, v]) => `
          <div class="stat-item">
            <div class="stat-title">${k.replace(/([A-Z])/g, ' $1')}</div>
            <div class="stat-val" style="color:${char.accentColor}">${v}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Build Tabs
  charTabs.innerHTML = characters.map(c => `
    <button class="char-tab-btn ${c.id === 'kai' ? 'active' : ''}" data-id="${c.id}">
      ${c.name}
    </button>
  `).join('');

  charTabs.querySelectorAll('.char-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => renderCharacter(btn.dataset.id));
  });

  renderCharacter('kai');

  // Open / Close Modal
  btnOpenDossier.addEventListener('click', () => dossierModal.classList.add('active'));
  btnDossierReveal.addEventListener('click', () => dossierModal.classList.add('active'));
  btnCloseDossier.addEventListener('click', () => dossierModal.classList.remove('active'));
  dossierModal.addEventListener('click', (e) => {
    if (e.target === dossierModal) dossierModal.classList.remove('active');
  });

  // Wishlist Button Feedback
  btnWishlist.addEventListener('click', () => {
    btnWishlist.innerHTML = '<i data-lucide="check"></i><span>ADDED TO WISHLIST!</span>';
    btnWishlist.style.background = '#28a745';
    initIcons();
  });
});
