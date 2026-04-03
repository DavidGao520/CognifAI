"use client";

import { use } from "react";
import Link from "next/link";
import {
  Brain,
  Search,
  ChevronRight,
  Plus,
  Sparkles,
  Clock,
  FileText,
  Layers,
  Calendar,
  BarChart3,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

const notebookData: Record<
  string,
  {
    name: string;
    description: string;
    sections: {
      id: string;
      name: string;
      description: string;
      pages: number;
      lastEdited: string;
    }[];
  }
> = {
  physics: {
    name: "Physics",
    description: "Classical mechanics, thermodynamics, waves, and modern physics",
    sections: [
      {
        id: "mechanics",
        name: "Mechanics",
        description:
          "Newton's laws, kinematics, dynamics, energy, and momentum",
        pages: 8,
        lastEdited: "2 hours ago",
      },
      {
        id: "thermodynamics",
        name: "Thermodynamics",
        description: "Heat, work, entropy, and the laws of thermodynamics",
        pages: 6,
        lastEdited: "1 day ago",
      },
      {
        id: "waves-optics",
        name: "Waves & Optics",
        description:
          "Wave mechanics, interference, diffraction, and optical instruments",
        pages: 5,
        lastEdited: "3 days ago",
      },
      {
        id: "modern-physics",
        name: "Modern Physics",
        description:
          "Quantum mechanics, relativity, atomic and nuclear physics",
        pages: 4,
        lastEdited: "1 week ago",
      },
    ],
  },
};

// Fallback for other notebook IDs
const defaultNotebook = {
  name: "Notebook",
  description: "Your notes and sections",
  sections: [
    {
      id: "section-1",
      name: "Section 1",
      description: "Getting started with this topic",
      pages: 3,
      lastEdited: "Recently",
    },
  ],
};

export default function NotebookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const notebook = notebookData[id] || {
    ...defaultNotebook,
    name: id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };
  const totalPages = notebook.sections.reduce((sum, s) => sum + s.pages, 0);

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      {/* Left Sidebar */}
      <Sidebar activeNotebookId={id} />

      {/* Center Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-[#e5e7eb] px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#6a7282]">
              <Link
                href="/dashboard"
                className="hover:text-[#5b6ef5] transition-colors"
              >
                Cognif.ai
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href="/dashboard"
                className="hover:text-[#5b6ef5] transition-colors"
              >
                Notebooks
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#101828] font-medium">
                {notebook.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99a1af]" />
                <input
                  type="text"
                  placeholder="Search sections..."
                  className="pl-9 pr-4 py-1.5 w-52 border border-[#e5e7eb] rounded-[10px] text-sm text-[#101828] placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-[#5b6ef5]/30 focus:border-[#5b6ef5]"
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#5b6ef5] flex items-center justify-center text-white text-xs font-semibold">
                SC
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Notebook header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#101828] mb-1">
              {notebook.name}
            </h1>
            <p className="text-[#6a7282] text-sm">{notebook.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-[#99a1af]">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                {notebook.sections.length} sections
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {totalPages} pages
              </span>
            </div>
          </div>

          {/* Add Section Button */}
          <button className="w-full mb-6 bg-gradient-to-r from-[#5b6ef5] to-[#3db9a4] text-white rounded-[10px] py-3 px-4 flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md transition-shadow">
            <Plus className="w-4 h-4" />
            Add New Section
          </button>

          {/* Sections List */}
          <div className="space-y-3">
            {notebook.sections.map((section) => (
              <Link
                key={section.id}
                href={`/notebook/${id}/${section.id}/page-1`}
                className="block bg-white rounded-[10px] border border-[#e5e7eb] p-4 hover:shadow-md hover:border-[#5b6ef5]/30 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#101828] mb-1 group-hover:text-[#5b6ef5] transition-colors">
                      {section.name}
                    </h3>
                    <p className="text-sm text-[#6a7282] mb-2">
                      {section.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[#99a1af]">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {section.pages} pages
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {section.lastEdited}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#99a1af] group-hover:text-[#5b6ef5] transition-colors mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      {/* Right Info Panel */}
      <div className="w-80 bg-white border-l border-[#e5e7eb] p-4 overflow-y-auto hidden xl:block">
        <h2 className="font-bold text-[#101828] mb-4">Notebook Info</h2>

        {/* Recent Activity */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-[#99a1af] uppercase tracking-wider mb-3">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              {
                text: 'Edited "Newton\'s Second Law"',
                time: "2 hours ago",
              },
              {
                text: "Added new page to Mechanics",
                time: "5 hours ago",
              },
              {
                text: "AI verified 3 formulas",
                time: "1 day ago",
              },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#5b6ef5] rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#364153]">{activity.text}</p>
                  <p className="text-xs text-[#99a1af]">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-[#99a1af] uppercase tracking-wider mb-3">
            Statistics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Total Pages",
                value: totalPages.toString(),
                icon: FileText,
              },
              {
                label: "Total Sections",
                value: notebook.sections.length.toString(),
                icon: Layers,
              },
              {
                label: "Created",
                value: "Jan 15",
                icon: Calendar,
              },
              {
                label: "Word Count",
                value: "12,450",
                icon: BarChart3,
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-[#f7f8fa] rounded-[10px] p-3"
                >
                  <Icon className="w-4 h-4 text-[#99a1af] mb-1" />
                  <p className="text-lg font-bold text-[#101828]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#99a1af]">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="bg-[#faf5ff] rounded-[10px] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#5b6ef5]" />
            <h3 className="text-sm font-semibold text-[#101828]">
              AI Suggestion
            </h3>
          </div>
          <p className="text-xs text-[#6a7282]">
            Your Thermodynamics section could benefit from more worked examples.
            Would you like AI to generate practice problems?
          </p>
        </div>
      </div>
    </div>
  );
}
