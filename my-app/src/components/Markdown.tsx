import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// Renderiza Markdown con fórmulas KaTeX ($...$ en línea y $$...$$ en bloque).
// Con `inline`, los párrafos se vuelven <span> para poder usarlo dentro de botones.
export default function Markdown({ children, inline = false }: { children: string; inline?: boolean }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={inline ? { p: ({ children }) => <span>{children}</span> } : undefined}
    >
      {children}
    </ReactMarkdown>
  );
}
