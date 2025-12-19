import React from "react";
import BreakText from "@/components/ui/BreakText";

type SectionHeadingProps = {
    title: string;
    subtitle?: string;
};

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
    return (
        <div className="section__heading">
            <h1 className="section__title">
                <BreakText className="block">{title}</BreakText>
            </h1>

            {subtitle && (
                <h4 className="section__subtitle">
                    <BreakText className="block">{subtitle}</BreakText>
                </h4>
            )}
        </div>
    );
}
