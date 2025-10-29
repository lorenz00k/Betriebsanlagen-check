'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DocumentCard from '@/app/components/Documents/DocumentCard';
import { DOCUMENTS } from '@/app/config/documents';
import { AlertTriangle, CheckCircle2, BookOpen } from 'lucide-react';
import { defaultLocale } from '@/i18n';

export default function DocumentsPage() {
  const t = useTranslations('documents');
  const params = useParams<{ locale: string }>();
  const paramLocale = params?.locale;
  const activeLocale = Array.isArray(paramLocale) ? paramLocale[0] : paramLocale ?? defaultLocale;
  const [filter, setFilter] = useState<'all' | 'required' | 'optional' | 'guide'>('all');

  const filteredDocuments = filter === 'all'
    ? DOCUMENTS
    : DOCUMENTS.filter(doc => doc.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t('pageTitle')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t('pageDescription')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Disclaimer */}
        <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2 text-lg">
                {t('disclaimer.title')}
              </h3>
              <p className="text-sm text-yellow-800 leading-relaxed">
                {t('disclaimer.text')}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('filter.all')} ({DOCUMENTS.length})
            </button>
            <button
              onClick={() => setFilter('required')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'required'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('filter.required')} ({DOCUMENTS.filter(d => d.category === 'required').length})
            </button>
            <button
              onClick={() => setFilter('guide')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                filter === 'guide'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t('filter.guides')} ({DOCUMENTS.filter(d => d.category === 'guide').length})
            </button>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              language={activeLocale}
            />
          ))}
        </div>

        {/* Help Box */}
        <div className="p-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white shadow-xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2">
                {t('needHelp.title')}
              </h3>
              <p className="text-blue-100 mb-4 leading-relaxed">
                {t('needHelp.text')}
              </p>
              <Link
                href={`/${activeLocale}/check`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-bold transition-colors shadow-md"
              >
                {t('startChecker')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Source Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            {t('officialSource')}
          </p>
        </div>
      </div>
    </div>
  );
}
