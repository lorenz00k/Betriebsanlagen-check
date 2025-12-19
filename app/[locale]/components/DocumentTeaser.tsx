import React from "react";
import BreakText from "@/components/ui/BreakText";
import Link from "next/link";

type DocumentTeaserProps = {
    t: (key: string) => string;
    locale: string;
};

export default function DocumentTeaser({ t, locale }: DocumentTeaserProps) {
    return (
        <section className="section">
            <div className="document-teaser">
                <div className="document-teaser__content">
                    <h2 className="document-teaser__title">
                        <BreakText className="block">
                            {t("card2Title")}
                        </BreakText>
                    </h2>

                    <BreakText className="document-teaser__copy block">
                        {t("card2Description")}
                    </BreakText>

                    <Link
                        href={`/${locale}/documents`}
                        className="btn btn-primary document-teaser__cta"
                    >
                        {t("card2Button")}
                    </Link>
                </div>

                <div className="document-teaser__media">
                    <img
                        src="/images/homepage/feature-2.jpg"
                        alt=""
                        loading="lazy"
                    />
                </div>
            </div>
        </section>
    );
}
