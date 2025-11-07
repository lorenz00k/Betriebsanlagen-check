'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Document } from '@/app/config/documents';
import { Download, FileText, Loader2 } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
  language: string;
}

export default function DocumentCard({ document, language }: DocumentCardProps) {
  const t = useTranslations('documents');
  const [isDownloading, setIsDownloading] = useState(false);

  const translation = document.translations[language] || document.translations.de;

  const handleDownload = async (format: 'pdf') => {
    setIsDownloading(true);

    try {
      const response = await fetch('/api/documents/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: document.id,
          format,
          language
        })
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = globalThis.document.createElement('a');
      a.href = url;
      a.download = `${document.id}.${format}`;
      globalThis.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      globalThis.document.body.removeChild(a);

      // Analytics (Vercel)
      if (typeof window !== 'undefined' && 'va' in window) {
        const va = (window as Window & { va?: (event: string, properties?: Record<string, string>) => void }).va;
        if (va) {
          va('document_download', {
            document_id: document.id,
            format: format,
            language: language
          });
        }
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert(t('downloadFailed'));
    } finally {
      setIsDownloading(false);
    }
  };

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
        <h3 className="text-lg font-bold mb-2 text-gray-900">
          {translation.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {translation.description}
        </p>

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

        {/* Download Button */}
        <button
          onClick={() => handleDownload('pdf')}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('downloading')}
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              {t('download')} PDF
            </>
          )}
        </button>

        {/* Help Text */}
        {translation.help && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-800">
              {translation.help}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
