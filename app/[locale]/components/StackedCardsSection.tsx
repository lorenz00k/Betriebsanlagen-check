"use client";

type Card = {
    title: string;
    description: string;
};

const cards: Card[] = [
    { title: "Fragen beantworten", description: "Beantworte ein paar kurze Fragen zu deinem Betrieb und Standort." },
    { title: "Einschätzung erhalten", description: "Du bekommst eine erste Einschätzung, ob eine Genehmigung nötig ist." },
    { title: "Dokumente vorbereiten", description: "Wir zeigen dir, welche Unterlagen typischerweise gebraucht werden." },
];

function StackedStickyCard({
    card,
    index,
    offsetPx,
    stickyTopPx,
}: {
    card: Card;
    index: number;
    offsetPx: number;
    stickyTopPx: number;
}) {
    return (
        <article
            className="rounded-3xl border border-slate-200 bg-white shadow-[0_25px_60px_-35px_rgba(15,23,42,0.35)]"
            style={{
                position: "sticky",
                top: stickyTopPx,
                transform: `translateY(${index * offsetPx}px)`,
                zIndex: index + 1,
                height: "clamp(260px, 32vw, 360px)",
            }}
        >
            <div className="p-6 sm:p-7">
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                        {index + 1}
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">{card.title}</h3>
                        <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-600">{card.description}</p>

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
    // Tuning
    const stickyTopPx = 96; // entspricht etwa top-24 (24*4px)
    const offsetPx = 18;    // sichtbarer "Stack"-Versatz
    const spacerPx = cards.length * offsetPx + 400; // Scroll-Spielraum unten

    return (
        <section className="section section--compact">
            <div className="section__heading text-center">
                <p className="text-sm font-semibold tracking-wide text-slate-600">So funktioniert der Check</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                    In drei Schritten zur ersten Einschätzung
                </h2>
            </div>

            <div className="mx-auto mt-10 w-full max-w-4xl px-6 lg:px-10">
                {/* Wichtig: kein space-y hier, sonst schiebst du die Cards auseinander */}
                <div style={{ paddingBottom: spacerPx }}>
                    {cards.map((card, i) => (
                        <StackedStickyCard
                            key={card.title}
                            card={card}
                            index={i}
                            offsetPx={offsetPx}
                            stickyTopPx={stickyTopPx}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
