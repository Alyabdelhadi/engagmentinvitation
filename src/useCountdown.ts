import { useEffect, useState } from "react";

export type Remaining = { days: number; hours: number; minutes: number; seconds: number; over: boolean };

function remaining(target: number, now: number): Remaining {
  const ms = Math.max(0, target - now);
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    over: ms === 0
  };
}

/** Ticks once a second until the date is reached. */
export function useCountdown(iso: string): Remaining {
  const target = new Date(iso).getTime();
  const [state, setState] = useState(() => remaining(target, Date.now()));
  useEffect(() => {
    const id = window.setInterval(() => setState(remaining(target, Date.now())), 1000);
    return () => window.clearInterval(id);
  }, [target]);
  return state;
}
