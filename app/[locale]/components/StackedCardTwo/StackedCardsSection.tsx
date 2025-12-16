"use client";

import styles from "./StackedCards.module.css";

type Card = { title: string; description: string };

const cards: Card[] = [
    { title: "Fragen beantworten", description: "Beantworte ein paar kurze Fragen zu deinem Betrieb und Standort." },
    { title: "Einschätzung erhalten", description: "Du bekommst eine erste Einschätzung, ob eine Genehmigung nötig ist." },
    { title: "Dokumente vorbereiten", description: "Wir zeigen dir, welche Unterlagen typischerweise gebraucht werden." },
];

export default function StackedCardsSection2() {
    return (
        <section className={styles.section}>
            <ul
                id={styles.cards} // oder className={styles.cards}
                className={styles.cards}
                style={{ ["--numcards" as any]: cards.length }}
            >
                {cards.map((c, idx) => (
                    <li
                        key={c.title}
                        className={styles.card}
                        style={{ ["--index" as any]: idx + 1 }} // 1-based wie im Demo
                    >
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
