import { Mail, AtSign, Globe, Briefcase } from "lucide-react";
import MushroomIcon from "./MushroomIcon";
import { AUTHOR, isExternalLink } from "@/lib/author";

export function FungirakBadge({
  href = AUTHOR.websiteUrl,
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  const external = isExternalLink(href);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center gap-1 text-[11px] text-muted transition hover:text-primary-dark ${className}`}
    >
      from <span className="font-semibold text-foreground/70">{AUTHOR.studio}</span>
      <MushroomIcon size={11} className="-mt-0.5" />
    </a>
  );
}

export function FungirakFullCredit() {
  const external = isExternalLink(AUTHOR.instagramUrl);
  return (
    <div className="flex flex-col gap-2">
      <a
        href={AUTHOR.instagramUrl}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary-dark"
      >
        <MushroomIcon size={14} className="text-primary" />
        <span>{AUTHOR.studio}</span>
      </a>
      <p className="text-xs text-muted">Diseño y desarrollo del sitio.</p>
      <div className="flex flex-col gap-1.5 text-xs">
        <a
          href={AUTHOR.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-muted hover:text-primary-dark"
        >
          <AtSign size={13} /> Instagram
        </a>
        {AUTHOR.linkedinUrl && (
          <a
            href={AUTHOR.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-muted hover:text-primary-dark"
          >
            <Briefcase size={13} /> LinkedIn
          </a>
        )}
        <a
          href={AUTHOR.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-muted hover:text-primary-dark"
        >
          <Globe size={13} /> fungirak.com
        </a>
        <a
          href={`mailto:${AUTHOR.email}`}
          className="flex items-center gap-1.5 text-muted hover:text-primary-dark"
        >
          <Mail size={13} /> {AUTHOR.email}
        </a>
      </div>
    </div>
  );
}
