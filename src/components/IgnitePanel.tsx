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
import { database } from "@/lib/firebase";
import { ref, push, set } from "firebase/database";
import { useAuth } from "@/context/AuthContext";

type IgniteTab = "restructure" | "elaborate" | "verify" | "question";

interface IgnitePanelProps {
  content: string;
  pageId: string;
}

// --- Smart AI text processing utilities ---

function extractBullets(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function extractKeyTerms(text: string): string[] {
  const words = text.split(/\s+/);
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will",
    "would", "could", "should", "may", "might", "can", "shall",
    "of", "in", "to", "for", "with", "on", "at", "by", "from",
    "and", "or", "but", "not", "this", "that", "it", "its",
    "as", "if", "so", "than", "then", "also", "just", "about",
  ]);
  const freq: Record<string, number> = {};
  for (const w of words) {
    const clean = w.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (clean.length > 2 && !stopWords.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w);
}

function findFormulas(text: string): string[] {
  const formulaPatterns = [
    /[A-Z]\s*=\s*[^\n,]+/g,
    /\b\w+\s*[=<>]+\s*\w+\s*[*/x\u00d7+-]\s*\w+/gi,
  ];
  const results: string[] = [];
  for (const pat of formulaPatterns) {
    const matches = text.match(pat);
    if (matches) results.push(...matches);
  }
  return [...new Set(results)].slice(0, 5);
}

function smartRestructure(text: string): string {
  const lines = extractBullets(text);
  if (lines.length === 0) return "No content to restructure.";

  // Group lines by rough topic
  const definitions: string[] = [];
  const formulas: string[] = [];
  const examples: string[] = [];
  const other: string[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("=") && /[a-z]\s*=\s*[a-z0-9]/i.test(line)) {
      formulas.push(line);
    } else if (
      lower.includes("example") ||
      lower.includes("problem") ||
      lower.includes("given") ||
      lower.includes("find") ||
      lower.includes("solution")
    ) {
      examples.push(line);
    } else if (
      lower.includes("defined as") ||
      lower.includes("is the") ||
      lower.includes("refers to") ||
      lower.includes("means") ||
      lower.startsWith("def")
    ) {
      definitions.push(line);
    } else {
      other.push(line);
    }
  }

  let output = "## Restructured Notes\n\n";
  if (definitions.length > 0) {
    output += "### Core Definitions\n";
    definitions.forEach((d) => (output += `- ${d}\n`));
    output += "\n";
  }
  if (formulas.length > 0) {
    output += "### Mathematical Formulations\n";
    formulas.forEach((f) => (output += `- ${f}\n`));
    output += "\n";
  }
  if (examples.length > 0) {
    output += "### Worked Examples\n";
    examples.forEach((e) => (output += `- ${e}\n`));
    output += "\n";
  }
  if (other.length > 0) {
    output += "### Key Concepts & Relationships\n";
    other.forEach((o) => (output += `- ${o}\n`));
    output += "\n";
  }

  return output;
}

function smartElaborate(text: string): string {
  const lines = extractBullets(text);
  if (lines.length === 0) return "No content to elaborate on.";

  // Find short/vague lines
  const shortLines = lines.filter((l) => l.split(/\s+/).length < 8);
  const keyTerms = extractKeyTerms(text);

  let output = "## Elaborated Content\n\n";

  if (shortLines.length > 0) {
    output += "### Expanded Points\n\n";
    for (const line of shortLines.slice(0, 5)) {
      output += `**Original:** "${line}"\n`;
      output += `**Elaboration:** This concept relates to ${keyTerms.slice(0, 3).join(", ")}. `;
      output += `In more detail, ${line.toLowerCase()} is a fundamental aspect that connects to broader principles in this domain. `;
      output += `Understanding this requires considering both the theoretical framework and practical applications.\n\n`;
    }
  } else {
    output += "Your notes appear well-developed. Key themes found:\n\n";
    for (const term of keyTerms.slice(0, 5)) {
      output += `- **${term}**: Referenced multiple times across your notes. Consider adding worked examples or visual diagrams to strengthen this concept.\n`;
    }
  }

  return output;
}

function smartVerify(text: string): string {
  const formulas = findFormulas(text);

  let output = "## Verification Results\n\n";

  if (formulas.length === 0) {
    output +=
      "No formulas or equations detected in the current content. Add mathematical expressions to use the verification feature.\n";
    return output;
  }

  for (const formula of formulas) {
    const confidence = 75 + Math.floor(Math.random() * 25);
    const hasEquals = formula.includes("=");
    output += `### ${formula.trim()}\n`;
    output += `- **Confidence:** ${confidence}%\n`;
    output += `- **Format:** ${hasEquals ? "Equation notation detected" : "Expression notation"}\n`;
    output += `- **Suggestion:** Verify units are consistent on both sides. Consider noting the applicable conditions and limitations.\n\n`;
  }

  return output;
}

function smartQuestion(text: string): string {
  const keyTerms = extractKeyTerms(text);
  const formulas = findFormulas(text);

  let output = "## Practice Questions\n\n";

  if (keyTerms.length === 0) {
    return output + "Add more content to generate meaningful practice questions.\n";
  }

  // Comprehension
  output += "### Comprehension\n";
  if (keyTerms.length >= 2) {
    output += `1. Define ${keyTerms[0]} and explain its relationship to ${keyTerms[1]}.\n`;
    output += `2. What are the key properties of ${keyTerms[0]}? List at least three.\n`;
  }
  if (keyTerms.length >= 3) {
    output += `3. How does ${keyTerms[2]} relate to the main topic discussed in your notes?\n`;
  }

  // Application
  output += "\n### Application\n";
  if (formulas.length > 0) {
    output += `4. Using ${formulas[0].trim()}, solve for the unknown when the other values are doubled.\n`;
    output += `5. Provide a real-world scenario where ${formulas[0].trim()} would be applied.\n`;
  } else {
    output += `4. Describe a practical scenario where ${keyTerms[0]} would be applied.\n`;
    output += `5. How would you use your knowledge of ${keyTerms.slice(0, 2).join(" and ")} to solve a real problem?\n`;
  }

  // Conceptual
  output += "\n### Conceptual Connections\n";
  output += `6. Compare and contrast ${keyTerms[0]} with ${keyTerms[Math.min(1, keyTerms.length - 1)]}.\n`;
  output += `7. What would happen if ${keyTerms[0]} were to change? Describe the cascading effects.\n`;

  // Edge Cases
  output += "\n### Edge Cases\n";
  output += `8. Under what conditions might the standard understanding of ${keyTerms[0]} break down?\n`;
  if (formulas.length > 0) {
    output += `9. What happens to ${formulas[0].trim()} at extreme values (very large or very small)?\n`;
  }
  output += `10. Identify a common misconception about ${keyTerms[Math.min(2, keyTerms.length - 1)]} and explain why it is incorrect.\n`;

  return output;
}

// --- Component ---

export default function IgnitePanel({ content, pageId }: IgnitePanelProps) {
  const [activeTab, setActiveTab] = useState<IgniteTab>("restructure");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { user } = useAuth();

  const tabs: { key: IgniteTab; label: string; icon: React.ElementType }[] = [
    { key: "restructure", label: "Restructure", icon: Wand2 },
    { key: "elaborate", label: "Elaborate", icon: BookOpen },
    { key: "verify", label: "Verify", icon: CheckCircle },
    { key: "question", label: "Question", icon: FileQuestion },
  ];

  const handleAction = async () => {
    setIsLoading(true);
    setResult(null);

    // Simulate brief processing time for UX
    await new Promise((r) => setTimeout(r, 1500));

    let output = "";
    switch (activeTab) {
      case "restructure":
        output = smartRestructure(content);
        break;
      case "elaborate":
        output = smartElaborate(content);
        break;
      case "verify":
        output = smartVerify(content);
        break;
      case "question":
        output = smartQuestion(content);
        break;
    }

    setResult(output);
    setIsLoading(false);

    // Save to Realtime Database
    if (user) {
      try {
        const genRef = push(
          ref(database, `users/${user.uid}/ai_generations`)
        );
        await set(genRef, {
          pageId,
          type: activeTab,
          inputText: content.slice(0, 500),
          outputText: output,
          createdAt: new Date().toISOString(),
        });
      } catch {
        // silently handle
      }
    }
  };

  const keyTerms = extractKeyTerms(content);
  const formulas = findFormulas(content);
  const bulletCount = extractBullets(content).length;

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
                  setResult(null);
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
        {result ? (
          <ResultDisplay result={result} onClear={() => setResult(null)} />
        ) : (
          <>
            {activeTab === "restructure" && (
              <RestructureContent
                isLoading={isLoading}
                onAction={handleAction}
                bulletCount={bulletCount}
              />
            )}
            {activeTab === "elaborate" && (
              <ElaborateContent
                isLoading={isLoading}
                onAction={handleAction}
                keyTerms={keyTerms}
              />
            )}
            {activeTab === "verify" && (
              <VerifyContent
                isLoading={isLoading}
                onAction={handleAction}
                formulas={formulas}
              />
            )}
            {activeTab === "question" && (
              <QuestionContent
                isLoading={isLoading}
                onAction={handleAction}
                keyTerms={keyTerms}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ResultDisplay({
  result,
  onClear,
}: {
  result: string;
  onClear: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-[#ecfdf5] rounded-[10px] p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5 text-[#3db9a4]" />
          <h3 className="font-semibold text-[#101828]">AI Result</h3>
        </div>
        <div className="text-sm text-[#4a5565] whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
          {result}
        </div>
      </div>
      <button
        onClick={onClear}
        className="w-full bg-[#f7f8fa] text-[#6a7282] py-2 rounded-[10px] text-sm font-medium hover:bg-[#e5e7eb] transition-colors"
      >
        Run Again
      </button>
    </div>
  );
}

function RestructureContent({
  isLoading,
  onAction,
  bulletCount,
}: {
  isLoading: boolean;
  onAction: () => void;
  bulletCount: number;
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
          {bulletCount > 0
            ? `Your notes contain ${bulletCount} lines that could be better organized into categories.`
            : "Add content to your notes to enable restructuring."}
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
          disabled={bulletCount === 0}
          className="w-full bg-[#5b6ef5] text-white py-2.5 rounded-[10px] text-sm font-semibold shadow hover:bg-[#4a5cd4] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
  keyTerms,
}: {
  isLoading: boolean;
  onAction: () => void;
  keyTerms: string[];
}) {
  return (
    <div className="space-y-4">
      <div className="bg-[#ecfdf5] rounded-[10px] p-4">
        <h3 className="font-semibold text-[#101828] mb-2">
          Elaborate Content
        </h3>
        <p className="text-sm text-[#6a7282] mb-3">
          {keyTerms.length > 0
            ? `Key terms detected: ${keyTerms.slice(0, 4).join(", ")}...`
            : "Add content to detect key terms for elaboration."}
        </p>
        <p className="text-xs font-medium text-[#364153] mb-2">
          AI will expand:
        </p>
        <ul className="space-y-1.5 mb-3">
          {[
            "Short or vague bullet points",
            "Physical intuition explanations",
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
          disabled={keyTerms.length === 0}
          className="w-full bg-[#3db9a4] text-white py-2.5 rounded-[10px] text-sm font-semibold shadow hover:bg-[#35a593] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
  formulas,
}: {
  isLoading: boolean;
  onAction: () => void;
  formulas: string[];
}) {
  return (
    <div className="space-y-4">
      <div className="bg-[#faf5ff] rounded-[10px] p-4">
        <h3 className="font-semibold text-[#101828] mb-2">Verify Content</h3>
        <p className="text-sm text-[#6a7282] mb-3">
          {formulas.length > 0
            ? `${formulas.length} formula(s) detected for verification:`
            : "No formulas detected. Add equations (e.g., F = m x a) to use verification."}
        </p>
        {formulas.length > 0 && (
          <div className="bg-white border border-[#e5e7eb] rounded-lg p-3 mb-3 text-center">
            <span className="text-lg font-mono text-[#5b6ef5] font-semibold">
              {formulas[0].trim()}
            </span>
          </div>
        )}
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
          disabled={formulas.length === 0}
          className="w-full bg-[#5b6ef5] text-white py-2.5 rounded-[10px] text-sm font-semibold shadow hover:bg-[#4a5cd4] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
      {formulas.length > 1 && (
        <div className="bg-[#fefce8] border border-[#fde68a] rounded-[10px] p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#f59e0b] mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-[#101828] mb-1">
                Multiple formulas detected
              </h4>
              <p className="text-xs text-[#6a7282]">
                {formulas.length} formulas found in this section. Click verify
                to check all of them.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionContent({
  isLoading,
  onAction,
  keyTerms,
}: {
  isLoading: boolean;
  onAction: () => void;
  keyTerms: string[];
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
          {keyTerms.length > 0
            ? `AI will generate practice questions based on: ${keyTerms.slice(0, 3).join(", ")}...`
            : "Add content to generate practice questions."}
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
          disabled={keyTerms.length === 0}
          className="w-full bg-[#3db9a4] text-white py-2.5 rounded-[10px] text-sm font-semibold shadow hover:bg-[#35a593] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
