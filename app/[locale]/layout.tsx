import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { defaultLocale, locales, type Locale } from "@/i18n";
import Footer from "../components/Footer";
import LanguageBanner from "../components/LanguageBanner";
import LanguageSwitcher from "../components/LanguageSwitcher";

type MetadataContent = {
  title: string;
  description: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    siteName?: string;
    images?: {
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }[];
  };
  twitter?: {
    title?: string;
    description?: string;
    creator?: string;
    images?: string[];
  };
};

type MessagesWithMetadata = AbstractIntlMessages & { metadata?: MetadataContent };


const FALLBACK_METADATA: MetadataContent = {
  title: "Betriebsanlagen Check",
  description:
    "Prüfen Sie online, ob Sie für Ihre Betriebsanlage eine Genehmigung benötigen, und erhalten Sie eine Schritt-für-Schritt-Anleitung.",
  openGraph: {
    siteName: "Betriebsanlagen Check",
  },
  twitter: {
    title: "Betriebsanlagen Check",
    description:
      "Finden Sie in wenigen Minuten heraus, ob Ihre Betriebsanlage genehmigungspflichtig ist.",
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://betriebsanlagen-check.vercel.app";

const isMessagesWithMetadata = (messages: AbstractIntlMessages): messages is MessagesWithMetadata =>
  typeof (messages as MessagesWithMetadata).metadata === "object" &&
  (messages as MessagesWithMetadata).metadata !== null;

export async function generateMetadata(
  { params }: { params: { locale: string } | Promise<{ locale: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    return {};
  }

  const importedMessages = (await import(`@/messages/${locale}.json`)).default as MessagesWithMetadata;
  const metadataMessages = importedMessages.metadata ?? FALLBACK_METADATA;

  const metadataBase = new URL(SITE_URL);
  const canonical = new URL(`/${locale}`, metadataBase).toString();
  const languageAlternates = locales.reduce<Record<string, string>>((acc, currentLocale) => {
    acc[currentLocale] = new URL(`/${currentLocale}`, metadataBase).toString();
    return acc;
  }, {});
  languageAlternates["x-default"] = languageAlternates[defaultLocale];

  const openGraphConfig = metadataMessages.openGraph ?? {};
  const twitterConfig = metadataMessages.twitter ?? {};
  const parentMetadata = await parent;
  const images = openGraphConfig.images ?? parentMetadata.openGraph?.images;
  const fallbackTwitterImages = Array.isArray(images)
    ? images
        .map((image) => {
          if (typeof image === "string") return image;
          if (image instanceof URL) return image.toString();
          return image?.url;
        })
        .filter((value): value is string => Boolean(value))
    : typeof images === "string"
      ? [images]
      : undefined;
  const twitterImages = twitterConfig.images ?? fallbackTwitterImages;

  return {
    metadataBase,
    title: metadataMessages.title,
    description: metadataMessages.description,
    keywords: metadataMessages.keywords,
    alternates: {
      canonical,
      languages: languageAlternates,
    },
    openGraph: {
      ...parentMetadata.openGraph,
      type: "website",
      url: canonical,
      locale,
      siteName: openGraphConfig.siteName ?? metadataMessages.title,
      title: openGraphConfig.title ?? metadataMessages.title,
      description: openGraphConfig.description ?? metadataMessages.description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: twitterConfig.title ?? metadataMessages.title,
      description: twitterConfig.description ?? metadataMessages.description,
      creator: twitterConfig.creator,
      images: twitterImages,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) notFound();

  let messages: AbstractIntlMessages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  const metadataMessages = isMessagesWithMetadata(messages) ? messages.metadata ?? FALLBACK_METADATA : FALLBACK_METADATA;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: metadataMessages.openGraph?.siteName ?? "Betriebsanlagen Check",
    alternateName: metadataMessages.title,
    url: SITE_URL,
    description: metadataMessages.description,
    logo: `${SITE_URL}/file.svg`,
    areaServed: "AT",
  };

  return (
    <html lang={locale}>
      <body className="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LanguageBanner />
          <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <Link href={`/${locale}`} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
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
                <h1 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  Betriebsanlagen Check
                </h1>
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href={`/${locale}/faq`}
                  className="hidden md:block text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  FAQ
                </Link>
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
