import { useMemo, useSyncExternalStore } from "react";
import type { Nivel, Pregunta, Tema } from "@/types";
import { CLAVE_JUEGO, EVENTO, suscribir } from "./storage";

// Reglas del juego.
export const PREGUNTAS_POR_LECCION = 5;
export const MINIMO_PARA_SUPERAR = 4; // 4 de 5 = 80%, como pide el plan para desbloquear

// Por cada tema se guarda el nivel más alto superado (0 = ninguno).
// Se guarda aparte del Progreso del plan para no cambiar ese modelo.
export type NivelesSuperados = Partial<Record<Tema, 0 | Nivel>>;

function leer(): NivelesSuperados {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_JUEGO) ?? "{}") as NivelesSuperados;
  } catch {
    return {};
  }
}

export function marcarSuperado(tema: Tema, nivel: Nivel) {
  const superados = leer();
  if ((superados[tema] ?? 0) < nivel) {
    superados[tema] = nivel;
    localStorage.setItem(CLAVE_JUEGO, JSON.stringify(superados));
    window.dispatchEvent(new Event(EVENTO));
  }
}

export function useNivelesSuperados(): NivelesSuperados {
  const crudo = useSyncExternalStore(
    suscribir,
    () => localStorage.getItem(CLAVE_JUEGO),
    () => null,
  );
  return useMemo(() => {
    try {
      return crudo ? (JSON.parse(crudo) as NivelesSuperados) : {};
    } catch {
      return {};
    }
  }, [crudo]);
}

// Elige al azar hasta PREGUNTAS_POR_LECCION preguntas del tema y nivel.
// Se llama desde un evento (al tocar un nivel), no durante el render.
export function armarLeccion(preguntas: Pregunta[], tema: Tema, nivel: Nivel): Pregunta[] {
  const candidatas = preguntas.filter((p) => p.tema === tema && p.nivel === nivel);
  for (let i = candidatas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidatas[i], candidatas[j]] = [candidatas[j], candidatas[i]];
  }
  return candidatas.slice(0, PREGUNTAS_POR_LECCION);
}
