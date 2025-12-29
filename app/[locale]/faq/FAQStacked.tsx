"use client"

import React from "react"
import FAQAccordion from "./FAQAccordion"
import StackedArticles from "../_components/StackedCard/Q&A/StackedArticles"

type UIGroup = {
    id: string
    questions: readonly string[]
    title: string
    description: string
}

export default function FAQStacked({
    groups,
    openQuestion,
    onToggle,
    t,
}: {
    groups: readonly UIGroup[]
    openQuestion: string | null
    onToggle: (q: string) => void
    t: (key: string) => string
}) {
    return (
        <StackedArticles
            items={groups.map(g => ({
                title: <h3 className="card__title">{g.title}</h3>,
                body: (
                    <>
                        <p className="card__body">{g.description}</p>
                        <FAQAccordion
                            questions={[...g.questions]}
                            openQuestion={openQuestion}
                            onToggle={onToggle}
                            t={t}
                        />
                    </>
                ),
            }))}
        />
    )
}
