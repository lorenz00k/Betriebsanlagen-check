"use client";
import React from "react";

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
        <div className="mt-6 space-y-3">
            {questions.map((q) => (
                <div key={q} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
                    <button
                        onClick={() => onToggle(q)}
                        className="w-full text-left p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        aria-expanded={openQuestion === q}
                        aria-controls={`answer-${q}`}
                        id={`question-${q}`}
                    >
                        <span className="text-lg font-semibold text-gray-900 pr-4">
                            {t(`questions.${q}.question`)}
                        </span>
                        <svg
                            className={`w-6 h-6 text-blue-600 flex-shrink-0 transition-transform duration-300 ${openQuestion === q ? "rotate-180" : ""
                                }`}
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
                        className={`transition-all duration-300 ease-in-out ${openQuestion === q ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                    >
                        <div className="p-5 pt-0 text-gray-700 leading-relaxed border-t border-gray-100">
                            {t(`questions.${q}.answer`)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
