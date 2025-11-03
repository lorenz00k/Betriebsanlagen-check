"use client";

// Home renders the localized landing page experience, including hero messaging,
// CTA cards, and animated visuals tailored to the active locale.
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import AnimatedStats from "../components/AnimatedStats";
import { defaultLocale } from "@/i18n";
import { CheckCircle2, FileText, Zap, Languages, Shield, ArrowRight, Sparkles } from "lucide-react";

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
          <section className="section page-hero">
            <h1 className="page-hero__title">
              <span>{t("title")}</span>
            </h1>
            <p className="page-hero__copy">{t("subtitle")}</p>
          </section>

          <section className="section section--compact">
            <div className="card-grid card-grid--two page-actions">
              <article className="card">
                <div className="card__icon">
                  <CheckCircle2 className="w-7 h-7" strokeWidth={2.2} />
                </div>
                <h2 className="card__title">{t("card1Title")}</h2>
                <p className="card__body">{t("card1Description")}</p>
                <Link
                  href={`/${activeLocale}/check`}
                  className="btn btn-primary w-full justify-center"
                >
                  {t("card1Button")}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </article>

              <article className="card">
                <div className="card__icon card__icon--warm">
                  <FileText className="w-7 h-7" strokeWidth={2.2} />
                </div>
                <h2 className="card__title">{t("card2Title")}</h2>
                <p className="card__body">{t("card2Description")}</p>
                <Link
                  href={`/${activeLocale}/dokumente`}
                  className="btn btn-secondary w-full justify-center"
                >
                  {t("card2Button")}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </article>
            </div>
          </section>

          <section className="section section--compact">
            <div className="surface-muted">
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
              <h2>{t("seo.heading")}</h2>
              <p className="section__copy">{t("seo.intro")}</p>
            </div>

            <div className="card-grid card-grid--three mt-12">
              <article className="card card--subtle">
                <div className="card__icon card__icon--accent-soft">
                  <Zap className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="card__title">{t("seo.feature1Title")}</h3>
                <p className="card__body">{t("seo.feature1Text")}</p>
              </article>

              <article className="card card--subtle">
                <div className="card__icon card__icon--success">
                  <Languages className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="card__title">{t("seo.feature2Title")}</h3>
                <p className="card__body">{t("seo.feature2Text")}</p>
              </article>

              <article className="card card--subtle">
                <div className="card__icon card__icon--shield">
                  <Shield className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="card__title">{t("seo.feature3Title")}</h3>
                <p className="card__body">{t("seo.feature3Text")}</p>
              </article>
            </div>

            <div className="surface-muted mt-12 flex flex-col gap-6 md:flex-row md:items-center">
              <div className="card__icon">
                <Sparkles className="w-6 h-6" strokeWidth={2} />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="card__title">{t("seo.whyTitle")}</h3>
                <p className="card__body text-lg">{t("seo.whyText")}</p>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section__heading">
              <h2>{t("gruender.heading")}</h2>
              <p className="section__copy">{t("gruender.intro")}</p>
            </div>

            <div className="card-grid card-grid--two mt-12">
              <article className="card card--subtle">
                <h3 className="card__title">{t("gruender.question1")}</h3>
                <p className="card__body">{t("gruender.answer1")}</p>
              </article>

              <article className="card card--subtle">
                <h3 className="card__title">{t("gruender.question2")}</h3>
                <p className="card__body">{t("gruender.answer2")}</p>
              </article>

              <article className="card card--subtle">
                <h3 className="card__title">{t("gruender.question3")}</h3>
                <p className="card__body">{t("gruender.answer3")}</p>
              </article>

              <article className="card card--subtle">
                <h3 className="card__title">{t("gruender.question4")}</h3>
                <p className="card__body">{t("gruender.answer4")}</p>
              </article>
            </div>

            <div className="cta-panel">
              <h3>{t("gruender.ctaTitle")}</h3>
              <p>{t("gruender.ctaText")}</p>
              <Link href={`/${activeLocale}/check`} className="btn btn-primary">
                {t("card1Button")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
