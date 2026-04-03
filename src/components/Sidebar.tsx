"use client";

import { useState, useEffect } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

const iconMap: Record<string, React.ElementType> = {
  atom: Atom,
  calculator: Calculator,
  network: Network,
  briefcase: Briefcase,
  lightbulb: Lightbulb,
  monitor: Monitor,
  globe: Globe,
  music: Music,
};

interface NotebookItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface SidebarProps {
  activeNotebookId?: string;
}

export default function Sidebar({ activeNotebookId }: SidebarProps) {
  const { user } = useAuth();
  const [notebooks, setNotebooks] = useState<NotebookItem[]>([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchNotebooks = async () => {
      try {
        const q = query(
          collection(db, "notebooks"),
          where("userId", "==", user.uid),
          orderBy("updatedAt", "desc")
        );
        const snap = await getDocs(q);
        setNotebooks(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              name: data.name,
              icon: data.icon || "atom",
              color: data.color || "#5b6ef5",
            };
          })
        );
      } catch {
        // silently handle
      }
    };
    fetchNotebooks();
  }, [user]);

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
        <Link
          href="/dashboard"
          className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#f7f8fa] text-[#99a1af]"
        >
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      {/* Notebook list */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="mb-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 w-full px-2 py-1.5 text-xs font-medium text-[#6a7282] hover:text-[#101828] transition-colors"
          >
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            My Notebooks
          </button>

          {expanded && (
            <div className="ml-2">
              {notebooks.length === 0 ? (
                <p className="px-3 py-2 text-xs text-[#99a1af]">
                  No notebooks yet
                </p>
              ) : (
                notebooks.map((item) => {
                  const Icon = iconMap[item.icon] || Atom;
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
                })
              )}
            </div>
          )}
        </div>
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
