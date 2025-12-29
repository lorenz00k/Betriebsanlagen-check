"use client";
import React from "react";
import styles from "./FAQAccordion.module.css";

type FAQAccordionProps = {
    questions: string[];
    openQuestion: string | null;
    onToggle: (q: string) => void;
    t: (key: string) => string;
};

export default function FAQAccordion({
    questions,
    openQuestion,
    onToggle,
    t,
}: FAQAccordionProps) {
    return (
        <div className={styles.accordion}>
            {questions.map((q) => (
                <div key={q} className={styles.item}>
                    <button
                        className={styles.trigger}
                        onClick={() => onToggle(q)}
                        aria-expanded={openQuestion === q}
                        aria-controls={`answer-${q}`}
                        id={`question-${q}`}
                    >
                        <span className={styles.question}>{t(`questions.${q}.question`)}</span>

                        <svg
                            className={`${styles.chevron} ${openQuestion === q ? styles.chevronOpen : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div
                        id={`answer-${q}`}
                        role="region"
                        aria-labelledby={`question-${q}`}
                        className={`${styles.collapse} ${openQuestion === q ? styles.expand : ""}`}
                    >
                        <div className={styles.panel}>{t(`questions.${q}.answer`)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
