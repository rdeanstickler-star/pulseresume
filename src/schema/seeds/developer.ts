import type { Resume } from '../resume';
import { SCHEMA_VERSION } from '../resume';
import { seedId } from './uuid';

/**
 * Seed: senior developer profile. Intentionally fictional. All companies,
 * dates, and accomplishments are illustrative.
 */
export const developerSeed: Resume = {
  schemaVersion: SCHEMA_VERSION,
  meta: {
    template: 'technical',
    pageSize: 'a4',
    theme: {
      primaryColor: '#0f172a',
      accentColor: '#0ea5e9',
      background: '#ffffff',
      foreground: '#0f172a',
      sansFont: 'Inter',
      serifFont: 'Merriweather',
      monoFont: 'JetBrains Mono',
      fontSize: 10,
      lineHeight: 1.4,
      marginTop: 16,
      marginBottom: 16,
      marginLeft: 16,
      marginRight: 16,
    },
    updatedAt: '2026-05-15T00:00:00.000Z',
  },
  basics: {
    name: 'Avery Chen',
    headline: 'Staff Software Engineer · Distributed Systems',
    email: 'avery@example.dev',
    phone: '+1 415-555-0142',
    url: 'https://avery.dev',
    photo: { url: '', visible: false },
    summary:
      'Twelve years building reliable backends. I like writing boring code that survives outages, ' +
      'mentoring engineers into staying technical, and shipping documentation people actually read.',
    location: {
      address: '',
      postalCode: '94110',
      city: 'San Francisco',
      countryCode: 'US',
      region: 'CA',
    },
  },
  sections: [
    {
      id: seedId(1),
      type: 'profile',
      name: 'Profiles',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(101),
          network: 'GitHub',
          username: 'averyc',
          url: 'https://github.com/averyc',
          icon: 'github',
          visible: true,
        },
        {
          id: seedId(102),
          network: 'LinkedIn',
          username: 'averychen',
          url: 'https://linkedin.com/in/averychen',
          icon: 'linkedin',
          visible: true,
        },
      ],
    },
    {
      id: seedId(2),
      type: 'experience',
      name: 'Experience',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(201),
          company: 'Helio Cloud',
          position: 'Staff Software Engineer',
          location: 'Remote',
          startDate: '2022-03',
          endDate: '',
          current: true,
          url: 'https://helio.cloud',
          summary:
            '<p>Lead the storage durability working group. Own the multi-region replication path for the object store.</p>',
          highlights: [
            'Cut p99 cross-region replication latency from 4.2s to 600ms by rewriting the dispatch loop in Rust.',
            'Wrote the post-mortem playbook adopted org-wide; reduced repeat-incident rate by 38%.',
            'Mentored four mid-level engineers; three promoted to senior within 14 months.',
          ],
          visible: true,
        },
        {
          id: seedId(202),
          company: 'Northwind Data',
          position: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          startDate: '2018-08',
          endDate: '2022-02',
          current: false,
          url: '',
          summary: '<p>Backend for the analytics ingestion pipeline. 1M events/sec sustained.</p>',
          highlights: [
            'Designed and shipped the partition-rebalancer; eliminated 90% of hot-shard pages.',
            'Migrated the metric layer from Statsd to OpenTelemetry; saved $180K/yr in vendor fees.',
          ],
          visible: true,
        },
      ],
    },
    {
      id: seedId(3),
      type: 'education',
      name: 'Education',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(301),
          institution: 'UC Berkeley',
          area: 'Computer Science',
          studyType: 'B.S.',
          startDate: '2010',
          endDate: '2014',
          current: false,
          score: '',
          url: '',
          courses: [
            'Operating Systems',
            'Distributed Computing',
            'Compilers',
            'Database Internals',
          ],
          summary: '',
          visible: true,
        },
      ],
    },
    {
      id: seedId(4),
      type: 'skills',
      name: 'Skills',
      visible: true,
      columns: 2,
      items: [
        {
          id: seedId(401),
          name: 'Languages',
          level: 'expert',
          keywords: ['Rust', 'Go', 'TypeScript', 'Python'],
          visible: true,
        },
        {
          id: seedId(402),
          name: 'Infrastructure',
          level: 'advanced',
          keywords: ['Kubernetes', 'Terraform', 'AWS', 'PostgreSQL'],
          visible: true,
        },
        {
          id: seedId(403),
          name: 'Observability',
          level: 'advanced',
          keywords: ['OpenTelemetry', 'Grafana', 'Honeycomb'],
          visible: true,
        },
      ],
    },
    {
      id: seedId(5),
      type: 'projects',
      name: 'Open Source',
      visible: true,
      columns: 1,
      items: [
        {
          id: seedId(501),
          name: 'tinydsm',
          description:
            '<p>A tiny distributed shared-memory crate for teaching consensus. ~3K stars.</p>',
          url: 'https://github.com/averyc/tinydsm',
          startDate: '2021',
          endDate: '',
          current: true,
          role: 'Maintainer',
          keywords: ['Rust', 'Raft', 'Education'],
          highlights: [],
          visible: true,
        },
      ],
    },
  ],
};
