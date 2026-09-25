/**
 * Non-text wedding settings. All wording (English + Arabic) lives in src/i18n.tsx.
 */

export const EVENT = {
  /** Countdown target — doors open at 8:00 PM, Cairo time (UTC+2). */
  dateISO: '2027-01-27T20:00:00+02:00',
  /** Used to draw the "Save The Date" calendar */
  calendar: { year: 2027, monthIndex: 0, day: 27 },
} as const;

export const DRESS_COLORS = [
  { color: '#6b1626', shade: '#3c0a14' },
  { color: '#5f6a34', shade: '#343b17' },
  { color: '#1a1a1a', shade: '#050505' },
] as const;

export const LINKS = {
  /** Verified: resolves to "Luasil hall | قاعه لوسيل" on Google Maps (31.4521, 31.6839). */
  maps: 'https://maps.app.goo.gl/oF9YF97TVqsm5eyd6',
  /** Egyptian mobile 01111229962 in international format (country code 20, leading 0 dropped). */
  whatsappNumber: '201111229962',
} as const;

export const whatsappUrl = (message: string) => `https://wa.me/${LINKS.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const VERSE =
  'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً';

export const VERSE_REF = 'سورة الروم · ٢١';

export const HERO_VIDEO = {
  /**
   * Optional: paste a hosted .mp4 URL of your own couple film here and it will play
   * behind the names instead of the animated cinematic portrait.
   */
  url: '',
} as const;

export const MUSIC = {
  title: 'Perfect',
  artist: 'Ed Sheeran',
  /**
   * For the most reliable playback on every device (and no ads), drop a licensed
   * copy of the song at `public/audio/perfect.mp3` and host it next to index.html
   * (or paste a full https:// URL to the file here).
   * If that file is not found, the official YouTube upload is streamed instead.
   */
  fileUrl: `${import.meta.env.BASE_URL}audio/perfect.mp3`,
  /**
   * Start at the first sung line "I found a love…" — not the instrumental intro.
   * Album version (÷ / Divide): the vocal enters at 2.98 s.
   */
  fileStartSeconds: 2.8,
  /**
   * Official music video — its film intro is ~17.6 s longer than the album,
   * so the vocal enters at ≈ 20.6 s.
   */
  youtube: [{ id: '2Vv-BfVoq4g', start: 20.4 }],
  /** Target volume, 0 – 1 */
  volume: 0.85,
  /** Short, soft fade so the very first words are clearly heard */
  fadeInMs: 1200,
} as const;
