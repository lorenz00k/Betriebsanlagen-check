"use client";

type Step = {
    title: string;
    text: string;
};

function ArrowRight() {
    return (
        <div className="hidden md:flex items-center justify-center px-2 text-slate-500">
            <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
            >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
            </svg>
        </div>
    );
}

function ArrowDown() {
    return (
        <div className="flex md:hidden items-center justify-center py-1 text-slate-500">
            <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
            >
                <path d="M12 5v14" />
                <path d="M6 13l6 6 6-6" />
            </svg>
        </div>
    );
}

function StepCard({ step, index }: { step: Step; index: number }) {
    return (
        <div className="card card--subtle flex-1">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
                    {index + 1}
                </div>
                <div className="min-w-0">
                    <h3 className="card__title">{step.title}</h3>
                    <div className="card__body">{step.text}</div>
                </div>
            </div>
        </div>
    );
}

/**
 * - < md: untereinander + Down-Pfeile
 * - >= md: nebeneinander + Right-Pfeile
 */
export default function FlowSteps({ steps }: { steps: Step[] }) {
    return (
        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-stretch md:justify-between md:gap-6">
            {steps.map((step, i) => (
                <div key={step.title} className="flex flex-col md:flex-row md:items-center md:flex-1">
                    <div className="md:flex-1">
                        <StepCard step={step} index={i} />
                    </div>

                    {i < steps.length - 1 && (
                        <>
                            <ArrowDown />
                            <ArrowRight />
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}