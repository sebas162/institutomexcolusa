"use client";

import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Table2,
  Palette,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return {
          bold: false,
          italic: false,
          heading2: false,
          heading3: false,
          bulletList: false,
          orderedList: false,
          link: false,
        };
      }

      return {
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        heading2: editor.isActive("heading", { level: 2 }),
        heading3: editor.isActive("heading", { level: 3 }),
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
        link: editor.isActive("link"),
      };
    },
  });

  if (!editor) {
    return null;
  }

  const activeState = editorState ?? {
    bold: false,
    italic: false,
    heading2: false,
    heading3: false,
    bulletList: false,
    orderedList: false,
    link: false,
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const toolbarGroups = [
    [
      {
        icon: Bold,
        label: "Bold",
        isActive: activeState.bold,
        onClick: () => editor.chain().focus().toggleBold().run(),
      },
      {
        icon: Italic,
        label: "Italic",
        isActive: activeState.italic,
        onClick: () => editor.chain().focus().toggleItalic().run(),
      },
    ],
    [
      {
        icon: Heading2,
        label: "Heading 2",
        isActive: activeState.heading2,
        onClick: () =>
          editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        icon: Heading3,
        label: "Heading 3",
        isActive: activeState.heading3,
        onClick: () =>
          editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
    ],
    [
      {
        icon: List,
        label: "Bullet list",
        isActive: activeState.bulletList,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        icon: ListOrdered,
        label: "Ordered list",
        isActive: activeState.orderedList,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
      },
    ],
    [
      {
        icon: Link2,
        label: "Link",
        isActive: activeState.link,
        onClick: setLink,
      },
      {
        icon: Table2,
        label: "Table",
        isActive: false,
        onClick: insertTable,
      },
    ],
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1 border rounded-md p-1">
        {toolbarGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="flex items-center gap-1">
            {group.map(({ icon: Icon, label, isActive, onClick }) => (
              <Button
                key={label}
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "shrink-0 transition-colors",
                  isActive
                    ? "bg-slate-800 [&_svg]:text-white"
                    : "hover:bg-accent"
                )}
                onClick={onClick}
                aria-label={label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
            {groupIndex === 0 && (
              <div className="relative shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 transition-colors hover:bg-accent"
                  aria-label="Text color"
                  tabIndex={-1}
                >
                  <Palette className="h-4 w-4" />
                </Button>
                <input
                  type="color"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) =>
                    editor.chain().focus().setColor(e.target.value).run()
                  }
                  aria-label="Text color"
                />
              </div>
            )}
            {groupIndex < toolbarGroups.length - 1 && (
              <div className="w-px h-6 bg-border mx-1" />
            )}
          </div>
        ))}
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-lg max-w-none border rounded-md p-4 min-h-[300px] [&_ul]:marker:text-black [&_ol]:marker:text-black"
      />
    </div>
  );
}
