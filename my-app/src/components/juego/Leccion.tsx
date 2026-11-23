"use client";

import { useState } from "react";
import type { Nivel, Pregunta, Tema } from "@/types";
import { NOMBRE_TEMA } from "@/lib/temas";
import { MINIMO_PARA_SUPERAR, PREGUNTAS_POR_LECCION, marcarSuperado } from "@/lib/juego";
import Markdown from "../Markdown";
import RespuestaAbierta from "../RespuestaAbierta";
import OpcionMultipleJuego from "./OpcionMultipleJuego";

interface Props {
  tema: Tema;
  nivel: Nivel;
  preguntas: Pregunta[];
  onSalir: () => void;
  onRepetir: () => void;
  onSiguiente: () => void;
}

// Una lección: las preguntas de a una, con barra de progreso y resultado al final.
export default function Leccion({ tema, nivel, preguntas, onSalir, onRepetir, onSiguiente }: Props) {
  const [indice, setIndice] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [resultado, setResultado] = useState<boolean | null>(null);
  const [terminada, setTerminada] = useState(false);

  const total = preguntas.length;
  const necesarios = Math.ceil((total * MINIMO_PARA_SUPERAR) / PREGUNTAS_POR_LECCION);
  const pregunta = preguntas[indice];

  function responder(acerto: boolean) {
    setResultado(acerto);
    if (acerto) setAciertos((a) => a + 1);
  }

  function continuar() {
    if (indice + 1 < total) {
      setIndice(indice + 1);
      setResultado(null);
      return;
    }
    setTerminada(true);
    if (aciertos >= necesarios) marcarSuperado(tema, nivel);
  }

  if (terminada) {
    const superado = aciertos >= necesarios;
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <p className="mb-2 text-5xl">{superado ? "🎉" : "💪"}</p>
        <h2 className="mb-2 text-2xl font-bold">{superado ? "¡Nivel superado!" : "Casi…"}</h2>
        <p className="mb-1 text-lg">
          {aciertos} de {total} correctas
        </p>
        <p className="mb-6 text-sm text-zinc-500">
          {superado
            ? nivel < 3
              ? `Desbloqueaste el nivel ${nivel + 1} de ${NOMBRE_TEMA[tema]}.`
              : `Completaste todos los niveles de ${NOMBRE_TEMA[tema]}.`
            : `Necesitás ${necesarios} de ${total} para superar el nivel. ¡Probá de nuevo!`}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={onSalir} className="rounded border border-zinc-300 px-4 py-2 hover:bg-zinc-50">
            Volver al mapa
          </button>
          <button type="button" onClick={onRepetir} className="rounded border border-zinc-300 px-4 py-2 hover:bg-zinc-50">
            Repetir nivel
          </button>
          {superado && nivel < 3 && (
            <button
              type="button"
              onClick={onSiguiente}
              className="rounded bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
            >
              Nivel {nivel + 1} →
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button type="button" onClick={onSalir} aria-label="Salir de la lección" className="text-2xl text-zinc-400 hover:text-zinc-700">
          ×
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{ width: `${((indice + (resultado !== null ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
        <span className="text-sm text-zinc-500">
          {indice + 1}/{total}
        </span>
      </div>

      <p className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
        {NOMBRE_TEMA[tema]} · Nivel {nivel}
        {!pregunta.revisada && " · sin revisar"}
      </p>

      <div className="markdown mb-5 text-lg">
        <Markdown>{pregunta.enunciado}</Markdown>
      </div>

      {/* key: cada pregunta arranca con su estado limpio */}
      {pregunta.tipo === "opcion_multiple" ? (
        <OpcionMultipleJuego key={pregunta.id} pregunta={pregunta} onResultado={responder} />
      ) : (
        <RespuestaAbierta key={pregunta.id} pregunta={pregunta} onResultado={responder} />
      )}

      {resultado !== null && (
        <div
          className={`mt-6 rounded-lg p-4 ${resultado ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}
        >
          <p className="mb-2 text-lg font-bold">
            {resultado
              ? "¡Bien!"
              : pregunta.tipo === "abierta"
                ? "Te faltaron puntos clave"
                : "Incorrecto"}
          </p>
          {pregunta.tipo === "opcion_multiple" && (
            <div className="markdown mb-3 text-sm text-zinc-800">
              <Markdown>{pregunta.explicacion ?? pregunta.respuestaModelo}</Markdown>
            </div>
          )}
          <button
            type="button"
            onClick={continuar}
            className={`w-full rounded-lg py-3 font-semibold text-white ${resultado ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}
