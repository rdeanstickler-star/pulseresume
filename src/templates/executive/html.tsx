import type { Resume } from '@/schema/resume';
import { defaultSectionName } from '@/store/resume-store';
import { SectionItemsHtml } from '../_shared/sections-html';
import { bodyFont } from '../_shared/types';
import { executiveTokens as T } from './tokens';

/** Executive — centered hero, serif body, conservative rules. */
export function ExecutiveHtmlTemplate({ resume }: { resume: Resume }) {
  const { basics, sections } = resume;
  const contact = [
    basics.email,
    basics.phone,
    basics.url,
    [basics.location.city, basics.location.region, basics.location.countryCode]
      .filter(Boolean)
      .join(', '),
  ].filter(Boolean);

  return (
    <article
      aria-label="Resume preview (Executive template)"
      className="mx-auto max-w-[8.5in] rounded-md border border-border bg-white text-black shadow-sm"
      style={{
        fontFamily: `${bodyFont(T)}, ui-serif, Georgia, serif`,
        fontSize: `${T.type.bodySize}pt`,
        lineHeight: T.type.lineHeight,
        color: T.colors.text,
        background: T.colors.background,
        padding: `${T.page.paddingTopPt}pt ${T.page.paddingRightPt}pt ${T.page.paddingBottomPt}pt ${T.page.paddingLeftPt}pt`,
      }}
    >
      <header style={{ textAlign: 'center', marginBottom: `${T.spacing.headerToBodyGap}pt` }}>
        <h1
          style={{
            fontSize: `${T.type.nameSize}pt`,
            fontWeight: 700,
            letterSpacing: '0.02em',
            margin: 0,
          }}
        >
          {basics.name || 'Your Name'}
        </h1>
        {basics.headline && (
          <p
            style={{
              fontSize: `${T.type.headlineSize}pt`,
              color: T.colors.muted,
              fontStyle: 'italic',
              marginTop: '4px',
            }}
          >
            {basics.headline}
          </p>
        )}
        {contact.length > 0 && (
          <p
            style={{
              fontSize: `${T.type.smallSize}pt`,
              color: T.colors.muted,
              marginTop: '8px',
            }}
          >
            {contact.join('  ·  ')}
          </p>
        )}
        <div
          aria-hidden="true"
          style={{
            margin: '12pt auto 0',
            width: '40%',
            borderBottom: `1px solid ${T.colors.rule}`,
          }}
        />
        {basics.summary && (
          <p
            style={{
              fontSize: `${T.type.bodySize}pt`,
              marginTop: '12px',
              maxWidth: '70ch',
              marginLeft: 'auto',
              marginRight: 'auto',
              textAlign: 'left',
            }}
          >
            {basics.summary}
          </p>
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
                fontSize: `${T.type.sectionHeadingSize}pt`,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: `${T.sectionHeading.letterSpacing}px`,
                textAlign: 'center',
                color: T.colors.text,
                borderTop: `1px solid ${T.colors.rule}`,
                borderBottom: `1px solid ${T.colors.rule}`,
                padding: '4pt 0',
                marginBottom: '8px',
              }}
            >
              {section.name || defaultSectionName(section.type)}
            </h2>
            <SectionItemsHtml section={section} tokens={T} />
          </section>
        ))}
    </article>
  );
}
