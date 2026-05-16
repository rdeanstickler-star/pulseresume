import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Resume } from '@/schema/resume';
import { defaultSectionName } from '@/store/resume-store';
import { SectionItemsPdf } from '../_shared/sections-pdf';
import { bodyFont, headingFont } from '../_shared/types';
import { registerPdfFonts } from '@/lib/pdf-fonts';
import { technicalTokens as T } from './tokens';

registerPdfFonts();

const styles = StyleSheet.create({
  page: {
    fontFamily: bodyFont(T),
    fontSize: T.type.bodySize,
    lineHeight: T.type.lineHeight,
    color: T.colors.text,
    backgroundColor: T.colors.background,
    paddingTop: T.page.paddingTopPt,
    paddingBottom: T.page.paddingBottomPt,
    paddingLeft: T.page.paddingLeftPt,
    paddingRight: T.page.paddingRightPt,
  },
  header: { marginBottom: T.spacing.headerToBodyGap },
  name: {
    fontFamily: headingFont(T),
    fontSize: T.type.nameSize,
    fontWeight: 700,
  },
  headline: {
    fontFamily: headingFont(T),
    fontSize: T.type.headlineSize,
    color: T.colors.accent,
    marginTop: 2,
  },
  contact: { fontSize: T.type.smallSize, color: T.colors.muted, marginTop: 6 },
  summary: { fontSize: T.type.bodySize, marginTop: 8 },
  section: { marginTop: T.spacing.sectionGap },
  sectionHeading: {
    fontFamily: headingFont(T),
    fontSize: T.type.sectionHeadingSize,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: T.sectionHeading.letterSpacing,
    color: T.colors.accent,
    marginBottom: 4,
  },
});

export function TechnicalPdfDocument({ resume }: { resume: Resume }) {
  const size = resume.meta.pageSize === 'letter' ? 'LETTER' : 'A4';
  const { basics, sections } = resume;
  const contact = [
    basics.email,
    basics.phone,
    basics.url,
    [basics.location.city, basics.location.region, basics.location.countryCode]
      .filter(Boolean)
      .join(', '),
  ]
    .filter(Boolean)
    .join('  ·  ');
  const [openBracket, closeBracket] = T.sectionHeading.brackets ?? ['', ''];

  return (
    <Document
      title={basics.name ? `${basics.name} — Resume` : 'Resume'}
      author={basics.name || undefined}
      creator="PulseResume"
      producer="PulseResume"
    >
      <Page size={size} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{basics.name || 'Your Name'}</Text>
          {basics.headline ? <Text style={styles.headline}>{`// ${basics.headline}`}</Text> : null}
          {contact ? <Text style={styles.contact}>{contact}</Text> : null}
          {basics.summary ? <Text style={styles.summary}>{basics.summary}</Text> : null}
        </View>
        {sections
          .filter((s) => s.visible)
          .map((section) => (
            <View key={section.id} style={styles.section} wrap>
              <Text style={styles.sectionHeading}>
                {openBracket}
                {section.name || defaultSectionName(section.type)}
                {closeBracket}
              </Text>
              <SectionItemsPdf section={section} tokens={T} />
            </View>
          ))}
      </Page>
    </Document>
  );
}
