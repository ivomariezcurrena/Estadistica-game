# App de estudio para el final de Estadística

Plan para construir, con Claude Code, una aplicación de práctica de preguntas y respuestas que sirva para preparar el final oral de Estadística (UNPSJB, Facultad de Ingeniería, sede Puerto Madryn).

## 1. Objetivo

Entrenar la **recuperación activa** de los conceptos con preguntas por tema y por nivel, y simular el formato real del examen: 30 minutos para armar un punteo y luego exponerlo oralmente a la mesa.

La app es una herramienta de estudio personal. No tiene usuarios, ni cuentas, ni backend en la primera versión.

## 2. Contexto del examen

- Al recibir la hoja hay 30 minutos para hacer un punteo de los conceptos necesarios para responder cada pregunta. Después se exponen oralmente a la mesa examinadora.
- Se evalúa que se entiendan y se puedan justificar los conceptos, no solo que se calcule.
- Temas vistos en los finales de referencia (2022 y 2026):
  - Estadística descriptiva: resumen de cinco números, diagrama de caja, RIC, sesgo.
  - Probabilidad: condicional, independencia, tablas de dos entradas, tipos de error.
  - Muestreo: Teorema Central del Límite, distribución de medias muestrales.
  - Inferencia: test de hipótesis para muestras pareadas, t de Student, p-valor.
  - Distribución de Poisson y sus supuestos.
  - Regresión lineal simple: interpretación de la salida de R, R², supuestos, causalidad.

## 3. Funcionalidades

### Versión mínima (MVP)

1. Banco de preguntas cargado desde un archivo JSON.
2. Filtro por **tema** y por **nivel**.
3. Dos tipos de pregunta:
   - **Opción múltiple:** se elige una opción y se muestra la explicación.
   - **Abierta:** se escribe la respuesta con las propias palabras, se muestra la respuesta modelo y una lista de **puntos clave**, y se marca qué puntos se cubrieron (autoevaluación).
4. Guardado del progreso en el navegador (`localStorage`).
5. Fórmulas renderizadas con KaTeX.

### Versión 2

6. **Niveles con desbloqueo:** se pasa al nivel siguiente de un tema con 80% de aciertos en las últimas 10 preguntas.
7. **Repetición espaciada** (cajas de Leitner, ver sección 6).
8. **Modo Repaso:** solo las preguntas que vencen hoy.
9. **Modo Simulacro:** temporizador de 30 minutos, una consigna tipo examen, un área de texto para escribir el punteo y, al terminar, el checklist de puntos clave para autoevaluarse.
10. Estadísticas por tema (aciertos, preguntas pendientes, racha).

### Versión 3 (opcional)

11. **Corrección de respuestas abiertas con IA** (Claude), que indica qué puntos clave faltan. Requiere un backend mínimo para no exponer la API key, por eso en ese caso conviene Next.js (ruta de API).
12. Instalable como PWA para usarla en el celular.

## 4. Niveles de dificultad

| Nivel | Qué evalúa | Ejemplo |
|---|---|---|
| 1 | Definiciones y reconocimiento | ¿Qué es el error estándar? |
| 2 | Aplicación y cálculo guiado | Calcular P(94 < X̄ < 106) con n = 49, μ = 100, σ = 21 |
| 3 | Justificación e interpretación (formato oral) | Explicar por qué un test pareado usa la t y no la normal |

## 5. Modelo de datos

```ts
type Tema =
  | "descriptiva"
  | "probabilidad"
  | "muestreo-tcl"
  | "test-hipotesis"
  | "poisson"
  | "regresion";

type Nivel = 1 | 2 | 3;

interface Pregunta {
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

interface Progreso {
  preguntaId: string;
  caja: 1 | 2 | 3 | 4 | 5;
  ultimaVez: string;          // ISO date
  proximaVez: string;         // ISO date
  aciertos: number;
  fallos: number;
}
```

### Ejemplo de pregunta

```json
{
  "id": "prob-001",
  "tema": "probabilidad",
  "nivel": 3,
  "tipo": "abierta",
  "enunciado": "En una tabla de probabilidades conjuntas falta una celda. ¿Cómo la obtenés y por qué en P(No apto | Rechazada) se divide por P(Rechazada) y no por 1?",
  "respuestaModelo": "Las cuatro celdas de la tabla conjunta suman 1, así que la celda faltante es 1 menos la suma de las otras tres. Al condicionar por Rechazada se reduce el espacio muestral a las muestras rechazadas, por eso se divide por P(Rechazada).",
  "puntosClave": [
    "Las probabilidades conjuntas suman 1",
    "P(A|B) = P(A ∩ B) / P(B)",
    "Condicionar reduce el espacio muestral al evento B"
  ],
  "fuente": "Final 2026, Ej. 1a",
  "revisada": false
}
```

## 6. Repetición espaciada (Leitner simplificado)

- Cada pregunta empieza en la caja 1.
- Si se acierta, sube una caja. Si se falla, vuelve a la caja 1.
- Intervalo de repaso por caja: 1 → hoy, 2 → 1 día, 3 → 3 días, 4 → 7 días, 5 → 14 días.
- En las preguntas abiertas, "acertar" es marcar que se cubrieron los puntos clave esenciales (autoevaluación honesta).

## 7. Stack técnico

| Pieza | Elección | Motivo |
|---|---|---|
| Framework | Vite + React + TypeScript | Ya lo conozco, es una app 100% interactiva y no necesita backend |
| Estilos | Tailwind CSS (o CSS simple) | Rapidez |
| Fórmulas | KaTeX (`react-katex`) | Para estadística |
| Markdown | `react-markdown` + `remark-math` + `rehype-katex` | Enunciados y respuestas con fórmulas |
| Persistencia | `localStorage` (después IndexedDB si hace falta) | Sin backend |
| Despliegue | Vercel o GitHub Pages | Gratis |
| Alternativa si se suma IA | Next.js con ruta de API | La API key queda en el servidor |

Astro se descartó porque está pensado para sitios de contenido y esta app es casi toda interactiva.

## 8. Estructura del repositorio

```
/
├── CLAUDE.md
├── material/            # TPs y finales (fuente de las preguntas)
│   ├── finales/
│   └── tps/
├── src/
│   ├── data/
│   │   └── preguntas.json
│   ├── components/
│   ├── lib/             # leitner.ts, storage.ts
│   └── main.tsx
└── README.md
```

## 9. Material de origen y cómo cargarlo

**Recomendación: dejar los PDFs en el repositorio, en `material/`.** Claude Code los lee directamente y tiene todo el contexto en el mismo lugar donde trabaja.

- Mejor si son PDFs con texto. Los escaneos o fotos manuscritas se leen peor, así que conviene pasar a texto lo importante.
- Si el material es de la cátedra, usar un **repositorio privado** o agregar `material/` al `.gitignore`.
- Cada pregunta generada debe indicar en `fuente` de dónde sale, y quedar con `revisada: false` hasta que yo la valide.

**Regla de generación:** Claude Code no inventa contenido. Las preguntas salen del material y de la teoría de la cátedra. Los resultados numéricos se verifican antes de marcarlas como revisadas.

## 10. Plan por fases

1. **Esqueleto:** proyecto Vite + React + TS, tipos, carga de `preguntas.json`.
2. **Modo estudio:** listar preguntas, filtrar por tema y nivel, responder opción múltiple.
3. **Preguntas abiertas:** área de texto, respuesta modelo y checklist de puntos clave.
4. **Progreso:** guardado en `localStorage` y vista de estadísticas simples.
5. **Banco de preguntas:** generar el primer lote desde `material/` y revisarlo a mano.
6. **Niveles y repetición espaciada:** desbloqueo por nivel, cajas de Leitner y modo Repaso.
7. **Simulacro:** temporizador de 30 minutos, punteo libre y autoevaluación.
8. **Opcional:** corrección con IA y PWA.

## 11. Criterios de aceptación del MVP

- Puedo elegir tema y nivel y responder preguntas de ambos tipos.
- Las fórmulas se ven bien.
- Al cerrar y abrir el navegador, el progreso sigue ahí.
- Hay al menos 40 preguntas revisadas entre los 6 temas.

## 12. Riesgos y cómo evitarlos

- **Gastar el tiempo de estudio en la app.** Mitigación: hacer solo el MVP, usar la app para estudiar desde el día 1 y sumar funciones después.
- **Preguntas con errores.** Mitigación: marcar `revisada` y contrastar con apuntes y finales antes de confiar en ellas.
- **Memorizar respuestas sin entender.** Mitigación: priorizar preguntas abiertas de nivel 3 y practicar el Simulacro con exposición oral.

## 13. Contenido sugerido para `CLAUDE.md`

```md
# App de estudio de Estadística

## Qué es
App web personal (sin backend) para practicar preguntas de Estadística con niveles,
opción múltiple y respuestas abiertas, y repaso espaciado. Preparación de un final oral.

## Stack
Vite + React + TypeScript, Tailwind, KaTeX (react-katex), react-markdown.
Persistencia en localStorage. Sin backend.

## Reglas
- Todo el contenido y la interfaz en español rioplatense.
- El modelo de datos está en docs/plan (interfaces Pregunta y Progreso). No cambiarlo sin avisar.
- Las preguntas se generan a partir de /material. No inventar contenido ni resultados
  numéricos: si hay un cálculo, verificarlo. Dejar `revisada: false`.
- Fórmulas en KaTeX. Mantener el código simple: es una app personal, no sobreingenierizar.

## Comandos
- npm run dev
- npm run build
```

## 14. Primer prompt para Claude Code

> Leé `CLAUDE.md` y `plan-app-estudio-estadistica.md`. Implementá solo la **fase 1 y 2**: proyecto Vite + React + TS, los tipos del modelo de datos, la carga de `src/data/preguntas.json` con 5 preguntas de ejemplo, el filtro por tema y nivel, y el modo estudio con opción múltiple. No hagas nada de las fases siguientes todavía. Cuando termines, mostrame cómo correrlo.
