import React from "react";
import { Zap, Languages, Shield, Sparkles } from "lucide-react";
import BreakText from "@/components/ui/BreakText";
import AutoGrid from "@/components/ui/AutoGrid";

type SellingPointsProps = {
    t: (key: string) => string;
};

export default function SellingPoints({ t }: SellingPointsProps) {
    return (
        <section className="section section--compact">
            <AutoGrid min="14rem" className="mt-10">
                <article className="card card--subtle">
                    <div className="card__icon card__icon--accent-soft">
                        <Zap className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <h3 className="card__title">
                        <BreakText className="block">{t("seo.feature1Title")}</BreakText>
                    </h3>
                    <BreakText className="card__body block">{t("seo.feature1Text")}</BreakText>
                </article>

                <article className="card card--subtle">
                    <div className="card__icon card__icon--success">
                        <Languages className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <h3 className="card__title">
                        <BreakText className="block">{t("seo.feature2Title")}</BreakText>
                    </h3>
                    <BreakText className="card__body block">{t("seo.feature2Text")}</BreakText>
                </article>

                <article className="card card--subtle">
                    <div className="card__icon card__icon--shield">
                        <Shield className="w-6 h-6" strokeWidth={2} />
                    </div>
                    <h3 className="card__title">
                        <BreakText className="block">{t("seo.feature3Title")}</BreakText>
                    </h3>
                    <BreakText className="card__body block">{t("seo.feature3Text")}</BreakText>
                </article>
            </AutoGrid>

            <div className="surface-muted mt-12 flex flex-col gap-6 md:flex-row md:items-center">
                <div className="card__icon">
                    <Sparkles className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="flex-1 space-y-3">
                    <h3 className="card__title">
                        <BreakText className="block">{t("seo.whyTitle")}</BreakText>
                    </h3>
                    <BreakText className="card__body text-lg block">{t("seo.whyText")}</BreakText>
                </div>
            </div>
        </section>
    );
}
