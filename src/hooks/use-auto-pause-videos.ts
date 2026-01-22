"use client";

import { useEffect } from "react";

export function useAutoPauseVideos(selector = "[data-autopause-video]") {
  useEffect(() => {
    const videos = Array.from(
      document.querySelectorAll<HTMLVideoElement>(selector)
    );

    if (videos.length === 0) {
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMobileSafari = isIOS && /Safari/.test(navigator.userAgent);

    // Handler to pause all other videos when one starts playing
    const handlePlay = (e: Event) => {
      const currentVideo = e.target as HTMLVideoElement;
      videos.forEach((video) => {
        if (video !== currentVideo && !video.paused) {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;

          if (!entry.isIntersecting && !video.paused) {
            video.pause();
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    videos.forEach((video) => {
      observer.observe(video);
      video.addEventListener("play", handlePlay);

      // Ensure inline playback for iOS
      video.setAttribute("playsinline", "true");
      video.setAttribute("webkit-playsinline", "true");

      // Force paint of the real first frame on mobile Safari
      const nudgeFirstFrame = () => {
        try {
          if (isMobileSafari) {
            if (!video.paused) {
              video.pause();
            }
            // Small seek to draw a frame
            video.currentTime = 0.001;
          }
        } catch {
          // Ignore seek errors silently
        }
      };

      // Run on metadata and when first frame is available
      video.addEventListener("loadedmetadata", nudgeFirstFrame, { once: true });
      video.addEventListener("loadeddata", nudgeFirstFrame, { once: true });

      // Additional fallback: force frame render after a brief delay on iOS
      if (isMobileSafari) {
        setTimeout(() => {
          try {
            if (!video.paused) {
              video.pause();
            }
            if (video.currentTime === 0) {
              video.currentTime = 0.001;
            }
          } catch {
            // Ignore errors
          }
        }, 300);
      }
    });

    return () => {
      observer.disconnect();
      videos.forEach((video) => {
        video.removeEventListener("play", handlePlay);
      });
    };
  }, [selector]);
}
