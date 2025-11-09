'use client';

import { useTranslations } from 'next-intl';
import type { Document } from '@/app/config/documents';
import { Download, ExternalLink, FileText } from 'lucide-react';
import BreakText from '@/components/ui/BreakText';

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
    required: 'bg-red-100 text-red-800 border-red-200',
    optional: 'bg-blue-100 text-blue-800 border-blue-200',
    guide: 'bg-green-100 text-green-800 border-green-200'
  }[document.category];

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-200">
      {/* Header with Icon */}
      <div className="relative h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <FileText className="w-16 h-16 text-blue-600" strokeWidth={1.5} />

        {/* Kategorie Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border ${badgeStyles}`}>
          {t(`category.${document.category}`)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 text-gray-900 min-w-0">
          <BreakText className="block">{translation.title}</BreakText>
        </h3>

        <BreakText className="block text-sm text-gray-600 mb-4 line-clamp-3">
          {translation.description}
        </BreakText>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            {t('openExternal')}
          </a>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            {t('noExternalLink')}
          </p>
        )}

        {/*
          Alter Download-Button (deaktiviert):
          <button>...</button>
        */}

        {/* Help Text */}
        {translation.help && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-800">
              {translation.help}
            </p>
          </div>
        )}

        {externalUrl && (
          <p className="mt-4 text-xs text-gray-500 text-center">
            {t('officialSource')}:{' '}
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-700"
            >
              {new URL(externalUrl).hostname}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
