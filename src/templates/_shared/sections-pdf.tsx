import { Text, View, Link, StyleSheet } from '@react-pdf/renderer';
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
import { formatDateRange, htmlToBlocks } from '@/lib/format';
import type { TokenSet } from './types';
import { bodyFont } from './types';

/**
 * Shared PDF section renderers for templates M5+. Mirrors
 * `sections-html.tsx` element-for-element so the two paths stay in lockstep.
 * Templates compose these into their own Page + Header + SectionFrame.
 */

export function SectionItemsPdf({ section, tokens }: { section: Section; tokens: TokenSet }) {
  switch (section.type) {
    case 'summary':
      return <SummaryItems items={section.items} tokens={tokens} />;
    case 'profile':
      return (
        <ColumnedList
          items={section.items as ProfileItem[]}
          columns={section.columns}
          tokens={tokens}
          render={(item) => renderProfile(item, tokens)}
        />
      );
    case 'experience':
      return (
        <ColumnedList
          items={section.items as ExperienceItem[]}
          columns={section.columns}
          tokens={tokens}
          render={(item) => renderExperience(item, tokens)}
        />
      );
    case 'education':
      return (
        <ColumnedList
          items={section.items as EducationItem[]}
          columns={section.columns}
          tokens={tokens}
          render={(item) => renderEducation(item, tokens)}
        />
      );
    case 'skills':
      return (
        <ColumnedList
          items={section.items as SkillItem[]}
          columns={section.columns}
          tokens={tokens}
          render={(item) => renderSkill(item, tokens)}
        />
      );
    case 'languages':
      return (
        <ColumnedList
          items={section.items as LanguageItem[]}
          columns={section.columns}
          tokens={tokens}
          render={(item) => renderLanguage(item, tokens)}
        />
      );
    case 'awards':
      return (
        <ColumnedList
          items={section.items as AwardItem[]}
          columns={section.columns}
          tokens={tokens}
          render={(item) => renderAward(item, tokens)}
        />
      );
    case 'certifications':
      return (
        <ColumnedList
          items={section.items as CertificationItem[]}
          columns={section.columns}
          tokens={tokens}
          render={(item) => renderCertification(item, tokens)}
        />
      );
    case 'publications':
      return (
        <ColumnedList
          items={section.items as PublicationItem[]}
          columns={section.columns}
          tokens={tokens}
          render={(item) => renderPublication(item, tokens)}
        />
      );
    case 'volunteering':
      return (
        <ColumnedList
          items={section.items as VolunteeringItem[]}
          columns={section.columns}
          tokens={tokens}
          render={(item) => renderVolunteering(item, tokens)}
        />
      );
    case 'references':
      return (
        <ColumnedList
          items={section.items as ReferenceItem[]}
          columns={section.columns}
          tokens={tokens}
          render={(item) => renderReference(item, tokens)}
        />
      );
    case 'projects':
      return (
        <ColumnedList
          items={section.items as ProjectItem[]}
          columns={section.columns}
          tokens={tokens}
          render={(item) => renderProject(item, tokens)}
        />
      );
    case 'interests':
      return (
        <ColumnedList
          items={section.items as InterestItem[]}
          columns={section.columns}
          tokens={tokens}
          render={(item) => renderInterest(item, tokens)}
        />
      );
    case 'custom':
      return (
        <ColumnedList
          items={section.items as CustomItem[]}
          columns={section.columns}
          tokens={tokens}
          render={(item) => renderCustom(item, tokens)}
        />
      );
  }
}

// -----------------------------------------------------------------------------
//  Style factory
// -----------------------------------------------------------------------------

function makeStyles(tokens: TokenSet) {
  return StyleSheet.create({
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    itemTitle: {
      fontFamily: bodyFont(tokens),
      fontSize: tokens.type.bodySize,
      fontWeight: 700,
      color: tokens.colors.text,
    },
    itemSubtitle: {
      fontFamily: bodyFont(tokens),
      fontSize: tokens.type.bodySize,
      color: tokens.colors.muted,
    },
    itemDate: {
      fontFamily: bodyFont(tokens),
      fontSize: tokens.type.smallSize,
      color: tokens.colors.muted,
    },
    itemMeta: {
      fontFamily: bodyFont(tokens),
      fontSize: tokens.type.smallSize,
      color: tokens.colors.muted,
      marginTop: 2,
    },
    paragraph: {
      fontFamily: bodyFont(tokens),
      fontSize: tokens.type.bodySize,
      color: tokens.colors.text,
      marginTop: 4,
    },
    bulletList: { marginTop: 4 },
    bulletRow: { flexDirection: 'row', marginTop: 1 },
    bulletGlyph: { width: tokens.spacing.bulletIndent, color: tokens.colors.muted },
    bulletText: { flex: 1 },
    link: { color: tokens.colors.muted, textDecoration: 'underline' },
    itemGap: { marginTop: tokens.spacing.itemGap },
    twoCol: { flexDirection: 'row', gap: 16 },
    twoColChild: { flex: 1 },
  });
}

// -----------------------------------------------------------------------------
//  Generic columned list
// -----------------------------------------------------------------------------

interface VisibleItem {
  id: string;
  visible: boolean;
}

function ColumnedList<T extends VisibleItem>({
  items,
  columns,
  tokens,
  render,
}: {
  items: T[];
  columns: 1 | 2;
  tokens: TokenSet;
  render: (item: T) => React.ReactElement;
}) {
  const styles = makeStyles(tokens);
  const visible = items.filter((i) => i.visible);
  if (visible.length === 0) return null;
  if (columns === 2) {
    const left = visible.filter((_, i) => i % 2 === 0);
    const right = visible.filter((_, i) => i % 2 === 1);
    return (
      <View style={styles.twoCol}>
        <View style={styles.twoColChild}>
          {left.map((item, i) => (
            <View key={item.id} style={i > 0 ? styles.itemGap : undefined}>
              {render(item)}
            </View>
          ))}
        </View>
        <View style={styles.twoColChild}>
          {right.map((item, i) => (
            <View key={item.id} style={i > 0 ? styles.itemGap : undefined}>
              {render(item)}
            </View>
          ))}
        </View>
      </View>
    );
  }
  return (
    <View>
      {visible.map((item, i) => (
        <View key={item.id} style={i > 0 ? styles.itemGap : undefined}>
          {render(item)}
        </View>
      ))}
    </View>
  );
}

// -----------------------------------------------------------------------------
//  Rich text + helpers
// -----------------------------------------------------------------------------

function RichText({ html, tokens }: { html: string; tokens: TokenSet }) {
  const styles = makeStyles(tokens);
  const blocks = htmlToBlocks(html);
  if (blocks.length === 0) return null;
  return (
    <View>
      {blocks.map((block, i) =>
        block.kind === 'paragraph' ? (
          <Text key={i} style={styles.paragraph}>
            {block.text}
          </Text>
        ) : (
          <View key={i} style={styles.bulletList}>
            {block.items?.map((item, j) => (
              <View key={j} style={styles.bulletRow}>
                <Text style={styles.bulletGlyph}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        ),
      )}
    </View>
  );
}

function HighlightList({ items, tokens }: { items: string[]; tokens: TokenSet }) {
  const styles = makeStyles(tokens);
  if (items.length === 0) return null;
  return (
    <View style={styles.bulletList}>
      {items.map((h, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bulletGlyph}>•</Text>
          <Text style={styles.bulletText}>{h}</Text>
        </View>
      ))}
    </View>
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
  const styles = makeStyles(tokens);
  return (
    <View>
      <View style={styles.itemRow}>
        <Text>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle ? <Text style={styles.itemSubtitle}>{` · ${subtitle}`}</Text> : null}
        </Text>
        {right ? <Text style={styles.itemDate}>{right}</Text> : null}
      </View>
      {meta ? <Text style={styles.itemMeta}>{meta}</Text> : null}
    </View>
  );
}

function SummaryItems({
  items,
  tokens,
}: {
  items: Array<{ id: string; content: string; visible: boolean }>;
  tokens: TokenSet;
}) {
  return (
    <View>
      {items
        .filter((i) => i.visible)
        .map((item) => (
          <RichText key={item.id} html={item.content} tokens={tokens} />
        ))}
    </View>
  );
}

// -----------------------------------------------------------------------------
//  Per-section renderers
// -----------------------------------------------------------------------------

function renderProfile(item: ProfileItem, tokens: TokenSet) {
  const styles = makeStyles(tokens);
  return (
    <View style={styles.itemRow}>
      <Text style={styles.itemTitle}>{item.network || 'Profile'}</Text>
      {item.url ? (
        <Link src={item.url} style={styles.link}>
          {item.username || item.url}
        </Link>
      ) : (
        <Text style={styles.itemSubtitle}>{item.username}</Text>
      )}
    </View>
  );
}

function renderExperience(item: ExperienceItem, tokens: TokenSet) {
  return (
    <View>
      <ItemTitleRow
        tokens={tokens}
        title={item.position || 'Role'}
        subtitle={item.company}
        right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
        meta={item.location}
      />
      <RichText html={item.summary} tokens={tokens} />
      <HighlightList items={item.highlights} tokens={tokens} />
    </View>
  );
}

function renderEducation(item: EducationItem, tokens: TokenSet) {
  const styles = makeStyles(tokens);
  return (
    <View>
      <ItemTitleRow
        tokens={tokens}
        title={item.institution || 'Institution'}
        subtitle={[item.studyType, item.area].filter(Boolean).join(' · ')}
        right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
        meta={item.score}
      />
      {item.courses.length > 0 ? (
        <Text style={styles.itemMeta}>Courses: {item.courses.join(', ')}</Text>
      ) : null}
      <RichText html={item.summary} tokens={tokens} />
    </View>
  );
}

function renderSkill(item: SkillItem, tokens: TokenSet) {
  const styles = makeStyles(tokens);
  return (
    <View>
      <View style={styles.itemRow}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        {item.level ? <Text style={styles.itemDate}>{item.level}</Text> : null}
      </View>
      {item.keywords.length > 0 ? (
        <Text style={styles.itemMeta}>{item.keywords.join(' · ')}</Text>
      ) : null}
    </View>
  );
}

function renderLanguage(item: LanguageItem, tokens: TokenSet) {
  const styles = makeStyles(tokens);
  return (
    <View style={styles.itemRow}>
      <Text style={styles.itemTitle}>{item.language}</Text>
      {item.fluency ? <Text style={styles.itemDate}>{item.fluency}</Text> : null}
    </View>
  );
}

function renderAward(item: AwardItem, tokens: TokenSet) {
  return (
    <View>
      <ItemTitleRow
        tokens={tokens}
        title={item.title}
        subtitle={item.awarder}
        right={item.date ?? ''}
        meta=""
      />
      <RichText html={item.summary} tokens={tokens} />
    </View>
  );
}

function renderCertification(item: CertificationItem, tokens: TokenSet) {
  return (
    <View>
      <ItemTitleRow
        tokens={tokens}
        title={item.name}
        subtitle={item.issuer}
        right={item.date ?? ''}
        meta=""
      />
      <RichText html={item.summary} tokens={tokens} />
    </View>
  );
}

function renderPublication(item: PublicationItem, tokens: TokenSet) {
  return (
    <View>
      <ItemTitleRow
        tokens={tokens}
        title={item.name}
        subtitle={item.publisher}
        right={item.releaseDate ?? ''}
        meta=""
      />
      <RichText html={item.summary} tokens={tokens} />
    </View>
  );
}

function renderVolunteering(item: VolunteeringItem, tokens: TokenSet) {
  return (
    <View>
      <ItemTitleRow
        tokens={tokens}
        title={item.position || 'Role'}
        subtitle={item.organization}
        right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
        meta={item.location}
      />
      <RichText html={item.summary} tokens={tokens} />
      <HighlightList items={item.highlights} tokens={tokens} />
    </View>
  );
}

function renderReference(item: ReferenceItem, tokens: TokenSet) {
  return (
    <View>
      <ItemTitleRow
        tokens={tokens}
        title={item.name}
        subtitle={item.position}
        right=""
        meta={item.contact}
      />
      <RichText html={item.reference} tokens={tokens} />
    </View>
  );
}

function renderProject(item: ProjectItem, tokens: TokenSet) {
  return (
    <View>
      <ItemTitleRow
        tokens={tokens}
        title={item.name}
        subtitle={item.role}
        right={formatDateRange(item.startDate ?? '', item.endDate ?? '', item.current)}
        meta={item.keywords.join(' · ')}
      />
      <RichText html={item.description} tokens={tokens} />
      <HighlightList items={item.highlights} tokens={tokens} />
    </View>
  );
}

function renderInterest(item: InterestItem, tokens: TokenSet) {
  const styles = makeStyles(tokens);
  return (
    <View>
      <Text style={styles.itemTitle}>{item.name}</Text>
      {item.keywords.length > 0 ? (
        <Text style={styles.itemMeta}>{item.keywords.join(' · ')}</Text>
      ) : null}
    </View>
  );
}

function renderCustom(item: CustomItem, tokens: TokenSet) {
  const styles = makeStyles(tokens);
  return (
    <View>
      <ItemTitleRow
        tokens={tokens}
        title={item.title}
        subtitle={item.subtitle}
        right={item.date ?? ''}
        meta={item.location}
      />
      <RichText html={item.summary} tokens={tokens} />
      {item.keywords.length > 0 ? (
        <Text style={styles.itemMeta}>{item.keywords.join(' · ')}</Text>
      ) : null}
    </View>
  );
}
