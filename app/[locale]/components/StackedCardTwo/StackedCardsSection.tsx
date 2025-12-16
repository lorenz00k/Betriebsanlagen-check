"use client";

import styles from "./StackedCards.module.css";

type Card = { title: string; description: string };

const cards: Card[] = [
    { title: "Fragen beantworten", description: "Beantworte ein paar kurze Fragen zu deinem Betrieb und Standort." },
    { title: "Einschätzung erhalten", description: "Du bekommst eine erste Einschätzung, ob eine Genehmigung nötig ist." },
    { title: "Dokumente vorbereiten", description: "Wir zeigen dir, welche Unterlagen typischerweise gebraucht werden." },
];

function cssVar(name: `--${string}`, value: string | number): React.CSSProperties {
    return { [name]: value } as React.CSSProperties;
}


export default function StackedCardsSection2() {
    return (
        <section className={styles.section}>
            <ul className={styles.cards} style={cssVar("--numcards", cards.length)}>
                {cards.map((c, idx) => (
                    <li key={c.title} className={styles.card} style={cssVar("--index", idx + 1)}>
                        <div className={styles.card__content}>
                            ...
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
