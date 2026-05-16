import type { Section } from '@/schema/sections';

/**
 * Extract a short, distinct display title from any section item — used by
 * the DnD item list and (later) the per-item editor headers.
 *
 * The shape varies per section type, so this is one of the few places where
 * the discriminated union has to be expanded. We pick the first 1–2 strong
 * fields and fall back to a placeholder.
 */
export function itemTitle(section: Section, item: Section['items'][number]): string {
  switch (section.type) {
    case 'profile':
      // typeof item is ProfileItem; field access narrowed by the parent type.
      return (item as { network: string; username: string }).network || 'Profile';
    case 'summary':
      return 'Summary';
    case 'experience': {
      const it = item as { position: string; company: string };
      return [it.position, it.company].filter(Boolean).join(' · ') || 'New experience';
    }
    case 'education': {
      const it = item as { institution: string; area: string };
      return [it.institution, it.area].filter(Boolean).join(' · ') || 'New education entry';
    }
    case 'skills':
      return (item as { name: string }).name || 'New skill';
    case 'languages':
      return (item as { language: string }).language || 'New language';
    case 'awards':
      return (item as { title: string }).title || 'New award';
    case 'certifications':
      return (item as { name: string }).name || 'New certification';
    case 'publications':
      return (item as { name: string }).name || 'New publication';
    case 'volunteering': {
      const it = item as { position: string; organization: string };
      return [it.position, it.organization].filter(Boolean).join(' · ') || 'New volunteer role';
    }
    case 'references':
      return (item as { name: string }).name || 'New reference';
    case 'projects':
      return (item as { name: string }).name || 'New project';
    case 'interests':
      return (item as { name: string }).name || 'New interest';
    case 'custom': {
      const it = item as { title: string; subtitle: string };
      return [it.title, it.subtitle].filter(Boolean).join(' · ') || 'New item';
    }
  }
}
