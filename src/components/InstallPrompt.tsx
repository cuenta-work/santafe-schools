"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { LogoMark } from "./Logo";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "installPromptDismissedAt";
const DISMISS_DAYS = 14;

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    const daysSinceDismiss = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    if (dismissedAt && daysSinceDismiss < DISMISS_DAYS) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const onInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[1800] flex w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-2.5 shadow-lg sm:left-auto sm:right-6 sm:w-auto sm:max-w-xs sm:translate-x-0">
      <LogoMark size={32} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">Santa Fe Schools</p>
        <p className="text-xs text-muted">Instalá la app en tu dispositivo</p>
      </div>
      <button
        onClick={install}
        className="flex shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition active:scale-95"
      >
        <Download size={13} /> Instalar
      </button>
      <button
        onClick={dismiss}
        aria-label="Cerrar"
        className="shrink-0 rounded-full p-1 text-muted hover:bg-background"
      >
        <X size={16} />
      </button>
    </div>
  );
}
