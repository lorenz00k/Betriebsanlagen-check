/**
 * Anthropic Claude Client
 *
 * Handles interactions with Claude 3.5 Haiku for generating RAG responses.
 */

import Anthropic from '@anthropic-ai/sdk';

// Singleton pattern für Anthropic Client
let anthropicClient: Anthropic | null = null;

/**
 * Initialize Anthropic Client
 */
export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }

    anthropicClient = new Anthropic({
      apiKey: apiKey,
    });
  }

  return anthropicClient;
}

/**
 * Claude Model Configuration
 */
export const CLAUDE_CONFIG = {
  model: 'claude-3-5-haiku-20241022',  // Claude 3.5 Haiku (schnell & günstig)
  maxTokens: 2048,                      // Max Output Tokens
  temperature: 0.3,                     // Niedrig für faktische Antworten
};

/**
 * Context Interface für User-Infos
 */
export interface UserContext {
  betriebsart?: string;    // z.B. "Restaurant", "Café", "Bar"
  groesse?: string;        // z.B. "50 Gästeplätze", "100 m²"
  bezirk?: string;        // z.B. "1. Bezirk", "Innere Stadt"
  features?: string[];    // z.B. ["Küche", "Schanigarten", "Live-Musik"]
  [key: string]: unknown; // Weitere Felder
}

/**
 * Source Document Interface
 */
export interface SourceDocument {
  text: string;
  source: string;
  page?: number;
  section?: string;
  score: number;
}

/**
 * Generate RAG Response with Claude
 *
 * @param userQuery Die Frage des Users
 * @param sourceDocuments Relevante Dokumente aus Pinecone
 * @param userContext Zusätzlicher Kontext vom User
 */
export async function generateRAGResponse(
  userQuery: string,
  sourceDocuments: SourceDocument[],
  userContext?: UserContext
): Promise<{
  answer: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}> {
  try {
    const client = getAnthropicClient();

    // Build System Prompt
    const systemPrompt = buildSystemPrompt();

    // Build Context from source documents
    const contextText = buildContextText(sourceDocuments);

    // Build User Message
    const userMessage = buildUserMessage(userQuery, contextText, userContext);

    // Call Claude API
    const response = await client.messages.create({
      model: CLAUDE_CONFIG.model,
      max_tokens: CLAUDE_CONFIG.maxTokens,
      temperature: CLAUDE_CONFIG.temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    // Extract text from response
    const answerText = response.content
      .filter(block => block.type === 'text')
      .map(block => ('text' in block ? block.text : ''))
      .join('\n');

    return {
      answer: answerText,
      model: CLAUDE_CONFIG.model,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      }
    };
  } catch (error) {
    console.error('❌ Error generating RAG response:', error);
    throw error;
  }
}

/**
 * Build System Prompt für RAG
 */
function buildSystemPrompt(): string {
  return `Du bist ein freundlicher KI-Assistent für Betriebsanlagengenehmigungen in Wien. Deine Antworten sollen modern, übersichtlich und leicht verständlich sein.

WICHTIGE REGELN:
- Sprich den Nutzer direkt mit "Du" an
- Verwende einfache, verständliche Sprache
- Gib KEINE Rechtsberatung - nur Informationen
- Basiere deine Antwort NUR auf den bereitgestellten Gesetzestexten

ANTWORT-STRUKTUR (genau in dieser Reihenfolge):

1. **HAUPTAUSSAGE** (1-2 Sätze)
   Beginne mit einer klaren, direkten Aussage:
   - "Du brauchst eine Betriebsanlagengenehmigung, weil..."
   - "Für deinen Betrieb ist keine UVP erforderlich, weil..."
   - "Du musst folgende Genehmigungen einholen, weil..."

   Erkläre das "WARUM" sofort - nicht nur "was" zu tun ist.

2. **RECHTLICHE GRUNDLAGE** (2-3 Sätze)
   Erkläre die relevanten Gesetze/Paragraphen in einfachen Worten:
   - "Nach § 77 der Gewerbeordnung gilt: [Zusammenfassung]"
   - "Die GFVO (Gastgewerbe-Verordnung) schreibt vor, dass..."

   Übersetze Juristensprache in Alltagssprache!

3. **KONKRETE SCHRITTE** (Bulletpoints)
   Liste klar auf, was zu tun ist:
   ✓ Schritt 1: [Was genau?]
   ✓ Schritt 2: [Was genau?]
   ✓ Schritt 3: [Was genau?]

4. **WICHTIGE HINWEISE** (falls relevant)
   - Besondere Anforderungen
   - Häufige Stolpersteine
   - Fristen oder Kosten

5. **NÄCHSTE SCHRITTE**
   - Empfehlung zur Kontaktaufnahme mit MA 36
   - Hinweis auf weitere benötigte Unterlagen

STIL:
- Kurze Sätze (max. 20 Wörter)
- Aktive statt passive Formulierungen
- "Du musst..." statt "Es muss..."
- Keine Schachtelsätze
- Emojis NICHT verwenden

BEISPIEL FÜR GUTE ANTWORT:

"Du brauchst eine Betriebsanlagengenehmigung, weil dein Restaurant mit Küche als Betriebsanlage gilt. Die Gewerbeordnung sieht das so vor, um Nachbarn vor Lärm und Gerüchen zu schützen.

Nach § 74 der Gewerbeordnung sind alle gewerblichen Betriebe mit möglichen Emissionen genehmigungspflichtig. Dein Restaurant mit Vollküche fällt darunter.

Diese Schritte musst du gehen:
✓ Grundrissplan im Maßstab 1:100 erstellen lassen
✓ Betriebsbeschreibung mit allen Details verfassen
✓ Maschinen- und Geräteliste mit Leistungsangaben erstellen
✓ Antragsformular bei der MA 36 einreichen (4-fach)

Wichtig zu wissen:
Die Genehmigung dauert normalerweise 3-6 Monate. Alle Pläne müssen von einem befugten Planer (Architekt) unterschrieben sein.

Nächster Schritt:
Kontaktiere die MA 36 unter +43 1 4000-25310 für eine kostenlose Vorabberatung. So vermeidest du Fehler im Antrag."`;
}

/**
 * Build Context Text from source documents
 */
function buildContextText(sourceDocuments: SourceDocument[]): string {
  if (sourceDocuments.length === 0) {
    return 'Keine relevanten Gesetzestexte gefunden.';
  }

  const contextParts = sourceDocuments.map((doc, index) => {
    const header = `[Quelle ${index + 1}] ${doc.source}${doc.section ? ` - ${doc.section}` : ''}${doc.page ? ` (Seite ${doc.page})` : ''} [Relevanz: ${(doc.score * 100).toFixed(1)}%]`;
    return `${header}\n${doc.text}\n`;
  });

  return `GESETZESTEXTE UND VERORDNUNGEN:\n\n${contextParts.join('\n---\n\n')}`;
}

/**
 * Build User Message
 */
function buildUserMessage(
  userQuery: string,
  contextText: string,
  userContext?: UserContext
): string {
  let message = '';

  // User Context hinzufügen (falls vorhanden)
  if (userContext && Object.keys(userContext).length > 0) {
    message += 'KONTEXT ZUM BETRIEB:\n';

    if (userContext.betriebsart) {
      message += `- Art des Betriebs: ${userContext.betriebsart}\n`;
    }
    if (userContext.groesse) {
      message += `- Größe: ${userContext.groesse}\n`;
    }
    if (userContext.bezirk) {
      message += `- Standort: ${userContext.bezirk}\n`;
    }
    if (userContext.features && userContext.features.length > 0) {
      message += `- Besonderheiten: ${userContext.features.join(', ')}\n`;
    }

    message += '\n';
  }

  // Context Text
  message += contextText;

  // User Query
  message += `\n\n---\n\nFRAGE DES NUTZERS:\n${userQuery}\n\nBitte beantworte diese Frage basierend auf den oben genannten Gesetzestexten.`;

  return message;
}

/**
 * Test Anthropic connection
 */
export async function testAnthropicConnection() {
  try {
    const client = getAnthropicClient();

    const response = await client.messages.create({
      model: CLAUDE_CONFIG.model,
      max_tokens: 50,
      messages: [
        {
          role: 'user',
          content: 'Antworte mit "OK" wenn du online bist.'
        }
      ]
    });

    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => ('text' in block ? block.text : ''))
      .join('');

    return {
      success: true,
      message: 'Anthropic connection successful',
      model: CLAUDE_CONFIG.model,
      testResponse: text
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    };
  }
}

/**
 * Calculate Claude API cost estimate
 *
 * Claude 3.5 Haiku:
 * - Input: $0.25 per 1M tokens
 * - Output: $1.25 per 1M tokens
 */
export function estimateClaudeCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1_000_000) * 0.25;
  const outputCost = (outputTokens / 1_000_000) * 1.25;
  return inputCost + outputCost;
}
