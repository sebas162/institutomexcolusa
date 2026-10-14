import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type VideoSource =
  | { kind: "youtube"; embedUrl: string }
  | { kind: "vimeo"; embedUrl: string }
  | { kind: "file"; url: string };

function parseVideoUrl(url: string): VideoSource {
  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  if (youtube) {
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtube[1]}?rel=0`,
    };
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return { kind: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeo[1]}` };
  }

  return { kind: "file", url };
}

interface VideoFrameProps {
  url: string | null;
  title: string;
  /** "dark": sobre el fondo verde; "light": marco oscuro sobre fondo claro; "soft": marco claro con borde suave. */
  surface: "dark" | "light" | "soft";
  size?: "lg" | "md";
}

export default function VideoFrame({ url, title, surface, size = "lg" }: VideoFrameProps) {
  const frameClass = cn(
    "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-[20px]",
    surface === "dark" && "border border-white/20 bg-black/20",
    surface === "light" && "bg-[#0A1416]",
    surface === "soft" && "border border-border bg-muted shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
  );
  const soft = surface === "soft";

  if (!url) {
    return (
      <div className={frameClass}>
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            disabled
            aria-label={`${title}: video próximamente`}
            className={cn(
              "flex cursor-not-allowed items-center justify-center rounded-full",
              soft ? "bg-primary text-primary-foreground" : "bg-white text-primary opacity-80",
              size === "lg" ? "h-[76px] w-[76px]" : "h-[68px] w-[68px]"
            )}
          >
            <Play
              aria-hidden="true"
              className={cn("fill-current", size === "lg" ? "h-[30px] w-[30px]" : "h-[26px] w-[26px]")}
            />
          </button>
          <span className={cn("text-sm font-semibold", soft ? "text-muted-foreground" : "text-white/80")}>
            Video próximamente
          </span>
        </div>
      </div>
    );
  }

  const source = parseVideoUrl(url);

  return (
    <div className={frameClass}>
      {source.kind === "file" ? (
        <video
          src={source.url}
          title={title}
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : (
        <iframe
          src={source.embedUrl}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="lazy"
          className="h-full w-full border-0"
        />
      )}
    </div>
  );
}
