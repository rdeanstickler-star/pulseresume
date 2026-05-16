import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Resume } from '@/schema/resume';
import { defaultSectionName } from '@/store/resume-store';
import { SectionItemsPdf } from '../_shared/sections-pdf';
import { bodyFont, type TokenSet } from '../_shared/types';
import { applyTheme } from '../_shared/themed-tokens';
import { registerPdfFonts } from '@/lib/pdf-fonts';
import { creativeTokens } from './tokens';

registerPdfFonts();

function makeStyles(T: TokenSet) {
  return StyleSheet.create({
    page: {
      fontFamily: bodyFont(T),
      fontSize: T.type.bodySize,
      lineHeight: T.type.lineHeight,
      color: T.colors.text,
      backgroundColor: T.colors.background,
      paddingBottom: T.page.paddingBottomPt,
    },
    hero: {
      backgroundColor: T.colors.accent,
      color: T.colors.onAccent,
      paddingTop: 28,
      paddingBottom: 24,
      paddingLeft: T.page.paddingLeftPt,
      paddingRight: T.page.paddingRightPt,
    },
    name: { fontSize: T.type.nameSize, fontWeight: 700, color: T.colors.onAccent },
    headline: {
      fontSize: T.type.headlineSize,
      color: T.colors.onAccent,
      opacity: 0.9,
      marginTop: 4,
    },
    contact: {
      fontSize: T.type.smallSize,
      color: T.colors.onAccent,
      opacity: 0.85,
      marginTop: 8,
    },
    body: {
      paddingTop: T.spacing.headerToBodyGap,
      paddingLeft: T.page.paddingLeftPt,
      paddingRight: T.page.paddingRightPt,
    },
    summary: { fontSize: T.type.bodySize, marginBottom: T.spacing.sectionGap },
    section: { marginTop: T.spacing.sectionGap },
    sectionHeading: {
      fontSize: T.type.sectionHeadingSize,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: T.sectionHeading.letterSpacing,
      color: T.colors.accent,
      borderBottomWidth: 1,
      borderBottomColor: T.colors.rule,
      paddingBottom: 3,
      marginBottom: 6,
    },
  });
}

export function CreativePdfDocument({ resume }: { resume: Resume }) {
  const T = applyTheme(creativeTokens, resume.meta.theme);
  const styles = makeStyles(T);
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

  return (
    <Document
      title={basics.name ? `${basics.name} — Resume` : 'Resume'}
      author={basics.name || undefined}
      creator="PulseResume"
      producer="PulseResume"
    >
      <Page size={size} style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.name}>{basics.name || 'Your Name'}</Text>
          {basics.headline ? <Text style={styles.headline}>{basics.headline}</Text> : null}
          {contact ? <Text style={styles.contact}>{contact}</Text> : null}
        </View>
        <View style={styles.body}>
          {basics.summary ? <Text style={styles.summary}>{basics.summary}</Text> : null}
          {sections
            .filter((s) => s.visible)
            .map((section) => (
              <View key={section.id} style={styles.section} wrap>
                <Text style={styles.sectionHeading}>
                  {section.name || defaultSectionName(section.type)}
                </Text>
                <SectionItemsPdf section={section} tokens={T} />
              </View>
            ))}
        </View>
      </Page>
    </Document>
  );
}
