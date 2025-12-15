'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

type Card = {
    title: string
    description: string
}

const cards: Card[] = [
    {
        title: 'Fragen beantworten',
        description: 'Beantworte ein paar kurze Fragen zu deinem Betrieb und Standort.',
    },
    {
        title: 'Einschätzung erhalten',
        description: 'Du bekommst eine erste Einschätzung, ob eine Genehmigung nötig ist.',
    },
    {
        title: 'Dokumente vorbereiten',
        description: 'Wir zeigen dir, welche Unterlagen typischerweise gebraucht werden.',
    },
]

function StackedCard({
    card,
    index,
    total,
    progress,
}: {
    card: Card
    index: number
    total: number
    progress: MotionValue<number>
}) {
    const start = index * 0.22
    const end = start + 0.32

    const y = useTransform(progress, [start, end], [80, 0])
    const scale = useTransform(progress, [start, end], [0.98, 1])
    const opacity = useTransform(progress, [start, start + 0.12], [0, 1])

    const collapseStart = end
    const collapseEnd = Math.min(1, end + 0.25)
    const yCollapse = useTransform(progress, [collapseStart, collapseEnd], [0, -22])
    const scaleCollapse = useTransform(progress, [collapseStart, collapseEnd], [1, 0.965])

    return (
        <motion.div
            className="absolute inset-0 rounded-3xl border border-slate-200 bg-white shadow-[0_25px_60px_-35px_rgba(15,23,42,0.35)]"
            style={{
                zIndex: total - index,
                y,
                opacity,
                scale: useTransform(progress, [0, 1], [1 - index * 0.04, 1 - index * 0.04]),
                translateY: index * 20,
            }}
        >
            <motion.div
                className="h-full w-full p-6 sm:p-8"
                style={{ y: yCollapse, scale: scaleCollapse }}
            >
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                        {index + 1}
                    </div>

                    <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                            {card.title}
                        </h3>
                        <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600">
                            {card.description}
                        </p>

                        {index === total - 1 && (
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
            </motion.div>
        </motion.div>
    )
}

function DesktopStack() {
    const sectionRef = useRef<HTMLElement | null>(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end end'],
    })

    return (
        <section ref={sectionRef} className="relative h-[260vh]">
            <div className="sticky top-24 flex h-[calc(100vh-6rem)] items-center">
                <div className="mx-auto w-full max-w-screen-xl px-6 lg:px-10">
                    <div className="mb-8 text-center">
                        <p className="text-sm font-semibold tracking-wide text-slate-600">
                            So funktioniert der Check
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
                            In drei Schritten zur ersten Einschätzung
                        </h2>
                    </div>

                    <div className="relative mx-auto h-[380px] w-full max-w-4xl">
                        {cards.map((card, i) => (
                            <StackedCard
                                key={card.title}
                                card={card}
                                index={i}
                                total={cards.length}
                                progress={scrollYProgress}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function MobileList() {
    return (
        <section className="py-10">
            <div className="mx-auto w-full max-w-screen-xl px-6 lg:px-10">
                <p className="text-sm font-semibold tracking-wide text-slate-600">
                    So funktioniert der Check
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                    In drei Schritten zur ersten Einschätzung
                </h2>

                <div className="mt-6 grid gap-4">
                    {cards.map((c, i) => (
                        <div
                            key={c.title}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {c.title}
                                    </h3>
                                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                                        {c.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <a
                        href="#start-check"
                        className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Check starten
                    </a>
                </div>
            </div>
        </section>
    )
}

export default function StackedCardsSection() {
    return (
        <>
            <div className="lg:hidden">
                <MobileList />
            </div>
            <div className="hidden lg:block">
                <DesktopStack />
            </div>
        </>
    )
}
