import type { Metadata } from "next";
import Link from "next/link";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estudio de Estadística",
  description: "Práctica de preguntas para el final oral de Estadística",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full bg-zinc-50 text-zinc-900">
        <nav className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-3xl gap-6 px-4 py-3 text-sm">
            <Link href="/juego" className="font-semibold hover:underline">
              Juego
            </Link>
            <Link href="/" className="hover:underline">
              Estudio
            </Link>
            <Link href="/estadisticas" className="hover:underline">
              Estadísticas
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
