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

      <main className="min-h-screen">
        <section className="section">
          <div className="layout-container flex flex-col gap-16">
            <div className="mx-auto max-w-3xl text-center space-y-6">
              <h1 className="text-balance">{t("title")}</h1>
              <p className="text-lg md:text-xl text-[color:var(--color-muted)]">{t("subtitle")}</p>
            </div>

            <div className="feature-grid">
              <div
                className="surface-card h-full flex flex-col gap-6 text-left"
                style={{ borderTop: '4px solid var(--color-accent)' }}
              >
                <span className="stat-icon !w-14 !h-14">
                  <CheckCircle2 className="w-7 h-7" strokeWidth={2} />
                </span>
                <div className="space-y-4">
                  <h2 className="text-2xl text-[color:var(--color-fg)]">{t("card1Title")}</h2>
                  <p>{t("card1Description")}</p>
                </div>
                <Link
                  href={`/${activeLocale}/check`}
                  className="btn btn-primary w-full"
                  style={{ justifyContent: 'space-between' }}
                >
                  {t("card1Button")}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              <div
                className="surface-card h-full flex flex-col gap-6 text-left"
                style={{ borderTop: '4px solid var(--color-warning)' }}
              >
                <span
                  className="stat-icon !w-14 !h-14"
                  style={{ background: 'rgba(179, 90, 31, 0.15)', color: 'var(--color-warning)' }}
                >
                  <FileText className="w-7 h-7" strokeWidth={2} />
                </span>
                <div className="space-y-4">
                  <h2 className="text-2xl text-[color:var(--color-fg)]">{t("card2Title")}</h2>
                  <p>{t("card2Description")}</p>
                </div>
                <Link
                  href={`/${activeLocale}/dokumente`}
                  className="btn btn-secondary w-full"
                  style={{ justifyContent: 'space-between' }}
                >
                  {t("card2Button")}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="surface-muted border border-[color:var(--color-border)] rounded-[calc(var(--radius)+2px)] p-6 md:p-10">
              <AnimatedStats
                stats={[
                  {
                    value: 8,
                    suffix: '',
                    label: t("stats.languages"),
                    icon: <Languages className="w-6 h-6" strokeWidth={2} />,
                  },
                  {
                    value: 2,
                    suffix: ' Min',
                    label: t("stats.time"),
                    icon: <Zap className="w-6 h-6" strokeWidth={2} />,
                  },
                  {
                    value: 100,
                    suffix: '%',
                    label: t("stats.free"),
                    icon: <Shield className="w-6 h-6" strokeWidth={2} />,
                  },
                ]}
              />
            </div>

            <div className="space-y-14">
              <div className="text-center space-y-4">
                <h2>{t("seo.heading")}</h2>
                <p className="mx-auto text-lg md:text-xl text-[color:var(--color-muted)] max-w-4xl">{t("seo.intro")}</p>
              </div>

              <div className="feature-grid md:grid-cols-3">
                <div className="surface-card h-full space-y-4">
                  <span className="stat-icon">
                    <Zap className="w-5 h-5" strokeWidth={2} />
                  </span>
                  <h3 className="text-xl text-[color:var(--color-fg)]">{t("seo.feature1Title")}</h3>
                  <p>{t("seo.feature1Text")}</p>
                </div>
                <div className="surface-card h-full space-y-4">
                  <span className="stat-icon">
                    <Languages className="w-5 h-5" strokeWidth={2} />
                  </span>
                  <h3 className="text-xl text-[color:var(--color-fg)]">{t("seo.feature2Title")}</h3>
                  <p>{t("seo.feature2Text")}</p>
                </div>
                <div className="surface-card h-full space-y-4">
                  <span className="stat-icon">
                    <Shield className="w-5 h-5" strokeWidth={2} />
                  </span>
                  <h3 className="text-xl text-[color:var(--color-fg)]">{t("seo.feature3Title")}</h3>
                  <p>{t("seo.feature3Text")}</p>
                </div>
              </div>

              <div className="surface-card flex flex-col gap-6 md:flex-row md:items-start">
                <span className="stat-icon !w-12 !h-12">
                  <Sparkles className="w-5 h-5" strokeWidth={2} />
                </span>
                <div className="space-y-4">
                  <h3 className="text-2xl text-[color:var(--color-fg)]">{t("seo.whyTitle")}</h3>
                  <p className="text-lg text-[color:var(--color-muted)]">{t("seo.whyText")}</p>
                </div>
              </div>

              <div className="space-y-10">
                <div className="text-center space-y-4">
                  <h2>{t("gruender.heading")}</h2>
                  <p className="mx-auto text-lg md:text-xl text-[color:var(--color-muted)] max-w-4xl">{t("gruender.intro")}</p>
                </div>
                <div className="feature-grid md:grid-cols-2">
                  <div className="surface-card space-y-3">
                    <h3 className="text-xl text-[color:var(--color-fg)]">{t("gruender.question1")}</h3>
                    <p>{t("gruender.answer1")}</p>
                  </div>
                  <div className="surface-card space-y-3">
                    <h3 className="text-xl text-[color:var(--color-fg)]">{t("gruender.question2")}</h3>
                    <p>{t("gruender.answer2")}</p>
                  </div>
                  <div className="surface-card space-y-3">
                    <h3 className="text-xl text-[color:var(--color-fg)]">{t("gruender.question3")}</h3>
                    <p>{t("gruender.answer3")}</p>
                  </div>
                  <div className="surface-card space-y-3">
                    <h3 className="text-xl text-[color:var(--color-fg)]">{t("gruender.question4")}</h3>
                    <p>{t("gruender.answer4")}</p>
                  </div>
                </div>
                <div
                  className="surface-card text-center flex flex-col gap-4 items-center"
                  style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', boxShadow: '0 28px 50px -28px rgba(12, 46, 54, 0.55)' }}
                >
                  <h3 className="text-2xl md:text-3xl font-semibold">{t("gruender.ctaTitle")}</h3>
                  <p className="text-lg max-w-3xl text-white/85">{t("gruender.ctaText")}</p>
                  <Link
                    href={`/${activeLocale}/check`}
                    className="btn btn-ghost"
                    style={{ background: '#fff', color: 'var(--color-accent-strong)', borderColor: 'transparent' }}
                  >
                    {t("card1Button")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
