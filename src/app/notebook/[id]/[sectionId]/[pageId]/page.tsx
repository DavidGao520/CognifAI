"use client";

import { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  Loader2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import NoteEditor from "@/components/NoteEditor";
import IgnitePanel from "@/components/IgnitePanel";
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
  limit as firestoreLimit,
} from "firebase/firestore";

interface PageDoc {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  updatedAt: Date | null;
}

export default function NoteEditorPage({
  params,
}: {
  params: Promise<{ id: string; sectionId: string; pageId: string }>;
}) {
  const { id, sectionId, pageId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [sectionName, setSectionName] = useState("");
  const [notebookName, setNotebookName] = useState("");
  const [pages, setPages] = useState<PageDoc[]>([]);
  const [activePage, setActivePage] = useState<PageDoc | null>(null);
  const [activePageId, setActivePageId] = useState(pageId);
  const [fetching, setFetching] = useState(true);
  const [editorContent, setEditorContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState("Saved");

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      // Fetch notebook name
      const nbDoc = await getDoc(doc(db, "notebooks", id));
      if (nbDoc.exists()) {
        setNotebookName(nbDoc.data().name);
      }

      // Fetch section name
      const sectDoc = await getDoc(
        doc(db, "notebooks", id, "sections", sectionId)
      );
      if (sectDoc.exists()) {
        setSectionName(sectDoc.data().name);
      }

      // Fetch all pages
      const pagesQuery = query(
        collection(db, "notebooks", id, "sections", sectionId, "pages"),
        orderBy("order", "asc")
      );
      const snap = await getDocs(pagesQuery);
      const pageList: PageDoc[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || "Untitled",
          content: data.content || "",
          wordCount: data.wordCount || 0,
          updatedAt: data.updatedAt?.toDate?.() || null,
        };
      });
      setPages(pageList);

      // Determine active page
      let targetPage: PageDoc | null = null;
      if (pageId === "first" && pageList.length > 0) {
        targetPage = pageList[0];
        setActivePageId(pageList[0].id);
      } else {
        targetPage = pageList.find((p) => p.id === pageId) || null;
        if (!targetPage && pageList.length > 0) {
          targetPage = pageList[0];
          setActivePageId(pageList[0].id);
        }
      }

      if (targetPage) {
        setActivePage(targetPage);
        setEditorContent(targetPage.content);
        setWordCount(targetPage.wordCount);
      }
    } catch {
      // handle error
    }
    setFetching(false);
  }, [id, sectionId, pageId]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const handleContentChange = (content: string) => {
    setEditorContent(content);
    const wc = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(wc);
  };

  const handleAddPage = async () => {
    try {
      const pageRef = await addDoc(
        collection(db, "notebooks", id, "sections", sectionId, "pages"),
        {
          title: "Untitled Page",
          content: "",
          wordCount: 0,
          order: pages.length,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );
      await updateDoc(doc(db, "notebooks", id, "sections", sectionId), {
        pageCount: increment(1),
        updatedAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "notebooks", id), {
        pageCount: increment(1),
        updatedAt: serverTimestamp(),
      });
      // Refresh
      fetchData();
      setActivePageId(pageRef.id);
    } catch {
      // handle error
    }
  };

  const timeAgo = (date: Date | null) => {
    if (!date) return "Just now";
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (authLoading || !user || fetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f7f8fa]">
        <Loader2 className="w-8 h-8 text-[#5b6ef5] animate-spin" />
      </div>
    );
  }

  const initials = (user.displayName || user.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
              {notebookName || "Notebook"}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#6a7282]">{sectionName || "Section"}</span>
          </div>
          <button
            onClick={handleAddPage}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#f7f8fa] hover:bg-[#eff6ff] border border-[#e5e7eb] rounded-[10px] text-sm text-[#6a7282] hover:text-[#5b6ef5] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Page
          </button>
        </div>

        {/* Page list */}
        <nav className="flex-1 overflow-y-auto p-2">
          {pages.map((page) => {
            const isActive = page.id === activePageId;
            return (
              <button
                key={page.id}
                onClick={() => {
                  setActivePageId(page.id);
                  setActivePage(page);
                  setEditorContent(page.content);
                  setWordCount(page.wordCount);
                }}
                className={`flex items-start gap-2 px-3 py-2.5 rounded-[10px] mb-0.5 transition-colors w-full text-left ${
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
                    {page.title}
                  </p>
                  <p className="text-xs text-[#99a1af] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {timeAgo(page.updatedAt)}
                  </p>
                </div>
              </button>
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
              {notebookName || "Notebook"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#101828] font-medium">
              {sectionName || "Section"}
            </span>
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
              {initials}
            </div>
          </div>
        </header>

        {/* Editor with bottom bar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activePage ? (
            <NoteEditor
              pageId={activePageId}
              notebookId={id}
              sectionId={sectionId}
              initialContent={editorContent}
              initialTitle={activePage.title}
              onContentChange={handleContentChange}
              onSaveStatusChange={setSaveStatus}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#99a1af]">
              No pages yet. Create one to get started.
            </div>
          )}

          {/* Bottom stats bar */}
          <div className="bg-white border-t border-[#e5e7eb] px-6 py-2 flex items-center justify-between text-xs text-[#99a1af]">
            <div className="flex items-center gap-4">
              <span>{wordCount.toLocaleString()} words</span>
              <span>{saveStatus}</span>
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
        <IgnitePanel content={editorContent} pageId={activePageId} />
      </div>
    </div>
  );
}
