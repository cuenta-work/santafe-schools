import { Lightbulb, ExternalLink } from "lucide-react";
import type { Level, Sector } from "@/lib/types";
import { SECTOR_LABELS } from "@/lib/types";
import { getLevelTip } from "@/lib/levelTips";

export default function LevelTipBanner({
  level,
  sectors,
}: {
  level: Level;
  // Set de gestión activa en los filtros actuales -- si hay exactamente
  // una, el dato se personaliza para esa gestión (por ej. "radio escolar"
  // solo tiene sentido si estás mirando escuelas públicas).
  sectors: Set<Sector>;
}) {
  const tip = getLevelTip(level, sectors);
  if (!tip) return null;

  const singleSector = sectors.size === 1 ? ([...sectors][0] as Sector) : null;

  return (
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3.5">
      <span className="mt-0.5 shrink-0 text-lg leading-none">{tip.emoji}</span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground/70">
          <Lightbulb size={12} className="text-gold" /> Dato útil
          {singleSector && (
            <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold normal-case text-muted">
              para gestión {SECTOR_LABELS[singleSector].replace("Gestión ", "")}
            </span>
          )}
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
