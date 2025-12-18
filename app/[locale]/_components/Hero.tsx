import BreakText from "@/components/ui/BreakText";
import React from "react";

type HeroProps = {
    t: (key: string) => string;
};

export default function Hero({ t }: HeroProps) {
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
                    poster="/images/homepage/hero-fallback.jpg"
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
                        <div className="page-hero__statValue">20+</div>
                        <div className="page-hero__statLabel">{t("stats.languages")}</div>
                    </div>
                    <div className="page-hero__stat">
                        <div className="page-hero__statValue">3–5</div>
                        <div className="page-hero__statLabel">{t("stats.time")}</div>
                    </div>
                    <div className="page-hero__stat">
                        <div className="page-hero__statValue">✓</div>
                        <div className="page-hero__statLabel">{t("stats.free")}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
