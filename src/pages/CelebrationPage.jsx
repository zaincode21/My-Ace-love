import { Link } from "react-router-dom";

/** Full celebration page after she says Yes */
export default function CelebrationPage() {
  return (
    <section className="celebration-page section fade-in">
      <div className="popup glass celebration-card">
        <div className="popup-hearts" aria-hidden="true">
          💕
        </div>
        <h1 className="popup-title heartbeat">
          ACE, you just made me the happiest person alive{" "}
          <span aria-hidden="true">❤️</span>
        </h1>
        <p className="popup-message">
          I promise to listen more, understand your feelings, and do my best to
          make you feel loved, valued, and respected every day.
        </p>
        <p className="popup-forever heartbeat">
          Let's begin a new chapter together{" "}
          <span aria-hidden="true">❤️</span>
        </p>
        <div className="celebration-actions">
          <Link to="/" className="btn btn-glow btn-primary">
            Back Home
          </Link>
          <Link to="/proposal" className="btn btn-secondary">
            Read Letter Again
          </Link>
        </div>
      </div>
    </section>
  );
}
