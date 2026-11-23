import preguntasJson from "@/data/preguntas.json";
import type { Pregunta } from "@/types";
import ModoEstudio from "@/components/ModoEstudio";

const preguntas = preguntasJson as Pregunta[];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold">Estudio para el final de Estadística</h1>
      <p className="mb-8 text-zinc-500">Modo estudio: elegí tema y nivel y respondé.</p>
      <ModoEstudio preguntas={preguntas} />
    </main>
  );
}
