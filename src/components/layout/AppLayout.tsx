import { Link, Outlet, useLocation } from 'react-router';
import { FileText, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeProvider } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';

export function AppLayout() {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor');

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>

        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="PulseResume home"
            >
              <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
              <span>PulseResume</span>
            </Link>

            <nav className="flex items-center gap-2" aria-label="Primary">
              <Link
                to="/editor"
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isEditor
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                Editor
              </Link>
              <ThemeToggle />
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="View source on GitHub (opens in new tab)"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </a>
            </nav>
          </div>
        </header>

        <main id="main" className="flex-1">
          <Outlet />
        </main>

        <footer className="border-t border-border bg-muted/30">
          <div className="container flex h-12 items-center justify-between text-xs text-muted-foreground">
            <p>PulseResume — MIT licensed. Your resume data never leaves your browser.</p>
            <p>v0.1.0</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
