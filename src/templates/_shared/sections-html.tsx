import type {
  AwardItem,
  CertificationItem,
  CustomItem,
  EducationItem,
  ExperienceItem,
  InterestItem,
  LanguageItem,
  ProfileItem,
  ProjectItem,
  PublicationItem,
  ReferenceItem,
  Section,
  SkillItem,
  VolunteeringItem,
} from '@/schema/sections';
import { formatDateRange } from '@/lib/format';
import type { TokenSet } from './types';
import { bodyFont } from './types';

/**
 * Shared HTML section renderers for templates M5+. Every renderer takes
 * the resume's discriminated section + the consuming template's TokenSet,
 * and returns JSX styled with inline styles derived from the tokens.
 *
 * Templates compose these into their own outer chrome (page wrapper,
 * header, section heading). The body of each section type is shared, so
 * data shape changes ripple to every template at once.
 */

export function SectionItemsHtml({ section, tokens }: { section: Section; tokens: TokenSet }) {
  const visibleItems = section.items.filter((i) => (i as { visible?: boolean }).visible !== false);
  if (visibleItems.length === 0) return null;

  const isTwoCol = section.columns === 2;
  const wrapStyle: React.CSSProperties = isTwoCol
    ? {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: '16pt',
        rowGap: `${tokens.spacing.itemGap}pt`,
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        gap: `${tokens.spacing.itemGap}pt`,
      };

  switch (section.type) {
    case 'summary':
      return <SummaryItems items={section.items} tokens={tokens} />;
    case 'profile':
      return (
        <ul style={{ ...wrapStyle, listStyle: 'none', padding: 0 }}>
          {(section.items as ProfileItem[])
            .filter((i) => i.visible)
            .map((item) => (
              <li
                key={item.id}
                style={{ display: 'flex', justifyContent: 'space-between', gap: '8pt' }}
              >
                <span style={itemTitleStyle(tokens)}>{item.network || 'Profile'}</span>
                {item.url ? (
                  <a
                    href={item.url}
                    style={{ ...itemSubtitleStyle(tokens), textDecoration: 'underline' }}
                  >
                    {item.username || item.url}
                  </a>
                ) : (
                  <span style={itemSubtitleStyle(tokens)}>{item.username}</span>
                )}
              </li>
            ))}
        </ul>
      );
    case 'experience':
      return (
        <div style={wrapStyle}>
          {(section.items as ExperienceItem[])
            .filter((i) => i.visible)
            .map((item) => (
              <div key={item.id}>
                <ItemTitleRow
                  tokens={tokens}
                  title={item.position || 'Role'}
                  subtitle={item.company}
                  right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
                  meta={item.location}
                />
                <RichText html={item.summary} tokens={tokens} />
                <HighlightList items={item.highlights} tokens={tokens} />
              </div>
            ))}
        </div>
      );
    case 'education':
      return (
        <div style={wrapStyle}>
          {(section.items as EducationItem[])
            .filter((i) => i.visible)
            .map((item) => (
              <div key={item.id}>
                <ItemTitleRow
                  tokens={tokens}
                  title={item.institution || 'Institution'}
                  subtitle={[item.studyType, item.area].filter(Boolean).join(' · ')}
                  right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
                  meta={item.score}
                />
                {item.courses.length > 0 && (
                  <p style={{ ...mutedSmallStyle(tokens), marginTop: '2px' }}>
                    <span style={{ fontWeight: 600 }}>Courses:</span> {item.courses.join(', ')}
                  </p>
                )}
                <RichText html={item.summary} tokens={tokens} />
              </div>
            ))}
        </div>
      );
    case 'skills':
      return (
        <div style={wrapStyle}>
          {(section.items as SkillItem[])
            .filter((i) => i.visible)
            .map((item) => (
              <div key={item.id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={itemTitleStyle(tokens)}>{item.name}</span>
                  {item.level && <span style={mutedSmallStyle(tokens)}>{item.level}</span>}
                </div>
                {item.keywords.length > 0 && (
                  <p style={{ ...mutedSmallStyle(tokens), marginTop: '2px' }}>
                    {item.keywords.join(' · ')}
                  </p>
                )}
              </div>
            ))}
        </div>
      );
    case 'languages':
      return (
        <div style={wrapStyle}>
          {(section.items as LanguageItem[])
            .filter((i) => i.visible)
            .map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={itemTitleStyle(tokens)}>{item.language}</span>
                {item.fluency && <span style={mutedSmallStyle(tokens)}>{item.fluency}</span>}
              </div>
            ))}
        </div>
      );
    case 'awards':
      return (
        <div style={wrapStyle}>
          {(section.items as AwardItem[])
            .filter((i) => i.visible)
            .map((item) => (
              <div key={item.id}>
                <ItemTitleRow
                  tokens={tokens}
                  title={item.title}
                  subtitle={item.awarder}
                  right={item.date ?? ''}
                  meta=""
                />
                <RichText html={item.summary} tokens={tokens} />
              </div>
            ))}
        </div>
      );
    case 'certifications':
      return (
        <div style={wrapStyle}>
          {(section.items as CertificationItem[])
            .filter((i) => i.visible)
            .map((item) => (
              <div key={item.id}>
                <ItemTitleRow
                  tokens={tokens}
                  title={item.name}
                  subtitle={item.issuer}
                  right={item.date ?? ''}
                  meta=""
                />
                <RichText html={item.summary} tokens={tokens} />
              </div>
            ))}
        </div>
      );
    case 'publications':
      return (
        <div style={wrapStyle}>
          {(section.items as PublicationItem[])
            .filter((i) => i.visible)
            .map((item) => (
              <div key={item.id}>
                <ItemTitleRow
                  tokens={tokens}
                  title={item.name}
                  subtitle={item.publisher}
                  right={item.releaseDate ?? ''}
                  meta=""
                />
                <RichText html={item.summary} tokens={tokens} />
              </div>
            ))}
        </div>
      );
    case 'volunteering':
      return (
        <div style={wrapStyle}>
          {(section.items as VolunteeringItem[])
            .filter((i) => i.visible)
            .map((item) => (
              <div key={item.id}>
                <ItemTitleRow
                  tokens={tokens}
                  title={item.position || 'Role'}
                  subtitle={item.organization}
                  right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
                  meta={item.location}
                />
                <RichText html={item.summary} tokens={tokens} />
                <HighlightList items={item.highlights} tokens={tokens} />
              </div>
            ))}
        </div>
      );
    case 'references':
      return (
        <div style={wrapStyle}>
          {(section.items as ReferenceItem[])
            .filter((i) => i.visible)
            .map((item) => (
              <div key={item.id}>
                <ItemTitleRow
                  tokens={tokens}
                  title={item.name}
                  subtitle={item.position}
                  right=""
                  meta={item.contact}
                />
                <RichText html={item.reference} tokens={tokens} />
              </div>
            ))}
        </div>
      );
    case 'projects':
      return (
        <div style={wrapStyle}>
          {(section.items as ProjectItem[])
            .filter((i) => i.visible)
            .map((item) => (
              <div key={item.id}>
                <ItemTitleRow
                  tokens={tokens}
                  title={item.name}
                  subtitle={item.role}
                  right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
                  meta={item.keywords.join(' · ')}
                />
                <RichText html={item.description} tokens={tokens} />
                <HighlightList items={item.highlights} tokens={tokens} />
              </div>
            ))}
        </div>
      );
    case 'interests':
      return (
        <div style={wrapStyle}>
          {(section.items as InterestItem[])
            .filter((i) => i.visible)
            .map((item) => (
              <div key={item.id}>
                <span style={itemTitleStyle(tokens)}>{item.name}</span>
                {item.keywords.length > 0 && (
                  <span style={{ ...itemSubtitleStyle(tokens), marginLeft: '8px' }}>
                    {item.keywords.join(' · ')}
                  </span>
                )}
              </div>
            ))}
        </div>
      );
    case 'custom':
      return (
        <div style={wrapStyle}>
          {(section.items as CustomItem[])
            .filter((i) => i.visible)
            .map((item) => (
              <div key={item.id}>
                <ItemTitleRow
                  tokens={tokens}
                  title={item.title}
                  subtitle={item.subtitle}
                  right={item.date ?? ''}
                  meta={item.location}
                />
                <RichText html={item.summary} tokens={tokens} />
                {item.keywords.length > 0 && (
                  <p style={{ ...mutedSmallStyle(tokens), marginTop: '2px' }}>
                    {item.keywords.join(' · ')}
                  </p>
                )}
              </div>
            ))}
        </div>
      );
  }
}

// -----------------------------------------------------------------------------
//  Helpers
// -----------------------------------------------------------------------------

function SummaryItems({
  items,
  tokens,
}: {
  items: Array<{ id: string; content: string; visible: boolean }>;
  tokens: TokenSet;
}) {
  return (
    <>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div
            key={item.id}
            style={{
              fontSize: `${tokens.type.bodySize}pt`,
              lineHeight: tokens.type.lineHeight,
            }}
          >
            <RichText html={item.content} tokens={tokens} />
          </div>
        ))}
    </>
  );
}

function RichText({ html, tokens: _tokens }: { html: string; tokens: TokenSet }) {
  if (!html) return null;
  return (
    <div
      style={{ marginTop: '4px' }}
      // Tiptap-sanitized HTML from the store.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function HighlightList({ items, tokens }: { items: string[]; tokens: TokenSet }) {
  if (items.length === 0) return null;
  return (
    <ul style={{ marginTop: '4px', paddingLeft: `${tokens.spacing.bulletIndent}pt` }}>
      {items.map((h, i) => (
        <li key={i}>{h}</li>
      ))}
    </ul>
  );
}

function ItemTitleRow({
  tokens,
  title,
  subtitle,
  right,
  meta,
}: {
  tokens: TokenSet;
  title: string;
  subtitle: string;
  right: string;
  meta: string;
}) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '8pt',
        }}
      >
        <div>
          <h3 style={{ ...itemTitleStyle(tokens), margin: 0, display: 'inline' }}>{title}</h3>
          {subtitle && (
            <span style={{ ...itemSubtitleStyle(tokens), marginLeft: '6px' }}>· {subtitle}</span>
          )}
        </div>
        {right && (
          <span
            style={{
              ...mutedSmallStyle(tokens),
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {right}
          </span>
        )}
      </div>
      {meta && <p style={{ ...mutedSmallStyle(tokens), marginTop: '2px' }}>{meta}</p>}
    </>
  );
}

// -----------------------------------------------------------------------------
//  Style helpers
// -----------------------------------------------------------------------------

function itemTitleStyle(tokens: TokenSet): React.CSSProperties {
  return {
    fontSize: `${tokens.type.bodySize}pt`,
    fontWeight: 700,
    color: tokens.colors.text,
    fontFamily: `${bodyFont(tokens)}, ui-sans-serif, system-ui, sans-serif`,
  };
}

function itemSubtitleStyle(tokens: TokenSet): React.CSSProperties {
  return {
    fontSize: `${tokens.type.bodySize}pt`,
    color: tokens.colors.muted,
  };
}

function mutedSmallStyle(tokens: TokenSet): React.CSSProperties {
  return {
    fontSize: `${tokens.type.smallSize}pt`,
    color: tokens.colors.muted,
  };
}
