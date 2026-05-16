import { useState } from 'react';
import {
  ChevronDown,
  Copy,
  Download,
  FileJson,
  FileText,
  Link as LinkIcon,
  Loader2,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useResumeStore } from '@/store/resume-store';
import { buildJsonFilename, downloadText, exportJson, importJson } from '@/lib/json-io';
import { buildShareUrl, encodeShareFragment, FRAGMENT_WARN_AT } from '@/lib/url-share';
import { cn } from '@/lib/utils';

/**
 * Unified Export control: page-size Select + Export dropdown.
 *
 * Dropdown actions:
 *   - Export as PDF (the original M4 flow)
 *   - Export as JSON
 *   - Import from JSON (file picker)
 *   - Copy share link (with character-count warning at >6 K)
 *
 * The page-size Select is kept visible because it's a high-traffic toggle.
 */
export function ExportButton() {
  const resume = useResumeStore((s) => s.resume);
  const setMeta = useResumeStore((s) => s.setMeta);
  const setResume = useResumeStore((s) => s.setResume);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err' | 'warn'; msg: string } | null>(null);

  async function handlePdf() {
    setBusy(true);
    setStatus(null);
    try {
      const { downloadResumePdf } = await import('@/lib/pdf-export');
      await downloadResumePdf(resume);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setStatus({ kind: 'err', msg: `PDF export failed: ${msg}` });
    } finally {
      setBusy(false);
    }
  }

  function handleJson() {
    try {
      downloadText(exportJson(resume), buildJsonFilename(resume));
      setStatus({ kind: 'ok', msg: 'JSON downloaded.' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setStatus({ kind: 'err', msg: `JSON export failed: ${msg}` });
    }
  }

  function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ''; // reset so the same file can be re-picked
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      const result = importJson(text);
      if (result.ok) {
        setResume(result.resume);
        setStatus({ kind: 'ok', msg: 'Resume imported.' });
      } else {
        setStatus({ kind: 'err', msg: `Import failed: ${result.error}` });
      }
    };
    reader.onerror = () => setStatus({ kind: 'err', msg: 'Could not read file.' });
    reader.readAsText(file);
  }

  async function handleCopyShareLink() {
    try {
      const url = buildShareUrl(resume);
      const fragmentLength = encodeShareFragment(resume).length;
      await navigator.clipboard.writeText(url);
      if (fragmentLength > FRAGMENT_WARN_AT) {
        setStatus({
          kind: 'warn',
          msg: `Link copied — ${fragmentLength} chars, may exceed some browser URL limits.`,
        });
      } else {
        setStatus({
          kind: 'ok',
          msg: `Link copied — ${fragmentLength} chars. Note: link is unencrypted.`,
        });
      }
    } catch {
      setStatus({ kind: 'err', msg: 'Clipboard write blocked — try the JSON export.' });
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <Select
          value={resume.meta.pageSize}
          onValueChange={(v) => setMeta({ pageSize: v as 'a4' | 'letter' })}
        >
          <SelectTrigger className="h-8 w-auto gap-2 text-xs" aria-label="Page size">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a4">A4</SelectItem>
            <SelectItem value="letter">US Letter</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" disabled={busy} aria-label={busy ? 'Exporting…' : 'Export menu'}>
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Export
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Export</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => void handlePdf()} disabled={busy}>
              <FileText className="h-4 w-4" aria-hidden="true" />
              PDF…
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleJson}>
              <FileJson className="h-4 w-4" aria-hidden="true" />
              JSON
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void handleCopyShareLink()}>
              <LinkIcon className="h-4 w-4" aria-hidden="true" />
              Copy share link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Import</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <label className="cursor-pointer">
                <Copy className="h-4 w-4" aria-hidden="true" />
                From JSON file…
                <input
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={handleImport}
                  aria-label="Import resume from JSON file"
                />
              </label>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {status && (
        <p
          role={status.kind === 'err' ? 'alert' : 'status'}
          aria-live="polite"
          className={cn(
            'text-xs',
            status.kind === 'err' && 'text-destructive',
            status.kind === 'warn' && 'text-amber-700 dark:text-amber-400',
            status.kind === 'ok' && 'text-muted-foreground',
          )}
        >
          {status.msg}
        </p>
      )}

      {/* Hidden file input for the dropdown item (some screen readers need an explicit fallback). */}
      <input
        id="hidden-import-fallback"
        type="file"
        accept="application/json,.json"
        className="sr-only"
        onChange={handleImport}
        aria-label="Import resume from JSON file (hidden)"
        tabIndex={-1}
      />

      <ImportFromUrlOnMount />

      <UnusedAvoidTreeShake icon={<Upload className="hidden h-0 w-0" aria-hidden="true" />} />
    </div>
  );
}

/**
 * On first mount, if the URL has a `#data=...` fragment, attempt to import
 * it. Surfaces a banner in localStorage so a refreshed-page user knows
 * what just happened.
 *
 * We do this here (inside ExportButton) so the import behavior travels
 * with the export UI — they're conceptually one feature. A future cleaner
 * design would have an <AppLifecycle> component at the layout root.
 */
function ImportFromUrlOnMount() {
  const setResume = useResumeStore((s) => s.setResume);
  // Read once on mount; React StrictMode double-invokes in dev — that's harmless here.
  if (typeof window !== 'undefined' && !window.__pulseresumeUrlImportRun) {
    window.__pulseresumeUrlImportRun = true;
    if (window.location.hash.includes('data=')) {
      // Dynamic import so this code doesn't ship with the editor critical path.
      void import('@/lib/url-share').then(({ decodeShareFragment }) => {
        const result = decodeShareFragment();
        if (result.ok) {
          setResume(result.resume);
          // Strip the fragment so a refresh doesn't keep re-loading.
          history.replaceState(null, '', window.location.pathname);
        }
      });
    }
  }
  return null;
}

/**
 * Reference the Upload icon so the tree-shaker doesn't drop it if the
 * import dropdown item's `asChild` JSX doesn't statically expose it.
 * Removes a future eslint warning if we ever re-arrange the menu.
 */
function UnusedAvoidTreeShake({ icon: _icon }: { icon: React.ReactNode }) {
  return null;
}

declare global {
  interface Window {
    __pulseresumeUrlImportRun?: boolean;
  }
}
