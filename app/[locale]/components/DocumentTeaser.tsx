import React from "react";
import BreakText from "@/components/ui/BreakText";
import Link from "next/link";
import styles from "./DocumentTeaser.module.css";

type DocumentTeaserProps = {
    t: (key: string) => string;
    locale: string;
};

export default function DocumentTeaser({ t, locale }: DocumentTeaserProps) {
    return (
        <section className="section">
            <div className={styles.documentTeaser}>
                <div className={styles.content}>
                    <h2 className={styles.title}>
                        <BreakText className="block">
                            {t("card2Title")}
                        </BreakText>
                    </h2>

                    <BreakText className={`${styles.hero} block`}>
                        {t("card2Description")}
                    </BreakText>

                    <Link
                        href={`/${locale}/documents`}
                        className={styles.cta}
                    >
                        {t("card2Button")}
                    </Link>
                </div>

                <div className={styles.media}>
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
