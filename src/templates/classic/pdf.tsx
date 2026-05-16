import { Document, Page, Text, View, Link, StyleSheet } from '@react-pdf/renderer';
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
import { htmlToBlocks } from '@/lib/format';
import { classicTokens } from './tokens';
import { registerPdfFonts } from '@/lib/pdf-fonts';

/**
 * Classic template — @react-pdf/renderer path (export).
 *
 * Shares `tokens.ts` with `html.tsx`. Every visual value comes from the same
 * source, so HTML preview and PDF export stay in lockstep automatically.
 *
 * ATS notes:
 * - Real text everywhere; no images, no embedded fonts as glyphs.
 * - Bullets are real list items with leading "• ".
 * - Heading hierarchy preserved via font-size + weight; PDF readers expose
 *   it as a logical structure (and Acrobat's screen reader walks it).
 * - Rich text (Tiptap HTML) is parsed into paragraphs and bullets at PDF
 *   build time so it renders as selectable text.
 */

registerPdfFonts();

// -----------------------------------------------------------------------------
//  Stylesheet — derived directly from tokens, no inline magic numbers.
// -----------------------------------------------------------------------------

const t = classicTokens;

const styles = StyleSheet.create({
  page: {
    fontFamily: t.fonts.sans,
    fontSize: t.type.bodySize,
    color: t.colors.text,
    lineHeight: t.type.lineHeight,
    paddingTop: t.page.paddingTopPt,
    paddingBottom: t.page.paddingBottomPt,
    paddingLeft: t.page.paddingLeftPt,
    paddingRight: t.page.paddingRightPt,
  },
  header: { marginBottom: t.spacing.headerToBodyGap },
  name: { fontSize: t.type.nameSize, fontWeight: 700, color: t.colors.text },
  headline: { fontSize: t.type.headlineSize, color: t.colors.muted, marginTop: 2 },
  contact: { fontSize: t.type.smallSize, color: t.colors.muted, marginTop: 4 },
  summaryParagraph: { fontSize: t.type.bodySize, marginTop: 6, lineHeight: t.type.lineHeight },

  section: { marginTop: t.spacing.sectionGap },
  sectionHeading: {
    fontSize: t.type.sectionHeadingSize,
    fontWeight: 700,
    color: t.colors.text,
    textTransform: 'uppercase',
    letterSpacing: t.sectionHeading.letterSpacing,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.rule,
    paddingBottom: 2,
    marginBottom: 4,
  },

  itemBlock: { marginTop: t.spacing.itemGap },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleLeft: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 },
  itemTitle: { fontSize: t.type.bodySize, fontWeight: 700, color: t.colors.text },
  itemSubtitle: { fontSize: t.type.bodySize, color: t.colors.muted },
  itemDate: { fontSize: t.type.smallSize, color: t.colors.muted },
  itemMeta: { fontSize: t.type.smallSize, color: t.colors.muted, marginTop: 2 },

  paragraph: { fontSize: t.type.bodySize, marginTop: 4 },
  bullets: { marginTop: 4 },
  bulletRow: { flexDirection: 'row', gap: 4 },
  bulletGlyph: { width: t.spacing.bulletIndent },
  bulletText: { flex: 1, fontSize: t.type.bodySize },

  twoCol: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  twoColItem: { width: '48%' },

  link: { color: t.colors.text, textDecoration: 'underline' },
});

// -----------------------------------------------------------------------------
//  Top-level document
// -----------------------------------------------------------------------------

export function ClassicPdfDocument({ resume }: { resume: Resume }) {
  const pageSize = resume.meta.pageSize === 'letter' ? 'LETTER' : 'A4';

  return (
    <Document
      title={`${resume.basics.name || 'Resume'} — Resume`}
      author={resume.basics.name || undefined}
      creator="PulseResume"
      producer="PulseResume"
    >
      <Page size={pageSize} style={styles.page} wrap>
        <Header basics={resume.basics} />
        {resume.sections
          .filter((s) => s.visible)
          .map((section) => (
            <SectionBlock key={section.id} section={section} />
          ))}
      </Page>
    </Document>
  );
}

// -----------------------------------------------------------------------------
//  Header
// -----------------------------------------------------------------------------

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
    <View style={styles.header}>
      <Text style={styles.name}>{basics.name || 'Your Name'}</Text>
      {basics.headline && <Text style={styles.headline}>{basics.headline}</Text>}
      {contactParts.length > 0 && <Text style={styles.contact}>{contactParts.join('  ·  ')}</Text>}
      {basics.summary && <Text style={styles.summaryParagraph}>{basics.summary}</Text>}
    </View>
  );
}

// -----------------------------------------------------------------------------
//  Section dispatch
// -----------------------------------------------------------------------------

function SectionBlock({ section }: { section: Section }) {
  return (
    <View style={styles.section} wrap>
      <Text style={styles.sectionHeading}>{section.name || defaultSectionName(section.type)}</Text>
      <SectionBody section={section} />
    </View>
  );
}

function SectionBody({ section }: { section: Section }) {
  const visibleItems = section.items.filter((i) => (i as { visible?: boolean }).visible !== false);
  if (visibleItems.length === 0) return null;

  const twoCol = section.columns === 2;

  switch (section.type) {
    case 'summary':
      return <SummaryItems items={section.items} />;
    case 'profile':
      return (
        <Wrap
          twoCol={twoCol}
          children={section.items.map((i) => (
            <ProfileRow key={i.id} item={i} />
          ))}
        />
      );
    case 'experience':
      return (
        <Wrap
          twoCol={twoCol}
          children={section.items.map((i) => (
            <ExperienceRow key={i.id} item={i} />
          ))}
        />
      );
    case 'education':
      return (
        <Wrap
          twoCol={twoCol}
          children={section.items.map((i) => (
            <EducationRow key={i.id} item={i} />
          ))}
        />
      );
    case 'skills':
      return (
        <Wrap
          twoCol={twoCol}
          children={section.items.map((i) => (
            <SkillRow key={i.id} item={i} />
          ))}
        />
      );
    case 'languages':
      return (
        <Wrap
          twoCol={twoCol}
          children={section.items.map((i) => (
            <LanguageRow key={i.id} item={i} />
          ))}
        />
      );
    case 'awards':
      return (
        <Wrap
          twoCol={twoCol}
          children={section.items.map((i) => (
            <AwardRow key={i.id} item={i} />
          ))}
        />
      );
    case 'certifications':
      return (
        <Wrap
          twoCol={twoCol}
          children={section.items.map((i) => (
            <CertificationRow key={i.id} item={i} />
          ))}
        />
      );
    case 'publications':
      return (
        <Wrap
          twoCol={twoCol}
          children={section.items.map((i) => (
            <PublicationRow key={i.id} item={i} />
          ))}
        />
      );
    case 'volunteering':
      return (
        <Wrap
          twoCol={twoCol}
          children={section.items.map((i) => (
            <VolunteeringRow key={i.id} item={i} />
          ))}
        />
      );
    case 'references':
      return (
        <Wrap
          twoCol={twoCol}
          children={section.items.map((i) => (
            <ReferenceRow key={i.id} item={i} />
          ))}
        />
      );
    case 'projects':
      return (
        <Wrap
          twoCol={twoCol}
          children={section.items.map((i) => (
            <ProjectRow key={i.id} item={i} />
          ))}
        />
      );
    case 'interests':
      return (
        <Wrap
          twoCol={twoCol}
          children={section.items.map((i) => (
            <InterestRow key={i.id} item={i} />
          ))}
        />
      );
    case 'custom':
      return (
        <Wrap
          twoCol={twoCol}
          children={section.items.map((i) => (
            <CustomRow key={i.id} item={i} />
          ))}
        />
      );
  }
}

function Wrap({ twoCol, children }: { twoCol: boolean; children: React.ReactNode[] }) {
  if (twoCol) {
    return (
      <View style={styles.twoCol}>
        {children.map((c, i) => (
          <View key={i} style={styles.twoColItem}>
            {c}
          </View>
        ))}
      </View>
    );
  }
  return <View>{children}</View>;
}

// -----------------------------------------------------------------------------
//  Rich text → flow of paragraphs + bulleted lists
// -----------------------------------------------------------------------------

function RichTextFlow({ html }: { html: string }) {
  const blocks = htmlToBlocks(html);
  if (blocks.length === 0) return null;
  return (
    <View>
      {blocks.map((block, i) => {
        if (block.kind === 'paragraph') {
          return (
            <Text key={i} style={styles.paragraph}>
              {block.text}
            </Text>
          );
        }
        return (
          <View key={i} style={styles.bullets}>
            {block.items?.map((item, j) => (
              <View key={j} style={styles.bulletRow}>
                <Text style={styles.bulletGlyph}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.bullets}>
      {items.map((h, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bulletGlyph}>•</Text>
          <Text style={styles.bulletText}>{h}</Text>
        </View>
      ))}
    </View>
  );
}

// -----------------------------------------------------------------------------
//  Generic item title row
// -----------------------------------------------------------------------------

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
    <View>
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && <Text style={styles.itemSubtitle}>{`· ${subtitle}`}</Text>}
        </View>
        {right && <Text style={styles.itemDate}>{right}</Text>}
      </View>
      {meta && <Text style={styles.itemMeta}>{meta}</Text>}
    </View>
  );
}

// -----------------------------------------------------------------------------
//  Per-type item rows
// -----------------------------------------------------------------------------

function SummaryItems({
  items,
}: {
  items: Array<{ id: string; content: string; visible: boolean }>;
}) {
  return (
    <View>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <View key={item.id} style={styles.itemBlock}>
            <RichTextFlow html={item.content} />
          </View>
        ))}
    </View>
  );
}

function ProfileRow({ item }: { item: ProfileItem }) {
  if (!item.visible) return null;
  return (
    <View style={styles.itemBlock}>
      <View style={styles.titleRow}>
        <Text style={styles.itemTitle}>{item.network || 'Profile'}</Text>
        {item.url ? (
          <Link src={item.url} style={styles.link}>
            <Text>{item.username || item.url}</Text>
          </Link>
        ) : (
          <Text style={styles.itemSubtitle}>{item.username}</Text>
        )}
      </View>
    </View>
  );
}

function ExperienceRow({ item }: { item: ExperienceItem }) {
  if (!item.visible) return null;
  return (
    <View style={styles.itemBlock}>
      <ItemTitleRow
        title={item.position || 'Role'}
        subtitle={item.company}
        right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
        meta={item.location}
      />
      <RichTextFlow html={item.summary} />
      <Bullets items={item.highlights} />
    </View>
  );
}

function EducationRow({ item }: { item: EducationItem }) {
  if (!item.visible) return null;
  return (
    <View style={styles.itemBlock}>
      <ItemTitleRow
        title={item.institution || 'Institution'}
        subtitle={[item.studyType, item.area].filter(Boolean).join(' · ')}
        right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
        meta={item.score}
      />
      {item.courses.length > 0 && (
        <Text style={styles.itemMeta}>Courses: {item.courses.join(', ')}</Text>
      )}
      <RichTextFlow html={item.summary} />
    </View>
  );
}

function SkillRow({ item }: { item: SkillItem }) {
  if (!item.visible) return null;
  return (
    <View style={styles.itemBlock}>
      <View style={styles.titleRow}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        {item.level && <Text style={styles.itemDate}>{item.level}</Text>}
      </View>
      {item.keywords.length > 0 && <Text style={styles.itemMeta}>{item.keywords.join(' · ')}</Text>}
    </View>
  );
}

function LanguageRow({ item }: { item: LanguageItem }) {
  if (!item.visible) return null;
  return (
    <View style={styles.itemBlock}>
      <View style={styles.titleRow}>
        <Text style={styles.itemTitle}>{item.language}</Text>
        {item.fluency && <Text style={styles.itemDate}>{item.fluency}</Text>}
      </View>
    </View>
  );
}

function AwardRow({ item }: { item: AwardItem }) {
  if (!item.visible) return null;
  return (
    <View style={styles.itemBlock}>
      <ItemTitleRow title={item.title} subtitle={item.awarder} right={item.date ?? ''} meta="" />
      <RichTextFlow html={item.summary} />
    </View>
  );
}

function CertificationRow({ item }: { item: CertificationItem }) {
  if (!item.visible) return null;
  return (
    <View style={styles.itemBlock}>
      <ItemTitleRow title={item.name} subtitle={item.issuer} right={item.date ?? ''} meta="" />
      <RichTextFlow html={item.summary} />
    </View>
  );
}

function PublicationRow({ item }: { item: PublicationItem }) {
  if (!item.visible) return null;
  return (
    <View style={styles.itemBlock}>
      <ItemTitleRow
        title={item.name}
        subtitle={item.publisher}
        right={item.releaseDate ?? ''}
        meta=""
      />
      <RichTextFlow html={item.summary} />
    </View>
  );
}

function VolunteeringRow({ item }: { item: VolunteeringItem }) {
  if (!item.visible) return null;
  return (
    <View style={styles.itemBlock}>
      <ItemTitleRow
        title={item.position || 'Role'}
        subtitle={item.organization}
        right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
        meta={item.location}
      />
      <RichTextFlow html={item.summary} />
      <Bullets items={item.highlights} />
    </View>
  );
}

function ReferenceRow({ item }: { item: ReferenceItem }) {
  if (!item.visible) return null;
  return (
    <View style={styles.itemBlock}>
      <ItemTitleRow title={item.name} subtitle={item.position} right="" meta={item.contact} />
      <RichTextFlow html={item.reference} />
    </View>
  );
}

function ProjectRow({ item }: { item: ProjectItem }) {
  if (!item.visible) return null;
  return (
    <View style={styles.itemBlock}>
      <ItemTitleRow
        title={item.name}
        subtitle={item.role}
        right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
        meta={item.keywords.join(' · ')}
      />
      <RichTextFlow html={item.description} />
      <Bullets items={item.highlights} />
    </View>
  );
}

function InterestRow({ item }: { item: InterestItem }) {
  if (!item.visible) return null;
  return (
    <View style={styles.itemBlock}>
      <View style={styles.titleRow}>
        <Text style={styles.itemTitle}>{item.name}</Text>
      </View>
      {item.keywords.length > 0 && <Text style={styles.itemMeta}>{item.keywords.join(' · ')}</Text>}
    </View>
  );
}

function CustomRow({ item }: { item: CustomItem }) {
  if (!item.visible) return null;
  return (
    <View style={styles.itemBlock}>
      <ItemTitleRow
        title={item.title}
        subtitle={item.subtitle}
        right={item.date ?? ''}
        meta={item.location}
      />
      <RichTextFlow html={item.summary} />
      {item.keywords.length > 0 && <Text style={styles.itemMeta}>{item.keywords.join(' · ')}</Text>}
    </View>
  );
}
