/**
 * LESS CREATION — Production-Grade Text Engine
 * 
 * Supports Unicode, Hindi, English, punctuation, and emojis:
 * - Real word counting using Intl.Segmenter with Unicode regex fallback
 * - Character count with & without spaces, lines, paragraphs, reading speed
 * - Standardized case conversions (Sentence case handles '.', '!', '?', and Hindi danda '।')
 * - Line-by-line text difference / diff algorithm
 */

export interface TextMetrics {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
}

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  lineNumberOriginal?: number;
  lineNumberNew?: number;
}

/**
 * Computes deep typographic metrics for English, Hindi, and multilingual text
 */
export function analyzeText(text: string): TextMetrics {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      paragraphs: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Real word counting: Prefer Intl.Segmenter where supported
  let wordCount = 0;
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as any).Segmenter(['en', 'hi'], { granularity: 'word' });
      for (const segment of segmenter.segment(text)) {
        if (segment.isWordLike) {
          wordCount++;
        }
      }
    } catch {
      wordCount = fallbackWordCount(text);
    }
  } else {
    wordCount = fallbackWordCount(text);
  }

  // Lines
  const lines = text.split(/\r?\n/).length;

  // Paragraphs (non-empty blocks separated by double linebreaks)
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean).length || (text.trim() ? 1 : 0);

  // Reading time (~200 words/min) and Speaking time (~130 words/min)
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const speakingTimeMinutes = Math.max(1, Math.ceil(wordCount / 130));

  return {
    characters,
    charactersNoSpaces,
    words: wordCount,
    lines,
    paragraphs,
    readingTimeMinutes,
    speakingTimeMinutes
  };
}

/**
 * Unicode-aware fallback word counter for environments without Intl.Segmenter
 */
function fallbackWordCount(text: string): number {
  // Matches Latin, Devanagari (\u0900-\u097F), and standard alphanumeric sequences
  const matches = text.match(/[\p{L}\p{N}\u0900-\u097F]+(?:['’\-][\p{L}\p{N}\u0900-\u097F]+)*/gu);
  return matches ? matches.length : 0;
}

/**
 * Case conversion utilities
 */
export function convertTextCase(
  text: string,
  mode: 'upper' | 'lower' | 'title' | 'sentence'
): string {
  if (!text) return '';

  switch (mode) {
    case 'upper':
      return text.toUpperCase();

    case 'lower':
      return text.toLowerCase();

    case 'title':
      return text.replace(/\b\w+/g, word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });

    case 'sentence':
      // Split sentences on '.', '!', '?', or Hindi Purna Viram '।'
      return text.replace(/(^\s*|[.!?।]\s+)([\p{L}])/gu, (_, prefix, letter) => {
        return prefix + letter.toUpperCase();
      });

    default:
      return text;
  }
}

/**
 * Real line-by-line Diff algorithm
 */
export function compareTextLines(originalText: string, updatedText: string): DiffLine[] {
  const origLines = originalText.split(/\r?\n/);
  const newLines = updatedText.split(/\r?\n/);
  const results: DiffLine[] = [];

  let origIdx = 0;
  let newIdx = 0;

  while (origIdx < origLines.length || newIdx < newLines.length) {
    const orig = origLines[origIdx];
    const updated = newLines[newIdx];

    if (origIdx < origLines.length && newIdx < newLines.length && orig === updated) {
      results.push({
        type: 'unchanged',
        text: orig,
        lineNumberOriginal: origIdx + 1,
        lineNumberNew: newIdx + 1
      });
      origIdx++;
      newIdx++;
    } else {
      // Check if original line appears further down in newLines
      const foundInNew = newLines.indexOf(orig, newIdx);
      const foundInOrig = origLines.indexOf(updated, origIdx);

      if (origIdx < origLines.length && (foundInNew === -1 || (foundInOrig !== -1 && foundInOrig <= foundInNew))) {
        results.push({
          type: 'removed',
          text: orig,
          lineNumberOriginal: origIdx + 1
        });
        origIdx++;
      } else if (newIdx < newLines.length) {
        results.push({
          type: 'added',
          text: updated,
          lineNumberNew: newIdx + 1
        });
        newIdx++;
      } else {
        break;
      }
    }
  }

  return results;
}
