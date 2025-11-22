"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileCheck,
  Globe2,
  Lock,
  MapPin,
  Sparkles,
  Timer,
} from "lucide-react";
import { defaultLocale } from "@/i18n";

const STEP_ICONS = [Sparkles, CheckCircle2, FileCheck];
const TRUST_ICONS = [Timer, Globe2, Lock, BadgeCheck];

export default function Home() {
  const t = useTranslations("home");
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const paramLocale = params?.locale;
  const activeLocale = Array.isArray(paramLocale) ? paramLocale[0] : paramLocale ?? defaultLocale;

  const [sector, setSector] = useState("retail");
  const [locationType, setLocationType] = useState("vienna");

  const steps = [
    { title: t("steps.items.0.title"), description: t("steps.items.0.description") },
    { title: t("steps.items.1.title"), description: t("steps.items.1.description") },
    { title: t("steps.items.2.title"), description: t("steps.items.2.description") },
  ];

  const trustPoints = [
    { title: t("trust.items.0.title"), description: t("trust.items.0.description") },
    { title: t("trust.items.1.title"), description: t("trust.items.1.description") },
    { title: t("trust.items.2.title"), description: t("trust.items.2.description") },
    { title: t("trust.items.3.title"), description: t("trust.items.3.description") },
  ];

  const infoCards = [
    { title: t("info.cards.0.title"), description: t("info.cards.0.description") },
    { title: t("info.cards.1.title"), description: t("info.cards.1.description") },
  ];

  const handleStart = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/${activeLocale}/check`);
  };

  return (
    <main className="landing">
      <div className="site-container space-y-16 lg:space-y-20">
        <section className="landing-hero">
          <div className="hero-text">
            <span className="eyebrow">{t("hero.eyebrow")}</span>
            <h1 className="hero-title">{t("hero.headline")}</h1>
            <p className="hero-subtitle">{t("hero.subheadline")}</p>
            <div className="hero-actions">
              <Link href={`/${activeLocale}/check`} className="btn btn-primary">
                {t("hero.primaryCta")} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#how-it-works" className="btn btn-ghost">
                {t("hero.secondaryCta")}
              </Link>
            </div>
            <div className="hero-highlights">
              <span>{t("hero.highlights.0")}</span>
              <span>{t("hero.highlights.1")}</span>
              <span>{t("hero.highlights.2")}</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card__header">
                <div className="hero-card__icon">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="hero-card__eyebrow">{t("hero.visual.label")}</p>
                  <p className="hero-card__title">{t("hero.visual.title")}</p>
                </div>
              </div>
              <ul className="hero-list">
                <li>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t("hero.visual.points.0")}</span>
                </li>
                <li>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t("hero.visual.points.1")}</span>
                </li>
                <li>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t("hero.visual.points.2")}</span>
                </li>
              </ul>
              <div className="hero-card__footer">
                <div>
                  <p className="hero-card__meta">{t("hero.visual.metaTitle")}</p>
                  <p className="hero-card__value">{t("hero.visual.metaValue")}</p>
                </div>
                <Link className="text-link" href={`/${activeLocale}/documents`}>
                  {t("hero.visual.cta")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="section-block">
          <div className="section-heading">
            <p className="section-kicker">{t("steps.kicker")}</p>
            <h2>{t("steps.title")}</h2>
            <p className="section-copy">{t("steps.copy")}</p>
          </div>
          <div className="step-row">
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[index];
              return (
                <div key={step.title} className="step-card">
                  <div className="step-number">0{index + 1}</div>
                  <div className="step-icon">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <p className="section-kicker">{t("checker.kicker")}</p>
            <h2>{t("checker.title")}</h2>
            <p className="section-copy">{t("checker.copy")}</p>
          </div>
          <div className="checker-card">
            <div className="checker-meta">
              <div className="meta-pill">
                <Timer className="w-4 h-4" />
                {t("checker.meta.time")}
              </div>
              <div className="meta-pill">
                <Globe2 className="w-4 h-4" />
                {t("checker.meta.languages")}
              </div>
              <div className="meta-pill">
                <Lock className="w-4 h-4" />
                {t("checker.meta.privacy")}
              </div>
            </div>
            <form className="checker-form" onSubmit={handleStart}>
              <label className="form-field">
                <span>{t("checker.fields.sectorLabel")}</span>
                <div className="select-field">
                  <select value={sector} onChange={(event) => setSector(event.target.value)}>
                    <option value="retail">{t("checker.fields.sectorOptions.retail")}</option>
                    <option value="gastro">{t("checker.fields.sectorOptions.gastro")}</option>
                    <option value="office">{t("checker.fields.sectorOptions.office")}</option>
                    <option value="production">{t("checker.fields.sectorOptions.production")}</option>
                    <option value="other">{t("checker.fields.sectorOptions.other")}</option>
                  </select>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </label>

              <label className="form-field">
                <span>{t("checker.fields.locationLabel")}</span>
                <div className="pill-row">
                  <button
                    type="button"
                    className={`pill ${locationType === "vienna" ? "pill--active" : ""}`}
                    onClick={() => setLocationType("vienna")}
                  >
                    <MapPin className="w-4 h-4" />
                    {t("checker.fields.locationOptions.vienna")}
                  </button>
                  <button
                    type="button"
                    className={`pill ${locationType === "austria" ? "pill--active" : ""}`}
                    onClick={() => setLocationType("austria")}
                  >
                    <MapPin className="w-4 h-4" />
                    {t("checker.fields.locationOptions.austria")}
                  </button>
                </div>
              </label>

              <div className="form-footer">
                <div className="form-note">{t("checker.note")}</div>
                <button type="submit" className="btn btn-primary">
                  {t("checker.cta")}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <p className="section-kicker">{t("trust.kicker")}</p>
            <h2>{t("trust.title")}</h2>
          </div>
          <div className="trust-grid">
            {trustPoints.map((item, index) => {
              const Icon = TRUST_ICONS[index];
              return (
                <article key={item.title} className="trust-card">
                  <div className="trust-icon">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section-block info-section">
          <div className="section-heading">
            <p className="section-kicker">{t("info.kicker")}</p>
            <h2>{t("info.title")}</h2>
            <p className="section-copy">{t("info.copy")}</p>
          </div>
          <div className="info-grid">
            {infoCards.map((card) => (
              <article key={card.title} className="info-card">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
