import { useSyncExternalStore } from 'react';
import { MUSIC } from '../config';

export type MusicStatus = 'loading' | 'ready' | 'playing' | 'paused' | 'unavailable';

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  unMute(): void;
  loadVideoById(opts: { videoId: string; startSeconds?: number }): void;
  cueVideoById(opts: { videoId: string; startSeconds?: number }): void;
}

interface YTNamespace {
  Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const YT_ENDED = 0;
const YT_PLAYING = 1;
const YT_PAUSED = 2;

let ytApiPromise: Promise<YTNamespace> | null = null;
function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise<YTNamespace>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => {
      ytApiPromise = null;
      reject(new Error('YouTube API unavailable'));
    };
    document.head.appendChild(script);
  });
  return ytApiPromise;
}

function isSameOrigin(url: string) {
  try {
    return new URL(url, location.href).origin === location.origin;
  } catch {
    return false;
  }
}

async function hasLocalTrack(url: string) {
  if (!url) return false;
  // A remote audio URL (e.g. your own CDN) is trusted; a load error falls back to YouTube.
  if (/^https?:\/\//i.test(url) && !isSameOrigin(url)) return true;
  if (!/^https?:$/.test(location.protocol)) return false;
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    const type = res.headers.get('content-type') ?? '';
    return res.ok && /audio|mpeg|octet-stream/i.test(type);
  } catch {
    return false;
  }
}

/**
 * Background-music engine.
 * 1. Uses a local audio file when present (most reliable, instant, no ads).
 * 2. Otherwise streams the official YouTube upload through a hidden player.
 * Handles soft fade-in/out, mute toggling and pausing while the tab is hidden.
 */
class MusicEngine {
  status: MusicStatus = 'loading';
  private listeners = new Set<() => void>();
  private kind: 'none' | 'file' | 'yt' = 'none';
  private audio: HTMLAudioElement | null = null;
  private player: YTPlayer | null = null;
  private ytReady = false;
  private ytIndex = 0;
  private startedOnce = false;
  private vol = 0;
  private fadeTimer: number | null = null;
  private pendingFade: number | null = null;
  private watchdog: number | null = null;
  private want = false;
  private suspended = false;

  constructor() {
    void this.init();
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  getSnapshot = () => this.status;

  /** Must be called synchronously inside the user's tap/click. */
  start = () => {
    if (this.want) return;
    this.want = true;
    this.vol = 0;
    if (this.audio) this.audio.volume = 0;
    this.play(MUSIC.fadeInMs);
  };

  toggle = () => {
    if (this.status === 'playing') {
      this.want = false;
      this.setStatus('paused');
      this.fadeTo(0, 450, () => {
        if (!this.want) this.pauseRaw();
      });
    } else if (this.status === 'unavailable') {
      this.retry();
    } else {
      this.want = true;
      this.play(1500);
    }
  };

  /** Re-attempt streaming after a failure (e.g. a flaky connection). */
  private retry() {
    this.want = true;
    this.ytIndex = 0;
    this.setStatus('loading');
    if (this.player && this.ytReady) {
      this.kind = 'yt';
      this.pendingFade = 1500;
      try {
        this.player.unMute();
        this.player.loadVideoById({ videoId: MUSIC.youtube[0].id, startSeconds: MUSIC.youtube[0].start });
      } catch {
        /* noop */
      }
      this.armWatchdog();
    } else {
      void this.initYouTube();
    }
  }

  private armWatchdog() {
    if (this.watchdog) window.clearTimeout(this.watchdog);
    this.watchdog = window.setTimeout(() => {
      if (this.status !== 'playing') this.blocked();
    }, 8000);
  }

  private setStatus(s: MusicStatus) {
    if (this.status === s) return;
    this.status = s;
    this.listeners.forEach((l) => l());
  }

  private async init() {
    if (await hasLocalTrack(MUSIC.fileUrl)) {
      const a = new Audio();
      a.src = MUSIC.fileUrl;
      a.loop = false; // looped manually so every repeat restarts at the vocals
      a.preload = 'auto';
      const seekToVocals = () => {
        try {
          if (a.currentTime < MUSIC.fileStartSeconds - 0.05) a.currentTime = MUSIC.fileStartSeconds;
        } catch {
          /* not seekable yet */
        }
      };
      a.addEventListener('loadedmetadata', seekToVocals);
      a.addEventListener('ended', () => {
        a.currentTime = MUSIC.fileStartSeconds;
        if (this.want) void a.play().catch(() => undefined);
      });
      a.setAttribute('playsinline', '');
      a.volume = 0;
      a.addEventListener('pause', () => {
        if (this.want && !this.suspended && !a.ended && a.currentTime < (a.duration || Infinity) - 0.3) {
          this.want = false;
          this.setStatus('paused');
        }
      });
      a.addEventListener('error', () => {
        // the audio file could not be decoded/loaded → stream from YouTube instead
        if (this.kind !== 'file') return;
        this.kind = 'none';
        this.audio = null;
        void this.initYouTube();
      });
      this.audio = a;
      this.kind = 'file';
      if (this.status === 'loading') this.setStatus('ready');
      if (this.want) this.play(MUSIC.fadeInMs);
      return;
    }
    await this.initYouTube();
  }

  private async initYouTube() {
    if (this.player) {
      this.kind = 'yt';
      if (this.want) this.play(MUSIC.fadeInMs);
      return;
    }
    try {
      const YT = await loadYouTubeApi();
      const host = document.createElement('div');
      host.setAttribute('aria-hidden', 'true');
      host.style.cssText =
        'position:fixed;left:-420px;top:-420px;width:200px;height:200px;opacity:0;pointer-events:none;overflow:hidden;z-index:-1;';
      const mount = document.createElement('div');
      host.appendChild(mount);
      document.body.appendChild(host);
      this.kind = 'yt';
      const origin = /^https?:$/.test(location.protocol) ? { origin: location.origin } : {};
      this.player = new YT.Player(mount, {
        width: 200,
        height: 200,
        videoId: MUSIC.youtube[0].id,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
          rel: 0,
          start: Math.floor(MUSIC.youtube[0].start),
          ...origin,
        },
        events: {
          onReady: () => {
            this.ytReady = true;
            try {
              this.player?.setVolume(0);
            } catch {
              /* noop */
            }
            if (this.status === 'loading') this.setStatus('ready');
            if (this.want) this.play(MUSIC.fadeInMs);
          },
          onStateChange: (e: { data: number }) => this.onYtState(e.data),
          onError: (e: { data: number }) => this.onYtError(e.data),
        },
      });
    } catch {
      this.kind = 'none';
      this.setStatus('unavailable');
    }
  }

  private onYtState(state: number) {
    if (state === YT_PLAYING) {
      if (this.watchdog) window.clearTimeout(this.watchdog);
      if (!this.want || this.suspended) {
        this.player?.pauseVideo();
        return;
      }
      this.setStatus('playing');
      if (this.pendingFade != null) {
        this.fadeTo(MUSIC.volume, this.pendingFade);
        this.pendingFade = null;
      }
    } else if (state === YT_ENDED) {
      this.player?.seekTo(MUSIC.youtube[this.ytIndex]?.start ?? 0, true);
      if (this.want) this.player?.playVideo();
    } else if (state === YT_PAUSED) {
      if (this.want && !this.suspended && this.status === 'playing') {
        this.want = false;
        this.setStatus('paused');
      }
    }
  }

  private onYtError(code: number) {
    console.info(`[music] YouTube player error ${code} for track #${this.ytIndex + 1}`);
    this.ytIndex += 1;
    const next = MUSIC.youtube[this.ytIndex];
    if (next && this.player) {
      const opts = { videoId: next.id, startSeconds: next.start };
      if (this.want) this.player.loadVideoById(opts);
      else this.player.cueVideoById(opts);
    } else {
      if (this.watchdog) window.clearTimeout(this.watchdog);
      this.want = false;
      this.setStatus('unavailable');
    }
  }

  private play(fadeMs: number) {
    if (this.kind === 'file' && this.audio) {
      const a = this.audio;
      if (!this.startedOnce) {
        this.startedOnce = true;
        try {
          a.currentTime = MUSIC.fileStartSeconds;
        } catch {
          /* seeked on loadedmetadata instead */
        }
      }
      const ok = () => {
        this.setStatus('playing');
        this.fadeTo(MUSIC.volume, fadeMs);
      };
      try {
        const p = a.play();
        if (p) p.then(ok).catch(() => this.blocked());
        else ok();
      } catch {
        this.blocked();
      }
      return;
    }
    if (this.kind === 'yt' && this.player && this.ytReady) {
      this.pendingFade = fadeMs;
      try {
        this.player.unMute();
        this.player.setVolume(Math.round(this.vol * 100));
        if (!this.startedOnce) {
          this.startedOnce = true;
          this.player.seekTo(MUSIC.youtube[this.ytIndex]?.start ?? 0, true);
        }
        this.player.playVideo();
      } catch {
        /* noop */
      }
      this.armWatchdog();
    }
    // otherwise the engine is still initialising — it will start once ready
  }

  private blocked() {
    this.want = false;
    this.setStatus('paused');
  }

  private pauseRaw() {
    try {
      if (this.kind === 'file') this.audio?.pause();
      if (this.kind === 'yt' && this.ytReady) this.player?.pauseVideo();
    } catch {
      /* noop */
    }
  }

  private applyVolume(v: number) {
    this.vol = Math.min(1, Math.max(0, v));
    try {
      if (this.kind === 'file' && this.audio) this.audio.volume = this.vol;
      if (this.kind === 'yt' && this.player && this.ytReady) this.player.setVolume(Math.round(this.vol * 100));
    } catch {
      /* iOS ignores programmatic volume — safe to skip */
    }
  }

  private fadeTo(target: number, ms: number, done?: () => void) {
    if (this.fadeTimer) window.clearInterval(this.fadeTimer);
    const from = this.vol;
    const t0 = performance.now();
    this.fadeTimer = window.setInterval(() => {
      const p = Math.min(1, (performance.now() - t0) / ms);
      const eased = p * p * (3 - 2 * p);
      this.applyVolume(from + (target - from) * eased);
      if (p >= 1) {
        if (this.fadeTimer) window.clearInterval(this.fadeTimer);
        this.fadeTimer = null;
        done?.();
      }
    }, 50);
  }

  private onVisibility = () => {
    if (document.hidden) {
      if (this.want && this.status === 'playing') {
        this.suspended = true;
        this.pauseRaw();
      }
    } else if (this.suspended) {
      this.suspended = false;
      if (this.want) {
        this.applyVolume(0);
        this.play(1200);
      }
    }
  };
}

let engine: MusicEngine | null = null;
function getEngine() {
  if (!engine) engine = new MusicEngine();
  return engine;
}

export function useMusic() {
  const e = getEngine();
  const status = useSyncExternalStore(e.subscribe, e.getSnapshot, e.getSnapshot);
  return { status, start: e.start, toggle: e.toggle };
}
