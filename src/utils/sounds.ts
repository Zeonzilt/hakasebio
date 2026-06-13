// Procedural sound engine using Web Audio API — no external files needed.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  // Resume if suspended (browsers suspend until user interaction)
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// ---------------------------------------------------------------------------
// Mechanical keyboard click — layered noise burst + short pitched click
// ---------------------------------------------------------------------------
export function playKeyClick(variant: 'normal' | 'space' | 'enter' = 'normal') {
  const ac = getCtx();
  const now = ac.currentTime;

  // Noise layer (white noise burst)
  const bufLen = ac.sampleRate * 0.04;
  const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 6);
  }
  const noiseSource = ac.createBufferSource();
  noiseSource.buffer = buf;

  const noiseFilter = ac.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = variant === 'space' ? 600 : variant === 'enter' ? 400 : 900;
  noiseFilter.Q.value = 0.8;

  const noiseGain = ac.createGain();
  noiseGain.gain.setValueAtTime(0.18, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ac.destination);
  noiseSource.start(now);
  noiseSource.stop(now + 0.05);

  // Tonal click layer
  const freq = variant === 'space' ? 220 : variant === 'enter' ? 180 : 260 + Math.random() * 80;
  const osc = ac.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.3, now + 0.025);

  const oscGain = ac.createGain();
  oscGain.gain.setValueAtTime(0.07, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

  osc.connect(oscGain);
  oscGain.connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.03);
}

// ---------------------------------------------------------------------------
// Welcome fanfare — synth arpeggio + pad chord
// ---------------------------------------------------------------------------
export function playWelcomeFanfare() {
  const ac = getCtx();
  const now = ac.currentTime;

  // Master reverb via convolver (short impulse response)
  const reverbLen = ac.sampleRate * 0.8;
  const reverbBuf = ac.createBuffer(2, reverbLen, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = reverbBuf.getChannelData(ch);
    for (let i = 0; i < reverbLen; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 3);
    }
  }
  const reverb = ac.createConvolver();
  reverb.buffer = reverbBuf;
  const reverbGain = ac.createGain();
  reverbGain.gain.value = 0.35;
  reverb.connect(reverbGain);
  reverbGain.connect(ac.destination);

  const master = ac.createGain();
  master.gain.value = 0.5;
  master.connect(ac.destination);
  master.connect(reverb);

  // Arpeggio notes: minor pentatonic ascending
  const notes = [220, 261.63, 329.63, 392, 523.25, 659.25];
  notes.forEach((freq, i) => {
    const t = now + i * 0.09;

    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const osc2 = ac.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 2.005; // slight detune for richness

    const g = ac.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.4, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(g);
    osc2.connect(g);
    g.connect(master);
    osc.start(t);
    osc2.start(t);
    osc.stop(t + 0.5);
    osc2.stop(t + 0.5);
  });

  // Pad chord at the end (Am chord)
  const padFreqs = [220, 261.63, 329.63, 440];
  const padStart = now + notes.length * 0.09 + 0.05;
  padFreqs.forEach(freq => {
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const g = ac.createGain();
    g.gain.setValueAtTime(0, padStart);
    g.gain.linearRampToValueAtTime(0.18, padStart + 0.12);
    g.gain.setValueAtTime(0.18, padStart + 0.5);
    g.gain.exponentialRampToValueAtTime(0.001, padStart + 1.2);

    osc.connect(g);
    g.connect(master);
    osc.start(padStart);
    osc.stop(padStart + 1.3);
  });

  // Final high shimmer
  const shimmer = ac.createOscillator();
  shimmer.type = 'sine';
  shimmer.frequency.value = 1046.5;
  const sg = ac.createGain();
  sg.gain.setValueAtTime(0, padStart);
  sg.gain.linearRampToValueAtTime(0.22, padStart + 0.06);
  sg.gain.exponentialRampToValueAtTime(0.001, padStart + 0.9);
  shimmer.connect(sg);
  sg.connect(master);
  shimmer.start(padStart);
  shimmer.stop(padStart + 1.0);
}

// ---------------------------------------------------------------------------
// OK beep — short confirmation tone played after each boot line
// ---------------------------------------------------------------------------
export function playLineOk() {
  const ac = getCtx();
  const now = ac.currentTime;

  const osc = ac.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(1100, now + 0.06);

  const g = ac.createGain();
  g.gain.setValueAtTime(0.12, now);
  g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  osc.connect(g);
  g.connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.12);
}
