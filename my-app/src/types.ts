// Modelo de datos tal cual está en el plan (CLAUDE.md, sección 5). No cambiar sin avisar.

export type Tema =
  | "descriptiva"
  | "probabilidad"
  | "muestreo-tcl"
  | "test-hipotesis"
  | "poisson"
  | "regresion";

export type Nivel = 1 | 2 | 3;

export interface Pregunta {
  id: string;                 // ej: "prob-001"
  tema: Tema;
  nivel: Nivel;
  tipo: "opcion_multiple" | "abierta";
  enunciado: string;          // Markdown + KaTeX
  opciones?: { id: string; texto: string }[];
  respuestaCorrecta?: string; // id de la opción (solo opción múltiple)
  respuestaModelo: string;    // Markdown
  puntosClave: string[];      // checklist de autoevaluación (abiertas)
  explicacion?: string;
  fuente: string;             // ej: "Final 2026, Ej. 1a"
  revisada: boolean;          // false hasta que yo la valide
}

export interface Progreso {
  preguntaId: string;
  caja: 1 | 2 | 3 | 4 | 5;
  ultimaVez: string;          // ISO date
  proximaVez: string;         // ISO date
  aciertos: number;
  fallos: number;
}
