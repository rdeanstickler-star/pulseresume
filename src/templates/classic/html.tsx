import type { Resume } from '@/schema/resume';
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
import { defaultSectionName } from '@/store/resume-store';
import { formatDateRange } from '@/lib/format';
import { classicHtmlStyle as S, classicTokens } from './tokens';

/**
 * Classic template — HTML render path (preview pane).
 *
 * Single-column, sans-serif, conservative. Same visual structure as the
 * PDF path (`pdf.tsx`) — they share `tokens.ts` for every style value, so
 * parity is by construction.
 *
 * ATS notes:
 * - H1 = name; H2 = section headings; H3 = item titles. ATS parsers
 *   walk the heading hierarchy.
 * - All text is real text — no images, no SVG fonts, no canvas.
 * - Bullets are real `<ul>` elements, not glyphs.
 */
export function ClassicHtmlTemplate({ resume }: { resume: Resume }) {
  const { basics, sections } = resume;

  return (
    <article
      aria-label="Resume preview (Classic template)"
      className="mx-auto max-w-[8.5in] rounded-md border border-border bg-white text-black shadow-sm"
      style={{
        ...S.page,
        padding: `${classicTokens.page.paddingTopPt}pt ${classicTokens.page.paddingRightPt}pt`,
      }}
    >
      <Header basics={basics} />

      {sections
        .filter((s) => s.visible)
        .map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}
    </article>
  );
}

// =============================================================================
//  Header
// =============================================================================

function Header({ basics }: { basics: Resume['basics'] }) {
  const contactParts = [
    basics.email,
    basics.phone,
    basics.url,
    [basics.location.city, basics.location.region, basics.location.countryCode]
      .filter(Boolean)
      .join(', '),
  ].filter(Boolean);

  return (
    <header
      style={{
        marginBottom: `${classicTokens.spacing.headerToBodyGap}pt`,
      }}
    >
      <h1 style={S.name}>{basics.name || 'Your Name'}</h1>
      {basics.headline && <p style={{ ...S.headline, marginTop: '2px' }}>{basics.headline}</p>}
      {contactParts.length > 0 && (
        <p style={{ ...S.contact, marginTop: '6px' }}>{contactParts.join('  ·  ')}</p>
      )}
      {basics.summary && (
        <p style={{ ...S.summaryParagraph, marginTop: '8px' }}>{basics.summary}</p>
      )}
    </header>
  );
}

// =============================================================================
//  Section dispatch
// =============================================================================

function SectionBlock({ section }: { section: Section }) {
  return (
    <section
      style={{ marginTop: `${classicTokens.spacing.sectionGap}pt` }}
      aria-labelledby={`s-${section.id}`}
    >
      <h2 id={`s-${section.id}`} style={S.sectionHeading}>
        {section.name || defaultSectionName(section.type)}
      </h2>
      <SectionBody section={section} />
    </section>
  );
}

function SectionBody({ section }: { section: Section }) {
  const visibleItems = section.items.filter((i) => (i as { visible?: boolean }).visible !== false);
  if (visibleItems.length === 0) return null;

  const isTwoCol = section.columns === 2;
  const gridStyle = isTwoCol
    ? ({
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: '16pt',
        rowGap: `${classicTokens.spacing.itemGap}pt`,
      } as const)
    : ({
        display: 'flex',
        flexDirection: 'column' as const,
        gap: `${classicTokens.spacing.itemGap}pt`,
      } as const);

  switch (section.type) {
    case 'summary':
      return <SummaryItems items={section.items} />;
    case 'profile':
      return <ProfileItems items={section.items} style={gridStyle} />;
    case 'experience':
      return <ExperienceItems items={section.items} style={gridStyle} />;
    case 'education':
      return <EducationItems items={section.items} style={gridStyle} />;
    case 'skills':
      return <SkillItems items={section.items} style={gridStyle} />;
    case 'languages':
      return <LanguageItems items={section.items} style={gridStyle} />;
    case 'awards':
      return <AwardItems items={section.items} style={gridStyle} />;
    case 'certifications':
      return <CertificationItems items={section.items} style={gridStyle} />;
    case 'publications':
      return <PublicationItems items={section.items} style={gridStyle} />;
    case 'volunteering':
      return <VolunteeringItems items={section.items} style={gridStyle} />;
    case 'references':
      return <ReferenceItems items={section.items} style={gridStyle} />;
    case 'projects':
      return <ProjectItems items={section.items} style={gridStyle} />;
    case 'interests':
      return <InterestItems items={section.items} style={gridStyle} />;
    case 'custom':
      return <CustomItems items={section.items} style={gridStyle} />;
  }
}

// =============================================================================
//  Item renderers — one per section type
// =============================================================================

/** Renders a small block of HTML as plain HTML (Tiptap output). */
function RichText({ html }: { html: string }) {
  if (!html) return null;
  return (
    <div
      style={{ marginTop: '4px' }}
      // The store + Tiptap already sanitize what lands here.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function SummaryItems({
  items,
}: {
  items: Array<{ id: string; content: string; visible: boolean }>;
}) {
  return (
    <>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div key={item.id} style={S.summaryParagraph}>
            <RichText html={item.content} />
          </div>
        ))}
    </>
  );
}

function ProfileItems({ items, style }: { items: ProfileItem[]; style: React.CSSProperties }) {
  return (
    <ul style={{ ...style, listStyle: 'none', padding: 0 }}>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <li
            key={item.id}
            style={{ display: 'flex', justifyContent: 'space-between', gap: '8pt' }}
          >
            <span style={S.itemTitle}>{item.network || 'Profile'}</span>
            {item.url ? (
              <a href={item.url} style={{ ...S.itemSubtitle, textDecoration: 'underline' }}>
                {item.username || item.url}
              </a>
            ) : (
              <span style={S.itemSubtitle}>{item.username}</span>
            )}
          </li>
        ))}
    </ul>
  );
}

function ExperienceItems({
  items,
  style,
}: {
  items: ExperienceItem[];
  style: React.CSSProperties;
}) {
  return (
    <div style={style}>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div key={item.id}>
            <ItemTitleRow
              title={item.position || 'Role'}
              subtitle={item.company}
              right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
              meta={item.location}
            />
            <RichText html={item.summary} />
            {item.highlights.length > 0 && (
              <ul
                style={{
                  marginTop: '4px',
                  paddingLeft: `${classicTokens.spacing.bulletIndent}pt`,
                }}
              >
                {item.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
    </div>
  );
}

function EducationItems({ items, style }: { items: EducationItem[]; style: React.CSSProperties }) {
  return (
    <div style={style}>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div key={item.id}>
            <ItemTitleRow
              title={item.institution || 'Institution'}
              subtitle={[item.studyType, item.area].filter(Boolean).join(' · ')}
              right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
              meta={item.score}
            />
            {item.courses.length > 0 && (
              <p style={{ ...S.contact, marginTop: '2px' }}>
                <span style={{ fontWeight: 600 }}>Courses:</span> {item.courses.join(', ')}
              </p>
            )}
            <RichText html={item.summary} />
          </div>
        ))}
    </div>
  );
}

function SkillItems({ items, style }: { items: SkillItem[]; style: React.CSSProperties }) {
  return (
    <div style={style}>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div key={item.id}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
            >
              <span style={S.itemTitle}>{item.name}</span>
              {item.level && <span style={S.itemDate}>{item.level}</span>}
            </div>
            {item.keywords.length > 0 && (
              <p style={{ ...S.contact, marginTop: '2px' }}>{item.keywords.join(' · ')}</p>
            )}
          </div>
        ))}
    </div>
  );
}

function LanguageItems({ items, style }: { items: LanguageItem[]; style: React.CSSProperties }) {
  return (
    <div style={style}>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={S.itemTitle}>{item.language}</span>
            {item.fluency && <span style={S.itemDate}>{item.fluency}</span>}
          </div>
        ))}
    </div>
  );
}

function AwardItems({ items, style }: { items: AwardItem[]; style: React.CSSProperties }) {
  return (
    <div style={style}>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div key={item.id}>
            <ItemTitleRow
              title={item.title}
              subtitle={item.awarder}
              right={item.date ?? ''}
              meta=""
            />
            <RichText html={item.summary} />
          </div>
        ))}
    </div>
  );
}

function CertificationItems({
  items,
  style,
}: {
  items: CertificationItem[];
  style: React.CSSProperties;
}) {
  return (
    <div style={style}>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div key={item.id}>
            <ItemTitleRow
              title={item.name}
              subtitle={item.issuer}
              right={item.date ?? ''}
              meta=""
            />
            <RichText html={item.summary} />
          </div>
        ))}
    </div>
  );
}

function PublicationItems({
  items,
  style,
}: {
  items: PublicationItem[];
  style: React.CSSProperties;
}) {
  return (
    <div style={style}>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div key={item.id}>
            <ItemTitleRow
              title={item.name}
              subtitle={item.publisher}
              right={item.releaseDate ?? ''}
              meta=""
            />
            <RichText html={item.summary} />
          </div>
        ))}
    </div>
  );
}

function VolunteeringItems({
  items,
  style,
}: {
  items: VolunteeringItem[];
  style: React.CSSProperties;
}) {
  return (
    <div style={style}>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div key={item.id}>
            <ItemTitleRow
              title={item.position || 'Role'}
              subtitle={item.organization}
              right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
              meta={item.location}
            />
            <RichText html={item.summary} />
            {item.highlights.length > 0 && (
              <ul
                style={{ marginTop: '4px', paddingLeft: `${classicTokens.spacing.bulletIndent}pt` }}
              >
                {item.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
    </div>
  );
}

function ReferenceItems({ items, style }: { items: ReferenceItem[]; style: React.CSSProperties }) {
  return (
    <div style={style}>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div key={item.id}>
            <ItemTitleRow title={item.name} subtitle={item.position} right="" meta={item.contact} />
            <RichText html={item.reference} />
          </div>
        ))}
    </div>
  );
}

function ProjectItems({ items, style }: { items: ProjectItem[]; style: React.CSSProperties }) {
  return (
    <div style={style}>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div key={item.id}>
            <ItemTitleRow
              title={item.name}
              subtitle={item.role}
              right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
              meta={item.keywords.join(' · ')}
            />
            <RichText html={item.description} />
            {item.highlights.length > 0 && (
              <ul
                style={{ marginTop: '4px', paddingLeft: `${classicTokens.spacing.bulletIndent}pt` }}
              >
                {item.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
    </div>
  );
}

function InterestItems({ items, style }: { items: InterestItem[]; style: React.CSSProperties }) {
  return (
    <div style={style}>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div key={item.id}>
            <span style={S.itemTitle}>{item.name}</span>
            {item.keywords.length > 0 && (
              <span style={{ ...S.itemSubtitle, marginLeft: '8px' }}>
                {item.keywords.join(' · ')}
              </span>
            )}
          </div>
        ))}
    </div>
  );
}

function CustomItems({ items, style }: { items: CustomItem[]; style: React.CSSProperties }) {
  return (
    <div style={style}>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <div key={item.id}>
            <ItemTitleRow
              title={item.title}
              subtitle={item.subtitle}
              right={item.date ?? ''}
              meta={item.location}
            />
            <RichText html={item.summary} />
            {item.keywords.length > 0 && (
              <p style={{ ...S.contact, marginTop: '2px' }}>{item.keywords.join(' · ')}</p>
            )}
          </div>
        ))}
    </div>
  );
}

// =============================================================================
//  Generic item title row
// =============================================================================

function ItemTitleRow({
  title,
  subtitle,
  right,
  meta,
}: {
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
          <h3 style={{ ...S.itemTitle, margin: 0, display: 'inline' }}>{title}</h3>
          {subtitle && <span style={{ ...S.itemSubtitle, marginLeft: '6px' }}>· {subtitle}</span>}
        </div>
        {right && <span style={S.itemDate}>{right}</span>}
      </div>
      {meta && <p style={{ ...S.contact, marginTop: '2px' }}>{meta}</p>}
    </>
  );
}
