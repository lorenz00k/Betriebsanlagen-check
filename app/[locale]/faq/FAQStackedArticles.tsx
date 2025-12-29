"use client";
import React from "react";
import styles from "./FAQStackedArticles.module.css";

type Item = {
    title: React.ReactNode;
    body: React.ReactNode;
};

function cssVar(name: `--${string}`, value: string | number): React.CSSProperties {
    return { [name]: value } as React.CSSProperties;
}

export default function FAQStackedArticles({
    items,
}: {
    items: Item[];
}) {
    return (
        <section className={styles.section}>
            <div className={styles.cards} style={cssVar("--numcards", items.length)}>
                {items.map((item, idx) => (
                    <article
                        key={idx}
                        className={styles.card}
                        style={cssVar("--index", idx + 1)}
                    >
                        <div className={styles.card__content}>
                            {item.title}
                            {item.body}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
