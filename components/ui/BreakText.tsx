import { ReactNode } from "react";

export default function BreakText({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={`min-w-0 break-words [overflow-wrap:anywhere] [hyphens:auto] ${className}`}>
      {children}
    </span>
  );
}
