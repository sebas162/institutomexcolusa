"use client";
import * as React from "react";

export type VideoCardProps = {
  type: "local" | "youtube";
  src: string;
  title?: string;
  poster?: string;
};

export function VideoCard({ type, src, poster }: VideoCardProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (type === "local" && videoRef.current) {
      videoRef.current.load();
    }
  }, [type, src]);

  const handlePlay = () => {
    if (videoRef.current) {
      // Pause all other videos with data-autopause-video attribute
      const allVideos = document.querySelectorAll<HTMLVideoElement>(
        "[data-autopause-video]"
      );
      allVideos.forEach((video) => {
        if (video !== videoRef.current && !video.paused) {
          video.pause();
        }
      });
      videoRef.current.muted = false;
    }
  };

  return (
    <div className="video-wrapper">
      {type === "local" ? (
        <video
          ref={videoRef}
          preload="metadata"
          playsInline
          controls
          muted
          onPlay={handlePlay}
          data-autopause-video
          width={1280}
          height={720}
          className="video-testimonial"
        >
          <source src={src} type="video/mp4" />
          Tu navegador no soporta video.
        </video>
      ) : (
        <iframe
          src={src}
          className="video-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={"Video testimonial"}
        />
      )}
    </div>
  );
}
