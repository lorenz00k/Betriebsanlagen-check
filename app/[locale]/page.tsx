"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { defaultLocale } from "@/i18n";
import { CheckCircle2, FileText, Zap, Languages, Shield, ArrowRight, Play, MapPin, Clock, Users } from "lucide-react";

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
      {/* QA Schema for AI Search */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaSchema) }}
      />

      {/* Hero Section - Full Width with Video/Image Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gray-900">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/images/homepage/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={`/${activeLocale}/check`}
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 shadow-xl shadow-blue-500/20"
            >
              {t("card1Button")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`/${activeLocale}/documents`}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 rounded-full font-semibold text-lg transition-all duration-300"
            >
              {t("card2Button")}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">8</div>
              <div className="text-sm text-slate-200">{t("stats.languages")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">2 Min</div>
              <div className="text-sm text-slate-200">{t("stats.time")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-sm text-slate-200">{t("stats.free")}</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section - White Background */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {t("seo.heading")}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t("seo.intro")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-blue-600" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {t("seo.feature1Title")}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t("seo.feature1Text")}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Languages className="w-7 h-7 text-green-600" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {t("seo.feature2Title")}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t("seo.feature2Text")}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-purple-600" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {t("seo.feature3Title")}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {t("seo.feature3Text")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Feature Section 1 - Left Image, Right Content */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Feature Image 1 */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/homepage/feature-1.jpg"
                alt="Standortprüfung für Betriebsanlagen in Wien"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {t("card1Title")}
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {t("card1Description")}
              </p>
              <Link
                href={`/${activeLocale}/check`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-xl"
              >
                {t("card1Button")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Image Feature Section 2 - Right Image, Left Content */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content (Desktop: Left) */}
            <div className="md:order-1 order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {t("card2Title")}
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                {t("card2Description")}
              </p>
              <Link
                href={`/${activeLocale}/documents`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-xl"
              >
                {t("card2Button")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Feature Image 2 (Desktop: Right) */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl md:order-2 order-1">
              <Image
                src="/images/homepage/feature-2.jpg"
                alt="Dokumente und Formulare für Betriebsanlagen"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Section - Dark Background */}
      <section className="py-20 md:py-32 bg-blue-900">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            {t("seo.whyTitle")}
          </h2>
          <p className="text-xl text-slate-100 leading-relaxed mb-12">
            {t("seo.whyText")}
          </p>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 text-blue-400 mb-4" />
              <div className="text-2xl font-bold text-white mb-2">Schnell</div>
              <div className="text-slate-300">In 2 Minuten zum Ergebnis</div>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-green-400 mb-4" />
              <div className="text-2xl font-bold text-white mb-2">Sicher</div>
              <div className="text-slate-300">DSGVO-konform & verschlüsselt</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-12 h-12 text-purple-400 mb-4" />
              <div className="text-2xl font-bold text-white mb-2">Vertrauenswürdig</div>
              <div className="text-slate-300">Von Experten entwickelt</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section for Founders - Light Background */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              {t("gruender.heading")}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {t("gruender.intro")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* FAQ 1 */}
            <div className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {t("gruender.question1")}
              </h3>
              <p className="text-slate-700 leading-relaxed text-base">
                {t("gruender.answer1")}
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {t("gruender.question2")}
              </h3>
              <p className="text-slate-700 leading-relaxed text-base">
                {t("gruender.answer2")}
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {t("gruender.question3")}
              </h3>
              <p className="text-slate-700 leading-relaxed text-base">
                {t("gruender.answer3")}
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {t("gruender.question4")}
              </h3>
              <p className="text-slate-700 leading-relaxed text-base">
                {t("gruender.answer4")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Gradient Background */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("gruender.ctaTitle")}
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            {t("gruender.ctaText")}
          </p>
          <Link
            href={`/${activeLocale}/check`}
            className="inline-flex items-center gap-3 px-10 py-5 bg-white hover:bg-slate-50 text-blue-600 rounded-full font-bold text-lg transition-all duration-300 shadow-2xl hover:scale-105"
          >
            {t("card1Button")}
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </>
  );
}
