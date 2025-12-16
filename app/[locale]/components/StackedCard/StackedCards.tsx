import React, { useEffect, useMemo, useRef } from "react";
import "./StackCards.css";

type StackCardsProps = {
    children: React.ReactNode[];
    /** px offset for sticky top (must match your CSS top) */
    stickyTop?: number;
    /** how strongly cards scale down while stacking */
    scaleIntensity?: number; // e.g. 0.05 in the tutorial
};

export function StackCards({
    children,
    stickyTop = 12,
    scaleIntensity = 0.05,
}: StackCardsProps) {
    const containerRef = useRef<HTMLUListElement | null>(null);
    const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

    // stable id count for refs
    const count = useMemo(() => React.Children.count(children), [children]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // respect reduced motion (similar to CodyHouse check) :contentReference[oaicite:2]{index=2}
        const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
        if (prefersReduced) return;

        const items = itemRefs.current.filter(Boolean) as HTMLLIElement[];
        if (items.length === 0) return;

        let rafId: number | null = null;
        let scrollListener: (() => void) | null = null;

        // read measurements once (and on resize)
        let cardHeight = 0;
        let marginY = 0;

        const readMeasurements = () => {
            // height of a card
            cardHeight = items[0].getBoundingClientRect().height;

            // vertical gap between cards (we infer it from layout)
            if (items.length > 1) {
                const r0 = items[0].getBoundingClientRect();
                const r1 = items[1].getBoundingClientRect();
                marginY = Math.max(0, r1.top - r0.bottom);
            } else {
                marginY = 0;
            }
        };

        const animate = () => {
            rafId = null;

            const containerTop = el.getBoundingClientRect().top;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                // Same idea as tutorial:
                // scrolling = stickyTop - containerTop - i*(cardHeight + marginY)
                // if scrolling > 0 => card is "fixed" (stuck), so scale it down. :contentReference[oaicite:3]{index=3}
                const scrolling = stickyTop - containerTop - i * (cardHeight + marginY);

                if (scrolling > 0) {
                    const scale = (cardHeight - scrolling * scaleIntensity) / cardHeight;
                    const clampedScale = Math.max(0.85, Math.min(1, scale)); // safety clamp
                    item.style.transform = `translateY(${marginY * i}px) scale(${clampedScale})`;
                } else {
                    // reset when not stuck
                    item.style.transform = `translateY(${marginY * i}px) scale(1)`;
                }
            }
        };

        const onScroll = () => {
            if (rafId != null) return;
            rafId = window.requestAnimationFrame(animate);
        };

        const start = () => {
            if (scrollListener) return;
            readMeasurements();
            scrollListener = onScroll;
            window.addEventListener("scroll", scrollListener, { passive: true });
            window.addEventListener("resize", readMeasurements);
            animate(); // run once immediately
        };

        const stop = () => {
            if (!scrollListener) return;
            window.removeEventListener("scroll", scrollListener);
            window.removeEventListener("resize", readMeasurements);
            scrollListener = null;
            if (rafId != null) cancelAnimationFrame(rafId);
            rafId = null;
        };

        // Observe when container is in viewport, then attach scroll listener
        // (same pattern as tutorial). :contentReference[oaicite:4]{index=4}
        const io = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting) start();
            else stop();
        });

        io.observe(el);

        return () => {
            io.disconnect();
            stop();
        };
    }, [stickyTop, scaleIntensity, count]);

    return (
        <ul ref={containerRef} className="stackCards">
            {React.Children.map(children, (child, i) => (
                <li
                    className="stackCardItem"
                    ref={(node) => {
                        itemRefs.current[i] = node;
                    }}
                >
                    {child}
                </li>
            ))}
        </ul>
    );
}
