'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DocumentCard from '@/app/components/Documents/DocumentCard';
import { DOCUMENTS } from '@/app/config/documents';
import BreakText from '@/components/ui/BreakText';
import {
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Phone,
  Mail,
  Globe,
  FileText,
  Volume2,
  Wind,
  Flame,
  Euro,
  Clock,
  Wrench,
  FolderOpen,
  Users,
  CheckSquare,
} from 'lucide-react';
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
              <BreakText>{t('title')}</BreakText>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              <BreakText>{t('subtitle')}</BreakText>
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Intro */}
        <div className="mb-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
          <p className="text-gray-700 leading-relaxed">
            <BreakText>{t('intro')}</BreakText>
          </p>
        </div>

        {/* Schritt-für-Schritt Anleitung */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-blue-600" />
            <BreakText>{t('steps.step1.title')}</BreakText>
          </h2>

          {/* Step 1: Vorprüfung */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              <BreakText>{`1. ${t('steps.step1.title')}`}</BreakText>
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              <BreakText>{t('steps.step1.description')}</BreakText>
            </p>

            <h4 className="font-bold text-gray-900 mb-4">
              <BreakText>{t('steps.step1.contactTitle')}</BreakText>
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="tel:+4314000-25310"
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    <BreakText>{t('steps.step1.contact.phone.label')}</BreakText>
                  </div>
                  <div className="text-sm text-gray-600">
                    <BreakText>{t('steps.step1.contact.phone.value')}</BreakText>
                  </div>
                </div>
              </a>

              <a
                href="mailto:post@ma36.wien.gv.at"
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">
                    <BreakText>{t('steps.step1.contact.email.label')}</BreakText>
                  </div>
                  <div className="text-sm text-gray-600">
                    <BreakText>{t('steps.step1.contact.email.value')}</BreakText>
                  </div>
                </div>
              </a>

              <a
                href="https://www.wien.gv.at/kontakte/ma36/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Globe className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Website</div>
                  <div className="text-sm text-gray-600">
                    <BreakText>{t('steps.step1.contact.website.value')}</BreakText>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Step 2: Dokumente vorbereiten */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              <BreakText>{`2. ${t('steps.step2.title')}`}</BreakText>
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              <BreakText>{t('steps.step2.description')}</BreakText>
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-gray-900 mb-2">
                  <BreakText>{t('steps.step2.items.applicationForm.title')}</BreakText>
                </h4>
                <p className="text-sm text-gray-600">
                  <BreakText>{t('steps.step2.items.applicationForm.description')}</BreakText>
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-gray-900 mb-2">
                  <BreakText>{t('steps.step2.items.businessLicense.title')}</BreakText>
                </h4>
                <p className="text-sm text-gray-600">
                  <BreakText>{t('steps.step2.items.businessLicense.description')}</BreakText>
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <FolderOpen className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-gray-900 mb-2">
                  <BreakText>{t('steps.step2.items.plans.title')}</BreakText>
                </h4>
                <p className="text-sm text-gray-600">
                  <BreakText>{t('steps.step2.items.plans.description')}</BreakText>
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <Wrench className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-gray-900 mb-2">
                  <BreakText>{t('steps.step2.items.technicalDescription.title')}</BreakText>
                </h4>
                <p className="text-sm text-gray-600">
                  <BreakText>{t('steps.step2.items.technicalDescription.description')}</BreakText>
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-gray-900 mb-2">
                  <BreakText>{t('steps.step2.items.neighbors.title')}</BreakText>
                </h4>
                <p className="text-sm text-gray-600">
                  <BreakText>{t('steps.step2.items.neighbors.description')}</BreakText>
                </p>
              </div>

              <div className="p-4 border-2 border-gray-200 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-gray-900 mb-2">
                  <BreakText>{t('steps.step2.items.tenancy.title')}</BreakText>
                </h4>
                <p className="text-sm text-gray-600">
                  <BreakText>{t('steps.step2.items.tenancy.description')}</BreakText>
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Antrag einreichen */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              <BreakText>{`3. ${t('steps.step3.title')}`}</BreakText>
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              <BreakText>{t('steps.step3.description')}</BreakText>
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3">
                  <BreakText>{t('steps.step3.options.inPerson.title')}</BreakText>
                </h4>
                <p className="text-gray-700 mb-2">
                  <BreakText>{t('steps.step3.options.inPerson.line1')}</BreakText>
                </p>
                <p className="text-sm text-gray-600">
                  <BreakText>{t('steps.step3.options.inPerson.line2')}</BreakText>
                </p>
              </div>

              <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3">
                  <BreakText>{t('steps.step3.options.mail.title')}</BreakText>
                </h4>
                <p className="text-gray-700 mb-2">
                  <BreakText>{t('steps.step3.options.mail.line1')}</BreakText>
                </p>
                <p className="text-sm text-gray-600">
                  <BreakText>{t('steps.step3.options.mail.line2')}</BreakText>
                </p>
              </div>
            </div>
          </div>

          {/* Step 4: Nach der Einreichung */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              <BreakText>{`4. ${t('steps.step4.title')}`}</BreakText>
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              <BreakText>{t('steps.step4.description')}</BreakText>
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">{t('steps.step4.items.confirmation.icon')}</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    <BreakText>{t('steps.step4.items.confirmation.title')}</BreakText>
                  </h4>
                  <p className="text-sm text-gray-600">
                    <BreakText>{t('steps.step4.items.confirmation.description')}</BreakText>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">{t('steps.step4.items.assessment.icon')}</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    <BreakText>{t('steps.step4.items.assessment.title')}</BreakText>
                  </h4>
                  <p className="text-sm text-gray-600">
                    <BreakText>{t('steps.step4.items.assessment.description')}</BreakText>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">{t('steps.step4.items.questions.icon')}</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    <BreakText>{t('steps.step4.items.questions.title')}</BreakText>
                  </h4>
                  <p className="text-sm text-gray-600">
                    <BreakText>{t('steps.step4.items.questions.description')}</BreakText>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">{t('steps.step4.items.decision.icon')}</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    <BreakText>{t('steps.step4.items.decision.title')}</BreakText>
                  </h4>
                  <p className="text-sm text-gray-600">
                    <BreakText>{t('steps.step4.items.decision.description')}</BreakText>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-bold text-gray-900">
                <BreakText>{t('steps.step4.processingTime')}</BreakText>
              </p>
            </div>
          </div>
        </div>

        {/* Häufig benötigte Fachgutachten */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <BreakText>{t('expertReports.title')}</BreakText>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <Volume2 className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <BreakText>{t('expertReports.items.noise.title')}</BreakText>
              </h3>
              <p className="text-gray-600">
                <BreakText>{t('expertReports.items.noise.description')}</BreakText>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <Wind className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <BreakText>{t('expertReports.items.ventilation.title')}</BreakText>
              </h3>
              <p className="text-gray-600">
                <BreakText>{t('expertReports.items.ventilation.description')}</BreakText>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <Flame className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <BreakText>{t('expertReports.items.fireProtection.title')}</BreakText>
              </h3>
              <p className="text-gray-600">
                <BreakText>{t('expertReports.items.fireProtection.description')}</BreakText>
              </p>
            </div>
          </div>
        </div>

        {/* Kosten & Gebühren */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Euro className="w-8 h-8 text-blue-600" />
            <BreakText>{t('fees.title')}</BreakText>
          </h2>

          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{t('fees.items.federalFees.icon')}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    <BreakText>{t('fees.items.federalFees.title')}</BreakText>
                  </h3>
                  <p className="text-gray-600">
                    <BreakText>{t('fees.items.federalFees.description')}</BreakText>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-3xl">{t('fees.items.expertFees.icon')}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    <BreakText>{t('fees.items.expertFees.title')}</BreakText>
                  </h3>
                  <p className="text-gray-600">
                    <BreakText>{t('fees.items.expertFees.description')}</BreakText>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-3xl">{t('fees.items.ownExperts.icon')}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    <BreakText>{t('fees.items.ownExperts.title')}</BreakText>
                  </h3>
                  <p className="text-gray-600">
                    <BreakText>{t('fees.items.ownExperts.description')}</BreakText>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-3xl">{t('fees.items.time.icon')}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    <BreakText>{t('fees.items.time.title')}</BreakText>
                  </h3>
                  <p className="text-gray-600">
                    <BreakText>{t('fees.items.time.description')}</BreakText>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tipps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-blue-600" />
            <BreakText>{t('tips.title')}</BreakText>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <span className="text-3xl mb-3 block">{t('tips.items.planEarly.icon')}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <BreakText>{t('tips.items.planEarly.title')}</BreakText>
              </h3>
              <p className="text-gray-600">
                <BreakText>{t('tips.items.planEarly.description')}</BreakText>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <span className="text-3xl mb-3 block">{t('tips.items.contactAuthority.icon')}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <BreakText>{t('tips.items.contactAuthority.title')}</BreakText>
              </h3>
              <p className="text-gray-600">
                <BreakText>{t('tips.items.contactAuthority.description')}</BreakText>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <span className="text-3xl mb-3 block">{t('tips.items.useChecklists.icon')}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <BreakText>{t('tips.items.useChecklists.title')}</BreakText>
              </h3>
              <p className="text-gray-600">
                <BreakText>{t('tips.items.useChecklists.description')}</BreakText>
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <span className="text-3xl mb-3 block">{t('tips.items.stayFlexible.icon')}</span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                <BreakText>{t('tips.items.stayFlexible.title')}</BreakText>
              </h3>
              <p className="text-gray-600">
                <BreakText>{t('tips.items.stayFlexible.description')}</BreakText>
              </p>
            </div>
          </div>
        </div>

        {/* Download-Sektion */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Formulare zum Download
          </h2>

          {/* Disclaimer */}
          <div className="mb-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-2 text-lg">
                  <BreakText>{t('disclaimer.title')}</BreakText>
                </h3>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  <BreakText>{t('disclaimer.text')}</BreakText>
                </p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <BreakText>{t('filter.all')}</BreakText> ({DOCUMENTS.length})
              </button>
              <button
                onClick={() => setFilter('required')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'required'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <BreakText>{t('filter.required')}</BreakText> ({DOCUMENTS.filter(d => d.category === 'required').length})
              </button>
              <button
                onClick={() => setFilter('guide')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${filter === 'guide'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <BreakText>{t('filter.guides')}</BreakText> ({DOCUMENTS.filter(d => d.category === 'guide').length})
              </button>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(doc => (
              <DocumentCard
                key={doc.id}
                document={doc}
                language={activeLocale}
              />
            ))}
          </div>
        </div>

        {/* Help Box */}
        <div className="p-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 rounded-2xl text-blue-900 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/60 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-2">
                <BreakText>{t('needHelp.title')}</BreakText>
              </h3>
              <p className="text-blue-800 mb-4 leading-relaxed">
                <BreakText>{t('needHelp.text')}</BreakText>
              </p>
              <Link
                href={`/${activeLocale}/check`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md transition-colors hover:bg-blue-700"
              >
                <BreakText>{t('startChecker')}</BreakText>
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
            <span>
              <BreakText>{t('officialSource')}</BreakText> |
            </span>
            <a
              href="https://www.wien.gv.at/amtswege/genehmigung-betriebsanlage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              wien.gv.at/betriebsanlage
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
