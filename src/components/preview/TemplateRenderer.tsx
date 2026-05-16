import { useResumeStore } from '@/store/resume-store';
import { ClassicHtmlTemplate } from '@/templates/classic';
import { ModernHtmlTemplate } from '@/templates/modern';
import { MinimalHtmlTemplate } from '@/templates/minimal';
import { CreativeHtmlTemplate } from '@/templates/creative';
import { ExecutiveHtmlTemplate } from '@/templates/executive';
import { TechnicalHtmlTemplate } from '@/templates/technical';

/**
 * Preview-pane dispatcher. Reads the current template from the store's
 * meta.template and renders the corresponding HTML template component.
 * All six templates ship as of M5.
 */
export function TemplateRenderer() {
  const resume = useResumeStore((s) => s.resume);
  switch (resume.meta.template) {
    case 'modern':
      return <ModernHtmlTemplate resume={resume} />;
    case 'minimal':
      return <MinimalHtmlTemplate resume={resume} />;
    case 'creative':
      return <CreativeHtmlTemplate resume={resume} />;
    case 'executive':
      return <ExecutiveHtmlTemplate resume={resume} />;
    case 'technical':
      return <TechnicalHtmlTemplate resume={resume} />;
    case 'classic':
    default:
      return <ClassicHtmlTemplate resume={resume} />;
  }
}
