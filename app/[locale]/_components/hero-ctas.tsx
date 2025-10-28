import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <Button
        asChild
        size="lg"
        className="w-full rounded-2xl px-6 py-6 text-base focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:w-auto"
        aria-label={t.primary}
      >
        <Link href={`/${locale}/check`} prefetch>
          {t.primary}
        </Link>
      </Button>

      <Button
        asChild
        variant="outline"
        size="lg"
        className="w-full rounded-2xl px-6 py-6 text-base focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:w-auto"
        aria-label={t.secondary}
      >
        <Link href={`/${locale}/documents`} prefetch>
          {t.secondary}
        </Link>
      </Button>
    </div>
  );
}

export type { SupportedLocale };
