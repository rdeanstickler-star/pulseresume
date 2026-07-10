import { Link } from 'react-router';
import { ArrowRight, Eye, FileDown, ShieldCheck } from 'lucide-react';
import { GITHUB_REPO_URL } from '@/config';

export function HomePage() {
  return (
    <div className="container py-16 md:py-24">
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Privacy-first · No accounts · MIT licensed
        </p>
        <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
          Build a beautiful resume{' '}
          <span className="text-primary">that never leaves your browser.</span>
        </h1>
        <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
          Real-time editor. Six templates. PDF export. No telemetry, no accounts, no server. Your
          data stays in your localStorage, where it belongs.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/editor"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Start building
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          {GITHUB_REPO_URL && (
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              View on GitHub
            </a>
          )}
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-5xl gap-8 md:grid-cols-3">
        <FeatureCard
          icon={<Eye className="h-5 w-5" aria-hidden="true" />}
          title="Live preview"
          body="Side-by-side editor and preview. Every keystroke renders in under 120ms. See exactly what your recruiter will see."
        />
        <FeatureCard
          icon={<FileDown className="h-5 w-5" aria-hidden="true" />}
          title="ATS-friendly PDF"
          body="Text-selectable PDFs with proper heading structure. Six templates, all parseable by every applicant tracking system."
        />
        <FeatureCard
          icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
          title="No cloud, ever"
          body="Your resume is yours. localStorage only. Optional URL-fragment sharing. Self-host the whole thing if you want."
        />
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  body: string;
}

function FeatureCard({ icon, title, body }: FeatureCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </article>
  );
}
