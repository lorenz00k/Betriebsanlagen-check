import { StackCards } from "./StackedCards";
import styles from "./Card.module.css";

type Card = { title: string; description: string };

const cards: Card[] = [
    { title: "Fragen beantworten", description: "Beantworte ein paar kurze Fragen zu deinem Betrieb und Standort." },
    { title: "Einschätzung erhalten", description: "Du bekommst eine erste Einschätzung, ob eine Genehmigung nötig ist." },
    { title: "Dokumente vorbereiten", description: "Wir zeigen dir, welche Unterlagen typischerweise gebraucht werden." },
];

export default function Card() {
    return (
        <section style={{ padding: "48px 0", minHeight: "200vh" }}>
            <StackCards stickyTop={12}>
                {cards.map((c) => (
                    <article key={c.title} className={styles.myCard}>
                        <h3 className={styles.myCardTitle}>{c.title}</h3>
                        <p className={styles.myCardDesc}>{c.description}</p>
                    </article>
                ))}
            </StackCards>
        </section>
    );
}