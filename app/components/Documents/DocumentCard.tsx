'use client';

import { useTranslations } from 'next-intl';
import type { Document } from '@/app/config/documents';
import { Download, ExternalLink, FileText } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
  language: string;
}

export default function DocumentCard({ document, language }: DocumentCardProps) {
  const t = useTranslations('documents');
  const translation = document.translations[language] || document.translations.de;
  const externalUrl = document.externalUrl || document.officialSource;

  // Badge-Farbe nach Kategorie
  const badgeStyles = {
    required: {
      background: 'color-mix(in srgb, var(--color-danger) 16%, white 84%)',
      color: 'var(--color-danger)'
    },
    optional: {
      background: 'color-mix(in srgb, var(--color-accent) 16%, white 84%)',
      color: 'var(--color-accent-strong)'
    },
    guide: {
      background: 'color-mix(in srgb, var(--color-success) 16%, white 84%)',
      color: 'var(--color-success)'
    }
  }[document.category];

  return (
    <div className="surface-card transition-transform duration-200 hover:-translate-y-1 overflow-hidden">
      {/* Header with Icon */}
      <div
        className="relative h-32 flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 12%, white 88%), var(--color-surface))',
        }}
      >
        <FileText className="w-16 h-16 text-[color:var(--color-accent-strong)]" strokeWidth={1.5} />

        {/* Kategorie Badge */}
        <div
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background: badgeStyles.background,
            color: badgeStyles.color,
            border: '1px solid color-mix(in srgb, currentColor 25%, transparent)',
          }}
        >
          {t(`category.${document.category}`)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2 text-[color:var(--color-fg)]">
          {translation.title}
        </h3>

        <p className="text-sm text-[color:var(--color-muted)] mb-4 line-clamp-3">
          {translation.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs mb-4 pb-4 border-b border-[color:var(--color-border)]" style={{ color: 'color-mix(in srgb, var(--color-muted) 70%, white 30%)' }}>
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {document.pages} {t('pages')}
          </span>

          <span className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            {document.fileSize.pdf} KB
          </span>
        </div>

        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center' }}
          >
            <ExternalLink className="w-4 h-4" />
            {t('openExternal')}
          </a>
        ) : (
          <p className="text-sm text-[color:var(--color-muted)] text-center">
            {t('noExternalLink')}
          </p>
        )}

        {/*
          Alter Download-Button (deaktiviert):
          <button>...</button>
        */}

        {/* Help Text */}
        {translation.help && (
          <div
            className="mt-3 rounded-[var(--radius-sm)] border p-3"
            style={{
              background: 'color-mix(in srgb, var(--color-accent) 14%, white 86%)',
              borderColor: 'color-mix(in srgb, var(--color-accent) 45%, transparent)',
              color: 'var(--color-accent-strong)',
            }}
          >
            <p className="text-xs">💡 {translation.help}</p>
          </div>
        )}

        {externalUrl && (
          <p className="mt-4 text-xs text-center" style={{ color: 'color-mix(in srgb, var(--color-muted) 70%, white 30%)' }}>
            {t('officialSource')}:{' '}
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: 'var(--color-accent-strong)' }}
            >
              {new URL(externalUrl).hostname}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
