import type { ReactElement } from 'react';
import { pdf, type DocumentProps } from '@react-pdf/renderer';
import type { Resume } from '@/schema/resume';
import { ClassicPdfDocument } from '@/templates/classic/pdf';

/**
 * Resolve a template + resume to the matching React-PDF document. Currently
 * only Classic exists; M5 adds Modern / Minimal / Creative / Executive /
 * Technical, each as its own `<TemplatePdfDocument>` component.
 */
function buildDocument(resume: Resume): ReactElement<DocumentProps> {
  switch (resume.meta.template) {
    case 'classic':
    case 'modern':
    case 'minimal':
    case 'creative':
    case 'executive':
    case 'technical':
      // Until M5 ships the other five, every template falls back to Classic
      // so export always produces something. Once each template gains its
      // own PDF document, swap this in.
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
