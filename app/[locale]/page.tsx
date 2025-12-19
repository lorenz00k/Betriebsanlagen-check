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
import FlowSteps from "./components/FlowSteps";
import StackedCard from "./_components/StackedCard/Process/StackedCard";
import StackedArticles from "./_components/StackedCard/Q&A/StackedArticles";
import CheckerEmbed from "./_components/CheckerEmbed";
import Hero from "./_components/Hero";
import SellingPoints from "./components/SellingPoints";
import DocumentTeaser from "./components/DocumentTeaser";
import SectionHeading from "./components/SectionHeading";

// Displays the localized homepage with locale-aware navigation targets.
export default function Home() {
  const t = useTranslations("home");
  const gruenderT = useTranslations("home.gruender");
  const params = useParams<{ locale: string }>();
  const paramLocale = params?.locale;
  const activeLocale = Array.isArray(paramLocale)
    ? paramLocale[0]
    : paramLocale ?? defaultLocale;

  const flowItems = [
    {
      title: t("flow.step1Title"),
      description: t("flow.step1Text"),
      bullets: t.raw("flow.step1Bullets") as string[],
    },
    {
      title: t("flow.step2Title"),
      description: t("flow.step2Text"),
      bullets: t.raw("flow.step2Bullets") as string[],
    },
    {
      title: t("flow.step3Title"),
      description: t("flow.step3Text"),
      bullets: t.raw("flow.step3Bullets") as string[],
      cta: { label: t("flow.step3Cta"), href: `/${activeLocale}/documents` },
    },
  ]


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

        {/* 1. HERO */}
        <Hero t={t} locale={activeLocale} />
        <div className="site-container">
          {/* 2. ABLAUF / FLOW */}

          {/* Mobile: FlowSteps */}
          {/*
          <section id="how-it-works" className="section section--compact md:hidden">
            <div className="section__heading">
              <h2>
                <BreakText className="block">{t("flow.heading")}</BreakText>
              </h2>
              <BreakText className="section__copy block">
                {t("flow.intro")}
              </BreakText>
            </div>

            <FlowSteps
              steps={flowItems.map(i => ({ title: i.title, text: i.description }))}
            />
          </section>
*/}
          {/* Desktop: Stacked Cards */}
          {/*
          <section id="how-it-works" className="section section--compact hidden md:block">
            <div className="section__heading">
              <h2>
                <BreakText className="block">{t("flow.heading")}</BreakText>
              </h2>
              <BreakText className="section__copy block">
                {t("flow.intro")}
              </BreakText>
            </div>
            <StackedCard cards={flowItems} />
          </section>
*/}

          {/* Why important & SELLING POINTS / STATS */}
          <SellingPoints t={t} />

          {/* CHECKER */}
          <section id="start-check" className="section section--full-bg">
            <div className="section--full-bg__inner">
              <SectionHeading
                title={t("checker.heading")}
                subtitle={t("checker.intro")}
              />

              <div className="checker-full mt-8">
                <CheckerEmbed />
              </div>
            </div>
          </section>

          {/* Dokumente */}
          <DocumentTeaser t={t} locale={activeLocale} />

          {/* 5. ALLGEMEINE INFOS / Q&A-BEREICH (Wien / Gründung) */}
          <section className="section">
            <SectionHeading
              title={t("gruender.heading")}
              subtitle={t("gruender.intro")}
            />

            <StackedArticles
              items={[
                {
                  title: (
                    <h3 className="card__title">
                      <BreakText className="block">{t("gruender.question2")}</BreakText>
                    </h3>
                  ),
                  body: (
                    <BreakText className="card__body block">{t("gruender.answer2")}</BreakText>
                  ),
                },
                {
                  title: (
                    <h3 className="card__title">
                      <BreakText className="block">{t("gruender.question3")}</BreakText>
                    </h3>
                  ),
                  body: (
                    <BreakText className="card__body block">{t("gruender.answer3")}</BreakText>
                  ),
                },
                {
                  title: (
                    <h3 className="card__title">
                      <BreakText className="block">{t("gruender.question4")}</BreakText>
                    </h3>
                  ),
                  body: (
                    <BreakText className="card__body block">{t("gruender.answer4")}</BreakText>
                  ),
                },
              ]}
            />

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
      </main >
    </>
  );
}
