import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, Locale } from "@/i18n";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

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
    import(`@/messages/${locale}/home.json`).then((m) => m.default),

    import(`@/messages/${locale}/common/nav.json`).then((m) => m.default),
    import(`@/messages/${locale}/common/item.json`).then((m) => m.default),

    import(`@/messages/${locale}/documents.json`).then((m) => m.default),
    import(`@/messages/${locale}/faq.json`).then((m) => m.default),
    import(`@/messages/${locale}/metadata.json`).then((m) => m.default),

    import(`@/messages/${locale}/addressChecker.json`).then((m) => m.default),
    import(`@/messages/${locale}/formularAssistent.json`).then((m) => m.default),

    import(`@/messages/${locale}/complianceChecker.json`).then((m) => m.default),
    import(`@/messages/${locale}/complianceResult.json`).then((m) => m.default)
  ]);

  return {
    locale,
    messages: {
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
    }
  };
});
