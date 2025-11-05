import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type LessonPlayerSource =
  | { type: "youtube"; url: string }
  | { type: "mp4"; url: string; poster?: string };

type LessonPlayerProps = {
  title: string;
  summary: string;
  competency: string;
  duration: string;
  source?: LessonPlayerSource;
  onComplete?: () => void;
  className?: string;
};

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1600&q=80";

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  title,
  summary,
  competency,
  duration,
  source,
  onComplete,
  className,
}) => {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  const handleProgress = useCallback((value: number) => {
    setProgress(value);
  }, []);

  const handleCompletion = useCallback(() => {
    setProgress(100);
    setComplete(true);
    onComplete?.();
  }, [onComplete]);

  const handleManualComplete = useCallback(() => {
    if (complete) return;
    setProgress(100);
    setComplete(true);
    onComplete?.();
  }, [complete, onComplete]);

  const autoTracked = source?.type === "mp4";

  const renderPlayer = useMemo(() => {
    if (!source) {
      return (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary/10 p-8 text-center shadow-inner">
          <Badge variant="outline" className="text-xs uppercase tracking-[0.3em]">
            Coming soon
          </Badge>
          <p className="text-sm font-semibold text-foreground">This lesson does not have a video yet.</p>
          <p className="text-xs text-muted-foreground">
            Review the summary and competency to prepare before the recording drops.
          </p>
        </div>
      );
    }

    if (source.type === "youtube") {
      return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-border/40 bg-black/30 pb-[56.25%]">
          <iframe
            src={`${source.url}${source.url.includes("?") ? "&" : "?"}modestbranding=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      );
    }

    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-black/30">
        <video
          key={source.url}
          src={source.url}
          poster={source.poster ?? FALLBACK_POSTER}
          controls
          className="h-full w-full object-cover"
          onTimeUpdate={(event) => {
            const element = event.currentTarget;
            if (!element.duration) return;
            handleProgress(Math.round((element.currentTime / element.duration) * 100));
          }}
          onEnded={handleCompletion}
        >
          <track kind="captions" srcLang="en" label="English captions" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }, [source, handleCompletion, handleProgress]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              {competency}
            </Badge>
            <span className="inline-flex items-center gap-2 uppercase tracking-[0.25em]">
              {duration}
            </span>
            {complete && <Badge className="bg-success/90 text-white">Completed</Badge>}
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl">
        {renderPlayer}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-[0.25em]">
          <span>{autoTracked ? "Lesson progress" : "Manual completion"}</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        {!autoTracked && (
          <Button
            variant="outline"
            size="sm"
            className="mt-1"
            onClick={handleManualComplete}
            disabled={complete}
          >
            {complete ? "Marked as complete" : "Mark lesson as complete"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default LessonPlayer;
