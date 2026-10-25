// Web Audio API Synthesizer for BMW M Performance & Electric Sounds
class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private idleOsc: OscillatorNode | null = null;
  private idleGain: GainNode | null = null;
  private isEngineRunning: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isEngineRunning) {
      this.stopEngine();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Soft metallic UI click
  public playClick(pitch: number = 800) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.4, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // AudioContext error handling
    }
  }

  // Headlights toggle high-tech chime
  public playHeadlightBeep(on: boolean) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const startFreq = on ? 440 : 660;
      const endFreq = on ? 880 : 330;
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {}
  }

  // Engine Startup sound: Starter crank + V8 ignition roar
  public playEngineStart() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Crank oscillator
      const crankOsc = this.ctx.createOscillator();
      const crankGain = this.ctx.createGain();
      crankOsc.type = 'sawtooth';
      crankOsc.frequency.setValueAtTime(35, now);
      crankOsc.frequency.linearRampToValueAtTime(45, now + 0.4);

      crankGain.gain.setValueAtTime(0.12, now);
      crankGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      crankOsc.connect(crankGain);
      crankGain.connect(this.ctx.destination);
      crankOsc.start(now);
      crankOsc.stop(now + 0.45);

      // Roar / Rev surge
      const roarOsc = this.ctx.createOscillator();
      const roarFilter = this.ctx.createBiquadFilter();
      const roarGain = this.ctx.createGain();

      roarOsc.type = 'sawtooth';
      roarOsc.frequency.setValueAtTime(55, now + 0.4);
      roarOsc.frequency.exponentialRampToValueAtTime(140, now + 0.7);
      roarOsc.frequency.exponentialRampToValueAtTime(48, now + 1.4);

      roarFilter.type = 'lowpass';
      roarFilter.frequency.setValueAtTime(220, now + 0.4);
      roarFilter.frequency.linearRampToValueAtTime(800, now + 0.7);
      roarFilter.frequency.linearRampToValueAtTime(240, now + 1.4);

      roarGain.gain.setValueAtTime(0.001, now + 0.4);
      roarGain.gain.linearRampToValueAtTime(0.2, now + 0.65);
      roarGain.gain.exponentialRampToValueAtTime(0.06, now + 1.4);

      roarOsc.connect(roarFilter);
      roarFilter.connect(roarGain);
      roarGain.connect(this.ctx.destination);

      roarOsc.start(now + 0.4);
      roarOsc.stop(now + 1.5);

      this.isEngineRunning = true;
    } catch {}
  }

  // Throttle Rev / Acceleration
  public playRev() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      subOsc.type = 'triangle';

      osc.frequency.setValueAtTime(60, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.6);
      osc.frequency.exponentialRampToValueAtTime(52, now + 1.6);

      subOsc.frequency.setValueAtTime(30, now);
      subOsc.frequency.exponentialRampToValueAtTime(110, now + 0.6);
      subOsc.frequency.exponentialRampToValueAtTime(26, now + 1.6);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);
      filter.frequency.linearRampToValueAtTime(1200, now + 0.6);
      filter.frequency.linearRampToValueAtTime(280, now + 1.6);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + 1.65);
      subOsc.stop(now + 1.65);
    } catch {}
  }

  // Electric Warp / Launch Control Sound
  public playWarpDrive() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Futuristic harmonic sine glide
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc2.type = 'triangle';

      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 1.8);

      osc2.frequency.setValueAtTime(180, now);
      osc2.frequency.exponentialRampToValueAtTime(2100, now + 1.8);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 2.05);
      osc2.stop(now + 2.05);
    } catch {}
  }

  public stopEngine() {
    if (this.idleGain && this.ctx) {
      try {
        this.idleGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          this.idleOsc?.stop();
          this.idleOsc = null;
          this.idleGain = null;
        }, 300);
      } catch {}
    }
    this.isEngineRunning = false;
  }
}

export const audioEngine = new AudioEngine();
