"use client";

import type { Pregunta, Tema } from "@/types";
import { NOMBRE_TEMA } from "@/lib/temas";
import { borrarProgreso, useProgreso } from "@/lib/storage";

interface Fila {
  nombre: string;
  total: number;
  respondidas: number;
  aciertos: number;
  fallos: number;
}

function porcentaje(f: Fila) {
  const intentos = f.aciertos + f.fallos;
  return intentos === 0 ? "—" : `${Math.round((f.aciertos / intentos) * 100)}%`;
}

export default function Estadisticas({ preguntas }: { preguntas: Pregunta[] }) {
  const progreso = useProgreso();

  function calcular(nombre: string, lista: Pregunta[]): Fila {
    const fila: Fila = { nombre, total: lista.length, respondidas: 0, aciertos: 0, fallos: 0 };
    for (const p of lista) {
      const pr = progreso[p.id];
      if (!pr) continue;
      fila.respondidas++;
      fila.aciertos += pr.aciertos;
      fila.fallos += pr.fallos;
    }
    return fila;
  }

  const filas = (Object.keys(NOMBRE_TEMA) as Tema[]).map((t) =>
    calcular(NOMBRE_TEMA[t], preguntas.filter((p) => p.tema === t)),
  );
  const total = calcular("Total", preguntas);

  function borrar() {
    if (confirm("¿Borrar todo el progreso guardado? No se puede deshacer.")) borrarProgreso();
  }

  return (
    <div>
      <table className="w-full border-collapse bg-white text-sm">
        <thead>
          <tr className="border-b border-zinc-300 text-left">
            <th className="p-2">Tema</th>
            <th className="p-2 text-right">Respondidas</th>
            <th className="p-2 text-right">Aciertos</th>
            <th className="p-2 text-right">Fallos</th>
            <th className="p-2 text-right">% aciertos</th>
          </tr>
        </thead>
        <tbody>
          {[...filas, total].map((f) => (
            <tr
              key={f.nombre}
              className={`border-b border-zinc-200 ${f === total ? "font-semibold" : ""}`}
            >
              <td className="p-2">{f.nombre}</td>
              <td className="p-2 text-right">
                {f.respondidas} / {f.total}
              </td>
              <td className="p-2 text-right text-green-700">{f.aciertos}</td>
              <td className="p-2 text-right text-red-700">{f.fallos}</td>
              <td className="p-2 text-right">{porcentaje(f)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-3 text-xs text-zinc-500">
        Respondidas: preguntas distintas que respondiste al menos una vez. Aciertos y fallos suman todas
        las veces que las respondiste (los reintentos inmediatos no cuentan).
      </p>

      <button type="button" onClick={borrar} className="mt-6 text-sm text-red-700 underline">
        Borrar progreso
      </button>
    </div>
  );
}
