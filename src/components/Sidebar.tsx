"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  ChevronDown,
  ChevronRight,
  Atom,
  Calculator,
  Network,
  Briefcase,
  Lightbulb,
  Monitor,
  Globe,
  Music,
  Settings,
  Plus,
} from "lucide-react";

interface NotebookItem {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

const notebookGroups: { label: string; items: NotebookItem[] }[] = [
  {
    label: "Engineering",
    items: [
      { id: "physics", name: "Physics", icon: Atom, color: "#5b6ef5" },
      {
        id: "computer-science",
        name: "Computer Science",
        icon: Monitor,
        color: "#06b6d4",
      },
      {
        id: "networking",
        name: "Networking",
        icon: Network,
        color: "#f59e0b",
      },
    ],
  },
  {
    label: "Sciences",
    items: [
      {
        id: "mathematics",
        name: "Mathematics",
        icon: Calculator,
        color: "#3db9a4",
      },
    ],
  },
  {
    label: "Other",
    items: [
      {
        id: "business-strategy",
        name: "Business Strategy",
        icon: Briefcase,
        color: "#ef4444",
      },
      {
        id: "design-thinking",
        name: "Design Thinking",
        icon: Lightbulb,
        color: "#ec4899",
      },
      {
        id: "world-history",
        name: "World History",
        icon: Globe,
        color: "#eab308",
      },
      {
        id: "music-theory",
        name: "Music Theory",
        icon: Music,
        color: "#8b5cf6",
      },
    ],
  },
];

interface SidebarProps {
  activeNotebookId?: string;
}

export default function Sidebar({ activeNotebookId }: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Engineering: true,
    Sciences: true,
    Other: true,
  });

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="w-64 bg-white border-r border-[#e5e7eb] flex flex-col h-full min-h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-[#e5e7eb]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#5b6ef5] rounded-[10px] flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-[#101828]">Cognif.ai</span>
        </Link>
      </div>

      {/* Notebooks header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#99a1af] uppercase tracking-wider">
          All Notebooks
        </span>
        <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#f7f8fa] text-[#99a1af]">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Notebook list */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {notebookGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <button
              onClick={() => toggleGroup(group.label)}
              className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-medium text-[#6a7282] hover:text-[#101828] transition-colors"
            >
              {expandedGroups[group.label] ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
              {group.label}
            </button>

            {expandedGroups[group.label] && (
              <div className="ml-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === activeNotebookId;
                  return (
                    <Link
                      key={item.id}
                      href={`/notebook/${item.id}`}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-sm transition-colors mb-0.5 ${
                        isActive
                          ? "bg-[#c7c9ff] text-[#5b6ef5] font-medium"
                          : "text-[#4a5565] hover:bg-[#f7f8fa]"
                      }`}
                    >
                      <Icon
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: isActive ? "#5b6ef5" : item.color }}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom settings */}
      <div className="p-3 border-t border-[#e5e7eb]">
        <button className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-sm text-[#6a7282] hover:bg-[#f7f8fa] w-full transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}
