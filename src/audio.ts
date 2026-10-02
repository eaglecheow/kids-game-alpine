let context: AudioContext | undefined;
let musicVolume: GainNode | undefined;
let musicTimer: ReturnType<typeof setInterval> | undefined;

function audioContext(): AudioContext | undefined {
  if (typeof window.AudioContext !== 'function') return undefined;
  context ??= new AudioContext();
  if (context.state === 'suspended') void context.resume().catch(() => {});
  return context;
}

function note(
  audio: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  volume: number,
  destination: AudioNode = audio.destination,
): void {
  const oscillator = audio.createOscillator();
  const envelope = audio.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(volume, start + 0.02);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope);
  envelope.connect(destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
  oscillator.onended = () => {
    oscillator.disconnect();
    envelope.disconnect();
  };
}

export function playSound(kind: 'clue' | 'success' | 'click', enabled: boolean): void {
  if (!enabled) return;
  const audio = audioContext();
  if (!audio) return;
  const frequencies =
    kind === 'success' ? [523, 659, 784, 1047] : kind === 'clue' ? [659, 880] : [440];
  frequencies.forEach((frequency, index) => {
    note(audio, frequency, audio.currentTime + index * 0.1, 0.25, 0.04);
  });
}

// Call from a Start/Continue button or an audio toggle so browsers allow playback.
export function setMusic(enabled: boolean): void {
  if (musicTimer !== undefined) clearInterval(musicTimer);
  musicTimer = undefined;
  if (musicVolume && context) musicVolume.gain.setValueAtTime(0, context.currentTime);
  if (!enabled) return;
  const audio = audioContext();
  if (!audio) return;
  musicVolume?.disconnect();
  musicVolume = audio.createGain();
  musicVolume.connect(audio.destination);
  musicVolume.gain.setValueAtTime(0.022, audio.currentTime);
  const destination = musicVolume;
  const melody = () => {
    if (document.hidden || audio.state !== 'running') return;
    [262, 330, 392, 330, 294, 349, 392, 349].forEach((frequency, index) => {
      note(audio, frequency, audio.currentTime + index * 0.65, 0.9, 0.5, destination);
    });
  };
  if (audio.state === 'running') melody();
  else
    void audio
      .resume()
      .then(melody)
      .catch(() => {});
  musicTimer = setInterval(melody, 6000);
}
