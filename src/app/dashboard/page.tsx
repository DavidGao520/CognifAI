"use client";

import Link from "next/link";
import {
  Brain,
  Search,
  Plus,
  Sparkles,
  Atom,
  Calculator,
  Network,
  Briefcase,
  Lightbulb,
  Monitor,
  Globe,
  Music,
} from "lucide-react";

const notebooks = [
  {
    id: "physics",
    name: "Physics",
    icon: Atom,
    color: "#5b6ef5",
    bgColor: "#eff6ff",
    sections: 4,
    pages: 23,
    lastEdited: "2 hours ago",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    icon: Calculator,
    color: "#3db9a4",
    bgColor: "#ecfdf5",
    sections: 6,
    pages: 31,
    lastEdited: "5 hours ago",
  },
  {
    id: "networking",
    name: "Networking",
    icon: Network,
    color: "#f59e0b",
    bgColor: "#fefce8",
    sections: 3,
    pages: 15,
    lastEdited: "1 day ago",
  },
  {
    id: "business-strategy",
    name: "Business Strategy",
    icon: Briefcase,
    color: "#ef4444",
    bgColor: "#fef2f2",
    sections: 5,
    pages: 19,
    lastEdited: "2 days ago",
  },
  {
    id: "design-thinking",
    name: "Design Thinking",
    icon: Lightbulb,
    color: "#ec4899",
    bgColor: "#fdf2f8",
    sections: 4,
    pages: 12,
    lastEdited: "3 days ago",
  },
  {
    id: "computer-science",
    name: "Computer Science",
    icon: Monitor,
    color: "#06b6d4",
    bgColor: "#ecfeff",
    sections: 7,
    pages: 42,
    lastEdited: "4 days ago",
  },
  {
    id: "world-history",
    name: "World History",
    icon: Globe,
    color: "#eab308",
    bgColor: "#fefce8",
    sections: 5,
    pages: 28,
    lastEdited: "1 week ago",
  },
  {
    id: "music-theory",
    name: "Music Theory",
    icon: Music,
    color: "#8b5cf6",
    bgColor: "#faf5ff",
    sections: 3,
    pages: 9,
    lastEdited: "1 week ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e7eb] px-6 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#5b6ef5] rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#101828]">Cognif.ai</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#99a1af]" />
              <input
                type="text"
                placeholder="Search notebooks..."
                className="pl-10 pr-4 py-2 w-64 border border-[#e5e7eb] rounded-[10px] text-sm text-[#101828] placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-[#5b6ef5]/30 focus:border-[#5b6ef5]"
              />
            </div>
            <div className="w-9 h-9 rounded-full bg-[#5b6ef5] flex items-center justify-center text-white text-sm font-semibold">
              SC
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#101828] mb-1">
            Welcome back, Johnny!
          </h1>
          <p className="text-[#6a7282]">
            Select a notebook to continue, or create a new one.
          </p>
        </div>

        {/* Create New Notebook Banner */}
        <Link href="#" className="block mb-8">
          <div className="bg-gradient-to-r from-[#5b6ef5] to-[#3db9a4] rounded-[10px] p-6 flex items-center justify-between text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-[10px] flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Create New Notebook</h2>
                <p className="text-white/80 text-sm">
                  Start a new subject or topic from scratch
                </p>
              </div>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
          </div>
        </Link>

        {/* Notebook Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {notebooks.map((notebook) => {
            const Icon = notebook.icon;
            return (
              <Link
                key={notebook.id}
                href={`/notebook/${notebook.id}`}
                className="bg-white rounded-[10px] border border-[#e5e7eb] p-5 hover:shadow-md hover:border-[#5b6ef5]/30 transition-all group"
              >
                <div
                  className="w-11 h-11 rounded-[10px] flex items-center justify-center mb-4"
                  style={{ backgroundColor: notebook.bgColor }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: notebook.color }}
                  />
                </div>
                <h3 className="font-semibold text-[#101828] mb-1 group-hover:text-[#5b6ef5] transition-colors">
                  {notebook.name}
                </h3>
                <p className="text-xs text-[#6a7282] mb-2">
                  {notebook.sections} sections &bull; {notebook.pages} pages
                </p>
                <p className="text-xs text-[#99a1af]">
                  Last edited {notebook.lastEdited}
                </p>
              </Link>
            );
          })}
        </div>

        {/* AI Insight Banner */}
        <div className="bg-white rounded-[10px] border border-[#e5e7eb] p-5 flex items-start gap-4 border-l-4 border-l-[#3db9a4]">
          <div className="w-10 h-10 bg-[#ecfdf5] rounded-[10px] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#3db9a4]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#101828] mb-1">AI Insight</h3>
            <p className="text-sm text-[#6a7282]">
              Your Physics notes on Thermodynamics have 3 unverified formulas.
              Would you like Cognif.ai to verify them against trusted sources?
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
