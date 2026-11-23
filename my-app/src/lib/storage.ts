import { useMemo, useSyncExternalStore } from "react";
import type { Progreso } from "@/types";

// Progreso guardado en localStorage como { [preguntaId]: Progreso }.
export type MapaProgreso = Record<string, Progreso>;

const CLAVE = "estadistica-progreso";
const EVENTO = "progreso-actualizado";

function leer(): MapaProgreso {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? "{}") as MapaProgreso;
  } catch {
    return {};
  }
}

function escribir(mapa: MapaProgreso) {
  localStorage.setItem(CLAVE, JSON.stringify(mapa));
  window.dispatchEvent(new Event(EVENTO));
}

// Suma un acierto o un fallo a la pregunta. La caja y la próxima fecha de repaso
// quedan fijas (caja 1, repasar hoy) hasta implementar Leitner en la fase 6.
export function registrarRespuesta(preguntaId: string, acerto: boolean) {
  const mapa = leer();
  const ahora = new Date().toISOString();
  const previo = mapa[preguntaId];
  mapa[preguntaId] = {
    preguntaId,
    caja: previo?.caja ?? 1,
    ultimaVez: ahora,
    proximaVez: previo?.proximaVez ?? ahora,
    aciertos: (previo?.aciertos ?? 0) + (acerto ? 1 : 0),
    fallos: (previo?.fallos ?? 0) + (acerto ? 0 : 1),
  };
  escribir(mapa);
}

export function borrarProgreso() {
  localStorage.removeItem(CLAVE);
  window.dispatchEvent(new Event(EVENTO));
}

function suscribir(avisar: () => void) {
  window.addEventListener(EVENTO, avisar);
  window.addEventListener("storage", avisar); // cambios desde otra pestaña
  return () => {
    window.removeEventListener(EVENTO, avisar);
    window.removeEventListener("storage", avisar);
  };
}

// Hook para leer el progreso y re-renderizar cuando cambia.
// En el servidor no hay localStorage, así que devuelve un mapa vacío.
export function useProgreso(): MapaProgreso {
  const crudo = useSyncExternalStore(
    suscribir,
    () => localStorage.getItem(CLAVE),
    () => null,
  );
  return useMemo(() => {
    try {
      return crudo ? (JSON.parse(crudo) as MapaProgreso) : {};
    } catch {
      return {};
    }
  }, [crudo]);
}
