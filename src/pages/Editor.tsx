/**
 * Editor page placeholder. The real split-pane editor + live preview lands in M3.
 * For now: a friendly stub so the route resolves and tests can mount it.
 */
export function EditorPage() {
  return (
    <div className="container py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Editor</h1>
        <p className="mt-2 text-muted-foreground">
          Editor shell ships in Milestone 3. This route is a placeholder so navigation,
          routing, and layout-level concerns are testable now.
        </p>
      </header>

      <div className="grid gap-4 rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
        <p className="text-sm font-medium text-muted-foreground">Editor coming in M3</p>
        <p className="text-xs text-muted-foreground/80">
          Split-pane editor, live preview, theme system, and rich text foundation arrive next.
        </p>
      </div>
    </div>
  );
}
