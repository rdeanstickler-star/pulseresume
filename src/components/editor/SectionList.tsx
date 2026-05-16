import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { useResumeStore, defaultSectionName } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { AddSectionPicker } from './AddSectionPicker';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import type { Section } from '@/schema/sections';

/**
 * Section list with add / rename / visibility-toggle / delete / reorder.
 *
 * Reorder via up/down buttons here. dnd-kit-based drag-and-drop replaces
 * these in M7 (keyboard + touch + mouse). The buttons stay accessible as a
 * fallback even after DnD lands.
 */
export function SectionList() {
  const sections = useResumeStore((s) => s.resume.sections);

  return (
    <section aria-labelledby="sections-heading" className="space-y-4">
      <header className="flex items-center justify-between">
        <h2
          id="sections-heading"
          className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Sections{' '}
          <span className="text-muted-foreground/70" aria-hidden="true">
            ({sections.length})
          </span>
        </h2>
      </header>

      <AddSectionPicker />

      {sections.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          No sections yet. Use “Add section” above to create one.
        </p>
      ) : (
        <ol className="space-y-2" aria-label="Resume sections">
          {sections.map((section, index) => (
            <li key={section.id}>
              <SectionRow section={section} index={index} count={sections.length} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function SectionRow({ section, index, count }: { section: Section; index: number; count: number }) {
  const updateSection = useResumeStore((s) => s.updateSection);
  const removeSection = useResumeStore((s) => s.removeSection);
  const moveSection = useResumeStore((s) => s.moveSection);

  const setName = useDebouncedCallback((name: string) => updateSection(section.id, { name }), 120);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono uppercase tracking-wide">
              {section.type}
            </span>
            <span>
              {section.items.length} item{section.items.length === 1 ? '' : 's'}
            </span>
          </div>
          <Input
            aria-label={`${defaultSectionName(section.type)} section name`}
            defaultValue={section.name}
            onChange={(e) => setName(e.target.value)}
            placeholder={defaultSectionName(section.type)}
            className="text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => moveSection(section.id, index - 1)}
            disabled={index === 0}
            aria-label={`Move ${section.name || defaultSectionName(section.type)} up`}
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => moveSection(section.id, index + 1)}
            disabled={index === count - 1}
            aria-label={`Move ${section.name || defaultSectionName(section.type)} down`}
          >
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </Button>
          <label className="ml-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Switch
              checked={section.visible}
              onCheckedChange={(checked) => updateSection(section.id, { visible: checked })}
              aria-label={`${section.visible ? 'Hide' : 'Show'} section`}
            />
            <span>{section.visible ? 'Visible' : 'Hidden'}</span>
          </label>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => removeSection(section.id)}
            aria-label={`Delete ${section.name || defaultSectionName(section.type)} section`}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
