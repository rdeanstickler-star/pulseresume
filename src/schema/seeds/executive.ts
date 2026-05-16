import type { Resume } from '../resume';
import { SCHEMA_VERSION } from '../resume';
import { seedId } from './uuid';

/**
 * Seed: VP-level executive resume. Intentionally fictional.
 * Heavier on summary, lighter on every-bullet detail — typical exec resume shape.
 */
export const executiveSeed: Resume = {
  schemaVersion: SCHEMA_VERSION,
  meta: {
    template: 'executive',
    pageSize: 'letter',
    theme: {
      primaryColor: '#1e3a8a',
      accentColor: '#b45309',
      background: '#fefefe',
      foreground: '#0c0a09',
      sansFont: 'Lato',
      serifFont: 'EB Garamond',
      monoFont: 'JetBrains Mono',
      fontSize: 11,
      lineHeight: 1.5,
      marginTop: 22,
      marginBottom: 22,
      marginLeft: 22,
      marginRight: 22,
    },
    updatedAt: '2026-05-15T00:00:00.000Z',
  },
  basics: {
    name: 'Jordan Whitfield',
    headline: 'Chief Revenue Officer · B2B SaaS · Scale stage',
    email: 'jordan@example.exec',
    phone: '+1 312-555-0188',
    url: 'https://jordanwhitfield.com',
    photo: { url: '', visible: false },
    summary:
      'Twenty-plus years building and operating revenue organizations from Series A through IPO. ' +
      'Two successful exits, one IPO, currently leading a 180-person GTM org through scale.',
    location: {
      address: '',
      postalCode: '60611',
      city: 'Chicago',
      countryCode: 'US',
      region: 'IL',
    },
  },
  sections: [
    {
      id: seedId(2001),
      type: 'summary',
      name: 'Executive Summary',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(2101),
          content:
            '<p>Builder of revenue engines that scale without losing customer focus. I&apos;ve grown ARR from ' +
            '$8M to $140M at two companies, hired and developed 14 VPs, and led teams through three economic ' +
            'downturns without losing a single quarter of net retention above 110%.</p>',
          visible: true,
        },
      ],
    },
    {
      id: seedId(2002),
      type: 'experience',
      name: 'Experience',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(2201),
          company: 'Northpoint Analytics',
          position: 'Chief Revenue Officer',
          location: 'Chicago, IL',
          startDate: '2022-04',
          endDate: '',
          current: true,
          url: '',
          summary:
            '<p>Own sales, marketing, customer success, and revenue operations for a $90M ARR analytics platform.</p>',
          highlights: [
            'Grew ARR from $38M to $90M in 30 months while reducing CAC payback from 22 months to 14.',
            'Hired and developed three VPs (Sales, Marketing, RevOps); zero unwanted attrition on the leadership team.',
            'Architected the move upmarket into enterprise; mid-market ACV up 3.2x.',
          ],
          visible: true,
        },
        {
          id: seedId(2202),
          company: 'Crestline Software',
          position: 'SVP, Sales',
          location: 'Boston, MA',
          startDate: '2017-08',
          endDate: '2022-03',
          current: false,
          url: '',
          summary:
            '<p>Led the global sales organization through Series D and IPO ($1.2B at offering).</p>',
          highlights: [
            'Scaled the sales org from 22 to 110 reps across four geographies.',
            'Built the partner channel that contributed 38% of new ARR by FY22.',
          ],
          visible: true,
        },
        {
          id: seedId(2203),
          company: 'Atrium Cloud',
          position: 'VP, Sales',
          location: 'San Francisco, CA',
          startDate: '2013-01',
          endDate: '2017-07',
          current: false,
          url: '',
          summary:
            '<p>Founding sales leader. First commercial hire. Took the company from $2M to $48M ARR. Acquired by Helio Cloud in 2017.</p>',
          highlights: [
            'Closed the first seven seven-figure deals personally.',
            'Hired the team that closed the acquiring company as a customer 18 months before the eventual M&amp;A.',
          ],
          visible: true,
        },
      ],
    },
    {
      id: seedId(2003),
      type: 'education',
      name: 'Education',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(2301),
          institution: 'Kellogg School of Management, Northwestern',
          area: 'Business Administration',
          studyType: 'M.B.A.',
          startDate: '2008',
          endDate: '2010',
          current: false,
          score: '',
          url: '',
          courses: [],
          summary: '',
          visible: true,
        },
        {
          id: seedId(2302),
          institution: 'University of Michigan',
          area: 'Economics',
          studyType: 'B.A.',
          startDate: '2001',
          endDate: '2005',
          current: false,
          score: '',
          url: '',
          courses: [],
          summary: '',
          visible: true,
        },
      ],
    },
    {
      id: seedId(2004),
      type: 'awards',
      name: 'Recognition',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(2401),
          title: 'Pavilion Top 100 Revenue Leaders',
          date: '2025',
          awarder: 'Pavilion',
          url: '',
          summary: '',
          visible: true,
        },
        {
          id: seedId(2402),
          title: 'SaaStr Top 50 CROs',
          date: '2024',
          awarder: 'SaaStr',
          url: '',
          summary: '',
          visible: true,
        },
      ],
    },
    {
      id: seedId(2005),
      type: 'custom',
      name: 'Board & Advisory',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(2501),
          title: 'Independent Board Member',
          subtitle: 'Helios Data',
          date: '2023',
          location: '',
          url: '',
          summary: '<p>Audit and compensation committees.</p>',
          keywords: [],
          visible: true,
        },
        {
          id: seedId(2502),
          title: 'Go-to-Market Advisor',
          subtitle: 'Bridge Ventures',
          date: '2021',
          location: '',
          url: '',
          summary: '',
          keywords: [],
          visible: true,
        },
      ],
    },
  ],
};
