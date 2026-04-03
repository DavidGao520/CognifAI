"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  Loader2,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { database } from "@/lib/firebase";
import { ref, get, push, set } from "firebase/database";

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

const colorOptions = [
  { color: "#5b6ef5", bgColor: "#eff6ff" },
  { color: "#3db9a4", bgColor: "#ecfdf5" },
  { color: "#f59e0b", bgColor: "#fefce8" },
  { color: "#ef4444", bgColor: "#fef2f2" },
  { color: "#ec4899", bgColor: "#fdf2f8" },
  { color: "#06b6d4", bgColor: "#ecfeff" },
  { color: "#eab308", bgColor: "#fefce8" },
  { color: "#8b5cf6", bgColor: "#faf5ff" },
];

const iconOptions = [
  { key: "atom", Icon: Atom },
  { key: "calculator", Icon: Calculator },
  { key: "network", Icon: Network },
  { key: "briefcase", Icon: Briefcase },
  { key: "lightbulb", Icon: Lightbulb },
  { key: "monitor", Icon: Monitor },
  { key: "globe", Icon: Globe },
  { key: "music", Icon: Music },
];

interface NotebookDoc {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  sections: number;
  pages: number;
  updatedAt: Date | null;
}

const demoNotebooks = [
  {
    name: "Physics",
    description: "Classical mechanics, thermodynamics, waves, and modern physics",
    icon: "atom",
    color: "#5b6ef5",
    bgColor: "#eff6ff",
  },
  {
    name: "Mathematics",
    description: "Calculus, linear algebra, and differential equations",
    icon: "calculator",
    color: "#3db9a4",
    bgColor: "#ecfdf5",
  },
  {
    name: "Computer Science",
    description: "Data structures, algorithms, and system design",
    icon: "monitor",
    color: "#06b6d4",
    bgColor: "#ecfeff",
  },
];

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [notebooks, setNotebooks] = useState<NotebookDoc[]>([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("atom");
  const [newColorIdx, setNewColorIdx] = useState(0);
  const [creating, setCreating] = useState(false);

  const fetchNotebooks = useCallback(async () => {
    if (!user) return;
    setFetching(true);
    try {
      const notebooksRef = ref(database, `users/${user.uid}/notebooks`);
      const snapshot = await get(notebooksRef);
      const items: NotebookDoc[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        for (const [key, value] of Object.entries(data)) {
          const nb = value as Record<string, unknown>;
          items.push({
            id: key,
            name: (nb.name as string) || "",
            description: (nb.description as string) || "",
            icon: (nb.icon as string) || "atom",
            color: (nb.color as string) || "#5b6ef5",
            bgColor: (nb.bgColor as string) || "#eff6ff",
            sections: (nb.sectionCount as number) || 0,
            pages: (nb.pageCount as number) || 0,
            updatedAt: nb.updatedAt ? new Date(nb.updatedAt as string) : null,
          });
        }
        // Sort by updatedAt descending
        items.sort((a, b) => {
          if (!a.updatedAt && !b.updatedAt) return 0;
          if (!a.updatedAt) return 1;
          if (!b.updatedAt) return -1;
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        });
      }
      setNotebooks(items);
    } catch {
      // silently handle
    }
    setFetching(false);
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchNotebooks();
  }, [user, fetchNotebooks]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <Loader2 className="w-8 h-8 text-[#5b6ef5] animate-spin" />
      </div>
    );
  }

  const firstName = user.displayName?.split(" ")[0] || "User";
  const initials = (user.displayName || user.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const opt = colorOptions[newColorIdx];
      const now = new Date().toISOString();
      const newNotebookRef = push(ref(database, `users/${user.uid}/notebooks`));
      await set(newNotebookRef, {
        name: newName.trim(),
        description: newDesc.trim(),
        icon: newIcon,
        color: opt.color,
        bgColor: opt.bgColor,
        sectionCount: 0,
        pageCount: 0,
        createdAt: now,
        updatedAt: now,
      });
      setShowModal(false);
      setNewName("");
      setNewDesc("");
      setNewIcon("atom");
      setNewColorIdx(0);
      fetchNotebooks();
    } catch {
      // handle error
    }
    setCreating(false);
  };

  const handleSeedDemos = async () => {
    const now = new Date().toISOString();
    for (const demo of demoNotebooks) {
      const newRef = push(ref(database, `users/${user.uid}/notebooks`));
      await set(newRef, {
        name: demo.name,
        description: demo.description,
        icon: demo.icon,
        color: demo.color,
        bgColor: demo.bgColor,
        sectionCount: 0,
        pageCount: 0,
        createdAt: now,
        updatedAt: now,
      });
    }
    fetchNotebooks();
  };

  const timeAgo = (date: Date | null) => {
    if (!date) return "Just now";
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const filtered = notebooks.filter((nb) =>
    nb.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-[#e5e7eb] rounded-[10px] text-sm text-[#101828] placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-[#5b6ef5]/30 focus:border-[#5b6ef5]"
              />
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className="p-2 rounded-[10px] hover:bg-[#f7f8fa] text-[#6a7282] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#5b6ef5] flex items-center justify-center text-white text-sm font-semibold">
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#101828] mb-1">
            Welcome back, {firstName}!
          </h1>
          <p className="text-[#6a7282]">
            Select a notebook to continue, or create a new one.
          </p>
        </div>

        {/* Create New Notebook Banner */}
        <button onClick={() => setShowModal(true)} className="block w-full mb-8 text-left">
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
        </button>

        {fetching ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-[#5b6ef5] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#eff6ff] rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-[#5b6ef5]" />
            </div>
            <h3 className="text-lg font-semibold text-[#101828] mb-2">
              {searchQuery ? "No notebooks found" : "No notebooks yet"}
            </h3>
            <p className="text-[#6a7282] mb-6 max-w-sm mx-auto">
              {searchQuery
                ? "Try a different search term."
                : "Create your first notebook or populate with demo data to get started."}
            </p>
            {!searchQuery && (
              <button
                onClick={handleSeedDemos}
                className="px-4 py-2 bg-[#5b6ef5] text-white rounded-[10px] text-sm font-semibold hover:bg-[#4a5cd4] transition-colors"
              >
                Populate with Demo Notebooks
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Notebook Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {filtered.map((notebook) => {
                const Icon = iconMap[notebook.icon] || Atom;
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
                      Last edited {timeAgo(notebook.updatedAt)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* AI Insight Banner */}
        <div className="bg-white rounded-[10px] border border-[#e5e7eb] p-5 flex items-start gap-4 border-l-4 border-l-[#3db9a4]">
          <div className="w-10 h-10 bg-[#ecfdf5] rounded-[10px] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#3db9a4]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#101828] mb-1">AI Insight</h3>
            <p className="text-sm text-[#6a7282]">
              Your notes can be restructured and verified using the AI Insights
              panel. Open any page and click on the Ignite panel to get started.
            </p>
          </div>
        </div>
      </main>

      {/* Create Notebook Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-[10px] w-full max-w-md p-6 shadow-xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#101828]">
                Create Notebook
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded hover:bg-[#f7f8fa] text-[#99a1af]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#364153] mb-1.5">
                  Notebook Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Physics, Calculus..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-[10px] text-sm text-[#101828] placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-[#5b6ef5]/30 focus:border-[#5b6ef5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#364153] mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Brief description..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-[10px] text-sm text-[#101828] placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-[#5b6ef5]/30 focus:border-[#5b6ef5]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#364153] mb-1.5">
                  Icon
                </label>
                <div className="flex gap-2 flex-wrap">
                  {iconOptions.map((opt) => {
                    const Icon = opt.Icon;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setNewIcon(opt.key)}
                        className={`w-10 h-10 rounded-[10px] flex items-center justify-center border transition-colors ${
                          newIcon === opt.key
                            ? "border-[#5b6ef5] bg-[#eff6ff]"
                            : "border-[#e5e7eb] hover:bg-[#f7f8fa]"
                        }`}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{
                            color:
                              newIcon === opt.key
                                ? "#5b6ef5"
                                : "#6a7282",
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#364153] mb-1.5">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewColorIdx(idx)}
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${
                        newColorIdx === idx
                          ? "border-[#101828] scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: opt.color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={creating || !newName.trim()}
                className="w-full bg-[#5b6ef5] text-white py-2.5 rounded-[10px] text-sm font-semibold shadow hover:bg-[#4a5cd4] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Create Notebook
                    <Plus className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
