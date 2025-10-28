import React from "react";

export default function LegalDisclaimer({ lang = "de" }: { lang?: "de" | "en" }) {
  if (lang === "en") {
    return (
      <p className="text-sm text-neutral-500 mt-4">
        This tool provides a legally grounded orientation based on the 2nd Exemption Regulation (2. GFVO) and the Trade Act (GewO). It is not legal advice and not a binding authority decision. Competent authority in Vienna: MA 36 – Commercial Installations.
      </p>
    );
  }
  return (
    <p className="text-sm text-neutral-500 mt-4">
      Dieses Tool bietet eine rechtlich fundierte Orientierung auf Grundlage der 2. Genehmigungsfreistellungsverordnung (2. GFVO) und der Gewerbeordnung (GewO). Es ist keine Rechtsberatung und keine behördliche Entscheidung. Zuständige Behörde in Wien: MA 36 – Betriebsanlagen.
    </p>
  );
}
