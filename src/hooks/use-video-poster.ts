import * as React from "react";

function isMobileUA() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iPhone|iPad|iPod|Android/i.test(ua);
}

export function useVideoPoster(
  ref: React.RefObject<HTMLVideoElement>,
  opts: { src?: string; timeSec?: number } = {}
) {
  const { src, timeSec = 0.1 } = opts;

  React.useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // Only attempt on mobile to avoid unnecessary work.
    if (!isMobileUA()) return;

    const onLoadedData = () => {
      try {
        // Seek to a small offset to avoid potential black first frame
        video.currentTime = timeSec;
      } catch {}
    };

    const onSeeked = () => {
      try {
        const w = video.videoWidth || 480;
        const h = video.videoHeight || 270;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/png");
        if (dataUrl) {
          video.setAttribute("poster", dataUrl);
        }
      } catch {
        // ignore if browser blocks drawing or CORS taints the canvas
      }
    };

    video.addEventListener("loadeddata", onLoadedData, { once: true });
    video.addEventListener("seeked", onSeeked, { once: true });

    return () => {
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("seeked", onSeeked);
    };
  }, [ref, src, timeSec]);
}
