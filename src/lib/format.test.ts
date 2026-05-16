import { describe, expect, it } from 'vitest';
import { formatDate, formatDateRange, htmlToBlocks, htmlToPlainText } from './format';

describe('formatDate', () => {
  it('renders year-only as-is', () => {
    expect(formatDate('2024')).toBe('2024');
  });
  it('renders year-month with month abbreviation', () => {
    expect(formatDate('2024-03')).toBe('Mar 2024');
  });
  it('drops the day on year-month-day', () => {
    expect(formatDate('2024-03-15')).toBe('Mar 2024');
  });
  it('returns empty string on empty input', () => {
    expect(formatDate('')).toBe('');
  });
  it('passes through unparseable strings (defensive)', () => {
    expect(formatDate('whenever')).toBe('whenever');
  });
});

describe('formatDateRange', () => {
  it('renders "Start – End" for completed roles', () => {
    expect(formatDateRange('2020-03', '2024-05', false)).toBe('Mar 2020 – May 2024');
  });
  it('renders "Start – Present" for current roles', () => {
    expect(formatDateRange('2020-03', '', true)).toBe('Mar 2020 – Present');
  });
  it('renders just "Present" when current but no start', () => {
    expect(formatDateRange('', '', true)).toBe('Present');
  });
  it('works with year-only on both ends', () => {
    expect(formatDateRange('2020', '2024', false)).toBe('2020 – 2024');
  });
  it('returns empty when nothing is filled', () => {
    expect(formatDateRange('', '', false)).toBe('');
  });
  it('returns just start when end is missing and not current', () => {
    expect(formatDateRange('2020', '', false)).toBe('2020');
  });
});

describe('htmlToPlainText', () => {
  it('strips simple tags', () => {
    expect(htmlToPlainText('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });
  it('decodes common entities', () => {
    expect(htmlToPlainText('A &amp; B &lt; C')).toBe('A & B < C');
  });
  it('returns empty for empty input', () => {
    expect(htmlToPlainText('')).toBe('');
  });
  it('preserves bullet structure as glyphs', () => {
    expect(htmlToPlainText('<ul><li>One</li><li>Two</li></ul>')).toMatch(/• One/);
  });
});

describe('htmlToBlocks', () => {
  it('returns a single paragraph block for a single <p>', () => {
    const blocks = htmlToBlocks('<p>Hello world</p>');
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toEqual({ kind: 'paragraph', text: 'Hello world' });
  });

  it('separates multiple paragraphs', () => {
    const blocks = htmlToBlocks('<p>First.</p><p>Second.</p>');
    expect(blocks).toHaveLength(2);
    expect(blocks[0]?.text).toBe('First.');
    expect(blocks[1]?.text).toBe('Second.');
  });

  it('captures bullet lists as a bullets block', () => {
    const blocks = htmlToBlocks('<ul><li>One</li><li>Two</li></ul>');
    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.kind).toBe('bullets');
    expect(blocks[0]?.items).toEqual(['One', 'Two']);
  });

  it('interleaves paragraphs and bullets in source order', () => {
    const blocks = htmlToBlocks('<p>intro</p><ul><li>a</li><li>b</li></ul><p>outro</p>');
    expect(blocks).toHaveLength(3);
    expect(blocks[0]?.kind).toBe('paragraph');
    expect(blocks[1]?.kind).toBe('bullets');
    expect(blocks[2]?.kind).toBe('paragraph');
  });

  it('returns empty array for empty html', () => {
    expect(htmlToBlocks('')).toEqual([]);
  });

  it('strips inline tags inside paragraphs', () => {
    const blocks = htmlToBlocks('<p>Hello <strong>world</strong> and <em>friends</em></p>');
    expect(blocks[0]?.text).toBe('Hello world and friends');
  });
});
