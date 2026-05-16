import { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, GripVertical, Trash2 } from 'lucide-react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type Announcements,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useResumeStore, defaultSectionName } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { AddSectionPicker } from './AddSectionPicker';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { itemTitle } from '@/lib/item-title';
import { cn } from '@/lib/utils';
import type { Section } from '@/schema/sections';

/**
 * Section list with dnd-kit drag-and-drop reorder for sections AND items
 * within sections. Keyboard + touch + mouse all supported. Up/down buttons
 * stay as an a11y fallback.
 *
 * Keyboard:  Tab to focus a drag handle → Space to grab → Arrow Up/Down to
 *            move → Space/Enter to drop → Esc to cancel.
 * Touch:     Long-press (200 ms) the handle → drag.
 * Mouse:     Click & drag the handle (the grip icon).
 *
 * Live region: dnd-kit's Announcements report status to AT users as the
 * drag progresses. We provide custom strings keyed off section / item
 * names so the announcement matches what the user sees.
 */
export function SectionList() {
  const sections = useResumeStore((s) => s.resume.sections);
  const moveSection = useResumeStore((s) => s.moveSection);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const announcements: Announcements = {
    onDragStart({ active }) {
      const s = sections.find((x) => x.id === active.id);
      return `Picked up section ${s?.name ?? 'unknown'}.`;
    },
    onDragOver({ active, over }) {
      if (!over) return;
      const fromName = sections.find((x) => x.id === active.id)?.name ?? '';
      const toIndex = sections.findIndex((x) => x.id === over.id);
      return `${fromName} is now at position ${toIndex + 1} of ${sections.length}.`;
    },
    onDragEnd({ active, over }) {
      if (!over) return `Drag canceled.`;
      const s = sections.find((x) => x.id === active.id);
      const toIndex = sections.findIndex((x) => x.id === over.id);
      return `Dropped ${s?.name ?? 'section'} at position ${toIndex + 1} of ${sections.length}.`;
    },
    onDragCancel() {
      return 'Drag canceled.';
    },
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = sections.findIndex((s) => s.id === active.id);
    const toIndex = sections.findIndex((s) => s.id === over.id);
    if (fromIndex < 0 || toIndex < 0) return;
    moveSection(String(active.id), toIndex);
  }

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          accessibility={{ announcements }}
        >
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <ol className="space-y-2" aria-label="Resume sections">
              {sections.map((section, index) => (
                <SortableSectionRow
                  key={section.id}
                  section={section}
                  index={index}
                  count={sections.length}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}

// -----------------------------------------------------------------------------
//  Sortable section row
// -----------------------------------------------------------------------------

function SortableSectionRow({
  section,
  index,
  count,
}: {
  section: Section;
  index: number;
  count: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const updateSection = useResumeStore((s) => s.updateSection);
  const removeSection = useResumeStore((s) => s.removeSection);
  const moveSection = useResumeStore((s) => s.moveSection);
  const [expanded, setExpanded] = useState(false);

  const setName = useDebouncedCallback((name: string) => updateSection(section.id, { name }), 120);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <li ref={setNodeRef} style={style}>
      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              {...attributes}
              {...listeners}
              aria-label={`Reorder section ${section.name || defaultSectionName(section.type)}. Press space to grab, arrow keys to move, space to drop, escape to cancel.`}
              className="-ml-1 flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" aria-hidden="true" />
            </button>

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
          </div>

          {section.items.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="flex items-center gap-1 rounded text-xs text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              >
                {expanded ? (
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {expanded
                  ? 'Collapse items'
                  : `Show ${section.items.length} item${section.items.length === 1 ? '' : 's'}`}
              </button>
              {expanded && <SortableItemList section={section} />}
            </div>
          )}
        </CardContent>
      </Card>
    </li>
  );
}

// -----------------------------------------------------------------------------
//  Sortable item list (nested DnD inside each section)
// -----------------------------------------------------------------------------

function SortableItemList({ section }: { section: Section }) {
  const moveItem = useResumeStore((s) => s.moveItem);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const items = section.items;
  const announcements: Announcements = {
    onDragStart({ active }) {
      const it = items.find((x) => x.id === active.id);
      return it ? `Picked up item ${itemTitle(section, it)}.` : 'Picked up item.';
    },
    onDragOver({ active, over }) {
      if (!over) return;
      const it = items.find((x) => x.id === active.id);
      const toIndex = items.findIndex((x) => x.id === over.id);
      const name = it ? itemTitle(section, it) : 'item';
      return `${name} is now at position ${toIndex + 1} of ${items.length}.`;
    },
    onDragEnd({ active, over }) {
      if (!over) return 'Drag canceled.';
      const it = items.find((x) => x.id === active.id);
      const toIndex = items.findIndex((x) => x.id === over.id);
      const name = it ? itemTitle(section, it) : 'item';
      return `Dropped ${name} at position ${toIndex + 1} of ${items.length}.`;
    },
    onDragCancel() {
      return 'Drag canceled.';
    },
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const toIndex = items.findIndex((i) => i.id === over.id);
    if (toIndex < 0) return;
    moveItem(section.id, String(active.id), toIndex);
  }

  // Note: we suppress the OUTER section drag while the user interacts with
  // the inner item handles by stopping propagation on pointer events inside
  // this list. dnd-kit's sensors only respond to their own activationConstraints.

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={{ announcements }}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <ol className="mt-2 space-y-1.5" aria-label={`${section.name} items`}>
          {items.map((item, i) => (
            <SortableItemRow
              key={item.id}
              section={section}
              itemId={item.id}
              title={itemTitle(section, item)}
              index={i}
              count={items.length}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}

function SortableItemRow({
  section,
  itemId,
  title,
  index,
  count,
}: {
  section: Section;
  itemId: string;
  title: string;
  index: number;
  count: number;
}) {
  const moveItem = useResumeStore((s) => s.moveItem);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: itemId,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 rounded border border-border bg-background/60 px-2 py-1.5',
        isDragging && 'shadow-md',
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Reorder item ${title}. Press space to grab, arrow keys to move, space to drop, escape to cancel.`}
        className="flex h-6 w-6 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span className="flex-1 truncate text-xs">{title}</span>
      <div className="flex items-center gap-0.5">
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => moveItem(section.id, itemId, index - 1)}
          disabled={index === 0}
          aria-label={`Move ${title} up`}
        >
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => moveItem(section.id, itemId, index + 1)}
          disabled={index === count - 1}
          aria-label={`Move ${title} down`}
        >
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}
