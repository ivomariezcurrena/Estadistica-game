"use client";

import { useState } from "react";
import type { Pregunta } from "@/types";
import { registrarRespuesta } from "@/lib/storage";
import Markdown from "../Markdown";

// Opción múltiple estilo juego: elegís una opción y la confirmás con "Comprobar".
export default function OpcionMultipleJuego({
  pregunta,
  onResultado,
}: {
  pregunta: Pregunta;
  onResultado: (acerto: boolean) => void;
}) {
  const [elegida, setElegida] = useState<string | null>(null);
  const [comprobada, setComprobada] = useState(false);

  function comprobar() {
    if (!elegida) return;
    const acerto = elegida === pregunta.respuestaCorrecta;
    setComprobada(true);
    registrarRespuesta(pregunta.id, acerto);
    onResultado(acerto);
  }

  return (
    <div>
      <ul className="space-y-2">
        {pregunta.opciones?.map((op) => {
          let estilo = "border-zinc-300 hover:bg-zinc-50";
          if (comprobada && op.id === pregunta.respuestaCorrecta) estilo = "border-green-500 bg-green-50";
          else if (comprobada && op.id === elegida) estilo = "border-red-500 bg-red-50";
          else if (op.id === elegida) estilo = "border-blue-500 bg-blue-50";
          return (
            <li key={op.id}>
              <button
                type="button"
                disabled={comprobada}
                onClick={() => setElegida(op.id)}
                className={`w-full rounded-lg border-2 px-4 py-3 text-left ${estilo} disabled:cursor-default`}
              >
                <Markdown inline>{op.texto}</Markdown>
              </button>
            </li>
          );
        })}
      </ul>

      {!comprobada && (
        <button
          type="button"
          onClick={comprobar}
          disabled={!elegida}
          className="mt-4 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          Comprobar
        </button>
      )}
    </div>
  );
}
