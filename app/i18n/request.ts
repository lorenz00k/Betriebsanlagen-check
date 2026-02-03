import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, Locale } from "@/i18n";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  const locale: Locale =
    requested && locales.includes(requested as Locale)
      ? (requested as Locale)
      : defaultLocale;

  // Versuche Messages für locale zu laden, sonst fallback auf defaultLocale
  async function loadMessages(l: Locale) {
    const [
      home,
      nav,
      item,
      documents,
      faq,
      metadata,
      addressChecker,
      formularAssistent,
      complianceChecker,
      complianceResult
    ] = await Promise.all([
      import(`@/messages/${l}/home.json`).then((m) => m.default),
      import(`@/messages/${l}/common/nav.json`).then((m) => m.default),
      import(`@/messages/${l}/common/item.json`).then((m) => m.default),
      import(`@/messages/${l}/documents.json`).then((m) => m.default),
      import(`@/messages/${l}/faq.json`).then((m) => m.default),
      import(`@/messages/${l}/faq.json`).then((m) => m.default),
      import(`@/messages/${l}/metadata.json`).then((m) => m.default),
      import(`@/messages/${l}/addressChecker.json`).then((m) => m.default),
      import(`@/messages/${l}/formularAssistent.json`).then((m) => m.default),
      import(`@/messages/${l}/complianceChecker.json`).then((m) => m.default),
      import(`@/messages/${l}/complianceResult.json`).then((m) => m.default)
    ]);

    return {
      home,
      nav,
      item,
      documents,
      faq,
      metadata,
      addressChecker,
      formularAssistent,
      complianceChecker,
      complianceResult
    };
  }

  let messages;
  try {
    messages = await loadMessages(locale);
  } catch {
    messages = await loadMessages(defaultLocale);
  }

  return { locale, messages };
});
