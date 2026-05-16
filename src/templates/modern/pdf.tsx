import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { Resume } from '@/schema/resume';
import { defaultSectionName } from '@/store/resume-store';
import { SectionItemsPdf } from '../_shared/sections-pdf';
import { bodyFont, type TokenSet } from '../_shared/types';
import { applyTheme } from '../_shared/themed-tokens';
import { registerPdfFonts } from '@/lib/pdf-fonts';
import { modernTokens } from './tokens';

registerPdfFonts();

function makeStyles(T: TokenSet) {
  return StyleSheet.create({
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
    accentStripe: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: 6,
      backgroundColor: T.colors.accent,
    },
    name: { fontSize: T.type.nameSize, fontWeight: 700, color: T.colors.text },
    headline: {
      fontSize: T.type.headlineSize,
      fontWeight: 600,
      color: T.colors.accent,
      marginTop: 2,
    },
    contact: { fontSize: T.type.smallSize, color: T.colors.muted, marginTop: 6 },
    summary: { fontSize: T.type.bodySize, lineHeight: T.type.lineHeight, marginTop: 8 },
    header: { marginBottom: T.spacing.headerToBodyGap },
    section: { marginTop: T.spacing.sectionGap },
    sectionHeadingWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
    },
    sectionHeadingBar: { width: 14, height: 2, backgroundColor: T.colors.accent },
    sectionHeading: {
      fontSize: T.type.sectionHeadingSize,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: T.sectionHeading.letterSpacing,
      color: T.colors.accent,
    },
  });
}

export function ModernPdfDocument({ resume }: { resume: Resume }) {
  const T = applyTheme(modernTokens, resume.meta.theme);
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
        <View style={styles.accentStripe} fixed />
        <View style={styles.header}>
          <Text style={styles.name}>{basics.name || 'Your Name'}</Text>
          {basics.headline ? <Text style={styles.headline}>{basics.headline}</Text> : null}
          {contact ? <Text style={styles.contact}>{contact}</Text> : null}
          {basics.summary ? <Text style={styles.summary}>{basics.summary}</Text> : null}
        </View>
        {sections
          .filter((s) => s.visible)
          .map((section) => (
            <View key={section.id} style={styles.section} wrap>
              <View style={styles.sectionHeadingWrap}>
                <View style={styles.sectionHeadingBar} />
                <Text style={styles.sectionHeading}>
                  {section.name || defaultSectionName(section.type)}
                </Text>
              </View>
              <SectionItemsPdf section={section} tokens={T} />
            </View>
          ))}
      </Page>
    </Document>
  );
}
