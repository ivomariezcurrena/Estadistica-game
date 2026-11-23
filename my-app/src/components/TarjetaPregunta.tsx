"use client";

import { useState } from "react";
import type { Pregunta } from "@/types";
import Markdown from "./Markdown";
import RespuestaAbierta from "./RespuestaAbierta";
import { NOMBRE_TEMA } from "@/lib/temas";
import { registrarRespuesta, useProgreso } from "@/lib/storage";

export default function TarjetaPregunta({ pregunta }: { pregunta: Pregunta }) {
  const [elegida, setElegida] = useState<string | null>(null);
  // Solo cuenta para el progreso el primer intento; los reintentos son de práctica.
  const [registrada, setRegistrada] = useState(false);
  const progreso = useProgreso()[pregunta.id];
  const respondida = elegida !== null;
  const acerto = elegida === pregunta.respuestaCorrecta;

  function elegir(opcionId: string) {
    setElegida(opcionId);
    if (!registrada) {
      registrarRespuesta(pregunta.id, opcionId === pregunta.respuestaCorrecta);
      setRegistrada(true);
    }
  }

  return (
    <article className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded bg-blue-100 px-2 py-0.5 text-blue-800">{NOMBRE_TEMA[pregunta.tema]}</span>
        <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-700">Nivel {pregunta.nivel}</span>
        {!pregunta.revisada && (
          <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800">Sin revisar</span>
        )}
        {progreso && (
          <span className="ml-auto text-zinc-500">
            {progreso.aciertos} {progreso.aciertos === 1 ? "acierto" : "aciertos"} · {progreso.fallos}{" "}
            {progreso.fallos === 1 ? "fallo" : "fallos"}
          </span>
        )}
      </div>

      <div className="markdown mb-4">
        <Markdown>{pregunta.enunciado}</Markdown>
      </div>

      {pregunta.tipo === "opcion_multiple" ? (
        <>
          <ul className="space-y-2">
            {pregunta.opciones?.map((op) => {
              let estilo = "border-zinc-300 hover:bg-zinc-50";
              if (respondida && op.id === pregunta.respuestaCorrecta) estilo = "border-green-500 bg-green-50";
              else if (op.id === elegida) estilo = "border-red-500 bg-red-50";
              return (
                <li key={op.id}>
                  <button
                    type="button"
                    disabled={respondida}
                    onClick={() => elegir(op.id)}
                    className={`w-full rounded border px-3 py-2 text-left ${estilo} disabled:cursor-default`}
                  >
                    <span className="mr-2 font-semibold">{op.id})</span>
                    <Markdown inline>{op.texto}</Markdown>
                  </button>
                </li>
              );
            })}
          </ul>

          {respondida && (
            <div className="mt-4 rounded bg-zinc-50 p-4">
              <p className={`mb-2 font-semibold ${acerto ? "text-green-700" : "text-red-700"}`}>
                {acerto ? "¡Correcto!" : "Incorrecto."}
              </p>
              <div className="markdown">
                <Markdown>{pregunta.explicacion ?? pregunta.respuestaModelo}</Markdown>
              </div>
              <button
                type="button"
                onClick={() => setElegida(null)}
                className="mt-3 text-sm text-blue-700 underline"
              >
                Volver a intentar (no se guarda)
              </button>
            </div>
          )}
        </>
      ) : (
        <RespuestaAbierta pregunta={pregunta} />
      )}

      <p className="mt-4 text-xs text-zinc-400">Fuente: {pregunta.fuente}</p>
    </article>
  );
}
