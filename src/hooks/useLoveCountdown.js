import { useEffect, useState } from "react";

/** Counts every second since the page opened. */
export function useLoveCountdown() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return seconds;
}
