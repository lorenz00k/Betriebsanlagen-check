"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import AnimatedStats from "../components/AnimatedStats";

export default function Home() {
  const t = useTranslations("home");

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Two Main Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Check if permit is needed */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-300 hover:-translate-y-2 glow-on-hover">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-700"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md animate-float">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("card1Title")}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {t("card1Description")}
              </p>
              <Link
                href="/check"
                className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                {t("card1Button")}
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Card 2: Documents and process */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-green-300 hover:-translate-y-2 relative">
            <div className="h-2 bg-gradient-to-r from-green-600 to-green-700"></div>
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md animate-float" style={{ animationDelay: '1s' }}>
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("card2Title")}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {t("card2Description")}
              </p>
              <Link
                href="/documents"
                className="inline-flex items-center gap-2 w-full justify-center bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
              >
                {t("card2Button")}
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Stats */}
        <div className="mb-12">
          <AnimatedStats
            stats={[
              {
                value: 8,
                suffix: "",
                label: "Sprachen verfügbar",
                icon: (
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                ),
              },
              {
                value: 2,
                suffix: " Min",
                label: "Ergebnis in Minuten",
                icon: (
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
              },
              {
                value: 100,
                suffix: "%",
                label: "Kostenlos & Sicher",
                icon: (
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
              },
            ]}
          />
        </div>

        {/* Trust indicators */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Sicher</h3>
              <p className="text-sm text-gray-600">Ihre Daten bleiben privat</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Schnell</h3>
              <p className="text-sm text-gray-600">Ergebnis in 2 Minuten</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Mehrsprachig</h3>
              <p className="text-sm text-gray-600">8 Sprachen verfügbar</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
