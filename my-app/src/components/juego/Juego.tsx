"use client";

import { useState } from "react";
import type { Nivel, Pregunta, Tema } from "@/types";
import { NOMBRE_TEMA } from "@/lib/temas";
import { MINIMO_PARA_SUPERAR, PREGUNTAS_POR_LECCION, armarLeccion, useNivelesSuperados } from "@/lib/juego";
import Leccion from "./Leccion";

const NIVELES: Nivel[] = [1, 2, 3];
const NOMBRE_NIVEL: Record<Nivel, string> = { 1: "Definiciones", 2: "Aplicación", 3: "Justificación" };

interface LeccionActual {
  tema: Tema;
  nivel: Nivel;
  preguntas: Pregunta[];
  intento: number; // cambia al repetir, para reiniciar la lección
}

// Mapa de niveles por tema. Cada nivel se desbloquea al superar el anterior.
export default function Juego({ preguntas }: { preguntas: Pregunta[] }) {
  const superados = useNivelesSuperados();
  const [leccion, setLeccion] = useState<LeccionActual | null>(null);

  function empezar(tema: Tema, nivel: Nivel) {
    setLeccion((prev) => ({
      tema,
      nivel,
      preguntas: armarLeccion(preguntas, tema, nivel),
      intento: (prev?.intento ?? 0) + 1,
    }));
  }

  if (leccion) {
    const { tema, nivel } = leccion;
    return (
      <Leccion
        key={leccion.intento}
        tema={tema}
        nivel={nivel}
        preguntas={leccion.preguntas}
        onSalir={() => setLeccion(null)}
        onRepetir={() => empezar(tema, nivel)}
        onSiguiente={() => empezar(tema, (nivel + 1) as Nivel)}
      />
    );
  }

  return (
    <div>
      <p className="mb-6 text-sm text-zinc-500">
        Cada lección tiene {PREGUNTAS_POR_LECCION} preguntas. Respondé bien {MINIMO_PARA_SUPERAR} para superar el
        nivel y desbloquear el siguiente.
      </p>

      <div className="space-y-4">
        {(Object.keys(NOMBRE_TEMA) as Tema[]).map((tema) => {
          const superado = superados[tema] ?? 0;
          return (
            <section key={tema} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 font-semibold">{NOMBRE_TEMA[tema]}</h2>
              <div className="flex flex-wrap items-center gap-1">
                {NIVELES.map((nivel, i) => {
                  const hecho = nivel <= superado;
                  const disponible = nivel <= superado + 1;
                  const cantidad = preguntas.filter((p) => p.tema === tema && p.nivel === nivel).length;
                  const estilo = hecho
                    ? "bg-yellow-400 text-yellow-950 hover:bg-yellow-500"
                    : disponible
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "cursor-not-allowed bg-zinc-200 text-zinc-400";
                  return (
                    <div key={nivel} className="flex items-center gap-1">
                      {i > 0 && <span className={`h-1 w-3 rounded ${disponible ? "bg-green-400" : "bg-zinc-200"}`} />}
                      <button
                        type="button"
                        disabled={!disponible || cantidad === 0}
                        onClick={() => empezar(tema, nivel)}
                        title={`${cantidad} preguntas`}
                        className={`flex h-16 w-24 flex-col items-center justify-center rounded-2xl text-sm font-semibold shadow ${estilo}`}
                      >
                        <span className="text-lg">{hecho ? "★" : disponible ? nivel : "🔒"}</span>
                        <span className="text-xs font-normal">{NOMBRE_NIVEL[nivel]}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
