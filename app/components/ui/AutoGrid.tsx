import { ReactNode, type CSSProperties } from "react";

export default function AutoGrid({
  children,
  className = "",
  min = "16rem",
  gap = "1rem",
}: {
  children: ReactNode;
  className?: string;
  min?: string;
  gap?: string;
}) {
  const style = {
    gap,
    "--min": min,
  } as CSSProperties & Record<string, string>;

  return (
    <div
      className={`grid [grid-template-columns:repeat(auto-fit,minmax(var(--min),1fr))] gap-x-4 gap-y-4 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
