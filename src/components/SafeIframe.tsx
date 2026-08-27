"use client";

import { useMemo, useRef, useState } from "react";
import { Loader2, ExternalLink, ShieldAlert } from "lucide-react";
import { isBlockedEmbedHost, openEmbedWindow, windowNameForUrl } from "@/lib/embed";

function Fallback({ src, title }: { src: string; title: string }) {
  const openAsWindow = () => openEmbedWindow(src, windowNameForUrl(src));

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-background px-4 text-center text-muted">
      <ShieldAlert size={20} />
      <p className="text-xs">Este sitio no se puede mostrar acá adentro.</p>
      <button
        type="button"
        onClick={openAsWindow}
        className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-dark"
      >
        Abrir {title} <ExternalLink size={12} />
      </button>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] text-muted underline hover:text-primary-dark"
      >
        o abrir en una pestaña normal
      </a>
    </div>
  );
}

export default function SafeIframe({
  src,
  title,
  className = "",
}: {
  src: string;
  title: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [misbehaving, setMisbehaving] = useState(false);
  const loadTimestamps = useRef<number[]>([]);

  const preBlocked = useMemo(() => isBlockedEmbedHost(src), [src]);
  const blocked = preBlocked || misbehaving;

  const handleLoad = () => {
    setLoaded(true);
    const now = Date.now();
    loadTimestamps.current = [...loadTimestamps.current, now].filter((t) => now - t < 10000);
    if (loadTimestamps.current.length >= 3) {
      setMisbehaving(true);
    }
  };

  if (blocked) {
    return (
      <div className={`overflow-hidden rounded-xl border border-border ${className}`}>
        <Fallback src={src} title={title} />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background text-muted">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-xs">Cargando...</span>
        </div>
      )}
      <iframe
        src={src}
        title={title}
        onLoad={handleLoad}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer"
        className="h-full w-full"
      />
    </div>
  );
}
