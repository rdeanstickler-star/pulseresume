import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useResumeStore, defaultSectionName, SECTION_TYPES } from '@/store/resume-store';
import type { SectionType } from '@/schema/sections';
import { useState } from 'react';

/**
 * Inline picker: choose a section type from the 14 supported, then add it.
 * Adds the section to the end of `resume.sections`. ID + default name set
 * by the store.
 */
export function AddSectionPicker() {
  const [type, setType] = useState<SectionType>('experience');
  const addSection = useResumeStore((s) => s.addSection);

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1 space-y-1.5">
        <label htmlFor="add-section-type" className="text-xs font-medium text-muted-foreground">
          Add section
        </label>
        <Select value={type} onValueChange={(v) => setType(v as SectionType)}>
          <SelectTrigger id="add-section-type" aria-label="Section type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SECTION_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {defaultSectionName(t)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={() => addSection(type)}
        aria-label={`Add ${defaultSectionName(type)} section`}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add
      </Button>
    </div>
  );
}
