import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import FormularWizard from '@/app/components/FormularAssistent/FormularWizard';

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'formularAssistent' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function FormularAssistentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="container mx-auto px-4">
        <FormularWizard />
      </div>
    </div>
  );
}
