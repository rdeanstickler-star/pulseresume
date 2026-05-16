import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link as LinkIcon, List, ListOrdered } from 'lucide-react';
import { useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

interface RichTextEditorProps {
  value: string;
  onChange(html: string): void;
  /** Accessible label for the editor region (screen readers). */
  ariaLabel: string;
  placeholder?: string;
  className?: string;
}

/**
 * Minimal Tiptap rich-text editor. Supports bold, italic, ordered + unordered
 * lists, and links. Emits sanitized HTML via the onChange callback.
 *
 * Debounce: built into onChange (120 ms), matching the project-wide input
 * debounce. Heavy typing won't thrash the Zustand store.
 *
 * Accessibility: toolbar buttons carry aria-pressed for current state. The
 * content area is contenteditable with `role="textbox"` and the provided
 * `ariaLabel`.
 */
export function RichTextEditor({
  value,
  onChange,
  ariaLabel,
  placeholder,
  className,
}: RichTextEditorProps) {
  const debouncedOnChange = useDebouncedCallback(onChange, 120);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': ariaLabel,
        class: cn(
          'min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          '[&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline',
        ),
      },
    },
    onUpdate({ editor: e }) {
      debouncedOnChange(e.getHTML());
    },
  });

  // Sync external value changes (e.g., when switching between section items).
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  const promptForLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL (leave empty to remove link):', prev ?? '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return <div className={cn('h-[80px] rounded-md border border-input', className)} aria-busy />;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Toolbar editor={editor} onLink={promptForLink} />
      <EditorContent editor={editor} data-placeholder={placeholder} />
    </div>
  );
}

function Toolbar({ editor, onLink }: { editor: Editor; onLink: () => void }) {
  return (
    <div role="toolbar" aria-label="Text formatting" className="flex items-center gap-1">
      <ToolbarButton
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        label="Bold"
        Icon={Bold}
      />
      <ToolbarButton
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        label="Italic"
        Icon={Italic}
      />
      <ToolbarButton
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        label="Bullet list"
        Icon={List}
      />
      <ToolbarButton
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        label="Numbered list"
        Icon={ListOrdered}
      />
      <ToolbarButton
        active={editor.isActive('link')}
        onClick={onLink}
        label="Link"
        Icon={LinkIcon}
      />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  Icon: typeof Bold;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted',
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}
