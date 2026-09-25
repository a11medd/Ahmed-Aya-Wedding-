import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'ar';

interface Item {
  title: string;
  text: string;
}

export interface Dict {
  docTitle: string;
  toggle: { label: string; aria: string };
  invited: string;
  cta: string;
  soundHint: string;
  openAria: string;
  hero: { kicker: string; groom: string; bride: string; amp: string; namesAria: string; date: string };
  invite: { title: string; salutation: string; message: string };
  countdown: { aria: string; kicker: string; title: string; subtitle: string; units: [string, string, string, string]; done: string };
  calendar: { aria: string; title: string; monthYear: string; weekdays: string[]; caption: string; weddingDay: string };
  schedule: { aria: string; kicker: string; title: string; items: Array<{ time: string; meridiem: string; title: string; note: string }> };
  venue: { aria: string; kicker: string; title: string; name: string; date: string; time: string; button: string };
  guidelines: { aria: string; kicker: string; title: string; subtitle: string; items: Item[]; colors: string[]; colorsAria: string };
  gratitude: { aria: string; title: string; text: string; rsvp: string; rsvpNote: string; whatsappMessage: string };
  footer: { date: string };
  music: { play: string; mute: string };
}

const en: Dict = {
  docTitle: 'Ahmed & Aya · The Wedding Celebration · 27.01.2027',
  toggle: { label: 'العربية', aria: 'عرض الدعوة باللغة العربية' },
  invited: 'You are cordially invited',
  cta: 'Click To Open',
  soundHint: 'For the full experience, kindly turn your sound on',
  openAria: 'Open the wedding invitation of Ahmed and Aya',
  hero: { kicker: 'The Wedding Celebration of', groom: 'Ahmed', bride: 'Aya', amp: '&', namesAria: 'Ahmed and Aya', date: '27 · 01 · 2027' },
  invite: {
    title: 'Wedding Invitation',
    salutation: 'Dear Family & Friends',
    message:
      'We are thrilled and honored to invite you to celebrate the most magical night of our lives and share the joyful beginning of our journey together.',
  },
  countdown: {
    aria: 'Countdown to the wedding',
    kicker: 'The Big Day',
    title: 'Countdown',
    subtitle: 'Until We Celebrate Together',
    units: ['Days', 'Hours', 'Minutes', 'Seconds'],
    done: 'Today, we celebrate',
  },
  calendar: {
    aria: 'Save the date',
    title: 'Save The Date',
    monthYear: 'January 2027',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    caption: 'Wednesday, January 27, 2027',
    weddingDay: 'Wednesday, January 27 — our wedding day',
  },
  schedule: {
    aria: 'Schedule',
    kicker: 'Schedule',
    title: 'The Celebration',
    items: [{ time: '8:00', meridiem: 'PM', title: 'Doors Open & Guest Arrival', note: 'Until the night comes to an end!' }],
  },
  venue: {
    aria: 'Venue',
    kicker: 'Location',
    title: 'The Venue',
    name: 'Luasil Hall',
    date: 'Wednesday · 27 January 2027',
    time: '8:00 PM',
    button: 'Venue Location',
  },
  guidelines: {
    aria: 'Event guidelines',
    kicker: 'Good to Know',
    title: 'Event Guidelines',
    subtitle: 'A few thoughtful details to ensure a magical evening for everyone',
    items: [
      {
        title: 'Dress Code',
        text: 'We would love for our lovely ladies to shine in Burgundy and Royal Olive, and gentlemen in elegant black suits.',
      },
      {
        title: 'Personal Invitation',
        text: 'This invitation is personal to the recipient.',
      },
      {
        title: 'Adults Only',
        text: 'To ensure a relaxing and delightful evening for everyone, our wedding is an adults-only celebration.',
      },
    ],
    colors: ['Burgundy', 'Olive Green', 'Classic Black'],
    colorsAria: 'Suggested colours',
  },
  gratitude: {
    aria: 'With love and gratitude',
    title: 'With Love & Gratitude',
    text: 'Your presence is the most cherished part of our love story',
    rsvp: 'RSVP Confirmation',
    rsvpNote: 'Kindly confirm your attendance via WhatsApp',
    whatsappMessage: "Hello, I would like to confirm my attendance for Ahmed & Aya's Wedding.",
  },
  footer: { date: 'Wednesday · 27 January 2027', credits: 'Designed with love by Ahmed Osama ♥' },
  music: { play: 'Play background music', mute: 'Mute background music' },
};

const ar: Dict = {
  docTitle: 'أحمد و آية · حفل الزفاف · ٢٧.٠١.٢٠٢٧',
  toggle: { label: 'English', aria: 'View the invitation in English' },
  invited: 'يسعدنا دعوتكم',
  cta: 'اضغط لفتح الدعوة',
  soundHint: 'لتجربة أجمل، يُرجى تشغيل الصوت',
  openAria: 'افتح دعوة زفاف أحمد و آية',
  hero: { kicker: 'حفل زفاف', groom: 'أحمد', bride: 'آية', amp: 'و', namesAria: 'أحمد و آية', date: '٢٧ يناير ٢٠٢٧' },
  invite: {
    title: 'دعوة زفاف',
    salutation: 'أهلنا وأصدقاءنا الأعزاء',
    message: 'يسعدنا ويشرّفنا دعوتكم لمشاركتنا أجمل ليلة في حياتنا، والاحتفال معنا ببداية رحلتنا السعيدة معًا.',
  },
  countdown: {
    aria: 'العد التنازلي لحفل الزفاف',
    kicker: 'اليوم الكبير',
    title: 'العد التنازلي',
    subtitle: 'حتى نحتفل معًا',
    units: ['أيام', 'ساعات', 'دقائق', 'ثوانٍ'],
    done: 'اليوم نحتفل',
  },
  calendar: {
    aria: 'احفظوا التاريخ',
    title: 'احفظوا التاريخ',
    monthYear: 'يناير ٢٠٢٧',
    weekdays: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
    caption: 'الأربعاء، ٢٧ يناير ٢٠٢٧',
    weddingDay: 'الأربعاء ٢٧ يناير — يوم زفافنا',
  },
  schedule: {
    aria: 'البرنامج',
    kicker: 'البرنامج',
    title: 'الاحتفال',
    items: [{ time: '٨:٠٠', meridiem: 'مساءً', title: 'فتح الأبواب واستقبال الضيوف', note: 'حتى نهاية الليلة!' }],
  },
  venue: {
    aria: 'القاعة',
    kicker: 'الموقع',
    title: 'القاعة',
    name: 'قاعة لوسيل',
    date: 'الأربعاء · ٢٧ يناير ٢٠٢٧',
    time: '٨:٠٠ مساءً',
    button: 'موقع القاعة',
  },
  guidelines: {
    aria: 'إرشادات الحفل',
    kicker: 'معلومات تهمّك',
    title: 'إرشادات الحفل',
    subtitle: 'بعض التفاصيل البسيطة لضمان أمسية ساحرة للجميع',
    items: [
      {
        title: 'قواعد اللباس',
        text: 'يسعدنا أن تتألق سيداتنا الجميلات بلونَي النبيتي والزيتي الملكي، وأن يطلّ السادة ببدلات سوداء أنيقة',
      },
      {
        title: 'دعوة شخصية',
        text: 'هذه الدعوة خاصة بصاحبها.',
      },
      {
        title: 'للكبار فقط',
        text: 'حرصًا على أمسية هادئة وممتعة للجميع، حفل زفافنا مخصّص للكبار فقط.',
      },
    ],
    colors: ['نبيتي', 'زيتي', 'أسود كلاسيكي'],
    colorsAria: 'الألوان المقترحة',
  },
  gratitude: {
    aria: 'مع خالص الحب والامتنان',
    title: 'مع خالص الحب والامتنان',
    text: 'حضوركم هو أغلى ما في قصة حبنا',
    rsvp: 'تأكيد الحضور',
    rsvpNote: 'يُرجى تأكيد حضوركم عبر واتساب',
    whatsappMessage: 'مرحبًا، أودّ تأكيد حضوري لحفل زفاف أحمد و آية.',
  },
  footer: { date: 'الأربعاء · ٢٧ يناير ٢٠٢٧', credits: 'صُمم بحب بواسطة أحمد أسامة ♥' },
  music: { play: 'تشغيل الموسيقى', mute: 'كتم الموسيقى' },
};

const DICTS: Record<Lang, Dict> = { en, ar };
const STORAGE_KEY = 'aa-invite-lang';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

function initialLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q === 'ar' || q === 'en') return q;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    /* private mode */
  }
  return 'ar';
}

interface LangValue {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  t: Dict;
  /** Localise digits (Arabic-Indic numerals in Arabic) */
  num: (value: string | number) => string;
  toggle: () => void;
}

const LangContext = createContext<LangValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const busy = useRef(false);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = DICTS[lang].docTitle;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const toggle = useCallback(() => {
    if (busy.current) return;
    const next: Lang = lang === 'en' ? 'ar' : 'en';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLang(next);
      return;
    }
    // soft cross-fade: fade the text out, swap language, fade back in
    busy.current = true;
    const html = document.documentElement;
    html.classList.add('is-lang-switching');
    window.setTimeout(() => setLang(next), 260);
    window.setTimeout(() => {
      html.classList.remove('is-lang-switching');
      busy.current = false;
    }, 330);
  }, [lang]);

  const value = useMemo<LangValue>(
    () => ({
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      t: DICTS[lang],
      num: (v) => (lang === 'ar' ? String(v).replace(/\d/g, (d) => AR_DIGITS[Number(d)]) : String(v)),
      toggle,
    }),
    [lang, toggle],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
