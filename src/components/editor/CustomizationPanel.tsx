import { useResumeStore } from '@/store/resume-store';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PALETTES, type Palette } from '@/lib/palette-options';
import { fontsBySlot } from '@/lib/font-options';
import { classifyContrast, contrastLabel, contrastRatio } from '@/lib/wcag';
import { cn } from '@/lib/utils';

/**
 * Customization sidebar — drives `resume.meta.theme`. Every change flows
 * through the Zustand store → Zod validation → all 6 templates instantly
 * re-render. WCAG contrast hint surfaces in real-time.
 *
 * Sections:
 *  - Palette: 8 curated + custom hex
 *  - Fonts: sans + serif + mono selectors
 *  - Type: body size, line height
 *  - Margins: 4 sliders
 */
export function CustomizationPanel() {
  const theme = useResumeStore((s) => s.resume.meta.theme);
  const setMeta = useResumeStore((s) => s.setMeta);

  function setTheme(patch: Partial<typeof theme>) {
    setMeta({ theme: { ...theme, ...patch } });
  }

  const activePalette =
    PALETTES.find(
      (p) =>
        p.foreground === theme.foreground &&
        p.background === theme.background &&
        p.accent === theme.accentColor,
    )?.id ?? 'custom';

  const ratio = (() => {
    try {
      return contrastRatio(theme.foreground, theme.background);
    } catch {
      return null;
    }
  })();
  const level = ratio !== null ? classifyContrast(ratio) : null;

  return (
    <section aria-labelledby="customization-heading" className="space-y-5">
      <h2
        id="customization-heading"
        className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
      >
        Customization
      </h2>

      <Group label="Palette">
        <div className="grid grid-cols-4 gap-2">
          {PALETTES.map((palette) => (
            <PaletteSwatch
              key={palette.id}
              palette={palette}
              active={activePalette === palette.id}
              onSelect={() =>
                setTheme({
                  foreground: palette.foreground,
                  background: palette.background,
                  accentColor: palette.accent,
                  primaryColor: palette.foreground,
                })
              }
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <HexField
            label="Text"
            value={theme.foreground}
            onChange={(v) => setTheme({ foreground: v, primaryColor: v })}
          />
          <HexField
            label="Accent"
            value={theme.accentColor}
            onChange={(v) => setTheme({ accentColor: v })}
          />
          <HexField
            label="Background"
            value={theme.background}
            onChange={(v) => setTheme({ background: v })}
          />
        </div>
        {ratio !== null && level && (
          <p
            role={level === 'fail' ? 'alert' : 'status'}
            className={cn(
              'text-xs',
              level === 'fail' && 'text-destructive',
              level === 'AA-large' && 'text-amber-700 dark:text-amber-400',
              (level === 'AA' || level === 'AAA') && 'text-muted-foreground',
            )}
          >
            Contrast {ratio.toFixed(1)} : 1 · {contrastLabel(level)}
          </p>
        )}
      </Group>

      <Group label="Fonts">
        <div className="grid grid-cols-1 gap-2">
          <FontField
            id="sans-font"
            label="Sans"
            slot="sans"
            value={theme.sansFont}
            onChange={(v) => setTheme({ sansFont: v })}
          />
          <FontField
            id="serif-font"
            label="Serif"
            slot="serif"
            value={theme.serifFont}
            onChange={(v) => setTheme({ serifFont: v })}
          />
          <FontField
            id="mono-font"
            label="Mono"
            slot="mono"
            value={theme.monoFont}
            onChange={(v) => setTheme({ monoFont: v })}
          />
        </div>
      </Group>

      <Group label="Type">
        <SliderRow
          id="font-size"
          label="Body size"
          min={8}
          max={14}
          step={0.5}
          value={theme.fontSize}
          unit="pt"
          onChange={(v) => setTheme({ fontSize: v })}
        />
        <SliderRow
          id="line-height"
          label="Line height"
          min={1}
          max={2}
          step={0.05}
          value={theme.lineHeight}
          unit=""
          onChange={(v) => setTheme({ lineHeight: v })}
        />
      </Group>

      <Group label="Margins">
        <SliderRow
          id="margin-top"
          label="Top"
          min={0}
          max={40}
          step={1}
          value={theme.marginTop}
          unit="pt"
          onChange={(v) => setTheme({ marginTop: v })}
        />
        <SliderRow
          id="margin-bottom"
          label="Bottom"
          min={0}
          max={40}
          step={1}
          value={theme.marginBottom}
          unit="pt"
          onChange={(v) => setTheme({ marginBottom: v })}
        />
        <SliderRow
          id="margin-left"
          label="Left"
          min={0}
          max={40}
          step={1}
          value={theme.marginLeft}
          unit="pt"
          onChange={(v) => setTheme({ marginLeft: v })}
        />
        <SliderRow
          id="margin-right"
          label="Right"
          min={0}
          max={40}
          step={1}
          value={theme.marginRight}
          unit="pt"
          onChange={(v) => setTheme({ marginRight: v })}
        />
      </Group>
    </section>
  );
}

// -----------------------------------------------------------------------------
//  Sub-components
// -----------------------------------------------------------------------------

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function PaletteSwatch({
  palette,
  active,
  onSelect,
}: {
  palette: Palette;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`${palette.label} palette`}
      title={palette.label}
      className={cn(
        'flex flex-col items-center gap-1 rounded-md border p-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        active ? 'border-primary bg-muted' : 'border-border hover:bg-muted/50',
      )}
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 rounded-full border border-border"
        style={{ background: palette.swatch }}
      />
      <span className="text-[10px] text-muted-foreground">{palette.label}</span>
    </button>
  );
}

function HexField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-input bg-background px-2 py-1">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${label} color`}
        className="h-5 w-5 cursor-pointer rounded border border-border bg-transparent"
      />
      <div className="flex flex-1 flex-col">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} hex`}
          className="h-5 border-0 bg-transparent p-0 text-xs shadow-none focus-visible:ring-0"
          maxLength={7}
        />
      </div>
    </label>
  );
}

function FontField({
  id,
  label,
  slot,
  value,
  onChange,
}: {
  id: string;
  label: string;
  slot: 'sans' | 'serif' | 'mono';
  value: string;
  onChange: (next: string) => void;
}) {
  const options = fontsBySlot(slot);
  return (
    <div className="flex items-center justify-between gap-3">
      <Label
        htmlFor={id}
        className="w-12 shrink-0 text-xs uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-8 flex-1 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((f) => (
            <SelectItem key={f.family} value={f.family}>
              <span style={{ fontFamily: `${f.family}, sans-serif` }}>{f.family}</span>
              {!f.pdfRegistered && (
                <span className="ml-2 text-[10px] text-muted-foreground">(preview only)</span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function SliderRow({
  id,
  label,
  min,
  max,
  step,
  value,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
  onChange: (next: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id} className="text-xs text-muted-foreground">
          {label}
        </Label>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {value.toFixed(step < 1 ? 2 : 0)}
          {unit && ` ${unit}`}
        </span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([v]) => v !== undefined && onChange(v)}
        aria-label={label}
      />
    </div>
  );
}
