"use client"

import React from "react"
import FAQAccordion from "./FAQAccordion"
import FAQStackedArticles from "./FAQStackedArticles"

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
        <FAQStackedArticles
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
