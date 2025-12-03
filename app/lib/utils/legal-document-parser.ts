/**
 * Legal Document Structure Parser
 *
 * Parses Austrian legal documents (GewO, GFVO, etc.) to extract hierarchical structure:
 * - § (Paragraph) - Main sections
 * - Abs. (Absatz) - Subsections
 * - Z (Ziffer) - Numbered points
 *
 * This preserves the legal document hierarchy for better context retrieval.
 */

export interface LegalSection {
  type: 'paragraph' | 'absatz' | 'ziffer' | 'text';
  identifier: string;  // e.g., "§ 77", "Abs. 2", "Z 1"
  text: string;
  startIndex: number;
  endIndex: number;
  level: number;  // 0 = paragraph, 1 = absatz, 2 = ziffer, 3 = text
  parentId?: string;  // Reference to parent section
  children: LegalSection[];
}

export interface ParsedLegalDocument {
  sections: LegalSection[];
  metadata: {
    totalSections: number;
    paragraphs: number;
    absatze: number;
    ziffern: number;
  };
}

/**
 * Parse legal document into hierarchical sections
 */
export function parseLegalDocument(text: string): ParsedLegalDocument {
  const sections: LegalSection[] = [];

  const metadata = {
    totalSections: 0,
    paragraphs: 0,
    absatze: 0,
    ziffern: 0
  };

  // Find all paragraph markers first (top-level structure)
  const paragraphRegex = /§\s*(\d+[a-z]?)/gi;
  let paragraphMatch;

  while ((paragraphMatch = paragraphRegex.exec(text)) !== null) {
    const paragraphId = `§ ${paragraphMatch[1]}`;
    const paragraphStart = paragraphMatch.index;

    // Find where this paragraph ends (at next paragraph or end of document)
    const nextParagraphMatch = paragraphRegex.exec(text);
    const paragraphEnd = nextParagraphMatch
      ? nextParagraphMatch.index
      : text.length;

    // Reset regex for next iteration
    if (nextParagraphMatch) {
      paragraphRegex.lastIndex = nextParagraphMatch.index;
    }

    const paragraphText = text.substring(paragraphStart, paragraphEnd);

    // Parse Absätze within this paragraph
    const absatze = parseAbsatze(paragraphText, paragraphStart, paragraphId);

    const paragraphSection: LegalSection = {
      type: 'paragraph',
      identifier: paragraphId,
      text: paragraphText,
      startIndex: paragraphStart,
      endIndex: paragraphEnd,
      level: 0,
      children: absatze
    };

    sections.push(paragraphSection);
    metadata.paragraphs++;
    metadata.totalSections++;
  }

  return {
    sections,
    metadata
  };
}

/**
 * Parse Absätze (subsections) within a paragraph
 */
function parseAbsatze(
  text: string,
  baseOffset: number,
  parentId: string
): LegalSection[] {
  const absatze: LegalSection[] = [];

  // Match both "Abs. X" and "(X)" patterns
  const absatzRegex = /(?:Abs\.\s*(\d+)|\((\d+)\))/gi;
  let absatzMatch;

  while ((absatzMatch = absatzRegex.exec(text)) !== null) {
    const absatzNum = absatzMatch[1] || absatzMatch[2];
    const absatzId = `Abs. ${absatzNum}`;
    const absatzStart = absatzMatch.index;

    // Find where this Absatz ends
    const nextAbsatzMatch = absatzRegex.exec(text);
    const absatzEnd = nextAbsatzMatch
      ? nextAbsatzMatch.index
      : text.length;

    // Reset regex
    if (nextAbsatzMatch) {
      absatzRegex.lastIndex = nextAbsatzMatch.index;
    }

    const absatzText = text.substring(absatzStart, absatzEnd);

    // Parse Ziffern within this Absatz
    const ziffern = parseZiffern(absatzText, baseOffset + absatzStart, `${parentId} ${absatzId}`);

    const absatzSection: LegalSection = {
      type: 'absatz',
      identifier: absatzId,
      text: absatzText,
      startIndex: baseOffset + absatzStart,
      endIndex: baseOffset + absatzEnd,
      level: 1,
      parentId: parentId,
      children: ziffern
    };

    absatze.push(absatzSection);
  }

  return absatze;
}

/**
 * Parse Ziffern (numbered points) within an Absatz
 */
function parseZiffern(
  text: string,
  baseOffset: number,
  parentId: string
): LegalSection[] {
  const ziffern: LegalSection[] = [];

  // Match "Z X", "Z. X", "Ziffer X" patterns
  const zifferRegex = /(?:Z\.?\s*(\d+)|Ziffer\s*(\d+))/gi;
  let zifferMatch;

  while ((zifferMatch = zifferRegex.exec(text)) !== null) {
    const zifferNum = zifferMatch[1] || zifferMatch[2];
    const zifferId = `Z ${zifferNum}`;
    const zifferStart = zifferMatch.index;

    // Find where this Ziffer ends
    const nextZifferMatch = zifferRegex.exec(text);
    const zifferEnd = nextZifferMatch
      ? nextZifferMatch.index
      : text.length;

    // Reset regex
    if (nextZifferMatch) {
      zifferRegex.lastIndex = nextZifferMatch.index;
    }

    const zifferText = text.substring(zifferStart, zifferEnd);

    const zifferSection: LegalSection = {
      type: 'ziffer',
      identifier: zifferId,
      text: zifferText,
      startIndex: baseOffset + zifferStart,
      endIndex: baseOffset + zifferEnd,
      level: 2,
      parentId: parentId,
      children: []
    };

    ziffern.push(zifferSection);
  }

  return ziffern;
}

/**
 * Get full hierarchical path for a section
 * Example: "§ 77 Abs. 2 Z 1"
 */
export function getSectionPath(section: LegalSection, allSections: LegalSection[]): string {
  const path: string[] = [section.identifier];

  let currentParentId = section.parentId;

  while (currentParentId) {
    // Find parent section
    const parent = findSectionById(currentParentId, allSections);
    if (parent) {
      path.unshift(parent.identifier);
      currentParentId = parent.parentId;
    } else {
      break;
    }
  }

  return path.join(' ');
}

/**
 * Find section by full identifier
 */
function findSectionById(id: string, sections: LegalSection[]): LegalSection | null {
  for (const section of sections) {
    if (section.identifier === id) {
      return section;
    }

    const found = findSectionById(id, section.children);
    if (found) {
      return found;
    }
  }

  return null;
}

/**
 * Get parent context for a section (includes all parent section texts)
 */
export function getParentContext(
  section: LegalSection,
  allSections: LegalSection[]
): string[] {
  const contexts: string[] = [];

  let currentParentId = section.parentId;

  while (currentParentId) {
    const parent = findSectionById(currentParentId, allSections);
    if (parent) {
      // Extract introduction text (text before first child)
      const introText = extractIntroductionText(parent);
      if (introText.trim().length > 0) {
        contexts.unshift(introText);
      }
      currentParentId = parent.parentId;
    } else {
      break;
    }
  }

  return contexts;
}

/**
 * Extract introduction text from a section (before first child)
 */
function extractIntroductionText(section: LegalSection): string {
  if (section.children.length === 0) {
    return section.text;
  }

  const firstChildStart = section.children[0].startIndex;
  const introEnd = firstChildStart - section.startIndex;

  return section.text.substring(0, introEnd);
}
