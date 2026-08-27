import { Mail, Send } from "lucide-react";
import { AUTHOR } from "@/lib/author";

export default function ContactCTA() {
  return (
    <section id="contacto" className="mx-auto w-full max-w-7xl scroll-mt-[57px] px-4 py-10 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-10 text-center sm:px-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 30%, var(--primary) 0, transparent 40%), radial-gradient(circle at 85% 70%, var(--accent) 0, transparent 40%)",
          }}
        />
        <div className="relative flex flex-col items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Para instituciones educativas
          </p>
          <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            ¿Tu institución todavía no está en la guía?
          </h2>
          <p className="max-w-xl text-sm text-muted sm:text-base">
            Si dirigís un jardín, escuela, terciario o universidad en Santa Fe capital o su zona
            y querés sumarte a la guía — o si nosotros nos perdimos algún dato tuyo — escribinos.
          </p>
          <a
            href={`mailto:${AUTHOR.email}?subject=${encodeURIComponent(
              "Quiero sumar mi institución a Santa Fe Schools"
            )}`}
            className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-md shadow-primary/20 transition active:scale-95 hover:bg-primary-dark"
          >
            <Send size={16} /> Contactanos
          </a>
          <a
            href={`mailto:${AUTHOR.email}`}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-primary-dark"
          >
            <Mail size={12} /> {AUTHOR.email}
          </a>
        </div>
      </div>
    </section>
  );
}
