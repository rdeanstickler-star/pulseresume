import { useEffect, useState } from 'react';
import { Sparkles, RotateCcw, Eye, Edit3 } from 'lucide-react';
import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BasicsForm } from '@/components/editor/BasicsForm';
import { SectionList } from '@/components/editor/SectionList';
import { ExportButton } from '@/components/editor/ExportButton';
import { TemplatePicker } from '@/components/editor/TemplatePicker';
import { CustomizationPanel } from '@/components/editor/CustomizationPanel';
import { TemplateRenderer } from '@/components/preview/TemplateRenderer';
import { SEEDS } from '@/schema/seeds';
import { cn } from '@/lib/utils';

/**
 * Two-pane editor shell: edit left, preview right.
 *
 * Responsive:
 *  - Desktop (md+): side-by-side panes, resizable later if useful
 *  - Mobile: tabs between Edit and Preview (bottom-sheet feel)
 *
 * Top-level controls: Load example, Reset, view mode toggle (mobile).
 */
export function EditorShell() {
  const reset = useResumeStore((s) => s.reset);
  const setResume = useResumeStore((s) => s.setResume);
  const hydrated = useResumeStore((s) => s.hydrated);
  const [view, setView] = useState<'edit' | 'preview'>('edit');

  // On first mount, force hydration to settle so SSR-style placeholders don't flash.
  useEffect(() => {
    // useResumeStore.persist.rehydrate() is a no-op if already rehydrated.
    // Stub: relying on Zustand's auto-rehydrate-on-import.
  }, []);

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] flex-col">
      <Toolbar
        onReset={reset}
        onLoadExample={(slug) => {
          const seed = SEEDS.find((s) => s.slug === slug);
          if (seed) setResume(seed.data);
        }}
        view={view}
        onViewChange={setView}
      />

      {!hydrated && (
        <p aria-live="polite" className="px-4 py-2 text-xs text-muted-foreground">
          Loading saved resume…
        </p>
      )}

      <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-2">
        <section
          aria-label="Editor"
          className={cn(
            'overflow-y-auto border-r border-border bg-background',
            view === 'preview' && 'hidden md:block',
          )}
        >
          <div className="space-y-6 p-4 md:p-6">
            <BasicsForm />
            <Separator />
            <SectionList />
            <Separator />
            <CustomizationPanel />
          </div>
        </section>

        <section
          aria-label="Preview"
          className={cn('overflow-y-auto bg-muted/30', view === 'edit' && 'hidden md:block')}
        >
          <div className="p-4 md:p-6">
            <TemplateRenderer />
          </div>
        </section>
      </div>
    </div>
  );
}

function Toolbar({
  onReset,
  onLoadExample,
  view,
  onViewChange,
}: {
  onReset: () => void;
  onLoadExample: (slug: string) => void;
  view: 'edit' | 'preview';
  onViewChange: (v: 'edit' | 'preview') => void;
}) {
  return (
    <div
      role="toolbar"
      aria-label="Resume actions"
      className="flex items-center justify-between gap-2 border-b border-border bg-background px-4 py-2"
    >
      <div className="flex items-center gap-2">
        <Select onValueChange={onLoadExample}>
          <SelectTrigger className="h-8 w-auto gap-2 text-xs" aria-label="Load an example resume">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <SelectValue placeholder="Load example…" />
          </SelectTrigger>
          <SelectContent>
            {SEEDS.map((seed) => (
              <SelectItem key={seed.slug} value={seed.slug}>
                {seed.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" variant="ghost" onClick={onReset} aria-label="Reset to a blank resume">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset
        </Button>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <TemplatePicker />
        <ExportButton />
      </div>

      <div
        className="inline-flex items-center rounded-md border border-border p-0.5 md:hidden"
        role="group"
        aria-label="View"
      >
        <ViewButton
          active={view === 'edit'}
          onClick={() => onViewChange('edit')}
          label="Edit"
          Icon={Edit3}
        />
        <ViewButton
          active={view === 'preview'}
          onClick={() => onViewChange('preview')}
          label="Preview"
          Icon={Eye}
        />
      </div>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  Icon: typeof Eye;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        'inline-flex h-7 items-center gap-1.5 rounded px-2 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted',
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}
