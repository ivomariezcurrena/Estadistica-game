"use client";

import { useState } from "react";
import type { Pregunta } from "@/types";
import Markdown from "./Markdown";
import { registrarRespuesta } from "@/lib/storage";

// Pregunta abierta: escribís tu respuesta, ves la respuesta modelo y marcás
// qué puntos clave cubriste (autoevaluación).
// En el juego se pasa `onResultado` para avisar el resultado; ahí no se ofrece reintentar.
export default function RespuestaAbierta({
  pregunta,
  onResultado,
}: {
  pregunta: Pregunta;
  onResultado?: (acerto: boolean) => void;
}) {
  const [texto, setTexto] = useState("");
  const [mostrada, setMostrada] = useState(false);
  const [cubiertos, setCubiertos] = useState<boolean[]>(() => pregunta.puntosClave.map(() => false));

  // null = todavía no se registró; si no, si contó como acierto.
  const [resultado, setResultado] = useState<boolean | null>(null);
  const [esReintento, setEsReintento] = useState(false);

  const cantidad = cubiertos.filter(Boolean).length;
  const todos = cantidad === pregunta.puntosClave.length;

  // Cuenta como acierto si se cubrieron todos los puntos clave.
  // Solo se registra el primer intento; los reintentos son de práctica.
  function registrar() {
    registrarRespuesta(pregunta.id, todos);
    setResultado(todos);
    onResultado?.(todos);
  }

  function alternar(i: number) {
    setCubiertos((prev) => prev.map((v, j) => (j === i ? !v : v)));
  }

  function reiniciar() {
    setTexto("");
    setMostrada(false);
    setCubiertos(pregunta.puntosClave.map(() => false));
    if (resultado !== null) setEsReintento(true);
  }

  return (
    <div>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        readOnly={mostrada}
        rows={6}
        placeholder="Escribí tu respuesta con tus propias palabras…"
        className="w-full rounded border border-zinc-300 bg-white p-3 text-sm read-only:bg-zinc-50"
      />

      {!mostrada ? (
        <button
          type="button"
          onClick={() => setMostrada(true)}
          disabled={texto.trim() === ""}
          className="mt-2 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          Ver respuesta modelo
        </button>
      ) : (
        <div className="mt-4 space-y-4 rounded bg-zinc-50 p-4">
          <div>
            <h3 className="mb-1 font-semibold">Respuesta modelo</h3>
            <div className="markdown">
              <Markdown>{pregunta.respuestaModelo}</Markdown>
            </div>
          </div>

          {pregunta.puntosClave.length > 0 && (
            <div>
              <h3 className="mb-1 font-semibold">Puntos clave: ¿cuáles cubriste?</h3>
              <ul className="space-y-1">
                {pregunta.puntosClave.map((punto, i) => (
                  <li key={i}>
                    <label className="flex cursor-pointer items-start gap-2">
                      <input
                        type="checkbox"
                        checked={cubiertos[i]}
                        onChange={() => alternar(i)}
                        disabled={resultado !== null && !esReintento}
                        className="mt-1"
                      />
                      <Markdown inline>{punto}</Markdown>
                    </label>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-zinc-600">
                Cubriste {cantidad} de {pregunta.puntosClave.length} puntos clave.
              </p>
            </div>
          )}

          {resultado === null ? (
            <button
              type="button"
              onClick={registrar}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              {onResultado ? "Comprobar" : "Guardar autoevaluación"}
            </button>
          ) : onResultado ? null : esReintento ? (
            <p className="text-sm text-zinc-500">Intento de práctica: no se guarda en el progreso.</p>
          ) : (
            <p className={`text-sm font-semibold ${resultado ? "text-green-700" : "text-red-700"}`}>
              {resultado
                ? "Guardado como acierto."
                : "Guardado como fallo: para que cuente como acierto tenés que cubrir todos los puntos clave."}
            </p>
          )}

          {!onResultado && (
            <button type="button" onClick={reiniciar} className="block text-sm text-blue-700 underline">
              Volver a intentar{resultado !== null && " (no se guarda)"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
