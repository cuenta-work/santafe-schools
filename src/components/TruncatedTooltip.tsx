"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Tooltip para nombres que se truncan con line-clamp/truncate -- pensado
// para no molestar: solo aparece si el texto realmente se corta (se mide
// contra el propio elemento, no se asume por CSS), tarda medio segundo en
// aparecer (así pasear el mouse por varias cards no dispara un cartel por
// cada una) pero se esconde al instante, y se renderiza en un portal a
// document.body con posición fija -- así nunca lo recorta el
// "overflow-hidden" de la card que lo contiene ni queda atrás en z-index.
export default function TruncatedTooltip({
  text,
  className = "",
  heading = false,
}: {
  text: string;
  className?: string;
  heading?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      setTruncated(el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1);
    };
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  useEffect(() => {
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
    };
  }, []);

  const hide = () => {
    if (showTimer.current) clearTimeout(showTimer.current);
    setVisible(false);
  };

  const handleEnter = () => {
    if (!truncated || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCoords({ top: rect.bottom + 6, left: rect.left });
    showTimer.current = setTimeout(() => setVisible(true), 500);
  };

  useEffect(() => {
    if (!visible) return;
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [visible]);

  const Tag = heading ? "h3" : "p";

  return (
    <>
      <Tag
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        onMouseEnter={handleEnter}
        onMouseLeave={hide}
        className={className}
      >
        {text}
      </Tag>
      {visible &&
        truncated &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[3000] w-max max-w-[16rem] rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium leading-snug text-background shadow-lg"
            style={{ top: coords.top, left: coords.left }}
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}
