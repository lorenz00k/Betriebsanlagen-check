'use client'

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Datenschutzerklärung
          </h1>
          <p className="text-sm text-gray-600 mb-8 italic">
            Hinweis: Diese Vorlage ist ein Startpunkt und ersetzt keine
            Rechtsberatung.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Verantwortlicher
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Lennard Baur, Lorenz Klemm
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">
              Mechitaristengasse 2, 1070 Wien, Österreich
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              E-Mail:{' '}
              <a
                href="mailto:betriebsanlage.checker@gmail.com"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                betriebsanlage.checker@gmail.com
              </a>
            </p>
            <p className="text-gray-700 leading-relaxed">
              Ein Datenschutzbeauftragter wurde nicht bestellt.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Zwecke, Rechtsgrundlagen und Datenkategorien
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wir verarbeiten personenbezogene Daten beim Besuch dieser Website
              zu den folgenden Zwecken:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              2.1. Bereitstellung der Website / Server-Logs
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                <strong>Daten:</strong> IP-Adresse (gekürzt), Datum/Zeit der
                Anfrage, Zeitzone, HTTP-Status, User-Agent, Referrer,
                aufgerufene URL.
              </li>
              <li>
                <strong>Zweck:</strong> Technische Bereitstellung, Stabilität,
                Sicherheit (Missbrauchserkennung), Fehleranalyse.
              </li>
              <li>
                <strong>Rechtsgrundlage:</strong> Berechtigtes Interesse (Art.
                6 Abs. 1 lit. f DSGVO).
              </li>
              <li>
                <strong>Bereitstellungsnotwendigkeit:</strong> Erforderlich für
                den Betrieb der Website.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              2.2. Hosting & Content Delivery (Vercel)
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                <strong>Dienst:</strong> Vercel, Inc., 440 N Barranca Ave
                #4133, Covina, CA 91723, USA (Rechenzentren u. a. in EU/EEA;
                CDN weltweit).
              </li>
              <li>
                <strong>Daten:</strong> Technische Nutzungsdaten (siehe 2.1),
                Auslieferungs- und Protokolldaten.
              </li>
              <li>
                <strong>Zweck:</strong> Hosting, Auslieferung der Website,
                Performance, Sicherheit.
              </li>
              <li>
                <strong>Rechtsgrundlage:</strong> Berechtigtes Interesse (Art.
                6 Abs. 1 lit. f DSGVO).
              </li>
              <li>
                <strong>Empfänger/Auftragsverarbeiter:</strong> Vercel
                (Auftragsverarbeitung).
              </li>
              <li>
                <strong>Drittlandübermittlung:</strong> Möglich (USA). Schutz
                durch EU-Standardvertragsklauseln (SCCs) und zusätzliche
                Maßnahmen.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              2.3. Webanalyse (Vercel Web Analytics – cookielos)
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                <strong>Dienst:</strong> Vercel Web Analytics (integriert in
                Hosting).
              </li>
              <li>
                <strong>Daten:</strong> Aggregierte Seitenaufrufe, Referrer,
                UTM-Parameter, Browser-/Geräteinformationen, Land/Region;{' '}
                <strong>ohne</strong> Third-Party-Cookies und ohne persistente
                Nutzer-IDs (Hash-basiert, i. d. R. kurzlebig).
              </li>
              <li>
                <strong>Zweck:</strong> Reichweitenmessung, Verbesserung der
                Inhalte und Usability.
              </li>
              <li>
                <strong>Rechtsgrundlage:</strong> Berechtigtes Interesse (Art.
                6 Abs. 1 lit. f DSGVO).
              </li>
              <li>
                <strong>Hinweis:</strong> Keine Nachverfolgung über längere
                Zeiträume/über Websites hinweg; keine personalisierte Werbung.
              </li>
              <li>
                <strong>Widerspruch:</strong> Siehe Punkt 7 (Rechte) – Sie
                können der Verarbeitung aus Gründen, die sich aus Ihrer
                besonderen Situation ergeben, widersprechen.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              2.4. Kontaktaufnahme (Formular/E-Mail)
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                <strong>Daten:</strong> Name, E-Mail, Betreff, Nachricht, ggf.
                Anhänge, Zeitpunkt.
              </li>
              <li>
                <strong>Zweck:</strong> Bearbeitung Ihrer Anfrage; ggf.
                vorvertragliche Kommunikation.
              </li>
              <li>
                <strong>Rechtsgrundlage:</strong> Berechtigtes Interesse (Art.
                6 Abs. 1 lit. f) und/oder vorvertragliche Maßnahmen (Art. 6
                Abs. 1 lit. b).
              </li>
              <li>
                <strong>Speicherdauer:</strong> Bis zur abschließenden
                Bearbeitung und gemäß gesetzlichen Aufbewahrungsfristen.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Cookies und lokale Speichertechnologien
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Wir setzen derzeit <strong>keine</strong> nicht-notwendigen
              Cookies/Tracker ein. Technisch erforderliche Cookies/Storage
              können zur Bereitstellung der Website notwendig sein.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Empfänger und Auftragsverarbeiter
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Vercel, Inc. (Hosting, CDN, Analytics) – Auftragsverarbeitung auf
              Basis der Standardvertragsklauseln (SCCs).
            </p>
            <p className="text-gray-700 leading-relaxed">
              Mit den genannten Anbietern bestehen Auftragsverarbeitungsverträge
              gemäß Art. 28 DSGVO.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Drittlandübermittlungen
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Eine Übermittlung in Drittländer (insb. USA) kann im Rahmen der
              Nutzung von Vercel erfolgen. Rechtsgrundlage sind die
              EU-Standardvertragsklauseln (SCCs) und ggf. zusätzliche
              technische/organisatorische Maßnahmen. Nähere Informationen stellt
              der jeweilige Anbieter bereit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Speicherdauer
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Server-Logs:</strong> 30 Tage zur Sicherstellung von
                Betrieb und Sicherheit, danach Löschung/Anonymisierung.
              </li>
              <li>
                <strong>Kontaktanfragen:</strong> bis Abschluss der Bearbeitung
                und gemäß gesetzlichen Aufbewahrungsfristen.
              </li>
              <li>
                <strong>Webanalyse (cookielos):</strong> Es werden aggregierte,
                nicht personenbeziehbare Statistiken vorgehalten; Rohdaten mit
                IP-Bezug werden nicht dauerhaft gespeichert bzw. – soweit
                vorhanden – gekürzt/aggregiert.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Betroffenenrechte
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sie haben nach der DSGVO insbesondere folgende Rechte (sofern die
              jeweiligen Voraussetzungen vorliegen):
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>
                Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung
                (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art.
                20).
              </li>
              <li>
                Recht auf Widerspruch gegen Verarbeitungen auf Grundlage
                berechtigter Interessen (Art. 21).
              </li>
              <li>
                Recht auf Widerruf erteilter Einwilligungen (Art. 7 Abs. 3) mit
                Wirkung für die Zukunft.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Zur Ausübung wenden Sie sich an:{' '}
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
              8. Beschwerderecht
            </h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Sie haben das Recht, Beschwerde bei der{' '}
              <strong>Österreichischen Datenschutzbehörde</strong> einzulegen:
            </p>
            <p className="text-gray-700 leading-relaxed">
              Österreichische Datenschutzbehörde
              <br />
              Barichgasse 40–42, 1030 Wien
              <br />
              <a
                href="https://www.dsb.gv.at"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                www.dsb.gv.at
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Sicherheit der Verarbeitung
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Wir treffen angemessene technische und organisatorische Maßnahmen
              (z. B. TLS-Verschlüsselung, Zugriffsbeschränkungen,
              Least-Privilege, regelmäßige Updates), um personenbezogene Daten
              zu schützen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Änderungen dieser Datenschutzerklärung
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Wir passen diese Erklärung an, wenn sich Rechtslage, Dienste oder
              Verarbeitungen ändern. Die jeweils aktuelle Fassung ist hier
              abrufbar.
            </p>
            <p className="text-gray-600 text-sm">Version: 15.10.2025</p>
          </section>
        </div>
      </div>
    </div>
  )
}
