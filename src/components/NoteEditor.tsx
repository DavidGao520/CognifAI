"use client";

import {
  Bold,
  Italic,
  List,
  Image,
  Heading1,
  Heading2,
  Code,
  Link2,
} from "lucide-react";

export default function NoteEditor() {
  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="border-b border-[#e5e7eb] px-6 py-2 flex items-center gap-1">
        {[
          { icon: Bold, label: "Bold" },
          { icon: Italic, label: "Italic" },
          { icon: Heading1, label: "Heading 1" },
          { icon: Heading2, label: "Heading 2" },
          { icon: List, label: "List" },
          { icon: Code, label: "Code" },
          { icon: Link2, label: "Link" },
          { icon: Image, label: "Image" },
        ].map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.label}
              title={tool.label}
              className="p-2 rounded-lg hover:bg-[#f7f8fa] text-[#6a7282] hover:text-[#101828] transition-colors"
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#101828] mb-2 outline-none">
          Newton&apos;s Second Law of Motion
        </h1>
        <p className="text-sm text-[#99a1af] mb-6">
          Last edited 2 hours ago &bull; Physics &gt; Mechanics
        </p>

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          <h2 className="text-xl font-semibold text-[#1e2939] mb-3">
            Overview
          </h2>
          <p className="text-[#4a5565] leading-relaxed mb-4">
            Newton&apos;s Second Law of Motion states that the acceleration of
            an object is directly proportional to the net force acting on it and
            inversely proportional to its mass. This fundamental law forms the
            basis of classical mechanics.
          </p>

          <h2 className="text-xl font-semibold text-[#1e2939] mb-3">
            The Formula
          </h2>
          {/* Formula highlight */}
          <div className="bg-[#faf5ff] border border-[#e9d5ff] rounded-[10px] p-4 mb-4 text-center">
            <span className="text-2xl font-mono font-bold text-[#5b6ef5]">
              F = m &times; a
            </span>
            <p className="text-sm text-[#6a7282] mt-2">
              Where F = Force (N), m = mass (kg), a = acceleration (m/s&sup2;)
            </p>
          </div>

          <h2 className="text-xl font-semibold text-[#1e2939] mb-3">
            Key Concepts
          </h2>
          <ul className="space-y-2 mb-4">
            {[
              "Force is a vector quantity with both magnitude and direction",
              "Net force is the vector sum of all forces acting on an object",
              "Mass is the measure of an object's resistance to acceleration (inertia)",
              "When net force is zero, the object remains at constant velocity (Newton's First Law)",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[#4a5565]">
                <span className="w-1.5 h-1.5 bg-[#5b6ef5] rounded-full mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold text-[#1e2939] mb-3">
            Example Problem
          </h2>
          <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-[10px] p-4 mb-4">
            <p className="text-sm font-medium text-[#1e2939] mb-2">
              Problem: A 5 kg object is pushed with a force of 20 N. What is its
              acceleration?
            </p>
            <div className="bg-white rounded-lg p-3 mt-2">
              <p className="text-sm text-[#4a5565] font-mono">
                Given: F = 20 N, m = 5 kg
                <br />
                Find: a = ?
                <br />
                <br />
                Using F = m &times; a
                <br />
                a = F / m = 20 / 5 ={" "}
                <span className="text-[#5b6ef5] font-bold">
                  4 m/s&sup2;
                </span>
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-[#1e2939] mb-3">
            Common Misconceptions
          </h2>
          <div className="bg-[#fefce8] border border-[#fde68a] rounded-[10px] p-4">
            <ul className="space-y-2">
              {[
                "Force does not equal velocity. Force causes changes in velocity (acceleration).",
                "Heavier objects don't always fall slower; in a vacuum, all objects fall at the same rate.",
                "An object can have velocity without any net force (constant velocity = zero net force).",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[#4a5565]"
                >
                  <span className="w-1.5 h-1.5 bg-[#f59e0b] rounded-full mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
