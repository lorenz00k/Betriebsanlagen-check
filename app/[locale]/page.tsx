"use client";

// Home renders the localized landing page experience, including hero messaging,
// CTA cards, and animated visuals tailored to the active locale.
import Image from "next/image";
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
              <span className="page-hero__eyebrow">{t("seo.whyTitle")}</span>
              <h1 className="page-hero__title">
                <BreakText className="block">{t("title")}</BreakText>
              </h1>
              <BreakText className="page-hero__copy block">{t("subtitle")}</BreakText>

              <div className="hero-actions">
                <Link
                  href={`/${activeLocale}/check`}
                  className="btn btn-primary btn-lg"
                >
                  <BreakText>{t("card1Button")}</BreakText>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href={`/${activeLocale}/documents`}
                  className="btn btn-secondary btn-lg"
                >
                  <BreakText>{t("card2Button")}</BreakText>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="hero-bullets">
                <div className="hero-bullet">
                  <div className="hero-bullet__icon">
                    <Languages className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="hero-bullet__label">{t("stats.languages")}</p>
                    <p className="hero-bullet__meta">8+</p>
                  </div>
                </div>
                <div className="hero-bullet">
                  <div className="hero-bullet__icon hero-bullet__icon--accent">
                    <Zap className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="hero-bullet__label">{t("stats.time")}</p>
                    <p className="hero-bullet__meta">{t("gruender.answer2")}</p>
                  </div>
                </div>
                <div className="hero-bullet">
                  <div className="hero-bullet__icon hero-bullet__icon--neutral">
                    <Shield className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="hero-bullet__label">{t("stats.free")}</p>
                    <p className="hero-bullet__meta">{t("seo.feature3Title")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-visual__panel">
                <div className="hero-visual__image">
                  <Image
                    src="/window.svg"
                    alt="Illustration"
                    width={640}
                    height={520}
                    priority
                  />
                </div>
                <div className="hero-visual__card">
                  <p className="hero-visual__eyebrow">{t("seo.heading")}</p>
                  <p className="hero-visual__copy">{t("seo.intro")}</p>
                  <div className="hero-visual__list">
                    <span className="pill">{t("seo.feature1Title")}</span>
                    <span className="pill">{t("seo.feature2Title")}</span>
                    <span className="pill">{t("seo.feature3Title")}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section section--band">
            <div className="section__heading section__heading--left">
              <h2>
                <BreakText className="block">{t("seo.whyTitle")}</BreakText>
              </h2>
              <BreakText className="section__copy block">{t("seo.whyText")}</BreakText>
            </div>

            <AutoGrid min="16rem" className="page-actions">
              <article className="card">
                <div className="card__icon">
                  <CheckCircle2 className="w-7 h-7" strokeWidth={2.2} />
                </div>
                <h2 className="card__title">
                  <BreakText className="block">{t("card1Title")}</BreakText>
                </h2>
                <BreakText className="card__body block">{t("card1Description")}</BreakText>
                <Link
                  href={`/${activeLocale}/check`}
                  className="btn btn-primary w-full justify-center"
                >
                  <BreakText>{t("card1Button")}</BreakText>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </article>

              <article className="card">
                <div className="card__icon card__icon--warm">
                  <FileText className="w-7 h-7" strokeWidth={2.2} />
                </div>
                <h2 className="card__title">
                  <BreakText className="block">{t("card2Title")}</BreakText>
                </h2>
                <BreakText className="card__body block">{t("card2Description")}</BreakText>
                <Link
                  href={`/${activeLocale}/documents`}
                  className="btn btn-secondary w-full justify-center"
                >
                  <BreakText>{t("card2Button")}</BreakText>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </article>
            </AutoGrid>
          </section>

          <section className="section section--columns">
            <div className="column-block">
              <div className="column-block__header">
                <span className="pill pill--outline">{t("stats.languages")}</span>
                <h2 className="column-block__title">
                  <BreakText className="block">{t("seo.heading")}</BreakText>
                </h2>
                <BreakText className="column-block__copy block">{t("seo.intro")}</BreakText>
              </div>
              <div className="column-block__highlight">
                <Sparkles className="w-6 h-6" />
                <BreakText className="block">{t("seo.whyText")}</BreakText>
              </div>
            </div>
            <div className="column-block column-block--panel">
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

            <div className="feature-showcase">
              <div className="feature-showcase__aside">
                <div className="feature-showcase__image">
                  <Image src="/file.svg" alt="Dokumentenvorschau" width={420} height={320} />
                </div>
                <div className="feature-showcase__badge">{t("seo.whyTitle")}</div>
              </div>
              <div className="feature-showcase__content">
                <AutoGrid min="14rem" className="mt-0">
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

                <div className="surface-muted mt-10 flex flex-col gap-6 md:flex-row md:items-center">
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
              </div>
            </div>
          </section>

          <section className="section section--muted">
            <div className="section__heading section__heading--left">
              <h2>
                <BreakText className="block">{t("gruender.heading")}</BreakText>
              </h2>
              <BreakText className="section__copy block">{t("gruender.intro")}</BreakText>
            </div>

            <div className="founder-grid">
              <div className="founder-grid__visual">
                <Image src="/globe.svg" alt="Vienna" width={280} height={280} />
                <div className="founder-grid__caption">{t("gruender.ctaTitle")}</div>
              </div>
              <div className="founder-grid__content">
                <AutoGrid min="16rem" className="mt-0">
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

                <div className="cta-panel">
                  <h3>
                    <BreakText className="block">{t("gruender.ctaTitle")}</BreakText>
                  </h3>
                  <BreakText className="block">{t("gruender.ctaText")}</BreakText>
                  <Link href={`/${activeLocale}/check`} className="btn btn-primary">
                    <BreakText>{t("card1Button")}</BreakText>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
