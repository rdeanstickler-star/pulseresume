import type { Resume } from '@/schema/resume';
import { defaultSectionName } from '@/store/resume-store';
import { SectionItemsHtml } from '../_shared/sections-html';
import { bodyFont, headingFont } from '../_shared/types';
import { technicalTokens as T } from './tokens';

/** Technical — monospace headings, compact density, `[ SECTION ]` markers. */
export function TechnicalHtmlTemplate({ resume }: { resume: Resume }) {
  const { basics, sections } = resume;
  const contact = [
    basics.email,
    basics.phone,
    basics.url,
    [basics.location.city, basics.location.region, basics.location.countryCode]
      .filter(Boolean)
      .join(', '),
  ].filter(Boolean);

  const [openBracket, closeBracket] = T.sectionHeading.brackets ?? ['', ''];

  return (
    <article
      aria-label="Resume preview (Technical template)"
      className="mx-auto max-w-[8.5in] rounded-md border border-border bg-white text-black shadow-sm"
      style={{
        fontFamily: `${bodyFont(T)}, ui-sans-serif, system-ui, sans-serif`,
        fontSize: `${T.type.bodySize}pt`,
        lineHeight: T.type.lineHeight,
        color: T.colors.text,
        background: T.colors.background,
        padding: `${T.page.paddingTopPt}pt ${T.page.paddingRightPt}pt ${T.page.paddingBottomPt}pt ${T.page.paddingLeftPt}pt`,
      }}
    >
      <header style={{ marginBottom: `${T.spacing.headerToBodyGap}pt` }}>
        <h1
          style={{
            fontFamily: `${headingFont(T)}, ui-monospace, SFMono-Regular, monospace`,
            fontSize: `${T.type.nameSize}pt`,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            margin: 0,
          }}
        >
          {basics.name || 'Your Name'}
        </h1>
        {basics.headline && (
          <p
            style={{
              fontFamily: `${headingFont(T)}, ui-monospace, SFMono-Regular, monospace`,
              fontSize: `${T.type.headlineSize}pt`,
              color: T.colors.accent,
              marginTop: '2px',
            }}
          >
            {`// ${basics.headline}`}
          </p>
        )}
        {contact.length > 0 && (
          <p style={{ fontSize: `${T.type.smallSize}pt`, color: T.colors.muted, marginTop: '6px' }}>
            {contact.join('  ·  ')}
          </p>
        )}
        {basics.summary && (
          <p style={{ fontSize: `${T.type.bodySize}pt`, marginTop: '8px' }}>{basics.summary}</p>
        )}
      </header>

      {sections
        .filter((s) => s.visible)
        .map((section) => (
          <section
            key={section.id}
            style={{ marginTop: `${T.spacing.sectionGap}pt` }}
            aria-labelledby={`s-${section.id}`}
          >
            <h2
              id={`s-${section.id}`}
              style={{
                fontFamily: `${headingFont(T)}, ui-monospace, SFMono-Regular, monospace`,
                fontSize: `${T.type.sectionHeadingSize}pt`,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: `${T.sectionHeading.letterSpacing}px`,
                color: T.colors.accent,
                marginBottom: '4px',
              }}
            >
              {openBracket}
              {section.name || defaultSectionName(section.type)}
              {closeBracket}
            </h2>
            <SectionItemsHtml section={section} tokens={T} />
          </section>
        ))}
    </article>
  );
}
