"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import to avoid SSR issues with ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-40 w-full bg-muted animate-pulse rounded-md" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']                                         // remove formatting button
    ],
  }), []);

  return (
    <div className={`prose-editor ${className}`}>
      <style jsx global>{`
        .ql-container {
          min-height: 150px;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          font-family: inherit;
        }
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: transparent;
        }
        .prose-editor .ql-toolbar.ql-snow {
          border-color: hsl(var(--input));
          border-top-left-radius: calc(var(--radius) - 2px);
          border-top-right-radius: calc(var(--radius) - 2px);
        }
        .prose-editor .ql-container.ql-snow {
          border-color: hsl(var(--input));
          border-bottom-left-radius: calc(var(--radius) - 2px);
          border-bottom-right-radius: calc(var(--radius) - 2px);
        }
        
        /* Focus state simulation */
        .prose-editor:focus-within .ql-toolbar.ql-snow,
        .prose-editor:focus-within .ql-container.ql-snow {
          border-color: hsl(var(--ring));
        }
        .prose-editor:focus-within {
          border-radius: calc(var(--radius) - 2px);
          outline: 2px solid transparent;
          outline-offset: 2px;
          /!* ring-2 ring-ring ring-offset-2 *!/
          box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring));
        }
        
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        className="rounded-md"
      />
    </div>
  );
}
