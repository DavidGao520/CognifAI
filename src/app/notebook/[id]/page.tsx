"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  Loader2,
  X,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";

interface SectionDoc {
  id: string;
  name: string;
  description: string;
  pages: number;
  order: number;
  updatedAt: Date | null;
}

export default function NotebookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [notebook, setNotebook] = useState<{
    name: string;
    description: string;
  } | null>(null);
  const [sections, setSections] = useState<SectionDoc[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionDesc, setNewSectionDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const nbDoc = await getDoc(doc(db, "notebooks", id));
      if (!nbDoc.exists()) {
        router.push("/dashboard");
        return;
      }
      const data = nbDoc.data();
      setNotebook({ name: data.name, description: data.description || "" });

      const sectQuery = query(
        collection(db, "notebooks", id, "sections"),
        orderBy("order", "asc")
      );
      const snap = await getDocs(sectQuery);
      const items: SectionDoc[] = snap.docs.map((d) => {
        const s = d.data();
        return {
          id: d.id,
          name: s.name,
          description: s.description || "",
          pages: s.pageCount || 0,
          order: s.order || 0,
          updatedAt: s.updatedAt?.toDate?.() || null,
        };
      });
      setSections(items);
    } catch {
      // handle error
    }
    setFetching(false);
  }, [id, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const timeAgo = (date: Date | null) => {
    if (!date) return "Just now";
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim()) return;
    setCreating(true);
    try {
      const sectionRef = await addDoc(
        collection(db, "notebooks", id, "sections"),
        {
          name: newSectionName.trim(),
          description: newSectionDesc.trim(),
          order: sections.length,
          pageCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      // Update notebook section count
      await updateDoc(doc(db, "notebooks", id), {
        sectionCount: increment(1),
        updatedAt: serverTimestamp(),
      });

      // Create a default first page in the section
      await addDoc(
        collection(
          db,
          "notebooks",
          id,
          "sections",
          sectionRef.id,
          "pages"
        ),
        {
          title: "Untitled Page",
          content: "",
          wordCount: 0,
          order: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      await updateDoc(
        doc(db, "notebooks", id, "sections", sectionRef.id),
        { pageCount: increment(1) }
      );

      setShowModal(false);
      setNewSectionName("");
      setNewSectionDesc("");
      fetchData();
    } catch {
      // handle error
    }
    setCreating(false);
  };

  if (authLoading || !user || fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <Loader2 className="w-8 h-8 text-[#5b6ef5] animate-spin" />
      </div>
    );
  }

  const totalPages = sections.reduce((sum, s) => sum + s.pages, 0);

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
                {notebook?.name || "Notebook"}
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
                {(user.displayName || user.email || "U")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Notebook header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#101828] mb-1">
              {notebook?.name || "Notebook"}
            </h1>
            <p className="text-[#6a7282] text-sm">
              {notebook?.description || ""}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-[#99a1af]">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                {sections.length} sections
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {totalPages} pages
              </span>
            </div>
          </div>

          {/* Add Section Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full mb-6 bg-gradient-to-r from-[#5b6ef5] to-[#3db9a4] text-white rounded-[10px] py-3 px-4 flex items-center justify-center gap-2 text-sm font-semibold shadow hover:shadow-md transition-shadow"
          >
            <Plus className="w-4 h-4" />
            Add New Section
          </button>

          {sections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#6a7282] mb-2">No sections yet.</p>
              <p className="text-sm text-[#99a1af]">
                Click the button above to create your first section.
              </p>
            </div>
          ) : (
            /* Sections List */
            <div className="space-y-3">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={`/notebook/${id}/${section.id}/first`}
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
                          {timeAgo(section.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#99a1af] group-hover:text-[#5b6ef5] transition-colors mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Right Info Panel */}
      <div className="w-80 bg-white border-l border-[#e5e7eb] p-4 overflow-y-auto hidden xl:block">
        <h2 className="font-bold text-[#101828] mb-4">Notebook Info</h2>

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
                value: sections.length.toString(),
                icon: Layers,
              },
              {
                label: "Created",
                value: "Recently",
                icon: Calendar,
              },
              {
                label: "Word Count",
                value: "--",
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
            Open any page and use the AI Insights panel to restructure,
            elaborate, verify, or generate questions from your notes.
          </p>
        </div>
      </div>

      {/* Add Section Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-[10px] w-full max-w-md p-6 shadow-xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#101828]">
                Add New Section
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
                  Section Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mechanics, Thermodynamics..."
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
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
                  value={newSectionDesc}
                  onChange={(e) => setNewSectionDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-[10px] text-sm text-[#101828] placeholder:text-[#99a1af] focus:outline-none focus:ring-2 focus:ring-[#5b6ef5]/30 focus:border-[#5b6ef5]"
                />
              </div>
              <button
                onClick={handleAddSection}
                disabled={creating || !newSectionName.trim()}
                className="w-full bg-[#5b6ef5] text-white py-2.5 rounded-[10px] text-sm font-semibold shadow hover:bg-[#4a5cd4] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Add Section
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
