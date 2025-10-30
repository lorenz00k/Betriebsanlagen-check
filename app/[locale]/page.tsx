"use client";

// Home renders the localized landing page experience, including hero messaging,
// CTA cards, and animated visuals tailored to the active locale.
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import AnimatedStats from "../components/AnimatedStats";
import { useEffect, useState } from "react";
import { defaultLocale } from "@/i18n";
import { CheckCircle2, FileText, Zap, Languages, Shield, ArrowRight, Sparkles } from "lucide-react";

// Displays the localized homepage with locale-aware navigation targets.
export default function Home() {
  const t = useTranslations("home");
  const gruenderT = useTranslations("home.gruender");
  const params = useParams<{ locale: string }>();
  const paramLocale = params?.locale;
  const activeLocale = Array.isArray(paramLocale) ? paramLocale[0] : paramLocale ?? defaultLocale;
  const [scrollY, setScrollY] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* QA Schema for AI Search and Featured Snippets */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaSchema) }}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-200/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div
          className="text-center mb-16 animate-fadeIn"
          style={{ transform: `translateY(${scrollY * 0.3}px)`, opacity: Math.max(0, 1 - scrollY / 500) }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-normal leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Primary actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Check if permit is needed */}
          <div className="group card-lift bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-300 relative transition-all duration-200" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div className="h-1.5 bg-gradient-to-r from-blue-600 to-blue-700"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-200" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("card1Title")}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed font-normal">
                {t("card1Description")}
              </p>
              <Link
                href={`/${activeLocale}/check`}
                className="button-shine button-click inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              >
                {t("card1Button")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Documents and process */}
          <div className="group card-lift bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#FF6B35] relative transition-all duration-200" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <div className="h-1.5 bg-gradient-to-r from-[#FF6B35] to-[#e55a28]"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#e55a28] rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-200" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <FileText className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("card2Title")}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed font-normal">
                {t("card2Description")}
              </p>
              <Link
                href={`/${activeLocale}/dokumente`}
                className="button-shine button-click inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-[#FF6B35] to-[#e55a28] text-white py-4 px-6 rounded-xl font-semibold hover:from-[#e55a28] hover:to-[#cc4d1f] transition-all duration-200"
                style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              >
                {t("card2Button")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

        {/* Animated Stats */}
        <div className="mb-16">
          <AnimatedStats
            stats={[
              {
                value: 8,
                suffix: "",
                label: t("stats.languages"),
                icon: (
                  <Languages className="w-7 h-7 text-white" strokeWidth={2} />
                ),
              },
              {
                value: 2,
                suffix: " Min",
                label: t("stats.time"),
                icon: (
                  <Zap className="w-7 h-7 text-white" strokeWidth={2} />
                ),
              },
              {
                value: 100,
                suffix: "%",
                label: t("stats.free"),
                icon: (
                  <Shield className="w-7 h-7 text-white" strokeWidth={2} />
                ),
              },
            ]}
          />
        </div>

        {/* SEO Content Section */}
        <div className="mt-20 space-y-12">
          {/* Main SEO Heading */}
          <div className="text-center animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("seo.heading")}
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed font-normal">
              {t("seo.intro")}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-lift bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-200" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("seo.feature1Title")}
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                {t("seo.feature1Text")}
              </p>
            </div>

            <div className="card-lift bg-white rounded-xl p-6 border border-gray-200 hover:border-[#22C55E] transition-all duration-200" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Languages className="w-6 h-6 text-green-600" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("seo.feature2Title")}
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                {t("seo.feature2Text")}
              </p>
            </div>

            <div className="card-lift bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition-all duration-200" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("seo.feature3Title")}
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                {t("seo.feature3Text")}
              </p>
            </div>
          </div>

          {/* Additional SEO Content */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-8 md:p-10 border border-blue-200 animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("seo.whyTitle")}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg font-normal">
                  {t("seo.whyText")}
                </p>
              </div>
            </div>
          </div>

          {/* Founders / Gründer Section - AI Search Optimized Q&A */}
          <div className="mt-12 animate-fadeIn">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t("gruender.heading")}
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed font-normal">
                {t("gruender.intro")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Question 1 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {t("gruender.question1")}
                </h3>
                <p className="text-gray-700 leading-relaxed font-normal">
                  {t("gruender.answer1")}
                </p>
              </div>

              {/* Question 2 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {t("gruender.question2")}
                </h3>
                <p className="text-gray-700 leading-relaxed font-normal">
                  {t("gruender.answer2")}
                </p>
              </div>

              {/* Question 3 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {t("gruender.question3")}
                </h3>
                <p className="text-gray-700 leading-relaxed font-normal">
                  {t("gruender.answer3")}
                </p>
              </div>

              {/* Question 4 */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {t("gruender.question4")}
                </h3>
                <p className="text-gray-700 leading-relaxed font-normal">
                  {t("gruender.answer4")}
                </p>
              </div>
            </div>

            {/* CTA for Founders */}
            <div className="mt-8 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{t("gruender.ctaTitle")}</h3>
              <p className="text-lg mb-6 opacity-90">{t("gruender.ctaText")}</p>
              <Link
                href={`/${activeLocale}/check`}
                className="inline-block bg-white text-green-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                {t("card1Button")}
              </Link>
            </div>
          </div>
        </div>
      </div>
      </main>
    </>
  );
}
