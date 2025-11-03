import { getTranslations } from 'next-intl/server';
import AddressChecker from '@/app/components/AddressChecker';

export default async function AddressCheckPage() {
  const t = await getTranslations('addressChecker');

  return (
    <div className="section">
      <div className="layout-container space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-balance">{t('title')}</h1>
          <p className="mx-auto text-lg md:text-xl text-[color:var(--color-muted)] max-w-3xl">{t('subtitle')}</p>
          <p className="mx-auto text-sm md:text-base" style={{ color: 'color-mix(in srgb, var(--color-muted) 80%, white 20%)', maxWidth: '60ch' }}>
            {t('description')}
          </p>
        </header>

        <AddressChecker />
      </div>
    </div>
  );
}
