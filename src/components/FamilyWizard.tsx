"use client";

import { useMemo, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  MapPin,
  Heart,
  MessageCircleHeart,
} from "lucide-react";
import type { Institution, Level, Sector } from "@/lib/types";
import { LEVEL_LABELS, LEVEL_EMOJI, SECTOR_SHORT } from "@/lib/types";
import { useFilters } from "@/context/FiltersContext";
import { capitalFirst } from "@/lib/localityPriority";
import InstitutionLogo from "./InstitutionLogo";
import LevelTipBanner from "./LevelTipBanner";

type Prioridad = "cercania" | "jornada" | "bilingue" | "tecnica" | "arancel";

const LEVEL_ORDER: Level[] = ["jardin", "primaria", "secundaria", "terciario", "universidad"];

const PRIORIDADES: { key: Prioridad; label: string; emoji: string }[] = [
  { key: "cercania", label: "Que quede cerca de casa", emoji: "📍" },
  { key: "jornada", label: "Jornada extendida o doble escolaridad", emoji: "⏰" },
  { key: "bilingue", label: "Que sea bilingüe", emoji: "🌐" },
  { key: "tecnica", label: "Orientación técnica", emoji: "⚙️" },
  { key: "arancel", label: "Que la cuota sea accesible", emoji: "💸" },
];

interface Answers {
  level: Level | null;
  sector: Sector | "cualquiera";
  localidad: string | null;
  prioridad: Prioridad | null;
}

function scoreInstitution(inst: Institution, answers: Answers): number {
  let score = 0;
  if (answers.sector !== "cualquiera" && inst.sector === answers.sector) score += 3;
  if (answers.localidad && inst.localidad === answers.localidad) score += 4;
  if (answers.prioridad === "bilingue" && inst.bilingue) score += 5;
  if (
    answers.prioridad === "jornada" &&
    (inst.modalidad === "jornada completa" || inst.modalidad === "doble escolaridad")
  )
    score += 5;
  if (answers.prioridad === "tecnica" && inst.tipoSecundaria === "tecnica") score += 5;
  if (answers.prioridad === "arancel" && (inst.sector === "publico" || inst.costTier === "$"))
    score += 5;
  if (inst.featured) score += 1;
  return score;
}

export default function FamilyWizard() {
  const { institutions, localidades, setSelected } = useFilters();
  const localidadesOrdenadas = useMemo(
    () => capitalFirst(localidades, (l) => l),
    [localidades]
  );
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    level: null,
    sector: "cualquiera",
    localidad: null,
    prioridad: null,
  });
  const [showResults, setShowResults] = useState(false);

  const results = useMemo(() => {
    if (!answers.level) return [];
    return institutions
      .filter((i) => i.levels.includes(answers.level as Level))
      .map((i) => ({ inst: i, score: scoreInstitution(i, answers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((r) => r.inst);
  }, [institutions, answers]);

  const restart = () => {
    setAnswers({ level: null, sector: "cualquiera", localidad: null, prioridad: null });
    setStep(0);
    setShowResults(false);
  };

  const steps = [
    {
      question: "¿Para qué nivel estás buscando?",
      body: (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {LEVEL_ORDER.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setAnswers((a) => ({ ...a, level: l }));
                setStep(1);
              }}
              data-active={answers.level === l}
              className="pill justify-center !py-3 !text-sm"
            >
              {LEVEL_EMOJI[l]} {LEVEL_LABELS[l]}
            </button>
          ))}
        </div>
      ),
    },
    {
      question: "¿Preferís gestión pública, privada, o no tenés problema?",
      body: (
        <div className="flex flex-wrap gap-2">
          {(["cualquiera", "publico", "privado"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setAnswers((a) => ({ ...a, sector: s }));
                setStep(2);
              }}
              data-active={answers.sector === s}
              className="pill pill-accent !py-3 !text-sm"
            >
              {s === "cualquiera" ? "🤷 Cualquiera" : `${s === "publico" ? "🏛️" : "🏫"} ${SECTOR_SHORT[s]}`}
            </button>
          ))}
        </div>
      ),
    },
    {
      question: "¿En qué zona vivís, o cerca de dónde te queda mejor?",
      body: (
        <div className="scrollbar-thin flex max-h-48 flex-col gap-1.5 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => {
              setAnswers((a) => ({ ...a, localidad: null }));
              setStep(3);
            }}
            data-active={answers.localidad === null}
            className="pill justify-start !py-2.5 !text-sm"
          >
            🗺️ Me da igual la zona
          </button>
          {localidadesOrdenadas.slice(0, 12).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => {
                setAnswers((a) => ({ ...a, localidad: loc }));
                setStep(3);
              }}
              data-active={answers.localidad === loc}
              className="pill justify-start !py-2.5 !text-sm"
            >
              <MapPin size={13} /> {loc}
            </button>
          ))}
        </div>
      ),
    },
    {
      question: "Si tuvieras que elegir una sola cosa, ¿qué es lo que más te importa?",
      body: (
        <div className="flex flex-col gap-2">
          {PRIORIDADES.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => {
                setAnswers((a) => ({ ...a, prioridad: p.key }));
                setShowResults(true);
              }}
              data-active={answers.prioridad === p.key}
              className="pill justify-start !py-3 !text-sm"
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section id="orientador" className="scroll-mt-[57px] mx-auto w-full max-w-4xl px-4 py-10 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 10%, var(--accent) 0, transparent 40%), radial-gradient(circle at 90% 90%, var(--primary) 0, transparent 40%)",
          }}
        />
        <div className="relative flex items-center gap-2">
          <MessageCircleHeart size={18} className="text-accent-dark" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-dark">
            El orientador de Santa Fe Schools
          </p>
        </div>

        {!showResults ? (
          <div className="relative mt-3">
            <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
              Contame por quién estás preguntando y te tiro 5 opciones para arrancar.
            </h2>
            <p className="mt-1 text-sm text-muted">
              4 preguntas rápidas, como charlarlo con una vecina que ya investigó todo.
            </p>

            <div className="mt-5 flex items-center gap-1.5">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i <= step ? "bg-accent" : "bg-border"
                  }`}
                />
              ))}
            </div>

            <p className="mt-4 font-display text-lg font-semibold text-foreground">
              {steps[step].question}
            </p>
            <div className="mt-3">{steps[step].body}</div>

            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="mt-5 flex items-center gap-1 text-xs font-medium text-muted hover:text-primary-dark"
              >
                <ArrowLeft size={13} /> Volver a la pregunta anterior
              </button>
            )}
          </div>
        ) : (
          <div className="relative mt-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                {results.length > 0
                  ? "Basado en lo que me contaste, empezá por acá:"
                  : "No encontramos coincidencias exactas todavía."}
              </h2>
              <button
                type="button"
                onClick={restart}
                className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-accent hover:text-accent-dark"
              >
                <RotateCcw size={12} /> Empezar de nuevo
              </button>
            </div>

            {answers.level && (
              <div className="mt-4">
                <LevelTipBanner
                  level={answers.level}
                  sectors={answers.sector === "cualquiera" ? new Set() : new Set([answers.sector])}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              {results.map((inst, i) => (
                <button
                  key={inst.id}
                  onClick={() => setSelected(inst)}
                  className="card-glow flex items-center gap-3 rounded-2xl border border-border bg-background p-3 text-left transition"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent-dark">
                    {i + 1}
                  </span>
                  <InstitutionLogo id={inst.id} name={inst.name} domain={inst.logoDomain} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="group/name relative min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{inst.name}</p>
                      <span className="pointer-events-none absolute left-0 top-full z-30 mt-1.5 w-max max-w-[15rem] rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium leading-snug text-background opacity-0 shadow-lg transition-opacity duration-150 group-hover/name:opacity-100">
                        {inst.name}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted">
                      {inst.localidad} · {SECTOR_SHORT[inst.sector]}
                      {inst.bilingue ? " · Bilingüe" : ""}
                    </p>
                  </div>
                  {inst.featured && <Heart size={14} className="shrink-0 text-accent" />}
                  <ArrowRight size={15} className="shrink-0 text-muted" />
                </button>
              ))}
            </div>

            {results.length === 0 && (
              <p className="mt-3 text-sm text-muted">
                Probá de nuevo eligiendo otra zona o gestión -- o mirá el buscador completo más
                abajo, filtrando por <strong>{answers.level && LEVEL_LABELS[answers.level]}</strong>.
              </p>
            )}
          </div>
        )}

        <p className="relative mt-6 flex items-center gap-1.5 text-[11px] text-muted">
          <Sparkles size={11} className="text-gold" />
          Es una orientación automática para arrancar la búsqueda, no un ranking oficial -- después
          confirmá siempre con cada institución.
        </p>
      </div>
    </section>
  );
}
