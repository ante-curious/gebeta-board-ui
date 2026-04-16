import { Howl } from 'howler';

class AudioManager {
  private bgm: Howl;
  private sfxMove: Howl;
  private sfxCapture: Howl;
  private sfxClick: Howl;
  private muted: boolean = false;

  constructor() {
    this.muted = localStorage.getItem('gebeta_muted') === 'true';

    // Using stable free assets
    this.bgm = new Howl({
      src: ['https://assets.mixkit.co/music/preview/mixkit-ethereal-fairy-win-2019.mp3'],
      loop: true,
      volume: 0.3,
      html5: true,
      mute: this.muted
    });

    this.sfxMove = new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-hand-ball-hit-758.mp3'],
      volume: 0.5,
      mute: this.muted
    });

    this.sfxCapture = new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-magic-marimba-notif-2483.mp3'],
      volume: 0.7,
      mute: this.muted
    });

    this.sfxClick = new Howl({
      src: ['https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3'],
      volume: 0.4,
      mute: this.muted
    });
  }

  playBGM() {
    if (!this.bgm.playing()) {
      this.bgm.play();
    }
  }

  playMove() {
    this.sfxMove.play();
  }

  playCapture() {
    this.sfxCapture.play();
  }

  playClick() {
    this.sfxClick.play();
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('gebeta_muted', String(this.muted));
    this.bgm.mute(this.muted);
    this.sfxMove.mute(this.muted);
    this.sfxCapture.mute(this.muted);
    this.sfxClick.mute(this.muted);
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}

export const audioManager = new AudioManager();