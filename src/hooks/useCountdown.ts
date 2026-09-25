import { useEffect, useMemo, useState } from 'react';

export function useCountdown(targetISO: string) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      setNow(Date.now());
      // re-align with the wall-clock second so all tiles flip together
      timer = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 8);
    };
    timer = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 8);
    return () => window.clearTimeout(timer);
  }, []);

  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    done: diff === 0,
  };
}
