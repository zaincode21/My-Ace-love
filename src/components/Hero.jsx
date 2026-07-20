export default function Hero({ loveSeconds, onOpenHeart }) {
  return (
    <section id="hero" className="hero section">
      <div className="hero-content fade-in">
        <p className="eyebrow">A letter from the heart</p>
        <h1 className="hero-title heartbeat">
          To My Dearest ACE{" "}
          <span className="heart-emoji" aria-hidden="true">
            ❤️
          </span>
        </h1>
        <p className="hero-subtitle">
          I miss what we had. I still love you, and I hope we can find our way
          back to each other.
        </p>
        <button
          type="button"
          className="btn btn-glow btn-primary"
          id="open-heart-btn"
          onClick={onOpenHeart}
        >
          Open My Heart <span aria-hidden="true">❤️</span>
        </button>
        <p className="countdown" aria-live="polite">
          Every second I love you more. <span>{loveSeconds}</span>s
        </p>
      </div>
      <div className="scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
