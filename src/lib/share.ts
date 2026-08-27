// Fallback de copiado para navegadores sin Clipboard API (o que la bloquean
// fuera de un contexto seguro) -- usa el viejo truco del textarea oculto +
// execCommand("copy").
export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  return new Promise<void>((resolve, reject) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (ok) resolve();
      else reject(new Error("execCommand copy failed"));
    } catch (err) {
      reject(err);
    }
  });
}
