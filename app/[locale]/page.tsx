"use client";

// Home renders the localized landing page experience, including hero messaging,
// CTA cards, and animated visuals tailored to the active locale.
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { defaultLocale } from "@/i18n";
import { Zap, Languages, Shield, ArrowRight, Sparkles } from "lucide-react";
import BreakText from "@/components/ui/BreakText";
import AutoGrid from "@/components/ui/AutoGrid";

// Displays the localized homepage with locale-aware navigation targets.
export default function Home() {
  const t = useTranslations("home");
  const gruenderT = useTranslations("home.gruender");
  const params = useParams<{ locale: string }>();
  const paramLocale = params?.locale;
  const activeLocale = Array.isArray(paramLocale)
    ? paramLocale[0]
    : paramLocale ?? defaultLocale;

  // QA Page schema for AI search and Google Featured Snippets
  const qaSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: [
      {
        "@type": "Question",
        name: gruenderT("question1"),
        acceptedAnswer: {
          "@type": "Answer",
          text: gruenderT("answer1"),
        },
      },
      {
        "@type": "Question",
        name: gruenderT("question2"),
        acceptedAnswer: {
          "@type": "Answer",
          text: gruenderT("answer2"),
        },
      },
      {
        "@type": "Question",
        name: gruenderT("question3"),
        acceptedAnswer: {
          "@type": "Answer",
          text: gruenderT("answer3"),
        },
      },
      {
        "@type": "Question",
        name: gruenderT("question4"),
        acceptedAnswer: {
          "@type": "Answer",
          text: gruenderT("answer4"),
        },
      },
    ],
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
          {/* 1. HERO */}
          <section className="section page-hero">
            <h1 className="page-hero__title">
              <BreakText className="block">{t("title")}</BreakText>
            </h1>
            <BreakText className="page-hero__copy block">
              {t("subtitle")}
            </BreakText>
            {/* keine Buttons hier – nur Headline + Subheadline */}
          </section>

          {/* 2. ABLAUF / FLOW */}
          <section
            id="how-it-works"
            className="section section--compact section--tight-top"
          >
            <div className="section__heading">
              <h2>
                <BreakText className="block">{t("flow.heading")}</BreakText>
              </h2>
            </div>

            <div className="flow-modern">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flow-modern__item">
                  <span className="flow-modern__badge">{step}</span>
                  <h3 className="flow-modern__title">
                    <BreakText className="block">
                      {t(`flow.step${step}Title` as const)}
                    </BreakText>
                  </h3>
                  <BreakText className="flow-modern__copy block">
                    {t(`flow.step${step}Text` as const)}
                  </BreakText>
                </div>
              ))}
            </div>
          </section>

          {/* 3. CHECKER – direkt unter dem Ablauf, mit eingebettetem ersten Screen */}
          <section className="section section--compact">
            <div className="surface-muted text-center">
              <h2>
                <BreakText className="block">{t("checker.heading")}</BreakText>
              </h2>
              <div className="mt-6 flex justify-center">
                <Link
                  href={`/${activeLocale}/check`}
                  className="btn btn-primary btn-wide"
                >
                  <BreakText>{t("card1Button")}</BreakText>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>

          <section className="section section--compact">
            <div className="surface-muted text-center">
              <h2>
                <BreakText className="block">
                  {t("documents.heading")}
                </BreakText>
              </h2>
              <div className="mt-4 flex justify-center">
                <Link
                  href={`/${activeLocale}/documents`}
                  className="btn btn-secondary btn-wide"
                >
                  <BreakText>{t("documents.cta")}</BreakText>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* 4. SELLING POINTS / STATS */}
          <section className="section section--compact">
            <div className="section__heading">
              <h2>
                <BreakText className="block">
                  {t("selling.heading")}
                </BreakText>
              </h2>
              {/* Subheadline entfernt – direkt in die Features/Stats */}
            </div>

            <AutoGrid min="14rem" className="mt-10">
              <article className="card card--subtle">
                <div className="card__icon card__icon--accent-soft">
                  <Zap className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="card__title">
                  <BreakText className="block">
                    {t("seo.feature1Title")}
                  </BreakText>
                </h3>
                <BreakText className="card__body block">
                  {t("seo.feature1Text")}
                </BreakText>
              </article>

              <article className="card card--subtle">
                <div className="card__icon card__icon--success">
                  <Languages className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="card__title">
                  <BreakText className="block">
                    {t("seo.feature2Title")}
                  </BreakText>
                </h3>
                <BreakText className="card__body block">
                  {t("seo.feature2Text")}
                </BreakText>
              </article>

              <article className="card card--subtle">
                <div className="card__icon card__icon--shield">
                  <Shield className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="card__title">
                  <BreakText className="block">
                    {t("seo.feature3Title")}
                  </BreakText>
                </h3>
                <BreakText className="card__body block">
                  {t("seo.feature3Text")}
                </BreakText>
              </article>
            </AutoGrid>

            <div className="surface-muted mt-12 flex flex-col gap-6 md:flex-row md:items-center">
              <div className="card__icon">
                <Sparkles className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="card__title">
                  <BreakText className="block">
                    {t("seo.whyTitle")}
                  </BreakText>
                </h3>
                <BreakText className="card__body text-lg block">
                  {t("seo.whyText")}
                </BreakText>
              </div>
            </div>
          </section>

          {/* 5. ALLGEMEINE INFOS / Q&A-BEREICH (Wien / Gründung) */}
          <section className="section">
            <div className="section__heading">
              <h2>
                <BreakText className="block">
                  {t("gruender.heading")}
                </BreakText>
              </h2>
              <BreakText className="section__copy block">
                {t("gruender.intro")}
              </BreakText>
            </div>

            <AutoGrid min="16rem" className="mt-12">
              <article className="card card--subtle">
                <h3 className="card__title">
                  <BreakText className="block">
                    {t("gruender.question1")}
                  </BreakText>
                </h3>
                <BreakText className="card__body block">
                  {t("gruender.answer1")}
                </BreakText>
              </article>

              <article className="card card--subtle">
                <h3 className="card__title">
                  <BreakText className="block">
                    {t("gruender.question2")}
                  </BreakText>
                </h3>
                <BreakText className="card__body block">
                  {t("gruender.answer2")}
                </BreakText>
              </article>

              <article className="card card--subtle">
                <h3 className="card__title">
                  <BreakText className="block">
                    {t("gruender.question3")}
                  </BreakText>
                </h3>
                <BreakText className="card__body block">
                  {t("gruender.answer3")}
                </BreakText>
              </article>

              <article className="card card--subtle">
                <h3 className="card__title">
                  <BreakText className="block">
                    {t("gruender.question4")}
                  </BreakText>
                </h3>
                <BreakText className="card__body block">
                  {t("gruender.answer4")}
                </BreakText>
              </article>
            </AutoGrid>

            <div className="cta-panel">
              <h3>
                <BreakText className="block">
                  {t("gruender.ctaTitle")}
                </BreakText>
              </h3>
              <BreakText className="block">
                {t("gruender.ctaText")}
              </BreakText>
              <Link
                href={`/${activeLocale}/check`}
                className="btn btn-primary"
              >
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
