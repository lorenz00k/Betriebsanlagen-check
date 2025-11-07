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
  return `Du bist ein Experte für Betriebsanlagengenehmigungen in Wien, spezialisiert auf Gastronomiebetriebe.

Deine Aufgabe:
- Beantworte Fragen zu Genehmigungen, Gesetzen und Verordnungen
- Nutze NUR die bereitgestellten Gesetzestexte als Grundlage
- Gib präzise, faktische Antworten
- Nenne IMMER die Quellenangaben (§-Paragraphen, Gesetze)
- Strukturiere deine Antwort klar und verständlich

Wichtige Regeln:
1. KEINE Rechtsberatung - nur Informationen
2. KEINE Garantien oder Versprechen
3. Bei Unsicherheit: Empfehle Rücksprache mit Behörde/Anwalt
4. Verwende einfache, verständliche Sprache
5. Gib konkrete, umsetzbare Informationen

Format deiner Antwort:
1. Direkte Antwort auf die Frage
2. Notwendige Schritte/Dokumente (wenn relevant)
3. Quellenangaben (§-Paragraphen)
4. Hinweis auf Besonderheiten (wenn relevant)`;
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
