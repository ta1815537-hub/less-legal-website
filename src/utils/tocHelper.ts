/**
 * TOC & Heading Parser Utility
 * 
 * Provides:
 * - Stable, unique anchor ID generation (handling duplicates cleanly)
 * - Automatic hierarchical numbering (1, 2, 2.1, 2.2, 2.2.1, 3, etc.)
 * - Parsing of Markdown and semantic HTML headings (H2, H3, H4)
 * - Rich paste conversion from Google Docs, Word, and web sources
 */

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3 | 4;
  numbering: string;
}

/**
 * Strips markdown and HTML formatting to extract clean text for anchor calculation and display
 */
export function cleanHeadingText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove markdown links, keep text
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
    .replace(/\*(.*?)\*/g, '$1') // remove italics
    .replace(/`([^`]+)`/g, '$1') // remove inline code
    .replace(/~~(.*?)~~/g, '$1') // remove strikethrough
    .trim();
}

/**
 * Generates a stable, URL-friendly, and unique DOM id from heading text.
 * Keeps track of used IDs to ensure duplicates receive a unique suffix (-2, -3, etc.).
 */
export function generateUniqueAnchorId(text: string, usedSlugs: Map<string, number>): string {
  const clean = cleanHeadingText(text);
  
  // Create slug retaining unicode letters and numbers (works for English, Hindi, etc.)
  let slug = clean
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep letters, numbers, spaces, hyphens
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Trim hyphens

  if (!slug) {
    slug = 'section';
  }

  // Handle collision / duplicates
  const currentCount = usedSlugs.get(slug);
  if (currentCount === undefined) {
    usedSlugs.set(slug, 1);
    return slug;
  } else {
    const nextCount = currentCount + 1;
    usedSlugs.set(slug, nextCount);
    return `${slug}-${nextCount}`;
  }
}

/**
 * Computes legal hierarchical numbering for a list of headings
 * H2 -> 1, 2, 3
 * H3 under H2 -> 2.1, 2.2
 * H4 under H3 -> 2.2.1, 2.2.2
 */
export function computeHierarchicalNumbering(items: Array<{ level: 2 | 3 | 4 }>): string[] {
  let h2Count = 0;
  let h3Count = 0;
  let h4Count = 0;

  return items.map((item) => {
    if (item.level === 2) {
      h2Count++;
      h3Count = 0;
      h4Count = 0;
      return `${h2Count}`;
    } else if (item.level === 3) {
      if (h2Count === 0) h2Count = 1;
      h3Count++;
      h4Count = 0;
      return `${h2Count}.${h3Count}`;
    } else {
      // level 4
      if (h2Count === 0) h2Count = 1;
      if (h3Count === 0) h3Count = 1;
      h4Count++;
      return `${h2Count}.${h3Count}.${h4Count}`;
    }
  });
}

/**
 * Fast parser to extract Table of Contents directly from article body.
 * Works seamlessly on both Markdown and HTML headings (H2, H3, H4).
 * H1 is treated as the article title and excluded from the TOC.
 */
export function extractTocFromContent(content: string): TocItem[] {
  if (!content || typeof content !== 'string') return [];

  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const rawHeadings: Array<{ text: string; level: 2 | 3 | 4 }> = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    // 1. Markdown H2 (## ...)
    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ') && !trimmed.startsWith('#### ')) {
      const text = trimmed.replace(/^##\s+/, '').trim();
      if (text) rawHeadings.push({ text, level: 2 });
      continue;
    }

    // 2. Markdown H3 (### ...)
    if (trimmed.startsWith('### ') && !trimmed.startsWith('#### ')) {
      const text = trimmed.replace(/^###\s+/, '').trim();
      if (text) rawHeadings.push({ text, level: 3 });
      continue;
    }

    // 3. Markdown H4 (#### ...)
    if (trimmed.startsWith('#### ')) {
      const text = trimmed.replace(/^####\s+/, '').trim();
      if (text) rawHeadings.push({ text, level: 4 });
      continue;
    }

    // 4. HTML Headings: <h2 ...>...</h2>, <h3 ...>...</h3>, <h4 ...>...</h4>
    const htmlH2Match = trimmed.match(/<h2(?:\s+[^>]*)?>(.*?)<\/h2>/i);
    if (htmlH2Match) {
      const text = cleanHeadingText(htmlH2Match[1]);
      if (text) rawHeadings.push({ text, level: 2 });
      continue;
    }

    const htmlH3Match = trimmed.match(/<h3(?:\s+[^>]*)?>(.*?)<\/h3>/i);
    if (htmlH3Match) {
      const text = cleanHeadingText(htmlH3Match[1]);
      if (text) rawHeadings.push({ text, level: 3 });
      continue;
    }

    const htmlH4Match = trimmed.match(/<h4(?:\s+[^>]*)?>(.*?)<\/h4>/i);
    if (htmlH4Match) {
      const text = cleanHeadingText(htmlH4Match[1]);
      if (text) rawHeadings.push({ text, level: 4 });
      continue;
    }
  }

  // Generate unique IDs and numbering
  const usedSlugs = new Map<string, number>();
  const numberings = computeHierarchicalNumbering(rawHeadings);

  return rawHeadings.map((h, idx) => ({
    id: generateUniqueAnchorId(h.text, usedSlugs),
    text: cleanHeadingText(h.text),
    level: h.level,
    numbering: numberings[idx]
  }));
}

/**
 * Converts pasted HTML from Word, Google Docs, or web articles to clean Markdown
 * Preserves H1, H2, H3, H4, bold, italics, links, blockquotes, and lists.
 */
export function convertPastedHtmlToMarkdown(html: string): string {
  if (!html) return '';

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove scripts, styles, and meta tags
    const removable = doc.querySelectorAll('script, style, meta, link, noscript');
    removable.forEach(el => el.remove());

    const walk = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
      }

      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      // Check inner contents
      const inner = Array.from(el.childNodes).map(walk).join('');

      switch (tag) {
        case 'h1':
          return `\n\n# ${inner.trim()}\n\n`;
        case 'h2':
          return `\n\n## ${inner.trim()}\n\n`;
        case 'h3':
          return `\n\n### ${inner.trim()}\n\n`;
        case 'h4':
        case 'h5':
        case 'h6':
          return `\n\n#### ${inner.trim()}\n\n`;
        case 'p':
          return `\n\n${inner.trim()}\n\n`;
        case 'br':
          return '\n';
        case 'hr':
          return '\n\n---\n\n';
        case 'strong':
        case 'b':
          return inner.trim() ? `**${inner.trim()}**` : '';
        case 'em':
        case 'i':
          return inner.trim() ? `*${inner.trim()}*` : '';
        case 'blockquote':
          return `\n\n> ${inner.trim().replace(/\n/g, '\n> ')}\n\n`;
        case 'ul': {
          const items: string[] = [];
          el.querySelectorAll(':scope > li').forEach(li => {
            const itemText = Array.from(li.childNodes).map(walk).join('').trim();
            if (itemText) items.push(`- ${itemText}`);
          });
          return `\n\n${items.join('\n')}\n\n`;
        }
        case 'ol': {
          const items: string[] = [];
          let count = 1;
          el.querySelectorAll(':scope > li').forEach(li => {
            const itemText = Array.from(li.childNodes).map(walk).join('').trim();
            if (itemText) items.push(`${count++}. ${itemText}`);
          });
          return `\n\n${items.join('\n')}\n\n`;
        }
        case 'a': {
          const href = el.getAttribute('href');
          const cleanText = inner.trim();
          if (href && cleanText && !href.startsWith('javascript:')) {
            return `[${cleanText}](${href})`;
          }
          return cleanText;
        }
        case 'img': {
          const src = el.getAttribute('src');
          const alt = el.getAttribute('alt') || 'Image';
          if (src && !src.startsWith('data:') && !src.startsWith('javascript:')) {
            return `\n\n![${alt}](${src})\n\n`;
          }
          return '';
        }
        case 'div':
        case 'section':
        case 'article':
        case 'main':
          return inner ? `\n${inner}\n` : '';
        default:
          return inner;
      }
    };

    const markdown = walk(doc.body);
    // Clean up multiple consecutive empty lines
    return markdown
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  } catch (err) {
    console.warn('Failed to parse pasted HTML:', err);
    return '';
  }
}
