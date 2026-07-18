import { useEffect, useState, useRef } from "react";
import { HEART_CHARS } from "../constants";

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Floating hearts rising across the page. */
export function FloatingHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const spawn = () => {
      const id = makeId();
      setHearts((prev) => [
        ...prev.slice(-40),
        {
          id,
          left: `${Math.random() * 100}%`,
          fontSize: `${0.7 + Math.random() * 1.4}rem`,
          duration: `${8 + Math.random() * 10}s`,
          char: HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)],
        },
      ]);
    };

    spawn();
    const interval = setInterval(spawn, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hearts-layer" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="float-heart"
          style={{
            left: h.left,
            bottom: "-40px",
            fontSize: h.fontSize,
            animationDuration: h.duration,
          }}
          onAnimationEnd={() =>
            setHearts((prev) => prev.filter((x) => x.id !== h.id))
          }
        >
          {h.char}
        </span>
      ))}
    </div>
  );
}

/** Occasional falling rose petals. */
export function RosePetals() {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    const spawnOne = () => {
      const id = makeId();
      setPetals((prev) => [
        ...prev.slice(-30),
        {
          id,
          left: `${Math.random() * 100}%`,
          duration: `${6 + Math.random() * 8}s`,
          scale: 0.6 + Math.random() * 0.8,
          soft: Math.random() > 0.5,
        },
      ]);
    };

    const burst = () => {
      const count = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        setTimeout(spawnOne, i * 180);
      }
    };

    const interval = setInterval(burst, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="petals-layer" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            animationDuration: p.duration,
            transform: `scale(${p.scale})`,
            background: p.soft
              ? "linear-gradient(135deg, #ffb3c9, #ff6b9d)"
              : undefined,
          }}
          onAnimationEnd={() =>
            setPetals((prev) => prev.filter((x) => x.id !== p.id))
          }
        />
      ))}
    </div>
  );
}

/**
 * Celebration layer — falling hearts + confetti after YES.
 * Imperative spawn API via ref for burst control.
 */
export function CelebrationLayer({ active }) {
  const [items, setItems] = useState([]);
  const rainRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setItems([]);
      if (rainRef.current) clearInterval(rainRef.current);
      return undefined;
    }

    const spawnHearts = (count) => {
      const batch = [];
      for (let i = 0; i < count; i++) {
        batch.push({
          id: makeId(),
          type: "heart",
          left: `${Math.random() * 100}%`,
          fontSize: `${1 + Math.random() * 1.8}rem`,
          duration: `${2.5 + Math.random() * 3}s`,
          delay: i * 60,
          char: HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)],
        });
      }
      setItems((prev) => [...prev, ...batch].slice(-200));
    };

    const colors = [
      "#ff6b9d",
      "#e63956",
      "#b794f6",
      "#ffffff",
      "#ffb3c9",
      "#fbbf24",
      "#f472b6",
    ];

    const spawnConfetti = (count) => {
      const batch = [];
      for (let i = 0; i < count; i++) {
        batch.push({
          id: makeId(),
          type: "confetti",
          left: `${Math.random() * 100}%`,
          color: colors[Math.floor(Math.random() * colors.length)],
          width: `${6 + Math.random() * 8}px`,
          height: `${8 + Math.random() * 10}px`,
          duration: `${2 + Math.random() * 2.5}s`,
          delay: i * 25,
          round: Math.random() > 0.5,
        });
      }
      setItems((prev) => [...prev, ...batch].slice(-200));
    };

    spawnHearts(50);
    spawnConfetti(100);

    rainRef.current = setInterval(() => {
      spawnHearts(6);
      spawnConfetti(10);
    }, 1200);

    const stop = setTimeout(() => {
      if (rainRef.current) clearInterval(rainRef.current);
    }, 8000);

    return () => {
      clearTimeout(stop);
      if (rainRef.current) clearInterval(rainRef.current);
    };
  }, [active]);

  const remove = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="celebration-layer" aria-hidden="true">
      {items.map((item) =>
        item.type === "heart" ? (
          <span
            key={item.id}
            className="fall-heart"
            style={{
              left: item.left,
              fontSize: item.fontSize,
              animationDuration: item.duration,
              animationDelay: `${item.delay}ms`,
            }}
            onAnimationEnd={() => remove(item.id)}
          >
            {item.char}
          </span>
        ) : (
          <div
            key={item.id}
            className="confetti"
            style={{
              left: item.left,
              background: item.color,
              width: item.width,
              height: item.height,
              animationDuration: item.duration,
              animationDelay: `${item.delay}ms`,
              borderRadius: item.round ? "50%" : "2px",
            }}
            onAnimationEnd={() => remove(item.id)}
          />
        )
      )}
    </div>
  );
}
