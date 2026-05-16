/**
 * Display formatters shared between HTML and PDF renderers.
 *
 * Keep these pure and locale-light. The PDF renderer can't pull in
 * Intl-heavy date libraries cheaply — these formatters use the browser's
 * native Intl when available, with safe fallbacks.
 */

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Format a permissive date string (YYYY, YYYY-MM, YYYY-MM-DD) for display.
 *
 *   '2024'        → '2024'
 *   '2024-03'     → 'Mar 2024'
 *   '2024-03-15'  → 'Mar 2024'   (we drop the day — resumes don't display it)
 *   ''            → ''
 */
export function formatDate(date: string): string {
  if (!date) return '';
  const match = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(date);
  if (!match) return date;
  const [, year, month] = match;
  if (!month) return year ?? '';
  const idx = Number.parseInt(month, 10) - 1;
  if (idx < 0 || idx > 11) return year ?? '';
  return `${MONTH_NAMES[idx]} ${year}`;
}

/**
 * Format a date range. Handles `current: true` and missing endDate.
 *
 *   ('2020-03', '2024-05', false) → 'Mar 2020 – May 2024'
 *   ('2020-03', '',         true)  → 'Mar 2020 – Present'
 *   ('2020',    '2024',     false) → '2020 – 2024'
 *   ('',        '',         false) → ''
 */
export function formatDateRange(startDate: string, endDate: string, current: boolean): string {
  const start = formatDate(startDate);
  if (current) {
    return start ? `${start} – Present` : 'Present';
  }
  const end = formatDate(endDate);
  if (start && end) return `${start} – ${end}`;
  return start || end || '';
}

/**
 * Best-effort plain-text extraction from HTML — used by the PDF renderer to
 * convert rich-text fields (Tiptap output) into selectable PDF text. Strips
 * tags, decodes a handful of common entities, normalizes whitespace, and
 * preserves bullet structure as "• " prefixes.
 *
 * This is intentionally simple (regex, not a real DOM parser) so it can run
 * inside @react-pdf's serializer without browser APIs.
 */
export function htmlToPlainText(html: string): string {
  if (!html) return '';
  let text = html
    // List items become bulleted lines.
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    // Paragraphs and headings become blank-line separated.
    .replace(/<\/(p|h\d|div|ul|ol|blockquote)>/gi, '\n\n')
    // Line breaks.
    .replace(/<br\s*\/?>/gi, '\n')
    // Strip remaining tags.
    .replace(/<[^>]+>/g, '');
  // Decode the most common entities.
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
  // Collapse runs of newlines and spaces.
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+|\s+$/g, '');
}

/**
 * Parse rich-text HTML into structured blocks for the PDF renderer.
 * Returns paragraphs and bullet lists in document order. Inline formatting
 * (bold, italic, links) is collapsed to plain text — adding it requires
 * per-fragment Tiptap parsing which we'll layer in later if needed.
 */
export interface RichTextBlock {
  kind: 'paragraph' | 'bullets';
  text?: string;
  items?: string[];
}

export function htmlToBlocks(html: string): RichTextBlock[] {
  if (!html) return [];
  const blocks: RichTextBlock[] = [];

  // Match top-level block elements. Bullet lists capture their items separately.
  const blockRegex = /<(ul|ol|p)[^>]*>([\s\S]*?)<\/\1>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(html)) !== null) {
    // Capture text between blocks as a paragraph.
    if (match.index > lastIndex) {
      const tail = htmlToPlainText(html.slice(lastIndex, match.index));
      if (tail) blocks.push({ kind: 'paragraph', text: tail });
    }
    const tag = match[1]!.toLowerCase();
    const inner = match[2]!;
    if (tag === 'ul' || tag === 'ol') {
      const itemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      const items: string[] = [];
      let item: RegExpExecArray | null;
      while ((item = itemRegex.exec(inner)) !== null) {
        const t = htmlToPlainText(item[1]!);
        if (t) items.push(t);
      }
      if (items.length) blocks.push({ kind: 'bullets', items });
    } else {
      const t = htmlToPlainText(inner);
      if (t) blocks.push({ kind: 'paragraph', text: t });
    }
    lastIndex = match.index + match[0].length;
  }
  // Trailing content (or html with no block tags at all).
  if (lastIndex < html.length) {
    const tail = htmlToPlainText(html.slice(lastIndex));
    if (tail) blocks.push({ kind: 'paragraph', text: tail });
  }
  return blocks;
}
