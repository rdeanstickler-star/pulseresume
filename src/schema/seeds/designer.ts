import type { Resume } from '../resume';
import { SCHEMA_VERSION } from '../resume';
import { seedId } from './uuid';

/**
 * Seed: senior product designer. Intentionally fictional.
 */
export const designerSeed: Resume = {
  schemaVersion: SCHEMA_VERSION,
  meta: {
    template: 'creative',
    pageSize: 'a4',
    theme: {
      primaryColor: '#7c3aed',
      accentColor: '#f59e0b',
      background: '#ffffff',
      foreground: '#1f2937',
      sansFont: 'Inter',
      serifFont: 'Playfair Display',
      monoFont: 'JetBrains Mono',
      fontSize: 10,
      lineHeight: 1.5,
      marginTop: 18,
      marginBottom: 18,
      marginLeft: 18,
      marginRight: 18,
    },
    updatedAt: '2026-05-15T00:00:00.000Z',
  },
  basics: {
    name: 'Maya Okafor',
    headline: 'Senior Product Designer · Systems & Accessibility',
    email: 'maya@example.design',
    phone: '+1 718-555-0193',
    url: 'https://mayaokafor.design',
    photo: { url: '', visible: false },
    summary:
      'I design products that hold up across teams, languages, and assistive tech. Eight years across ' +
      'fintech, health, and developer tools. I co-lead the design systems guild at my current company.',
    location: {
      address: '',
      postalCode: '11215',
      city: 'Brooklyn',
      countryCode: 'US',
      region: 'NY',
    },
  },
  sections: [
    {
      id: seedId(1001),
      type: 'profile',
      name: 'Profiles',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(1101),
          network: 'Dribbble',
          username: 'mayao',
          url: 'https://dribbble.com/mayao',
          icon: 'dribbble',
          visible: true,
        },
        {
          id: seedId(1102),
          network: 'LinkedIn',
          username: 'mayaokafor',
          url: 'https://linkedin.com/in/mayaokafor',
          icon: 'linkedin',
          visible: true,
        },
        {
          id: seedId(1103),
          network: 'Read.cv',
          username: 'mayao',
          url: 'https://read.cv/mayao',
          icon: 'globe',
          visible: true,
        },
      ],
    },
    {
      id: seedId(1002),
      type: 'summary',
      name: 'Summary',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(1201),
          content:
            '<p>I focus on the unglamorous parts of design — naming, error states, empty states, accessibility. ' +
            'Most of the work I&apos;m proudest of is invisible.</p>',
          visible: true,
        },
      ],
    },
    {
      id: seedId(1003),
      type: 'experience',
      name: 'Experience',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(1301),
          company: 'Lumen Health',
          position: 'Senior Product Designer',
          location: 'Brooklyn, NY',
          startDate: '2023-01',
          endDate: '',
          current: true,
          url: 'https://lumen.health',
          summary: '<p>Lead designer for the patient portal. WCAG 2.1 AA across web + mobile.</p>',
          highlights: [
            'Shipped the appointment-rescheduling flow that reduced no-shows by 22%.',
            'Drove the design system rewrite; cut new-feature design-to-ship time from 4 weeks to 9 days.',
            'Set up the team&apos;s usability testing cadence; 8 sessions/month with patients aged 65+.',
          ],
          visible: true,
        },
        {
          id: seedId(1302),
          company: 'Beacon Fintech',
          position: 'Product Designer',
          location: 'Remote',
          startDate: '2019-06',
          endDate: '2022-12',
          current: false,
          url: '',
          summary: '<p>End-to-end design for the small-business lending product.</p>',
          highlights: [
            'Rebuilt the underwriting funnel — reduced abandonment from 47% to 18%.',
            'Co-authored the accessibility playbook now used by 4 product teams.',
          ],
          visible: true,
        },
      ],
    },
    {
      id: seedId(1004),
      type: 'skills',
      name: 'Skills',
      visible: true,
      columns: 2,
      items: [
        {
          id: seedId(1401),
          name: 'Tooling',
          level: 'expert',
          keywords: ['Figma', 'FigJam', 'Linear', 'Notion'],
          visible: true,
        },
        {
          id: seedId(1402),
          name: 'Methods',
          level: 'expert',
          keywords: ['Usability testing', 'Service blueprinting', 'WCAG audit'],
          visible: true,
        },
        {
          id: seedId(1403),
          name: 'Prototyping',
          level: 'advanced',
          keywords: ['Framer', 'ProtoPie', 'HTML/CSS'],
          visible: true,
        },
      ],
    },
    {
      id: seedId(1005),
      type: 'education',
      name: 'Education',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(1501),
          institution: 'Pratt Institute',
          area: 'Industrial Design',
          studyType: 'B.F.A.',
          startDate: '2014',
          endDate: '2018',
          current: false,
          score: '',
          url: '',
          courses: ['Human Factors', 'Information Design', 'Design Research'],
          summary: '',
          visible: true,
        },
      ],
    },
    {
      id: seedId(1006),
      type: 'awards',
      name: 'Recognition',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(1601),
          title: 'Design Week Brooklyn — Accessibility Award',
          date: '2024',
          awarder: 'Design Week Brooklyn',
          url: '',
          summary: '',
          visible: true,
        },
      ],
    },
  ],
};
