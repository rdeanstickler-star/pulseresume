import { useResumeStore } from '@/store/resume-store';
import { defaultSectionName } from '@/store/resume-store';

/**
 * Preview placeholder used in M3 until M4 ships the Classic template's dual
 * HTML+PDF renderer. Shows a faithful preview of basics + section names so
 * users can see real-time edits flowing into the document, even before any
 * template visuals exist.
 *
 * Renders inside the right pane of the editor. Plain HTML, no PDF primitives.
 */
export function TemplatePlaceholder() {
  const resume = useResumeStore((s) => s.resume);
  const { basics } = resume;

  return (
    <article
      aria-label="Resume preview"
      className="mx-auto max-w-[8.5in] rounded-md border border-border bg-card p-6 text-sm shadow-sm md:p-10"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <header className="mb-6 border-b border-border pb-4">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {basics.name || <span className="text-muted-foreground">Your name</span>}
        </h1>
        {basics.headline && (
          <p className="mt-1 text-base text-muted-foreground">{basics.headline}</p>
        )}
        <ul
          className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"
          aria-label="Contact details"
        >
          {basics.email && <li>{basics.email}</li>}
          {basics.phone && <li>{basics.phone}</li>}
          {basics.url && <li>{basics.url}</li>}
          {[basics.location.city, basics.location.region, basics.location.countryCode]
            .filter(Boolean)
            .map((part) => (
              <li key={part}>{part}</li>
            ))}
        </ul>
        {basics.summary && (
          <p className="mt-4 text-sm leading-relaxed text-foreground/90">{basics.summary}</p>
        )}
      </header>

      {resume.sections.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Add a section from the editor to see it here.
        </p>
      ) : (
        <ol className="space-y-5">
          {resume.sections
            .filter((s) => s.visible)
            .map((section) => (
              <li key={section.id}>
                <h2 className="border-b border-border pb-1 text-sm font-semibold uppercase tracking-wider text-foreground">
                  {section.name || defaultSectionName(section.type)}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  {section.items.length} item{section.items.length === 1 ? '' : 's'} ·{' '}
                  <span className="font-mono">{section.type}</span>
                </p>
                {section.items.length === 0 && (
                  <p className="mt-1 text-xs italic text-muted-foreground/70">
                    Empty section — add items in the editor.
                  </p>
                )}
              </li>
            ))}
        </ol>
      )}

      <footer className="mt-8 border-t border-dashed border-border pt-3 text-center text-xs text-muted-foreground">
        M3 placeholder · The Classic template ships in M4 with real HTML + PDF rendering.
      </footer>
    </article>
  );
}
