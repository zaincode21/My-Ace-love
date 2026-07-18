import { useCallback, useEffect, useRef, useState } from "react";

/** YouTube video from: https://www.youtube.com/watch?v=5gg17XXXiNo&list=RD5gg17XXXiNo */
const YT_VIDEO_ID = "5gg17XXXiNo";
const YT_PLAYLIST_ID = "RD5gg17XXXiNo";

function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };

    if (!document.getElementById("youtube-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });
}

/**
 * Hidden YouTube player for background music + play/pause toggle.
 * Uses: https://www.youtube.com/watch?v=5gg17XXXiNo&list=RD5gg17XXXiNo
 */
export default function YouTubeMusic() {
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !hostRef.current || playerRef.current) return;

      playerRef.current = new YT.Player(hostRef.current, {
        width: 1,
        height: 1,
        videoId: YT_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          loop: 1,
          // Same video in playlist enables loop; list keeps the radio mix URL intent
          playlist: YT_VIDEO_ID,
          list: YT_PLAYLIST_ID,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            if (!cancelled) setReady(true);
          },
          onStateChange: (event) => {
            // 1 = playing, 2 = paused, 0 = ended
            if (event.data === 1) setPlaying(true);
            if (event.data === 2) setPlaying(false);
            if (event.data === 0) {
              // Restart if loop fails for any reason
              try {
                playerRef.current?.playVideo?.();
              } catch {
                setPlaying(false);
              }
            }
          },
          onError: () => setPlaying(false),
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, []);

  const toggle = useCallback(() => {
    const player = playerRef.current;
    if (!player || !ready) return;

    const state = player.getPlayerState?.();
    // PLAYING = 1, BUFFERING = 3
    if (state === 1 || state === 3) {
      player.pauseVideo();
      setPlaying(false);
    } else {
      player.unMute?.();
      player.setVolume?.(80);
      player.playVideo();
      setPlaying(true);
    }
  }, [ready]);

  return (
    <>
      {/* Visually hidden YouTube player — audio only via Music button */}
      <div className="yt-music-host" aria-hidden="true">
        <div ref={hostRef} id="yt-romantic-player" />
      </div>

      <button
        id="music-btn"
        className={`music-btn${playing ? " playing" : ""}`}
        type="button"
        aria-label={playing ? "Pause background music" : "Play background music"}
        title="Play / Pause YouTube music"
        onClick={toggle}
        disabled={!ready}
      >
        <span className="music-icon" aria-hidden="true">
          ♪
        </span>
        <span className="music-label">Music</span>
      </button>
    </>
  );
}
