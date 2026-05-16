import type { ReactElement } from 'react';
import { pdf, type DocumentProps } from '@react-pdf/renderer';
import type { Resume } from '@/schema/resume';
import { ClassicPdfDocument } from '@/templates/classic/pdf';
import { ModernPdfDocument } from '@/templates/modern/pdf';
import { MinimalPdfDocument } from '@/templates/minimal/pdf';
import { CreativePdfDocument } from '@/templates/creative/pdf';
import { ExecutivePdfDocument } from '@/templates/executive/pdf';
import { TechnicalPdfDocument } from '@/templates/technical/pdf';

/**
 * Resolve a template + resume to the matching React-PDF document. All six
 * template families ship as of M5; the default arm catches forward-compat
 * future values and falls back to Classic.
 */
function buildDocument(resume: Resume): ReactElement<DocumentProps> {
  switch (resume.meta.template) {
    case 'modern':
      return <ModernPdfDocument resume={resume} />;
    case 'minimal':
      return <MinimalPdfDocument resume={resume} />;
    case 'creative':
      return <CreativePdfDocument resume={resume} />;
    case 'executive':
      return <ExecutivePdfDocument resume={resume} />;
    case 'technical':
      return <TechnicalPdfDocument resume={resume} />;
    case 'classic':
    default:
      return <ClassicPdfDocument resume={resume} />;
  }
}

/**
 * Produce a PDF Blob for the given resume using its declared template +
 * page size. Pure async — never throws on its own; @react-pdf surfaces
 * font / layout errors via promise rejection.
 */
export async function buildPdfBlob(resume: Resume): Promise<Blob> {
  const doc = buildDocument(resume);
  return pdf(doc).toBlob();
}

/**
 * Build a sensible filename like `avery-chen-resume.pdf`. Falls back to
 * "resume" when the name field is empty.
 */
export function buildPdfFilename(resume: Resume): string {
  const raw = resume.basics.name.trim() || 'resume';
  const slug = raw
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'resume'}-resume.pdf`;
}

/**
 * Convenience: download the resume as a PDF via a temporary <a> element.
 * Caller is the click handler on the Export button.
 */
export async function downloadResumePdf(resume: Resume): Promise<void> {
  const blob = await buildPdfBlob(resume);
  const url = URL.createObjectURL(blob);
  const filename = buildPdfFilename(resume);

  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    // Give the click handler one tick to start the download before revoking.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
