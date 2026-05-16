import type { Resume } from '@/schema/resume';
import { defaultSectionName } from '@/store/resume-store';
import { SectionItemsHtml } from '../_shared/sections-html';
import { bodyFont } from '../_shared/types';
import { applyTheme } from '../_shared/themed-tokens';
import { creativeTokens } from './tokens';

/** Creative — full-width color-block hero header followed by single column. */
export function CreativeHtmlTemplate({ resume }: { resume: Resume }) {
  const T = applyTheme(creativeTokens, resume.meta.theme);
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
      aria-label="Resume preview (Creative template)"
      className="mx-auto max-w-[8.5in] overflow-hidden rounded-md border border-border bg-white text-black shadow-sm"
      style={{
        fontFamily: `${bodyFont(T)}, ui-sans-serif, system-ui, sans-serif`,
        fontSize: `${T.type.bodySize}pt`,
        lineHeight: T.type.lineHeight,
        color: T.colors.text,
        background: T.colors.background,
      }}
    >
      {/* Color block hero */}
      <header
        style={{
          background: T.colors.accent,
          color: T.colors.onAccent,
          padding: `28pt ${T.page.paddingRightPt}pt 24pt ${T.page.paddingLeftPt}pt`,
        }}
      >
        <h1
          style={{
            fontSize: `${T.type.nameSize}pt`,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            margin: 0,
            color: T.colors.onAccent,
          }}
        >
          {basics.name || 'Your Name'}
        </h1>
        {basics.headline && (
          <p
            style={{
              fontSize: `${T.type.headlineSize}pt`,
              color: T.colors.onAccent,
              opacity: 0.9,
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
              color: T.colors.onAccent,
              opacity: 0.85,
              marginTop: '8px',
            }}
          >
            {contact.join('  ·  ')}
          </p>
        )}
      </header>

      <div
        style={{
          padding: `${T.spacing.headerToBodyGap}pt ${T.page.paddingRightPt}pt ${T.page.paddingBottomPt}pt ${T.page.paddingLeftPt}pt`,
        }}
      >
        {basics.summary && (
          <p
            style={{ fontSize: `${T.type.bodySize}pt`, marginBottom: `${T.spacing.sectionGap}pt` }}
          >
            {basics.summary}
          </p>
        )}

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
                  color: T.colors.accent,
                  borderBottom: `1px solid ${T.colors.rule}`,
                  paddingBottom: '3px',
                  marginBottom: '6px',
                }}
              >
                {section.name || defaultSectionName(section.type)}
              </h2>
              <SectionItemsHtml section={section} tokens={T} />
            </section>
          ))}
      </div>
    </article>
  );
}
