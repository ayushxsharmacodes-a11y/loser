import gsap from 'gsap';
import { audioManager } from './audio.js';

export const SCENES = [
  {
    id: "prologue",
    timeStart: 0,
    timeEnd: 14,
    mode: "intro",
    speaker: "CLASSIFIED DOSSIER // INTERPOL BLACK FILE",
    text: "They called him a ghost. An outcast. An impossible problem. They called him... 'Loser'.",
    telemetry: { alt: "0 FT", speed: "STATIONARY", heart: "82 BPM", status: "STANDBY" }
  },
  {
    id: "chase",
    timeStart: 14,
    timeEnd: 32,
    mode: "chase",
    speaker: "VALENTINA // THE WHEELWOMAN",
    text: "Hang on tight, Kai! Three syndicate interceptors on our six—taking the overpass drift at 200 NOW!",
    sfx: "engine",
    telemetry: { alt: "120 FT", speed: "214 MPH", heart: "115 BPM", status: "PURSUIT ACTIVE" }
  },
  {
    id: "combat",
    timeStart: 32,
    timeEnd: 50,
    mode: "combat",
    speaker: "MAYA // GHOST INFILTRATOR",
    text: "Target heading for rooftop heli-pad! Kai, catch him mid-air before the chopper clears the skyline!",
    sfx: "glass",
    telemetry: { alt: "1,450 FT", speed: "SPRINT", heart: "142 BPM", status: "ENGAGING ENEMY" }
  },
  {
    id: "plane_edge",
    timeStart: 50,
    timeEnd: 72,
    mode: "plane",
    speaker: "MISSION 07 // AIRBORNE FORTRESS 'LEVIATHAN'",
    text: "Altitude: 35,000 feet. Sub-zero blizzard. Chained at the open cargo ramp into seven miles of abyss.",
    sfx: "wind",
    telemetry: { alt: "35,000 FT", speed: "520 KTS", heart: "78 BPM", status: "IN CHAINS" }
  },
  {
    id: "zane_threat",
    timeStart: 72,
    timeEnd: 88,
    mode: "plane",
    speaker: "VIKTOR ZANE // SYNDICATE OVERLORD",
    text: "Look at you, Loser. Chained at the edge of the sky. No parachute. Nowhere left to run. Any last words?",
    sfx: "heartbeat",
    telemetry: { alt: "35,000 FT", speed: "520 KTS", heart: "52 BPM [CALM]", status: "SURROUNDED" }
  },
  {
    id: "hero_smile",
    timeStart: 88,
    timeEnd: 104,
    mode: "plane",
    speaker: "AGENT KAI // 'LOSER'",
    text: "Kai slowly lifts his gaze into the howling gale... and smiles a faint, lethal smirk.",
    sfx: "chains",
    telemetry: { alt: "35,000 FT", speed: "520 KTS", heart: "46 BPM [DEAD CALM]", status: "THE TURN" }
  },
  {
    id: "panic_chutes",
    timeStart: 104,
    timeEnd: 114,
    mode: "plane",
    speaker: "SYNDICATE LIEUTENANT // PANIC",
    text: "WAIT! WHY IS HE SMILING?! HE DIDN'T GET CAUGHT—HE BROUGHT THE WHOLE JET DOWN! GET TO THE CHUTES NOW!!",
    sfx: "panic",
    telemetry: { alt: "35,000 FT", speed: "DIVE", heart: "185 BPM [ENEMY PANIC]", status: "SCRAMBLE" }
  },
  {
    id: "qte_detonate",
    timeStart: 114,
    timeEnd: 125,
    mode: "qte",
    speaker: "THE FINAL GAMBIT",
    text: "In one impossible flick, the heavy chains drop. His thumb hits the trigger. He falls backwards into the void.",
    isQTE: true,
    telemetry: { alt: "35,000 FT", speed: "ZERO-G", heart: "45 BPM", status: "DETONATION IMMINENT" }
  },
  {
    id: "blast",
    timeStart: 125,
    timeEnd: 145,
    mode: "blast",
    speaker: "DETONATION // HINOKAMI BLAST",
    text: "A blinding Demon Slayer-style apocalyptic fireball obliterates the aircraft, shockwaves ripping across the stratosphere!",
    sfx: "explosion",
    telemetry: { alt: "34,800 FT", speed: "MACH 3 SHOCKWAVE", heart: "42 BPM", status: "TARGET ANNIHILATED" }
  },
  {
    id: "freefall",
    timeStart: 145,
    timeEnd: 170,
    mode: "freefall",
    speaker: "NARRATION",
    text: "Freefalling through drifting ash and silver clouds. He smiled peacefully... because he won. (But at what cost?)",
    telemetry: { alt: "22,000 FT", speed: "174 MPH TERMINAL", heart: "44 BPM", status: "VICTORY AT WHAT COST" }
  },
  {
    id: "end_reveal",
    timeStart: 170,
    timeEnd: 9999,
    mode: "end",
    speaker: "",
    text: "",
    isEndCard: true,
    telemetry: { alt: "CLASSIFIED", speed: "0", heart: "--", status: "MISSION COMPLETE" }
  }
];

export class CinematicSequencer {
  constructor(threeScene, uiCallbacks) {
    this.threeScene = threeScene;
    this.ui = uiCallbacks;
    this.currentSceneIndex = -1;
    this.hasDetonatedQTE = false;
    this.isQTEPending = false;
  }

  update(currentTime, duration) {
    // Determine active scene based on currentTime
    let activeIndex = 0;
    for (let i = 0; i < SCENES.length; i++) {
      if (currentTime >= SCENES[i].timeStart && currentTime < SCENES[i].timeEnd) {
        activeIndex = i;
        break;
      }
    }

    if (activeIndex !== this.currentSceneIndex) {
      this.onSceneTransition(activeIndex);
    }

    // Dynamic wind modulation based on altitude
    const scene = SCENES[this.currentSceneIndex];
    if (scene) {
      if (scene.mode === 'plane' || scene.mode === 'qte') {
        audioManager.setWindIntensity(0.28, 0.4);
      } else if (scene.mode === 'freefall') {
        audioManager.setWindIntensity(0.2, 0.6);
      } else {
        audioManager.setWindIntensity(0.001, 1.0);
      }
    }
  }

  onSceneTransition(index) {
    this.currentSceneIndex = index;
    const scene = SCENES[index];
    if (!scene) return;

    console.log(`Transitioning to scene [${index}]: ${scene.id}`);

    // Update ThreeScene 3D mode
    this.threeScene.setMode(scene.mode);

    // Update UI Subtitles & Speaker
    this.ui.updateSubtitles(scene.speaker, scene.text);
    this.ui.updateTelemetry(scene.telemetry);

    // Handle special audio SFX on scene enter
    if (scene.sfx === 'engine') {
      audioManager.playGunshot();
    } else if (scene.sfx === 'glass') {
      audioManager.playGlassShatter();
    } else if (scene.sfx === 'chains') {
      audioManager.playChainsRattle();
    } else if (scene.sfx === 'heartbeat') {
      audioManager.playHeartbeat();
    } else if (scene.sfx === 'explosion' && !this.hasDetonatedQTE) {
      audioManager.playDemonSlayerExplosion();
      this.hasDetonatedQTE = true;
    }

    // Handle QTE Trigger
    if (scene.isQTE && !this.hasDetonatedQTE) {
      this.isQTEPending = true;
      this.ui.showQTE(true);
    } else {
      this.isQTEPending = false;
      this.ui.showQTE(false);
    }

    // Handle Title Reveal End Card
    if (scene.isEndCard) {
      this.ui.showEndCard(true);
    } else {
      this.ui.showEndCard(false);
    }
  }

  triggerQTEAction() {
    if (this.hasDetonatedQTE) return;
    this.hasDetonatedQTE = true;
    this.isQTEPending = false;
    this.ui.showQTE(false);

    // Audio SFX sequence: Chains drop -> Detonator click -> Huge Demon Slayer Blast!
    audioManager.playChainsDrop();
    setTimeout(() => {
      audioManager.playDetonatorClick();
    }, 280);

    setTimeout(() => {
      audioManager.playDemonSlayerExplosion();
      this.threeScene.setMode('blast');
      this.ui.triggerFlash();
    }, 650);
  }

  jumpToScene(sceneId) {
    const target = SCENES.find(s => s.id === sceneId);
    if (target) {
      audioManager.seekToSeconds(target.timeStart + 0.1);
    }
  }
}
