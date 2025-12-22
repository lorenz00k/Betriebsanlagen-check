"use client";

import BreakText from "@/components/ui/BreakText";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type HeroProps = {
    t: (key: string, values?: Record<string, unknown>) => string;
    locale: string;
};

export default function Hero({ t, locale }: HeroProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [useImageFallback, setUseImageFallback] = useState(false);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        let settled = false;

        const markFallback = () => {
            if (!settled) {
                settled = true;
                setUseImageFallback(true);
            }
        };

        const markPlaying = () => {
            if (!settled) {
                settled = true;
                setUseImageFallback(false);
            }
        };

        // If playback starts -> keep video
        v.addEventListener("playing", markPlaying);
        v.addEventListener("canplay", () => {
            // try to play when we can
            v.play().catch(markFallback);
        });

        // If something goes wrong -> fallback
        v.addEventListener("error", markFallback);
        v.addEventListener("stalled", markFallback);
        v.addEventListener("abort", markFallback);

        // Try immediately as well
        v.play().catch(() => { /* will fallback by timer below */ });

        // If it hasn't started after ~1s, assume mobile blocked it
        const timer = window.setTimeout(() => {
            if (v.paused || v.readyState < 3) markFallback();
        }, 1200);

        return () => {
            window.clearTimeout(timer);
            v.removeEventListener("playing", markPlaying);
            v.removeEventListener("error", markFallback);
            v.removeEventListener("stalled", markFallback);
            v.removeEventListener("abort", markFallback);
        };
    }, []);

    return (
        <section className="section page-hero">
            <div className="page-hero__bg">
                {/* Video (only visible if it actually plays) */}
                <video
                    ref={videoRef}
                    className={`page-hero__video ${useImageFallback ? "is-hidden" : ""}`}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    poster="/images/betriebsboerse/verkaufer-bild.jpg"
                >
                    <source src="/images/homepage/hero-video.mp4" type="video/mp4" />
                </video>

                {/* Image fallback (visible only when video fails) */}
                <img
                    className={`page-hero__poster ${useImageFallback ? "is-visible" : ""}`}
                    src="/images/betriebsboerse/verkaufer-bild.jpg"
                    alt=""
                />
            </div>

            <div className="page-hero__content">
                <h1 className="page-hero__title">
                    <BreakText className="block">{t("title")}</BreakText>
                </h1>

                <BreakText className="page-hero__copy block">{t("subtitle")}</BreakText>

                <div className="page-hero__stats" aria-label="Key stats">
                    <div className="page-hero__stat">
                        <div className="page-hero__statValue">{t("stats.value_language", { value: 8 })}</div>
                        <div className="page-hero__statLabel">{t("stats.languages")}</div>
                    </div>
                    <div className="page-hero__stat">
                        <div className="page-hero__statValue">{t("stats.value_time", { value: 3 })}</div>
                        <div className="page-hero__statLabel">{t("stats.time")}</div>
                    </div>
                    <div className="page-hero__stat">
                        <div className="page-hero__statValue">{t("stats.value_free")}</div>
                        <div className="page-hero__statLabel">{t("stats.free")}</div>
                    </div>
                </div>

                <Link href={`/${locale}/check`} className="hero-cta">
                    {t("cardButton")}
                </Link>
            </div>
        </section>
    );
}
