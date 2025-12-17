"use client";
import React from "react";
import styles from "./StackedCard.module.css";

type Card = { title: string; description: string };

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
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
