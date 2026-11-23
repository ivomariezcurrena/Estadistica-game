"use client";

import { useState } from "react";
import type { Nivel, Pregunta, Tema } from "@/types";
import { NOMBRE_TEMA } from "@/lib/temas";
import TarjetaPregunta from "./TarjetaPregunta";

export default function ModoEstudio({ preguntas }: { preguntas: Pregunta[] }) {
  const [tema, setTema] = useState<Tema | "todos">("todos");
  const [nivel, setNivel] = useState<Nivel | "todos">("todos");

  const filtradas = preguntas.filter(
    (p) => (tema === "todos" || p.tema === tema) && (nivel === "todos" || p.nivel === nivel),
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4">
        <label className="flex flex-col text-sm">
          Tema
          <select
            value={tema}
            onChange={(e) => setTema(e.target.value as Tema | "todos")}
            className="mt-1 rounded border border-zinc-300 bg-white px-2 py-1"
          >
            <option value="todos">Todos</option>
            {(Object.keys(NOMBRE_TEMA) as Tema[]).map((t) => (
              <option key={t} value={t}>
                {NOMBRE_TEMA[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm">
          Nivel
          <select
            value={nivel}
            onChange={(e) => setNivel(e.target.value === "todos" ? "todos" : (Number(e.target.value) as Nivel))}
            className="mt-1 rounded border border-zinc-300 bg-white px-2 py-1"
          >
            <option value="todos">Todos</option>
            <option value="1">1 · Definiciones</option>
            <option value="2">2 · Aplicación y cálculo</option>
            <option value="3">3 · Justificación oral</option>
          </select>
        </label>
      </div>

      <p className="mb-4 text-sm text-zinc-500">
        {filtradas.length} {filtradas.length === 1 ? "pregunta" : "preguntas"}
      </p>

      <div className="space-y-6">
        {filtradas.map((p) => (
          <TarjetaPregunta key={p.id} pregunta={p} />
        ))}
        {filtradas.length === 0 && (
          <p className="text-zinc-500">No hay preguntas para ese tema y nivel todavía.</p>
        )}
      </div>
    </div>
  );
}
