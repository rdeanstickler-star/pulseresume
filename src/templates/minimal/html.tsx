import type { Resume } from '@/schema/resume';
import { defaultSectionName } from '@/store/resume-store';
import { SectionItemsHtml } from '../_shared/sections-html';
import { bodyFont } from '../_shared/types';
import { applyTheme } from '../_shared/themed-tokens';
import { minimalTokens } from './tokens';

/** Minimal — quiet, whitespace-rich, no decorative rules. */
export function MinimalHtmlTemplate({ resume }: { resume: Resume }) {
  const T = applyTheme(minimalTokens, resume.meta.theme);
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
      aria-label="Resume preview (Minimal template)"
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
            fontSize: `${T.type.nameSize}pt`,
            fontWeight: 500,
            letterSpacing: '-0.005em',
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
              marginTop: '4px',
            }}
          >
            {basics.headline}
          </p>
        )}
        {contact.length > 0 && (
          <p
            style={{ fontSize: `${T.type.smallSize}pt`, color: T.colors.muted, marginTop: '10px' }}
          >
            {contact.join('  ·  ')}
          </p>
        )}
        {basics.summary && (
          <p style={{ fontSize: `${T.type.bodySize}pt`, marginTop: '12px', maxWidth: '60ch' }}>
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
                fontWeight: T.sectionHeading.weight,
                textTransform: 'uppercase',
                letterSpacing: `${T.sectionHeading.letterSpacing}px`,
                color: T.colors.muted,
                marginBottom: '10px',
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
