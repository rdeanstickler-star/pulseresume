import { EditorShell } from '@/components/layout/EditorShell';

/**
 * Editor page. The actual two-pane shell lives in EditorShell so it can be
 * tested in isolation. This page just mounts it.
 */
export function EditorPage() {
  return <EditorShell />;
}
