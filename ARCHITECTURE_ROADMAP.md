# Projekt-Roadmap: Hybrid-Architektur für Betriebsanlage-Check.at

## 1. Zielsetzung
Migration der aktuellen Next.js Monolith-Architektur (Vercel) hin zu einer hybriden, hochsicheren Architektur. Ziel ist die Integration von **MCP (Model Context Protocol)**-Services via **Docker** auf einem dedizierten Worker-Server, um DSGVO-konforme Datenverarbeitung und professionelle Partner-Schnittstellen (Agentur-Portal) zu ermöglichen.

## 2. Ziel-Architektur
* **Frontend (Vercel):** Next.js App (UI, Auth, Statische Inhalte).
* **Backend Worker (VPS/Docker):** Node.js/Express oder Fastify Server in einem Docker-Container auf einem EU-basierten Server (z.B. Hetzner).
* **Security Layer:** PII-Anonymisierung (Personally Identifiable Information) vor der Übergabe an LLMs.
* **MCP Integration:** Lokale Instanzen von MCP-Servern (z.B. Markitdown, Filesystem, DeepL) zur Dokumentenverarbeitung.

---

## 3. Implementierungs-Phasen (Anweisungen für Claude)

### Phase 1: Code-Audit & Entkopplung
1.  **Code-Analyse:** Analysiere die aktuelle `app/api/`-Struktur. Identifiziere Logik, die schwere Dateiverarbeitung oder sensible Datenmanipulation durchführt.
2.  **API-Contract:** Definiere ein Interface (TypeScript), wie das Vercel-Frontend mit dem neuen Worker-Backend kommunizieren soll (Request/Response-Typen).
3.  **Environment Setup:** Bereite das Projekt darauf vor, zwischen lokalem Mock-Backend und echtem Worker-Backend zu unterscheiden.

### Phase 2: Der "Anonymisierungs-Proxy"
1.  Entwickle ein Modul zur **Daten-Schwärzung**.
    - Suche nach: Namen, Adressen, Firmenbuchnummern, E-Mails.
    - Ersetze diese durch Platzhalter (z.B. `{{FIRMA_1}}`).
    - Speichere die Zuordnung (Mapping) nur flüchtig im Speicher des Workers, um sie nach der KI-Verarbeitung wieder zurückzutauschen (Re-Identifizierung).
2.  Stelle sicher, dass **niemals** ungeschwärzte Daten an externe LLM-APIs gesendet werden.

### Phase 3: Docker & MCP Setup
1.  Erstelle ein `Dockerfile` für den Worker-Service.
2.  Integriere MCP-Server-Verbindungen:
    - `markitdown` für PDF/Word-Parsing.
    - `filesystem` für temporäre Dokumentenerstellung.
3.  Implementiere die Logik, um pro komplexem Request eine isolierte Verarbeitung zu gewährleisten.

### Phase 4: Partner-Portal (Multi-Tenancy)
1.  Erweitere das Datenbankschema, um Rollen zu unterstützen (`USER`, `AGENCY`).
2.  Erstelle eine geschützte Route `/agency/dashboard`.
3.  Implementiere eine Opt-in-Logik für User: "Daten für Förderprüfung an Agentur freigeben". Nur bei `true` darf die Agentur die (ggf. anonymisierten) Ergebnisse sehen.

---

## 4. Wichtige Leitplanken für die Entwicklung
* **Cross-Check:** Jede Änderung muss gegen den existierenden Code in `betriebsanlage-check.at` geprüft werden, um Breaking Changes zu vermeiden.
* **DSGVO-Fokus:** Datenminimierung ist oberstes Gebot. Persistente Speicherung sensibler Daten auf dem Worker-Server vermeiden.
* **Typ-Sicherheit:** Nutze Shared Types für die Kommunikation zwischen Frontend und Backend.
* **Fehlerbehandlung:** Da Docker-Container oder MCP-Services Timeouts haben können, muss ein robustes Error-Handling implementiert werden (Retry-Logik, User-Feedback).

---

## 5. Nächster Schritt für Claude
Analysiere die Datei `app/api/check/route.ts` (oder die entsprechende Haupt-Logik-Datei) und erstelle einen Entwurf für ein `Worker-Service` Skript, das die darin enthaltene Logik übernimmt, aber um eine Anonymisierungs-Funktion erweitert ist.
