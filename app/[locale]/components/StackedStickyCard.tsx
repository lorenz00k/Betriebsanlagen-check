"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
    slotRef,
}: {
    card: Card;
    index: number;
    total: number;
    stickyTopPx: number;
    cardHeight: number;
    slotRef: React.RefObject<HTMLDivElement | null>;
}) {
    const backLayers = Math.max(0, total - index - 1);

    const insetStep = 18;
    const liftStep = 14;

    const depth = index;

    // Tunables (so bekommst du den Screenshot-Look)
    const scaleStep = 0.03; // pro Depth-Ebene kleiner
    const baseScale = 1 - depth * scaleStep; // z.B. 1, 0.97, 0.94
    const baseY = -depth * 10; // optional: leicht hochgezogen

    // ✅ Scroll-Progress in meinem Slot
    const { scrollYProgress } = useScroll({
        target: slotRef,
        offset: ["start 85%", "start 25%"],
    });

    // ✅ während "übernehmen": von base -> full
    const scale = useTransform(scrollYProgress, [0, 1], [baseScale, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [baseY, 0]);

    return (
        <motion.div
            className="relative"
            style={{
                position: "sticky",
                top: stickyTopPx,
                zIndex: total - index,
                scale,
                y,
                transformOrigin: "center top",
            }}
        >
            {/* Back frames (Deko) */}
            {Array.from({ length: backLayers }).map((_, j) => {
                const n = j + 1;
                const opacity = Math.max(0.18, 0.38 - j * 0.08);
                return (
                    <div
                        key={n}
                        aria-hidden
                        className="pointer-events-none absolute rounded-3xl border border-slate-300 bg-white"
                        style={{
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
                            <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                                {card.title}
                            </h3>
                            <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-600">
                                {card.description}
                            </p>
                        </div>
                    </div>
                </div>
            </article>
        </motion.div>
    );
}

function CardSlot({
    card,
    i,
    total,
    stickyTopPx,
    cardHeight,
    slotExtraScroll,
    pullUp,
}: {
    card: Card;
    i: number;
    total: number;
    stickyTopPx: number;
    cardHeight: number;
    slotExtraScroll: number;
    pullUp: number;
}) {
    const slotRef = useRef<HTMLDivElement | null>(null);

    return (
        <div
            ref={slotRef}
            className="relative"
            style={{
                height: cardHeight + slotExtraScroll,
                marginTop: i === 0 ? 0 : -pullUp,
            }}
        >
            <CardDeck
                card={card}
                index={i}
                total={total}
                stickyTopPx={stickyTopPx}
                cardHeight={cardHeight}
                slotRef={slotRef}
            />
        </div>
    );
}



export default function StackedStickyCardSection() {
    const stickyTopPx = 96;
    const cardHeight = 340;
    const slotExtraScroll = 220;

    const overlapPeek = 28;
    const pullUp = cardHeight - overlapPeek;

    return (
        <section className="section section--compact">
            {/* Heading ... */}

            <div className="mx-auto mt-10 w-full max-w-4xl px-6 lg:px-10 overflow-visible">
                {cards.map((card, i) => (
                    <CardSlot
                        key={card.title}
                        card={card}
                        i={i}
                        total={cards.length}
                        stickyTopPx={stickyTopPx}
                        cardHeight={cardHeight}
                        slotExtraScroll={slotExtraScroll}
                        pullUp={pullUp}
                    />
                ))}

                <div style={{ height: 120 }} />
            </div>
        </section>
    );
}
