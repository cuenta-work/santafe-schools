import { Lightbulb, ExternalLink } from "lucide-react";
import type { Level } from "@/lib/types";
import { LEVEL_TIPS } from "@/lib/levelTips";

export default function LevelTipBanner({ level }: { level: Level }) {
  const tip = LEVEL_TIPS[level];
  if (!tip) return null;

  return (
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3.5">
      <span className="mt-0.5 shrink-0 text-lg leading-none">{tip.emoji}</span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground/70">
          <Lightbulb size={12} className="text-gold" /> Dato útil
        </p>
        <p className="mt-0.5 text-sm text-foreground/85">
          {tip.text}
          {tip.linkUrl && (
            <>
              {" "}
              <a
                href={tip.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary-dark underline underline-offset-2 hover:text-primary"
              >
                {tip.linkLabel} <ExternalLink size={11} />
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
