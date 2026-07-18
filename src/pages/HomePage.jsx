import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import { useLoveCountdown } from "../hooks/useLoveCountdown";

/** Landing page — hero only */
export default function HomePage() {
  const navigate = useNavigate();
  const loveSeconds = useLoveCountdown();

  return (
    <Hero
      loveSeconds={loveSeconds}
      onOpenHeart={() => navigate("/proposal")}
    />
  );
}
