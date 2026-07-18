import { useEffect, useState } from "react";

/**
 * Typewriter effect — returns displayed text and whether typing is done.
 */
export function useTypewriter(text, enabled, speed = 28) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;

    let i = 0;
    let timeoutId;
    setDisplayed("");
    setDone(false);

    const tick = () => {
      if (i < text.length) {
        i += 1;
        setDisplayed(text.slice(0, i));
        timeoutId = setTimeout(tick, speed + Math.random() * 18);
      } else {
        setDone(true);
      }
    };

    timeoutId = setTimeout(tick, 200);
    return () => clearTimeout(timeoutId);
  }, [text, enabled, speed]);

  return { displayed, done };
}
