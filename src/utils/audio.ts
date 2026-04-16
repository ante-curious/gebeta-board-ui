import { Howl } from 'howler';

let bgMusic: Howl | null = null;
let sfx: Record<string, Howl> = {};

export const initAudio = () => {
  if (bgMusic) return;

  // Reliable free background music URL
  bgMusic = new Howl({
    src: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'],
    loop: true,
    volume: 0.3,
    html5: true
  });

  sfx.click = new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'],
    volume: 0.5
  });

  sfx.pop = new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3'],
    volume: 0.4
  });

  // Start music if not muted
  if (localStorage.getItem('gebeta_muted') !== 'true') {
    bgMusic.play();
  }
};

export const toggleMute = () => {
  const isMuted = localStorage.getItem('gebeta_muted') === 'true';
  const newMuted = !isMuted;
  localStorage.setItem('gebeta_muted', String(newMuted));

  if (bgMusic) {
    if (newMuted) bgMusic.pause();
    else bgMusic.play();
  }

  return newMuted;
};

export const isMuted = () => {
  return localStorage.getItem('gebeta_muted') === 'true';
};

export const playSFX = (name: string) => {
  if (isMuted()) return;
  if (sfx[name]) sfx[name].play();
};