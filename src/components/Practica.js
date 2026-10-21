"use client";
// Simulacro de práctica (no oficial): elegís un área, respondés 10 preguntas y ves cuántas acertaste, la explicación de cada una y qué
// temas repasar. Sin «nota» ni «aprobaste». Sin cuenta: el historial queda en este navegador.
import { useEffect, useState } from "react";
import { AREAS, OFICIALES, armarSimulacro } from "@/lib/practica";

const K = "schools.practica";
const leer = () => { try { return JSON.parse(localStorage.getItem(K) || "[]"); } catch { return []; } };

export default function Practica() {
  const [area, setArea] = useState(null);
  const [l, setL] = useState([]);
  const [resp, setResp] = useState({});
  const [fin, setFin] = useState(false);
  const [hist, setHist] = useState([]);
  useEffect(() => { setHist(leer()); }, []); // el historial guardado en este navegador
  const empezar = (id) => { setArea(id); setL(armarSimulacro(id)); setResp({}); setFin(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const terminar = () => {
    const bien = l.filter((p) => resp[p.id] === p.ok).length;
    const h = [{ area, bien, total: l.length, fecha: new Date().toISOString() }, ...leer()].slice(0, 30);
    try { localStorage.setItem(K, JSON.stringify(h)); } catch {}
    setHist(h); setFin(true); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const aviso = (
    <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
      <b>Práctica no oficial.</b> No pertenece a ninguna universidad ni está avalada por ellas: son preguntas propias sobre temas que suelen entrar en los ingresos. Los contenidos y fechas oficiales están en el sitio de cada universidad:{" "}
      {OFICIALES.map((o, i) => <span key={o.url}>{i ? " · " : ""}<a href={o.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">{o.n}</a></span>)}.
    </div>
  );
  if (!area) return (
    <div className="flex flex-col gap-5">
      {aviso}
      <div className="grid gap-3 sm:grid-cols-2">
        {AREAS.map((a) => {
          const ult = hist.find((h) => h.area === a.id);
          return (
            <button key={a.id} type="button" onClick={() => empezar(a.id)} className="flex flex-col items-start gap-1 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary">
              <span className="font-display text-xl font-semibold text-foreground">{a.n}</span>
              <span className="text-sm text-muted">10 preguntas al azar de {a.preguntas.length}{ult ? ` · la última vez: ${ult.bien} de ${ult.total} correctas` : ""}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
  const a = AREAS.find((x) => x.id === area);
  const bien = l.filter((p) => resp[p.id] === p.ok).length;
  const repasar = [...new Set(l.filter((p) => resp[p.id] !== p.ok).map((p) => p.tema))];
  return (
    <div className="flex flex-col gap-5">
      {aviso}
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-display text-2xl font-semibold">{a.n}</h2><button type="button" onClick={() => setArea(null)} className="text-sm font-semibold text-primary">Elegir otra área</button></div>
      {fin && (
        <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5">
          <p className="font-display text-3xl font-semibold">{bien} de {l.length} respuestas correctas</p>
          {repasar.length ? <p className="text-sm text-muted">Para repasar: <b className="text-foreground">{repasar.join(", ")}</b>. Abajo tenés la explicación de cada una.</p> : <p className="text-sm text-muted">¡Todas bien! Probá otra área o volvé a practicar esta (salen otras preguntas).</p>}
          <div className="flex flex-wrap gap-2"><button type="button" onClick={() => empezar(area)} className="rounded-full bg-primary px-5 py-2.5 font-semibold text-white">Otro simulacro de {a.n}</button></div>
        </div>
      )}
      <ol className="flex flex-col gap-4">
        {l.map((p, i) => (
          <li key={p.id} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">{i + 1}. {p.tema}</span>
            <p className="font-semibold text-foreground">{p.q}</p>
            <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={`Pregunta ${i + 1}`}>
              {p.op.map((o, j) => {
                const elegida = resp[p.id] === j, correcta = fin && j === p.ok, mal = fin && elegida && j !== p.ok;
                return <button key={j} type="button" role="radio" aria-checked={elegida} disabled={fin} onClick={() => setResp({ ...resp, [p.id]: j })}
                  className={`rounded-xl border px-3 py-2 text-left text-sm ${correcta ? "border-sage bg-sage/10 font-semibold" : mal ? "border-accent bg-accent/10" : elegida ? "border-primary bg-primary/10 font-semibold" : "border-border"}`}>{o}</button>;
              })}
            </div>
            {fin && <p className="text-sm text-muted">{resp[p.id] === p.ok ? "✔ Correcta. " : "✘ "}{p.por}</p>}
          </li>
        ))}
      </ol>
      {!fin && <button type="button" onClick={terminar} disabled={Object.keys(resp).length < l.length} className="self-start rounded-full bg-primary px-6 py-3 font-semibold text-white disabled:opacity-50">Ver cuántas acerté ({Object.keys(resp).length} de {l.length})</button>}
    </div>
  );
}
