"use client";

// Home renders the localized landing page experience, including hero messaging,
// CTA cards, and animated visuals tailored to the active locale.
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import AnimatedStats from "../components/AnimatedStats";
import { defaultLocale } from "@/i18n";
import { CheckCircle2, FileText, Zap, Languages, Shield, ArrowRight, Sparkles } from "lucide-react";
import BreakText from "@/components/ui/BreakText";
import AutoGrid from "@/components/ui/AutoGrid";

// Displays the localized homepage with locale-aware navigation targets.
export default function Home() {
  const t = useTranslations("home");
  const gruenderT = useTranslations("home.gruender");
  const params = useParams<{ locale: string }>();
  const paramLocale = params?.locale;
  const activeLocale = Array.isArray(paramLocale) ? paramLocale[0] : paramLocale ?? defaultLocale;

  // QA Page schema for AI search and Google Featured Snippets
  const qaSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": gruenderT("question1"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": gruenderT("answer1")
        }
      },
      {
        "@type": "Question",
        "name": gruenderT("question2"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": gruenderT("answer2")
        }
      },
      {
        "@type": "Question",
        "name": gruenderT("question3"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": gruenderT("answer3")
        }
      },
      {
        "@type": "Question",
        "name": gruenderT("question4"),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": gruenderT("answer4")
        }
      }
    ]
  };

  return (
    <>
      {/* QA Schema for AI Search and Featured Snippets */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaSchema) }}
      />

      <main className="page-shell">
        <div className="site-container">
          <section className="section page-hero page-hero--split">
            <div className="page-hero__content">
              <div className="page-hero__eyebrow">
                <Sparkles className="w-4 h-4" />
                {t("seo.heading")}
              </div>
              <h1 className="page-hero__title">
                <BreakText className="block">{t("title")}</BreakText>
              </h1>
              <BreakText className="page-hero__copy block">{t("subtitle")}</BreakText>

              <div className="hero-points">
                <div className="hero-point">
                  <CheckCircle2 className="w-5 h-5" strokeWidth={2.2} />
                  <span>{t("seo.feature1Title")}</span>
                </div>
                <div className="hero-point">
                  <Languages className="w-5 h-5" strokeWidth={2.2} />
                  <span>{t("stats.languages")}</span>
                </div>
                <div className="hero-point">
                  <Shield className="w-5 h-5" strokeWidth={2.2} />
                  <span>{t("seo.feature3Title")}</span>
                </div>
              </div>

              <div className="page-hero__actions">
                <Link href={`/${activeLocale}/check`} className="btn btn-primary">
                  <BreakText>{t("card1Button")}</BreakText>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href={`/${activeLocale}/documents`} className="btn btn-secondary">
                  <BreakText>{t("card2Button")}</BreakText>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="page-hero__visual">
              <div className="hero-blob" />
              <div className="hero-spot" />
              <div className="hero-card">
                <div className="hero-card__header">
                  <Sparkles className="w-5 h-5" strokeWidth={2.2} />
                  <span>{t("seo.whyTitle")}</span>
                </div>
                <p className="hero-card__body">{t("seo.whyText")}</p>

                <div className="hero-metrics">
                  <div>
                    <span className="hero-metrics__value">2</span>
                    <span className="hero-metrics__label">{t("stats.time")}</span>
                  </div>
                  <div>
                    <span className="hero-metrics__value">100%</span>
                    <span className="hero-metrics__label">{t("stats.free")}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section section--compact">
            <div className="card-rail">
              <article className="card card--frosted">
                <div className="card__icon">
                  <CheckCircle2 className="w-7 h-7" strokeWidth={2.2} />
                </div>
                <div className="card__stack">
                  <h2 className="card__title">
                    <BreakText className="block">{t("card1Title")}</BreakText>
                  </h2>
                  <BreakText className="card__body block">{t("card1Description")}</BreakText>
                </div>
                <Link
                  href={`/${activeLocale}/check`}
                  className="btn btn-primary w-full justify-center"
                >
                  <BreakText>{t("card1Button")}</BreakText>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </article>

              <article className="card card--frosted">
                <div className="card__icon card__icon--warm">
                  <FileText className="w-7 h-7" strokeWidth={2.2} />
                </div>
                <div className="card__stack">
                  <h2 className="card__title">
                    <BreakText className="block">{t("card2Title")}</BreakText>
                  </h2>
                  <BreakText className="card__body block">{t("card2Description")}</BreakText>
                </div>
                <Link
                  href={`/${activeLocale}/documents`}
                  className="btn btn-secondary w-full justify-center"
                >
                  <BreakText>{t("card2Button")}</BreakText>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </article>
            </div>
          </section>

          <section className="section section--compact">
            <div className="surface-muted surface-muted--gradient">
              <AnimatedStats
                stats={[
                  {
                    value: 8,
                    suffix: "",
                    label: t("stats.languages"),
                    icon: <Languages className="w-6 h-6" strokeWidth={2} />,
                  },
                  {
                    value: 2,
                    suffix: " Min",
                    label: t("stats.time"),
                    icon: <Zap className="w-6 h-6" strokeWidth={2} />,
                  },
                  {
                    value: 100,
                    suffix: "%",
                    label: t("stats.free"),
                    icon: <Shield className="w-6 h-6" strokeWidth={2} />,
                  },
                ]}
              />
            </div>
          </section>

          <section className="section">
            <div className="section__heading">
              <h2>
                <BreakText className="block">{t("seo.heading")}</BreakText>
              </h2>
              <BreakText className="section__copy block">{t("seo.intro")}</BreakText>
            </div>

            <div className="feature-grid">
              <article className="card card--subtle feature-card">
                <div className="feature-card__icon">
                  <Zap className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="card__title">
                  <BreakText className="block">{t("seo.feature1Title")}</BreakText>
                </h3>
                <BreakText className="card__body block">{t("seo.feature1Text")}</BreakText>
              </article>

              <article className="card card--subtle feature-card">
                <div className="feature-card__icon feature-card__icon--accent">
                  <Languages className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="card__title">
                  <BreakText className="block">{t("seo.feature2Title")}</BreakText>
                </h3>
                <BreakText className="card__body block">{t("seo.feature2Text")}</BreakText>
              </article>

              <article className="card card--subtle feature-card">
                <div className="feature-card__icon feature-card__icon--dark">
                  <Shield className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="card__title">
                  <BreakText className="block">{t("seo.feature3Title")}</BreakText>
                </h3>
                <BreakText className="card__body block">{t("seo.feature3Text")}</BreakText>
              </article>
            </div>

            <div className="surface-muted surface-muted--stack mt-12">
              <div className="card__icon">
                <Sparkles className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="card__title">
                  <BreakText className="block">{t("seo.whyTitle")}</BreakText>
                </h3>
                <BreakText className="card__body text-lg block">{t("seo.whyText")}</BreakText>
              </div>
              <Link href={`/${activeLocale}/check`} className="btn btn-primary">
                <BreakText>{t("card1Button")}</BreakText>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>

          <section className="section">
            <div className="section__heading">
              <h2>
                <BreakText className="block">{t("gruender.heading")}</BreakText>
              </h2>
              <BreakText className="section__copy block">{t("gruender.intro")}</BreakText>
            </div>

            <AutoGrid min="16rem" className="mt-12">
              <article className="card card--subtle">
                <h3 className="card__title">
                  <BreakText className="block">{t("gruender.question1")}</BreakText>
                </h3>
                <BreakText className="card__body block">{t("gruender.answer1")}</BreakText>
              </article>

              <article className="card card--subtle">
                <h3 className="card__title">
                  <BreakText className="block">{t("gruender.question2")}</BreakText>
                </h3>
                <BreakText className="card__body block">{t("gruender.answer2")}</BreakText>
              </article>

              <article className="card card--subtle">
                <h3 className="card__title">
                  <BreakText className="block">{t("gruender.question3")}</BreakText>
                </h3>
                <BreakText className="card__body block">{t("gruender.answer3")}</BreakText>
              </article>

              <article className="card card--subtle">
                <h3 className="card__title">
                  <BreakText className="block">{t("gruender.question4")}</BreakText>
                </h3>
                <BreakText className="card__body block">{t("gruender.answer4")}</BreakText>
              </article>
            </AutoGrid>

            <div className="cta-panel cta-panel--bordered">
              <div className="cta-panel__content">
                <h3>
                  <BreakText className="block">{t("gruender.ctaTitle")}</BreakText>
                </h3>
                <BreakText className="block">{t("gruender.ctaText")}</BreakText>
              </div>
              <Link href={`/${activeLocale}/check`} className="btn btn-primary">
                <BreakText>{t("card1Button")}</BreakText>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
