import preguntasJson from "@/data/preguntas.json";
import type { Pregunta } from "@/types";
import Estadisticas from "@/components/Estadisticas";

const preguntas = preguntasJson as Pregunta[];

export default function PaginaEstadisticas() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold">Estadísticas</h1>
      <p className="mb-8 text-zinc-500">Tu progreso por tema, guardado en este navegador.</p>
      <Estadisticas preguntas={preguntas} />
    </main>
  );
}
