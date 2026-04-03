"use client";

import { use } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Search,
  Plus,
  FileText,
  Clock,
  Sparkles,
  Download,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import NoteEditor from "@/components/NoteEditor";
import IgnitePanel from "@/components/IgnitePanel";

const pages = [
  {
    id: "page-1",
    name: "Newton's Second Law",
    lastEdited: "2 hours ago",
  },
  {
    id: "page-2",
    name: "Free Body Diagrams",
    lastEdited: "5 hours ago",
  },
  {
    id: "page-3",
    name: "Friction & Normal Force",
    lastEdited: "1 day ago",
  },
  {
    id: "page-4",
    name: "Circular Motion",
    lastEdited: "2 days ago",
  },
  {
    id: "page-5",
    name: "Work-Energy Theorem",
    lastEdited: "3 days ago",
  },
  {
    id: "page-6",
    name: "Conservation of Momentum",
    lastEdited: "1 week ago",
  },
  {
    id: "page-7",
    name: "Rotational Dynamics",
    lastEdited: "1 week ago",
  },
  {
    id: "page-8",
    name: "Gravitation",
    lastEdited: "2 weeks ago",
  },
];

export default function NoteEditorPage({
  params,
}: {
  params: Promise<{ id: string; sectionId: string; pageId: string }>;
}) {
  const { id, sectionId, pageId } = use(params);

  const sectionName = sectionId
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const notebookName = id
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex h-screen bg-[#f7f8fa] overflow-hidden">
      {/* Left Sidebar - Notebook Navigation */}
      <Sidebar activeNotebookId={id} />

      {/* Page List Sidebar */}
      <div className="w-60 bg-white border-r border-[#e5e7eb] flex flex-col">
        {/* Section header */}
        <div className="p-3 border-b border-[#e5e7eb]">
          <div className="flex items-center gap-1 text-xs text-[#99a1af] mb-2">
            <Link
              href={`/notebook/${id}`}
              className="hover:text-[#5b6ef5] transition-colors"
            >
              {notebookName}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#6a7282]">{sectionName}</span>
          </div>
          <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#f7f8fa] hover:bg-[#eff6ff] border border-[#e5e7eb] rounded-[10px] text-sm text-[#6a7282] hover:text-[#5b6ef5] transition-colors">
            <Plus className="w-3.5 h-3.5" />
            New Page
          </button>
        </div>

        {/* Page list */}
        <nav className="flex-1 overflow-y-auto p-2">
          {pages.map((page) => {
            const isActive = page.id === pageId;
            return (
              <Link
                key={page.id}
                href={`/notebook/${id}/${sectionId}/${page.id}`}
                className={`flex items-start gap-2 px-3 py-2.5 rounded-[10px] mb-0.5 transition-colors ${
                  isActive
                    ? "bg-[#c7c9ff] text-[#5b6ef5]"
                    : "text-[#4a5565] hover:bg-[#f7f8fa]"
                }`}
              >
                <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p
                    className={`text-sm truncate ${isActive ? "font-medium" : ""}`}
                  >
                    {page.name}
                  </p>
                  <p className="text-xs text-[#99a1af] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {page.lastEdited}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Center - Editor Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[#e5e7eb] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#6a7282]">
            <Link
              href="/dashboard"
              className="hover:text-[#5b6ef5] transition-colors"
            >
              Cognif.ai
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/notebook/${id}`}
              className="hover:text-[#5b6ef5] transition-colors"
            >
              {notebookName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#101828] font-medium">{sectionName}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99a1af]" />
              <input
                type="text"
                placeholder="Search in note..."
                className="pl-9 pr-4 py-1.5 w-48 border border-[#e5e7eb] rounded-[10px] text-sm text-[#101828] placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-[#5b6ef5]/30 focus:border-[#5b6ef5]"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#5b6ef5] flex items-center justify-center text-white text-xs font-semibold">
              SC
            </div>
          </div>
        </header>

        {/* Editor with bottom bar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <NoteEditor />

          {/* Bottom stats bar */}
          <div className="bg-white border-t border-[#e5e7eb] px-6 py-2 flex items-center justify-between text-xs text-[#99a1af]">
            <div className="flex items-center gap-4">
              <span>1,247 words</span>
              <span>Last saved 2 min ago</span>
            </div>
            <div className="flex items-center gap-2">
              {[
                {
                  icon: Sparkles,
                  label: "Generate practice problems",
                },
                { icon: BookOpen, label: "Create flashcards" },
                { icon: Download, label: "Export as PDF" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    title={action.label}
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#f7f8fa] hover:text-[#5b6ef5] transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden 2xl:inline">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right - Ignite Panel */}
      <div className="hidden xl:flex">
        <IgnitePanel />
      </div>
    </div>
  );
}
