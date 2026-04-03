"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  List,
  Image,
  Heading1,
  Heading2,
  Code,
  Link2,
} from "lucide-react";
import { database } from "@/lib/firebase";
import { ref, update } from "firebase/database";
import { useAuth } from "@/context/AuthContext";

interface NoteEditorProps {
  pageId: string;
  notebookId: string;
  sectionId: string;
  initialContent: string;
  initialTitle: string;
  onContentChange?: (content: string) => void;
  onSaveStatusChange?: (status: string) => void;
}

export default function NoteEditor({
  pageId,
  notebookId,
  sectionId,
  initialContent,
  initialTitle,
  onContentChange,
  onSaveStatusChange,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef({ title: initialTitle, content: initialContent });
  const { user } = useAuth();

  // Sync when props change (switching pages)
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    lastSavedRef.current = { title: initialTitle, content: initialContent };
  }, [initialTitle, initialContent, pageId]);

  const saveToDatabase = useCallback(
    async (newTitle: string, newContent: string) => {
      // Don't save if nothing changed
      if (
        newTitle === lastSavedRef.current.title &&
        newContent === lastSavedRef.current.content
      ) {
        return;
      }

      if (!user) return;

      onSaveStatusChange?.("Saving...");
      try {
        const wc = newContent.trim()
          ? newContent.trim().split(/\s+/).length
          : 0;
        const pagePath = `users/${user.uid}/notebooks/${notebookId}/sections/${sectionId}/pages/${pageId}`;
        await update(ref(database, pagePath), {
          title: newTitle,
          content: newContent,
          wordCount: wc,
          updatedAt: new Date().toISOString(),
        });
        lastSavedRef.current = { title: newTitle, content: newContent };
        onSaveStatusChange?.("Saved");
      } catch {
        onSaveStatusChange?.("Error saving");
      }
    },
    [pageId, notebookId, sectionId, onSaveStatusChange, user]
  );

  const debounceSave = useCallback(
    (newTitle: string, newContent: string) => {
      onSaveStatusChange?.("Unsaved changes...");
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveToDatabase(newTitle, newContent);
      }, 1000);
    },
    [saveToDatabase, onSaveStatusChange]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debounceSave(newTitle, content);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onContentChange?.(newContent);
    debounceSave(title, newContent);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="border-b border-[#e5e7eb] px-6 py-2 flex items-center gap-1">
        {[
          { icon: Bold, label: "Bold" },
          { icon: Italic, label: "Italic" },
          { icon: Heading1, label: "Heading 1" },
          { icon: Heading2, label: "Heading 2" },
          { icon: List, label: "List" },
          { icon: Code, label: "Code" },
          { icon: Link2, label: "Link" },
          { icon: Image, label: "Image" },
        ].map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.label}
              title={tool.label}
              className="p-2 rounded-lg hover:bg-[#f7f8fa] text-[#6a7282] hover:text-[#101828] transition-colors"
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled"
          className="text-3xl font-bold text-[#101828] mb-2 outline-none w-full bg-transparent"
        />
        <p className="text-sm text-[#99a1af] mb-6">
          {notebookId && sectionId ? `Editing in this section` : ""}
        </p>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start typing your notes here...

Use bullet points with - or * at the start of a line.
Write formulas like F = m x a.
The AI panel on the right can restructure, elaborate, verify, and generate questions from your content."
          className="w-full min-h-[400px] text-[#4a5565] leading-relaxed outline-none resize-none bg-transparent text-sm"
          style={{ fontFamily: "inherit" }}
        />
      </div>
    </div>
  );
}
