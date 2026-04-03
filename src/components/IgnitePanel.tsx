"use client";

import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  FileQuestion,
  Wand2,
  BookOpen,
  AlertTriangle,
  Loader2,
} from "lucide-react";

type IgniteTab = "restructure" | "elaborate" | "verify" | "question";

export default function IgnitePanel() {
  const [activeTab, setActiveTab] = useState<IgniteTab>("restructure");
  const [isLoading, setIsLoading] = useState(false);

  const tabs: { key: IgniteTab; label: string; icon: React.ElementType }[] = [
    { key: "restructure", label: "Restructure", icon: Wand2 },
    { key: "elaborate", label: "Elaborate", icon: BookOpen },
    { key: "verify", label: "Verify", icon: CheckCircle },
    { key: "question", label: "Question", icon: FileQuestion },
  ];

  const handleAction = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="w-80 bg-white border-l border-[#e5e7eb] flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-[#5b6ef5]" />
          <h2 className="font-bold text-[#101828]">AI Insights</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#f7f8fa] rounded-[10px] p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setIsLoading(false);
                }}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-[#5b6ef5] text-white shadow-sm"
                    : "text-[#6a7282] hover:text-[#101828]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "restructure" && (
          <RestructureContent isLoading={isLoading} onAction={handleAction} />
        )}
        {activeTab === "elaborate" && (
          <ElaborateContent isLoading={isLoading} onAction={handleAction} />
        )}
        {activeTab === "verify" && (
          <VerifyContent isLoading={isLoading} onAction={handleAction} />
        )}
        {activeTab === "question" && (
          <QuestionContent isLoading={isLoading} onAction={handleAction} />
        )}
      </div>
    </div>
  );
}

function RestructureContent({
  isLoading,
  onAction,
}: {
  isLoading: boolean;
  onAction: () => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-[#faf5ff] rounded-[10px] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Loader2 className="w-5 h-5 text-[#5b6ef5] animate-spin" />
            <h3 className="font-semibold text-[#101828]">
              Restructuring Content
            </h3>
          </div>
          <div className="space-y-3">
            {[
              "Analyzing note structure...",
              "Identifying key concepts...",
              "Organizing into sections...",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                {i < 2 ? (
                  <CheckCircle className="w-4 h-4 text-[#3db9a4]" />
                ) : (
                  <Loader2 className="w-4 h-4 text-[#5b6ef5] animate-spin" />
                )}
                <span
                  className={`text-sm ${i < 2 ? "text-[#3db9a4]" : "text-[#6a7282]"}`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#faf5ff] rounded-[10px] p-4">
        <h3 className="font-semibold text-[#101828] mb-2">
          Restructure Content
        </h3>
        <p className="text-sm text-[#6a7282] mb-3">
          Your notes contain 18 fragmented bullets across multiple concepts that
          could be better organized.
        </p>
        <div className="bg-[#5b6ef5] rounded-lg p-3 mb-3">
          <p className="text-xs text-white/80 mb-2 font-medium">
            AI will organize into:
          </p>
          <ul className="space-y-1.5">
            {[
              "Core Definitions & Laws",
              "Mathematical Formulations",
              "Worked Examples",
              "Key Relationships",
            ].map((item) => (
              <li
                key={item}
                className="text-sm text-white flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={onAction}
          className="w-full bg-[#5b6ef5] text-white py-2.5 rounded-[10px] text-sm font-semibold shadow hover:bg-[#4a5cd4] transition-colors flex items-center justify-center gap-2"
        >
          Restructure Notes
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ElaborateContent({
  isLoading,
  onAction,
}: {
  isLoading: boolean;
  onAction: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-[#ecfdf5] rounded-[10px] p-4">
        <h3 className="font-semibold text-[#101828] mb-2">
          Elaborate Content
        </h3>
        <p className="text-sm text-[#6a7282] mb-3">
          Vague statement detected in your notes:
        </p>
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-3 mb-3">
          <p className="text-sm text-[#364153] italic">
            &quot;Force is related to mass and acceleration somehow&quot;
          </p>
        </div>
        <p className="text-xs font-medium text-[#364153] mb-2">
          This concept needs:
        </p>
        <ul className="space-y-1.5 mb-3">
          {[
            "Precise mathematical definition",
            "Physical intuition explanation",
            "Real-world examples",
            "Common misconceptions addressed",
          ].map((item) => (
            <li
              key={item}
              className="text-sm text-[#6a7282] flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-[#3db9a4] rounded-full" />
              {item}
            </li>
          ))}
        </ul>
        <button
          onClick={onAction}
          className="w-full bg-[#3db9a4] text-white py-2.5 rounded-[10px] text-sm font-semibold shadow hover:bg-[#35a593] transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Elaborate Selected Text
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function VerifyContent({
  isLoading,
  onAction,
}: {
  isLoading: boolean;
  onAction: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-[#faf5ff] rounded-[10px] p-4">
        <h3 className="font-semibold text-[#101828] mb-2">Verify Content</h3>
        <p className="text-sm text-[#6a7282] mb-3">
          Selected formula for verification:
        </p>
        <div className="bg-white border border-[#e5e7eb] rounded-lg p-3 mb-3 text-center">
          <span className="text-lg font-mono text-[#5b6ef5] font-semibold">
            F = m x a
          </span>
        </div>
        <p className="text-xs font-medium text-[#364153] mb-2">
          AI will check:
        </p>
        <ul className="space-y-1.5 mb-3">
          {[
            "Mathematical correctness",
            "Proper notation & units",
            "Applicable conditions",
            "Edge cases & limitations",
          ].map((item) => (
            <li
              key={item}
              className="text-sm text-[#6a7282] flex items-center gap-2"
            >
              <CheckCircle className="w-3.5 h-3.5 text-[#5b6ef5]" />
              {item}
            </li>
          ))}
        </ul>
        <button
          onClick={onAction}
          className="w-full bg-[#5b6ef5] text-white py-2.5 rounded-[10px] text-sm font-semibold shadow hover:bg-[#4a5cd4] transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Verify Formula
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Warning card */}
      <div className="bg-[#fefce8] border border-[#fde68a] rounded-[10px] p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-[#f59e0b] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-[#101828] mb-1">
              Potential issues detected
            </h4>
            <p className="text-xs text-[#6a7282]">
              2 formulas in this section may have incorrect units. Review
              recommended.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionContent({
  isLoading,
  onAction,
}: {
  isLoading: boolean;
  onAction: () => void;
}) {
  const questionTypes = [
    { label: "Comprehension", color: "#5b6ef5" },
    { label: "Application", color: "#3db9a4" },
    { label: "Conceptual Connection", color: "#f59e0b" },
    { label: "Edge Cases", color: "#ef4444" },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-[#ecfdf5] rounded-[10px] p-4">
        <h3 className="font-semibold text-[#101828] mb-2">
          Generate Questions
        </h3>
        <p className="text-sm text-[#6a7282] mb-3">
          AI will generate practice questions based on your current notes:
        </p>
        <div className="space-y-2 mb-3">
          {questionTypes.map((qt) => (
            <div key={qt.label} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: qt.color }}
              />
              <span className="text-sm text-[#364153]">{qt.label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onAction}
          className="w-full bg-[#3db9a4] text-white py-2.5 rounded-[10px] text-sm font-semibold shadow hover:bg-[#35a593] transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Generate Practice Questions
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
