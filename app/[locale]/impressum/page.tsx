'use client'

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Impressum</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Medieninhaber & Diensteanbieter (§ 5 ECG, § 25 MedienG)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Lorenz Klemm, Lennard Baur
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">
              Fünfhausgasse 5, 1150 Wien, Österreich
            </p>
            <p className="text-gray-700 leading-relaxed">
              E-Mail:{' '}
              <a
                href="mailto:betriebsanlage.checker@gmail.com"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                betriebsanlage.checker@gmail.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verantwortlich für den Inhalt
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Lorenz Klemm, Lennard Baur
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Blattlinie (§ 25 Abs. 4 MedienG)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Informationen zur Betriebsanlagengenehmigung, insbesondere
              Orientierung für Gründer:innen und KMU; Bereitstellung eines
              unverbindlichen Checks.
            </p>
            <p className="text-gray-600 text-sm mt-2 italic">
              (Nicht periodisches Online-Medium.)
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Haftungsausschluss
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Alle Inhalte wurden sorgfältig erstellt. Es wird keine Gewähr für
              Richtigkeit, Vollständigkeit und Aktualität übernommen.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              Die Informationen stellen keine Rechtsberatung dar und ersetzen
              keine individuelle behördliche oder rechtliche Beratung.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Anschrift für Zustellungen
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Mechitaristengasse 2, 1070 Wien, Österreich
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
