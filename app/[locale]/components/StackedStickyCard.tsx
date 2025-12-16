"use client";

type Card = { title: string; description: string };

const cards: Card[] = [
    { title: "Fragen beantworten", description: "Beantworte ein paar kurze Fragen zu deinem Betrieb und Standort." },
    { title: "Einschätzung erhalten", description: "Du bekommst eine erste Einschätzung, ob eine Genehmigung nötig ist." },
    { title: "Dokumente vorbereiten", description: "Wir zeigen dir, welche Unterlagen typischerweise gebraucht werden." },
];

function CardDeck({
    card,
    index,
    total,
    stickyTopPx,
    cardHeight,
}: {
    card: Card;
    index: number;
    total: number;
    stickyTopPx: number;
    cardHeight: number;
}) {
    // so viele "Back Cards", wie wirklich noch kommen (max 3 ist bei 3 cards sowieso erfüllt)
    const backLayers = Math.max(0, total - index - 1);

    const insetStep = 18; // wie stark die Back-Cards kleiner werden
    const liftStep = 14;  // wie stark sie nach oben rutschen

    return (
        <div
            className="relative"
            style={{
                position: "sticky",
                top: stickyTopPx,
                zIndex: index + 1, // spätere Karten liegen beim Überlappen vorne
            }}
        >
            {/* Back frames */}
            {Array.from({ length: backLayers }).map((_, j) => {
                const n = j + 1;
                const opacity = Math.max(0.18, 0.38 - j * 0.08); // vorne stärker, hinten schwächer
                return (
                    <div
                        key={n}
                        aria-hidden
                        className="pointer-events-none absolute rounded-3xl border border-slate-300 bg-white"
                        style={{
                            // "Deck" Look: kleiner + nach oben versetzt
                            inset: `${n * insetStep}px`,
                            transform: `translateY(${-n * liftStep}px)`,
                            opacity,
                        }}
                    />
                );
            })}

            {/* Front card */}
            <article
                className="relative rounded-3xl border border-slate-200 bg-white shadow-[0_25px_60px_-35px_rgba(15,23,42,0.35)]"
                style={{ height: cardHeight }}
            >
                <div className="h-full p-6 sm:p-7">
                    <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                            {index + 1}
                        </div>

                        <div className="min-w-0">
                            <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">{card.title}</h3>
                            <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-600">{card.description}</p>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}

export default function StackedStickyCardSection() {
    const stickyTopPx = 96;

    // Alle gleich groß (wichtig für sauberen Stack)
    const cardHeight = 340;

    // Wie viel “Scroll-Zeit” jede Karte bekommt, bevor die nächste übernimmt
    const slotExtraScroll = 220;

    return (
        <section className="section section--compact">
            <div className="section__heading text-center">
                <p className="text-sm font-semibold tracking-wide text-slate-600">So funktioniert der Check</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                    In drei Schritten zur ersten Einschätzung
                </h2>
            </div>

            <div className="mx-auto mt-10 w-full max-w-4xl px-6 lg:px-10 overflow-visible">
                {cards.map((card, i) => {
                    // wie stark soll die nächste Karte "unter" der vorherigen noch sichtbar bleiben?
                    const overlapPeek = 28; // px (optischer Abstand)
                    const pullUp = cardHeight - overlapPeek;

                    return (
                        <div
                            key={card.title}
                            className="relative"
                            style={{
                                height: cardHeight + slotExtraScroll,
                                marginTop: i === 0 ? 0 : -pullUp,  // ✅ das ist der Stapel-Trick
                            }}
                        >
                            <CardDeck
                                card={card}
                                index={i}
                                total={cards.length}
                                stickyTopPx={stickyTopPx}
                                cardHeight={cardHeight}
                            />
                        </div>
                    );
                })}

                <div style={{ height: 120 }} />
            </div>

        </section>
    );
}
