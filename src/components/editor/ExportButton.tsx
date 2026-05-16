import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useResumeStore } from '@/store/resume-store';
import type { Meta } from '@/schema/resume';

/**
 * "Export PDF" control. Page size picker + the button that triggers the
 * download. The actual @react-pdf work is imported dynamically on click so
 * the ~500KB renderer chunk doesn't ship with the initial bundle — users
 * who never export never pay for it.
 */
export function ExportButton() {
  const resume = useResumeStore((s) => s.resume);
  const setMeta = useResumeStore((s) => s.setMeta);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onExport() {
    setBusy(true);
    setError(null);
    try {
      const { downloadResumePdf } = await import('@/lib/pdf-export');
      await downloadResumePdf(resume);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'PDF export failed';
      setError(msg);
      console.error('PulseResume: PDF export failed', e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={resume.meta.pageSize}
        onValueChange={(v) => setMeta({ pageSize: v as Meta['pageSize'] })}
      >
        <SelectTrigger className="h-8 w-auto gap-2 text-xs" aria-label="Page size">
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a4">A4</SelectItem>
          <SelectItem value="letter">US Letter</SelectItem>
        </SelectContent>
      </Select>

      <Button
        size="sm"
        onClick={onExport}
        disabled={busy}
        aria-busy={busy}
        aria-label="Export resume as PDF"
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {busy ? 'Building…' : 'Export PDF'}
      </Button>

      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
