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
            {/* Why Betriebsanlage important */}
            <div className="section__heading">
                <h4>
                    <BreakText className="block">
                        {t("seo.heading")}
                    </BreakText>
                </h4>
                <h1>
                    <BreakText className="section__copy block">
                        {t("seo.intro")}
                    </BreakText>
                </h1>
            </div>

            {/*stats*/}
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
        </section>
    );
}
