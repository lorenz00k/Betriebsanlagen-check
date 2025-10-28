import Link from "next/link";

type SupportedLocale = "de" | "en";

const LABELS: Record<SupportedLocale, { primary: string; secondary: string }> = {
  de: { primary: "Check starten", secondary: "Unterlagen & Ablauf" },
  en: { primary: "Start check", secondary: "Documents & process" },
};

type HeroCtasProps = {
  locale?: SupportedLocale;
};

export function HeroCtas({ locale = "de" }: HeroCtasProps) {
  const t = LABELS[locale] ?? LABELS.de;

  return (
    <div className="mt-8 flex flex-col items-stretch justify-center gap-3 md:flex-row md:flex-wrap md:items-center">
      <Link
        href={`/${locale}/check`}
        prefetch
        aria-label={t.primary}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-6 text-base font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 md:w-auto"
      >
        {t.primary}
      </Link>

      <Link
        href={`/${locale}/documents`}
        prefetch
        aria-label={t.secondary}
        className="inline-flex w-full items-center justify-center rounded-2xl border border-blue-600 px-6 py-6 text-base font-semibold text-blue-600 transition-colors hover:border-blue-500 hover:text-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 md:w-auto"
      >
        {t.secondary}
      </Link>
    </div>
  );
}

export type { SupportedLocale };
