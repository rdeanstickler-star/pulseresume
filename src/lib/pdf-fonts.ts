import { Font } from '@react-pdf/renderer';

/**
 * Register fonts with @react-pdf/renderer.
 *
 * @react-pdf cannot use system fonts — every glyph that lands in the PDF
 * must come from a font file we explicitly register. Without registration,
 * PDF text falls back to Helvetica (the default, which is hideous and
 * missing many glyphs).
 *
 * We source from Fontsource via jsDelivr CDN — it's a pinned, immutable
 * mirror of Google Fonts that doesn't require Google's own CDN (which
 * sometimes blocks programmatic access).
 *
 * Privacy: these URLs are the ONE allowed exception to the
 * "no network calls" rule, documented in README and CONTRIBUTING.
 *
 * The function is idempotent — Font.register tolerates repeat calls for
 * the same family.
 */

let registered = false;

const FONTSOURCE_BASE = 'https://cdn.jsdelivr.net/fontsource/fonts';

interface FontVariant {
  src: string;
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
}

interface FontFamilyConfig {
  family: string;
  fonts: FontVariant[];
}

const FONT_FAMILIES: FontFamilyConfig[] = [
  {
    family: 'Inter',
    fonts: [
      { src: `${FONTSOURCE_BASE}/inter@latest/latin-400-normal.ttf`, fontWeight: 400 },
      {
        src: `${FONTSOURCE_BASE}/inter@latest/latin-400-italic.ttf`,
        fontWeight: 400,
        fontStyle: 'italic',
      },
      { src: `${FONTSOURCE_BASE}/inter@latest/latin-700-normal.ttf`, fontWeight: 700 },
    ],
  },
  {
    family: 'Merriweather',
    fonts: [
      { src: `${FONTSOURCE_BASE}/merriweather@latest/latin-400-normal.ttf`, fontWeight: 400 },
      {
        src: `${FONTSOURCE_BASE}/merriweather@latest/latin-400-italic.ttf`,
        fontWeight: 400,
        fontStyle: 'italic',
      },
      { src: `${FONTSOURCE_BASE}/merriweather@latest/latin-700-normal.ttf`, fontWeight: 700 },
    ],
  },
  {
    family: 'JetBrains Mono',
    fonts: [
      { src: `${FONTSOURCE_BASE}/jetbrains-mono@latest/latin-400-normal.ttf`, fontWeight: 400 },
    ],
  },
];

/**
 * Register all known font families with @react-pdf. Safe to call multiple
 * times; only the first call performs the registration.
 */
export function registerPdfFonts(): void {
  if (registered) return;
  for (const { family, fonts } of FONT_FAMILIES) {
    Font.register({ family, fonts });
  }
  // Silence hyphenation warnings on uncommon words.
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}
