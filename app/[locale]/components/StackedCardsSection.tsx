"use client";

type Card = {
    title: string;
    description: string;
};

const cards: Card[] = [
    {
        title: "Fragen beantworten",
        description: "Beantworte ein paar kurze Fragen zu deinem Betrieb und Standort.",
    },
    {
        title: "Einschätzung erhalten",
        description: "Du bekommst eine erste Einschätzung, ob eine Genehmigung nötig ist.",
    },
    {
        title: "Dokumente vorbereiten",
        description: "Wir zeigen dir, welche Unterlagen typischerweise gebraucht werden.",
    },
];

function ArrowRight() {
    return (
        <div className="hidden md:flex items-center justify-center px-3 text-slate-400">
            <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
            >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
            </svg>
        </div>
    );
}

function ArrowDown() {
    return (
        <div className="flex md:hidden items-center justify-center py-2 text-slate-400">
            <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
            >
                <path d="M12 5v14" />
                <path d="M6 13l6 6 6-6" />
            </svg>
        </div>
    );
}

function StackedStickyCard({
    card,
    index,
    offsetRem,
    stickyTopRem,
}: {
    card: Card;
    index: number;
    offsetRem: number;
    stickyTopRem: number;
}) {
    return (
        <article
            className="card card--subtle rounded-3xl border border-slate-200 bg-white shadow-[0_25px_60px_-35px_rgba(15,23,42,0.35)]"
            style={{
                position: "sticky",
                top: `${stickyTopRem}rem`,
                transform: `translateY(${index * offsetRem}rem)`,
                zIndex: 50 - index,
            }}
        >
            <div className="p-6 sm:p-7">
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                        {index + 1}
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                            {card.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-600">
                            {card.description}
                        </p>

                        {index === cards.length - 1 && (
                            <div className="mt-6">
                                <a
                                    href="#start-check"
                                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                                >
                                    Check starten
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function StackedCardsSection() {
    // “Artikel”-Parameter
    const offsetRem = 1.25;      // Abstand zwischen Karten im Stack
    const stickyTopRem = 6;      // wie weit von oben “klebt” die Karte (z.B. top-24 ~= 6rem)
    const spacerRem = cards.length * offsetRem + 8; // Scroll-Spielraum unten

    return (
        <section className="section section--compact">
            <div className="section__heading text-center">
                <p className="text-sm font-semibold tracking-wide text-slate-600">
                    So funktioniert der Check
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                    In drei Schritten zur ersten Einschätzung
                </h2>
            </div>

            {/* Wrapper:
          - max-w / centered
          - paddingBottom = “Spacer” damit Sticky wirklich scrollen kann
      */}
            <div className="mx-auto mt-10 w-full max-w-4xl px-6 lg:px-10">
                <div style={{ paddingBottom: `${spacerRem}rem` }} className="space-y-5">
                    {cards.map((card, i) => (
                        <div key={card.title}>
                            <StackedStickyCard
                                card={card}
                                index={i}
                                offsetRem={offsetRem}
                                stickyTopRem={stickyTopRem}
                            />

                            {/* Optional: Pfeile zwischen Karten */}
                            {i < cards.length - 1 && (
                                <>
                                    <ArrowDown />
                                    <ArrowRight />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
