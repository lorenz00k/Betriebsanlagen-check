"use client";
import React from "react";
import styles from "./StackedCard.module.css";
import Link from "next/link";

type Card = {
    title: string
    description: string
    bullets?: string[]
    cta?: { label: string; href: string }
}

function cssVar(name: `--${string}`, value: string | number): React.CSSProperties {
    return { [name]: value } as React.CSSProperties;
}


export default function StackedCard({ cards }: { cards: Card[] }) {
    return (
        <section className={styles.section}>
            <ul className={styles.cards} style={cssVar("--numcards", cards.length)}>
                {cards.map((c, idx) => (
                    <li key={c.title} className={styles.card} style={cssVar("--index", idx + 1)}>
                        <div className={styles.card__content}>
                            <h3 className={styles.title}>{c.title}</h3>
                            <p className={styles.desc}>{c.description}</p>
                            {c.bullets?.length ? (
                                <ul className={styles.bullets}>
                                    {c.bullets.map((b) => (
                                        <li key={b} className={styles.bullet}>{b}</li>
                                    ))}
                                </ul>
                            ) : null}
                            {c.cta ? (
                                <div className={styles.ctaRow}>
                                    <Link href={c.cta.href} className={styles.cta}>
                                        {c.cta.label}
                                        <span className={styles.ctaArrow} aria-hidden>→</span>
                                    </Link>
                                </div>
                            ) : null}

                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
