import { useCallback, useEffect, useRef, useState } from "react";
import { ESCAPE_TEXTS, LOVE_LETTER } from "../constants";
import { useTypewriter } from "../hooks/useTypewriter";

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Proposal glass card: typewriter letter, question,
 * YES celebration trigger, and impossible-to-click NO button.
 */
export default function ProposalCard({ celebrating, onYes }) {
  const cardRef = useRef(null);
  const noBtnRef = useRef(null);
  const lastMsgRef = useRef(-1);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionVisible, setQuestionVisible] = useState(false);
  const [noPos, setNoPos] = useState({ left: 0, top: 0 });
  const [noTransform, setNoTransform] = useState("");
  const [noReady, setNoReady] = useState(false);
  const [escapeMsgs, setEscapeMsgs] = useState([]);

  const { displayed, done } = useTypewriter(LOVE_LETTER, inView);

  // Dedicated proposal page — reveal card and start typewriter on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => {
      setVisible(true);
      setInView(true);
    });
    return () => cancelAnimationFrame(t);
  }, []);

  // After typewriter finishes, reveal question + buttons
  useEffect(() => {
    if (!done) return undefined;
    setShowQuestion(true);
    const anim = requestAnimationFrame(() => setQuestionVisible(true));
    const t = setTimeout(() => {
      positionNoInitially();
      setNoReady(true);
    }, 120);
    return () => {
      cancelAnimationFrame(anim);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const positionNoInitially = useCallback(() => {
    const card = cardRef.current;
    const noBtn = noBtnRef.current;
    if (!card || !noBtn) return;

    const yesBtn = card.querySelector(".btn-yes");
    if (!yesBtn) return;

    const cardRect = card.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();
    const btnW = noBtn.offsetWidth || 90;
    const btnH = noBtn.offsetHeight || 44;
    const padding = 12;

    let left = yesRect.right - cardRect.left + 14;
    let top = yesRect.top - cardRect.top;
    const maxLeft = cardRect.width - btnW - padding;
    const maxTop = cardRect.height - btnH - padding;

    if (left > maxLeft) {
      left = (cardRect.width - btnW) / 2;
      top = yesRect.bottom - cardRect.top + 14;
    }

    left = Math.min(Math.max(padding, left), Math.max(padding, maxLeft));
    top = Math.min(Math.max(padding, top), Math.max(padding, maxTop));
    setNoPos({ left, top });
  }, []);

  useEffect(() => {
    if (!noReady) return undefined;
    const onResize = () => positionNoInitially();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [noReady, positionNoInitially]);

  const showEscapeMessage = useCallback(() => {
    let idx = Math.floor(Math.random() * ESCAPE_TEXTS.length);
    if (idx === lastMsgRef.current) idx = (idx + 1) % ESCAPE_TEXTS.length;
    lastMsgRef.current = idx;

    const card = cardRef.current;
    if (!card) return;

    const id = makeId();
    const x = 20 + Math.random() * Math.max(40, card.clientWidth - 180);
    const y = 60 + Math.random() * Math.max(40, card.clientHeight - 160);

    setEscapeMsgs((prev) => [
      ...prev.slice(-6),
      { id, text: ESCAPE_TEXTS[idx], left: x, top: y },
    ]);
  }, []);

  const moveNoButton = useCallback(
    (clientX, clientY) => {
      if (!noReady || celebrating) return;
      const card = cardRef.current;
      const noBtn = noBtnRef.current;
      if (!card || !noBtn) return;

      const cardRect = card.getBoundingClientRect();
      const btnW = noBtn.offsetWidth;
      const btnH = noBtn.offsetHeight;
      const padding = 14;

      const btnRect = noBtn.getBoundingClientRect();
      const cx = btnRect.left + btnW / 2;
      const cy = btnRect.top + btnH / 2;
      const dist = Math.hypot(clientX - cx, clientY - cy);

      const threshold = window.matchMedia("(pointer: coarse)").matches
        ? 100
        : 72;
      if (dist > threshold) return;

      const maxLeft = Math.max(padding, cardRect.width - btnW - padding);
      const maxTop = Math.max(padding, cardRect.height - btnH - padding);

      let newLeft;
      let newTop;
      let attempts = 0;

      do {
        newLeft = padding + Math.random() * (maxLeft - padding);
        newTop = padding + Math.random() * (maxTop - padding);
        attempts += 1;
        const absX = cardRect.left + newLeft + btnW / 2;
        const absY = cardRect.top + newTop + btnH / 2;
        if (Math.hypot(clientX - absX, clientY - absY) > threshold + 40) break;
      } while (attempts < 14);

      newLeft = Math.min(Math.max(padding, newLeft), maxLeft);
      newTop = Math.min(Math.max(padding, newTop), maxTop);
      setNoPos({ left: newLeft, top: newTop });

      const roll = Math.random();
      if (roll < 0.35) {
        const scale = 0.72 + Math.random() * 0.2;
        const rot = (Math.random() - 0.5) * 28;
        setNoTransform(`scale(${scale}) rotate(${rot}deg)`);
        setTimeout(() => setNoTransform(""), 500);
      } else if (roll < 0.55) {
        setNoTransform(`rotate(${(Math.random() - 0.5) * 18}deg)`);
        setTimeout(() => setNoTransform(""), 400);
      }

      showEscapeMessage();
    },
    [noReady, celebrating, showEscapeMessage]
  );

  const onCardPointer = (e) => {
    const point = e.touches?.[0] || e;
    if (point?.clientX != null) moveNoButton(point.clientX, point.clientY);
  };

  return (
    <section id="proposal" className="proposal section">
      <div
        ref={cardRef}
        className={`proposal-card glass${visible ? " visible" : ""}`}
        onMouseMove={onCardPointer}
        onTouchStart={onCardPointer}
      >
        <h2 className="card-title heartbeat">
          My Love Letter <span aria-hidden="true">❤️</span>
        </h2>

        <p className="love-letter" aria-live="polite">
          {displayed}
          {inView && !done && <span className="cursor" />}
        </p>

        {showQuestion && (
          <>
            <p className={`question${questionVisible ? " show" : ""}`}>
              Will you be my girlfriend? <span aria-hidden="true">❤️</span>
            </p>

            <div className={`btn-row${questionVisible ? " show" : ""}`}>
              <button
                type="button"
                className="btn btn-glow btn-yes"
                onClick={onYes}
                disabled={celebrating}
              >
                ❤️ Yes, I Love You Too
              </button>
            </div>
          </>
        )}

        {showQuestion && !celebrating && (
          <button
            ref={noBtnRef}
            type="button"
            className="btn btn-no"
            style={{
              left: noPos.left,
              top: noPos.top,
              transform: noTransform || undefined,
              visibility: noReady ? "visible" : "hidden",
            }}
            onMouseEnter={(e) => moveNoButton(e.clientX, e.clientY)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              moveNoButton(e.clientX, e.clientY);
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              moveNoButton(e.clientX, e.clientY);
            }}
          >
            💔 No
          </button>
        )}

        <div className="escape-messages" aria-live="polite">
          {escapeMsgs.map((m) => (
            <span
              key={m.id}
              className="escape-msg"
              style={{ left: m.left, top: m.top }}
              onAnimationEnd={() =>
                setEscapeMsgs((prev) => prev.filter((x) => x.id !== m.id))
              }
            >
              {m.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
