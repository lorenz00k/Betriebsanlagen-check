import { ReactNode } from "react";

function splitCompoundWords(content: ReactNode): ReactNode {
  if (typeof content === "string") {
    return content.replace(/Betriebsanlagengenehmigung/g, "Betriebsanlagen Genehmigung");
  }

  return content;
}

export default function BreakText({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={`min-w-0 break-words [overflow-wrap:anywhere] [hyphens:auto] ${className}`}>
      {splitCompoundWords(children)}
    </span>
  );
}
