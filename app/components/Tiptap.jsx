import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, AlignJustify, Highlighter, Pilcrow } from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const buttons = [
    { action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), icon: <Heading1 size={18} />, active: editor.isActive('heading', { level: 1 }) },
    { action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), icon: <Heading2 size={18} />, active: editor.isActive('heading', { level: 2 }) },
    { action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), icon: <Heading3 size={18} />, active: editor.isActive('heading', { level: 3 }) },
    { action: () => editor.chain().focus().setParagraph().run(), icon: <Pilcrow size={18} />, active: editor.isActive('paragraph') },
    { action: () => editor.chain().focus().toggleBold().run(), icon: <Bold size={18} />, active: editor.isActive('bold') },
    { action: () => editor.chain().focus().toggleItalic().run(), icon: <Italic size={18} />, active: editor.isActive('italic') },
    { action: () => editor.chain().focus().toggleStrike().run(), icon: <Strikethrough size={18} />, active: editor.isActive('strike') },
    { action: () => editor.chain().focus().toggleHighlight().run(), icon: <Highlighter size={18} />, active: editor.isActive('highlight') },
    { action: () => editor.chain().focus().setTextAlign('left').run(), icon: <AlignLeft size={18} />, active: editor.isActive({ textAlign: 'left' }) },
    { action: () => editor.chain().focus().setTextAlign('center').run(), icon: <AlignCenter size={18} />, active: editor.isActive({ textAlign: 'center' }) },
    { action: () => editor.chain().focus().setTextAlign('right').run(), icon: <AlignRight size={18} />, active: editor.isActive({ textAlign: 'right' }) },
    { action: () => editor.chain().focus().setTextAlign('justify').run(), icon: <AlignJustify size={18} />, active: editor.isActive({ textAlign: 'justify' }) },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-md shadow-sm">
      {buttons.map((btn, index) => (
        <button
          key={index}
          onClick={btn.action}
          className={`p-2 rounded-md border flex items-center justify-center ${btn.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
};

const TiptapEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: content || '<p>Start writing...</p>',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="max-w-2xl mx-auto p-4  bg-white">
      <MenuBar editor={editor} />
      <div className="mt-4 min-h-[200px] bg-transparent p-2 text-gray-900 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
