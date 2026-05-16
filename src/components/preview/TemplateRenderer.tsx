import { useResumeStore } from '@/store/resume-store';
import { ClassicHtmlTemplate } from '@/templates/classic';

/**
 * Dispatches the right template HTML renderer based on `resume.meta.template`.
 *
 * Currently only Classic exists; M5's five templates each export their own
 * `<XHtmlTemplate>` and slot in here. Until then, every template value
 * falls back to Classic so the editor never shows a blank pane.
 */
export function TemplateRenderer() {
  const resume = useResumeStore((s) => s.resume);

  switch (resume.meta.template) {
    case 'classic':
    case 'modern':
    case 'minimal':
    case 'creative':
    case 'executive':
    case 'technical':
      // M5 swaps each of these to its own component.
      return <ClassicHtmlTemplate resume={resume} />;
  }
}
