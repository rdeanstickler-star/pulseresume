import { LayoutTemplate } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useResumeStore } from '@/store/resume-store';
import { TEMPLATES, type TemplateId } from '@/templates/registry';

/**
 * Template picker — small select control in the editor toolbar. Updates
 * `resume.meta.template` which both the preview and PDF export react to.
 */
export function TemplatePicker() {
  const template = useResumeStore((s) => s.resume.meta.template);
  const setMeta = useResumeStore((s) => s.setMeta);

  return (
    <Select value={template} onValueChange={(v) => setMeta({ template: v as TemplateId })}>
      <SelectTrigger className="h-8 w-auto gap-2 text-xs" aria-label="Resume template">
        <LayoutTemplate className="h-3.5 w-3.5" aria-hidden="true" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TEMPLATES.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            <div className="flex flex-col">
              <span className="font-medium">{t.label}</span>
              <span className="text-xs text-muted-foreground">{t.description}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
