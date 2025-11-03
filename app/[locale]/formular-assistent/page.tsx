import { getTranslations } from 'next-intl/server';
import FormularWizard from '@/app/components/FormularAssistent/FormularWizard';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'formularAssistent' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function FormularAssistentPage() {
  return (
    <div className="section">
      <div className="layout-container">
        <FormularWizard />
      </div>
    </div>
  );
}
