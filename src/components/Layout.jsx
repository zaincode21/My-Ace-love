import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  FloatingHearts,
  RosePetals,
  CelebrationLayer,
} from "./Atmosphere";
import SparkleCanvas from "./SparkleCanvas";
import YouTubeMusic from "./YouTubeMusic";

/**
 * Shared chrome across all pages: atmosphere, music, footer.
 */
export default function Layout() {
  const { pathname } = useLocation();
  const celebrating = pathname === "/celebration";

  useEffect(() => {
    document.body.classList.toggle("celebrating", celebrating);
    window.scrollTo(0, 0);
    return () => document.body.classList.remove("celebrating");
  }, [pathname, celebrating]);

  return (
    <div className={celebrating ? "celebrating" : undefined}>
      <div className="bg-gradient" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />

      <FloatingHearts />
      <RosePetals />
      <SparkleCanvas />
      <CelebrationLayer active={celebrating} />

      <YouTubeMusic />

      <main className="page-main">
        <Outlet />
      </main>

      <footer className="footer">
        <p>
          I made this website with all my heart, just for you{" "}
          <span aria-hidden="true">❤️</span>
        </p>
      </footer>
    </div>
  );
}
