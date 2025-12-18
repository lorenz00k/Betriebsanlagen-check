import BreakText from "@/components/ui/BreakText";
import Link from "next/link";
import React from "react";

type HeroProps = {
    t: (key: string) => string;
    locale: string;
};

export default function Hero({ t, locale }: HeroProps) {
    return (
        <section className="section page-hero">
            <div className="page-hero__bg">
                <video
                    className="page-hero__video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    poster="/images/betriebsboerse/verkaufer-bild.jpg"
                >
                    <source src="/images/homepage/hero-video.mp4" type="video/mp4" />
                    <img
                        src="/images/betriebsboerse/verkaufer-bild.jpg"
                        alt=""
                        className="page-hero__fallback"
                    />
                </video>
            </div>

            <div className="page-hero__content">
                <h1 className="page-hero__title">
                    <BreakText className="block">{t("title")}</BreakText>
                </h1>

                <BreakText className="page-hero__copy block">{t("subtitle")}</BreakText>

                <div className="page-hero__stats" aria-label="Key stats">
                    <div className="page-hero__stat">
                        <div className="page-hero__statValue">{t("stats.value_language")}</div>
                        <div className="page-hero__statLabel">{t("stats.languages")}</div>
                    </div>
                    <div className="page-hero__stat">
                        <div className="page-hero__statValue">{t("stats.value_time")}</div>
                        <div className="page-hero__statLabel">{t("stats.time")}</div>
                    </div>
                    <div className="page-hero__stat">
                        <div className="page-hero__statValue">{t("stats.value_free")}</div>
                        <div className="page-hero__statLabel">{t("stats.free")}</div>
                    </div>
                </div>

                <Link href={`/${locale}/check`} className="hero-cta">
                    {t("home.card1Button")}
                </Link>
            </div>
        </section>
    );
}
