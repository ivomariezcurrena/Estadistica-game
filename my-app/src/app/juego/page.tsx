import preguntasJson from "@/data/preguntas.json";
import type { Pregunta } from "@/types";
import Juego from "@/components/juego/Juego";

const preguntas = preguntasJson as Pregunta[];

export default function PaginaJuego() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold">Juego</h1>
      <Juego preguntas={preguntas} />
    </main>
  );
}
