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
  Trash2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { database } from "@/lib/firebase";
import { ref, get, push, set, remove } from "firebase/database";

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

const sampleNotebooks = [
  {
    name: "Physics",
    description: "Classical mechanics, thermodynamics, waves, and modern physics",
    icon: "atom",
    color: "#5b6ef5",
    bgColor: "#eff6ff",
    sections: [
      {
        name: "Mechanics",
        description: "Newton's laws, kinematics, forces, energy, momentum, rotational motion",
        pages: [
          {
            title: "Newton's Second Law",
            content: `Overview

Newton's Second Law of Motion states that the acceleration of an object is directly proportional to the net force acting upon it and inversely proportional to its mass. This is one of the most fundamental principles in classical mechanics.

F = m × a

Where F is net force (N), m is mass (kg), and a is acceleration (m/s²)

Key Concepts

Net Force: The vector sum of all forces acting on an object. If forces are balanced (net force = 0), the object maintains constant velocity (could be at rest).

Mass: A measure of an object's inertia—its resistance to changes in motion. Greater mass means more force is required to achieve the same acceleration.

Acceleration: The rate of change of velocity. Can be due to changing speed, changing direction, or both. Always points in the direction of the net force.

Vector Nature: Force and acceleration are vectors—they have both magnitude and direction. Must use vector addition to find net force.

Example Problem

A 10 kg box is pushed across a frictionless surface with a force of 50 N. What is the acceleration of the box?

Given: F = 50 N, m = 10 kg
Find: a = ?
Solution: F = ma → a = F/m = 50/10 = 5 m/s²

Common Misconceptions

• Heavier objects don't always fall faster — in a vacuum, all objects accelerate at g = 9.8 m/s²
• Force is not needed to maintain motion — only to change motion (Newton's First Law)
• Action-reaction pairs act on different objects, not the same one`,
          },
          {
            title: "Free Body Diagrams",
            content: `Free Body Diagrams (FBD)

A free body diagram is a sketch of an object with all forces acting on it drawn as arrows. Essential tool for solving any mechanics problem.

Steps to Draw an FBD:
• Identify the object of interest
• Draw the object as a simple shape (usually a dot or box)
• Identify ALL forces acting ON the object
• Draw each force as an arrow pointing in the correct direction
• Label each force with its name and magnitude (if known)

Common Forces:
• Weight (W = mg) — always points downward
• Normal force (N) — perpendicular to contact surface
• Friction (f) — parallel to surface, opposes motion
• Tension (T) — along the rope/string, away from object
• Applied force (F) — in the direction of push/pull
• Spring force (F = -kx) — toward equilibrium position`,
          },
          {
            title: "Friction & Normal Force",
            content: `Friction

Friction is a force that opposes the relative motion or tendency of motion between two surfaces in contact.

Types of Friction:
• Static friction (fs ≤ μs × N) — prevents motion from starting
• Kinetic friction (fk = μk × N) — opposes ongoing motion
• μs > μk always (harder to start moving than to keep moving)

Normal Force:
The normal force is the support force exerted by a surface perpendicular to the object. On a flat surface: N = mg. On an incline at angle θ: N = mg cos(θ).

Key Equations:
• fs,max = μs × N (maximum static friction)
• fk = μk × N (kinetic friction)
• On an incline: component along slope = mg sin(θ)`,
          },
        ],
      },
      {
        name: "Thermodynamics",
        description: "Heat, work, entropy, and the laws of thermodynamics",
        pages: [
          {
            title: "Entropy & Second Law",
            content: `Rapid Lecture Notes — Entropy & Second Law

• entropy = measure of disorder in system
• ΔS = Q/T but only for reversible processes!!!
• second law - entropy of isolated system always increases
• can't have 100% efficient heat engine, always waste heat
• Carnot cycle - theoretical max efficiency
• efficiency = 1 - T_cold/T_hot
• real engines way less efficient bc friction, heat loss etc
• refrigerators are heat engines in reverse
• COP = coefficient of performance for fridges
• gibbs free energy G = H - TS determines spontaneity
• if ΔG negative → spontaneous
• phase transitions have entropy changes
• ice melting = entropy increases (more disorder)
• prof said remember: "nature tends toward disorder"
• statistical interpretation: S = k ln(W) - Boltzmann
• W = number of microstates
• more microstates = higher entropy
• example: gas expansion into vacuum - irreversible, entropy up`,
          },
          {
            title: "Carnot Cycle",
            content: `The Carnot Cycle

The Carnot cycle is the most efficient thermodynamic cycle possible, consisting of four reversible processes.

Four Steps:
1. Isothermal expansion (absorb heat Qh from hot reservoir at Th)
2. Adiabatic expansion (temperature drops from Th to Tc)
3. Isothermal compression (release heat Qc to cold reservoir at Tc)
4. Adiabatic compression (temperature rises from Tc to Th)

Carnot Efficiency:
η = 1 - Tc/Th (temperatures in Kelvin!)

Key Points:
• No real engine can be more efficient than a Carnot engine
• Efficiency increases as Th increases or Tc decreases
• Efficiency can never reach 100% (would require Tc = 0 K)
• All reversible engines operating between same temperatures have same efficiency`,
          },
        ],
      },
      {
        name: "Waves & Optics",
        description: "Wave mechanics, interference, diffraction, reflection, refraction, lenses",
        pages: [
          {
            title: "Wave Properties",
            content: `Fundamental Wave Properties

Wavelength (λ): Distance between two consecutive crests or troughs
Frequency (f): Number of complete cycles per second (Hz)
Period (T): Time for one complete cycle, T = 1/f
Amplitude (A): Maximum displacement from equilibrium
Wave speed: v = fλ

Types of Waves:
• Transverse: oscillation perpendicular to wave direction (light, water surface)
• Longitudinal: oscillation parallel to wave direction (sound)

Wave Equation:
y(x,t) = A sin(kx - ωt + φ)
where k = 2π/λ (wave number) and ω = 2πf (angular frequency)

Superposition Principle:
When two waves meet, the resultant displacement is the sum of individual displacements.
• Constructive interference: waves in phase → amplitude adds
• Destructive interference: waves out of phase → amplitude cancels`,
          },
        ],
      },
      {
        name: "Modern Physics",
        description: "Quantum mechanics, special relativity, atomic structure, nuclear physics",
        pages: [
          {
            title: "Wave-Particle Duality",
            content: `Wave-Particle Duality

Fundamental Concepts:
• Photons exhibit wave-particle duality
• de Broglie wavelength: λ = h/p
• Wave function collapse happens during measurement
• Uncertainty principle limits precision

Double-Slit Experiment:
The double-slit experiment demonstrates the fundamental weirdness of quantum mechanics. When electrons pass through two slits, they create an interference pattern like waves, but when we try to measure which slit they go through, the pattern disappears.

• Electrons show interference pattern without observation
• Pattern disappears when measuring which slit
• Demonstrates wave-particle duality

Mathematical Framework:
• Schrödinger equation: describes wave function evolution
• Born interpretation: |ψ|² gives probability density
• Operators correspond to physical observables`,
          },
        ],
      },
    ],
  },
  {
    name: "Chemistry 201",
    description: "Organic chemistry, reactions, molecular structure, thermochemistry",
    icon: "lightbulb",
    color: "#f59e0b",
    bgColor: "#fefce8",
    sections: [
      {
        name: "Organic Chemistry",
        description: "Functional groups, reactions, stereochemistry, synthesis",
        pages: [
          {
            title: "SN1 vs SN2 Reactions",
            content: `SN2 Reactions

Mechanism: Bimolecular nucleophilic substitution — occurs in a single concerted step

• Nucleophile attacks from backside (opposite the leaving group)
• Causes inversion of configuration (Walden inversion)
• Rate = k[substrate][nucleophile] — second order kinetics
• Favored by strong nucleophiles and primary substrates
• Polar aprotic solvents (DMSO, acetone) enhance rate

SN1 Reactions

Mechanism: Unimolecular nucleophilic substitution — proceeds in two steps

• Step 1: Leaving group departs, forming carbocation (slow, rate-determining)
• Step 2: Nucleophile attacks carbocation (fast)
• Rate = k[substrate] — first order kinetics
• Results in racemization (loss of stereochemistry)
• Favored by tertiary substrates (stable carbocations)
• Polar protic solvents (water, alcohols) stabilize carbocation

Key Differences Summary:
• Stereochemistry: SN2 = inversion, SN1 = racemization
• Kinetics: SN2 = 2nd order, SN1 = 1st order
• Substrate: SN2 prefers 1°, SN1 prefers 3°
• Solvent: SN2 = polar aprotic, SN1 = polar protic`,
          },
        ],
      },
      {
        name: "Thermochemistry",
        description: "Enthalpy, entropy, Gibbs free energy, reaction spontaneity",
        pages: [
          {
            title: "Hess's Law",
            content: `Hess's Law

The total enthalpy change for a reaction is independent of the pathway taken. This means we can add up enthalpy changes of individual steps to find the overall ΔH.

Key Principle:
ΔH is a state function — depends only on initial and final states, not the path.

Using Hess's Law:
1. Write target reaction
2. Manipulate given reactions (reverse, multiply) to match
3. If you reverse a reaction, change the sign of ΔH
4. If you multiply a reaction by n, multiply ΔH by n
5. Add up all ΔH values

Standard Enthalpy of Formation (ΔHf°):
• Enthalpy change when 1 mol of compound forms from elements in standard states
• ΔH°rxn = Σ ΔHf°(products) - Σ ΔHf°(reactants)
• ΔHf° for elements in standard state = 0`,
          },
        ],
      },
    ],
  },
  {
    name: "Calculus III",
    description: "Multivariable calculus, vector calculus, partial derivatives, multiple integrals",
    icon: "calculator",
    color: "#3db9a4",
    bgColor: "#ecfdf5",
    sections: [
      {
        name: "Vector Calculus",
        description: "Gradient, divergence, curl, line integrals, surface integrals",
        pages: [
          {
            title: "Divergence Theorem",
            content: `Divergence Theorem (Gauss's Theorem)

Relates the flux of a vector field through a closed surface to the divergence of the field in the volume enclosed.

∫∫∫_V (∇ · F) dV = ∫∫_S F · n dS

Requirements:
• S must be a closed surface (piecewise smooth)
• F must be continuously differentiable on V
• n is the outward-pointing unit normal vector

Physical Interpretation:
The total flux through a closed surface equals the sum of all sources (positive divergence) minus all sinks (negative divergence) inside the volume.

Example: For a sphere of radius r centered at origin with F = (x, y, z), the divergence theorem gives:

∫∫∫_sphere 3 dV = 4πr³

Applications:
• Fluid dynamics — relates flow out of a region to sources inside
• Electrostatics — derives Gauss's law for electric fields
• Heat transfer — relates heat flux to temperature distribution`,
          },
          {
            title: "Stokes' Theorem",
            content: `Stokes' Theorem

Relates the surface integral of curl(F) to the line integral of F around the boundary curve.

∫∫_S (∇ × F) · dS = ∮_C F · dr

Key Requirements:
• S is an oriented surface bounded by curve C
• C is traversed in positive direction (right-hand rule)
• F must have continuous partial derivatives

Special Cases:
• If S is a flat region in the xy-plane, reduces to Green's Theorem
• If curl(F) = 0 everywhere, the line integral around any closed curve is zero

Applications:
• Verifying conservative vector fields
• Computing circulation of fluid flow
• Electromagnetic theory (Faraday's law)`,
          },
        ],
      },
    ],
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

  const [seeding, setSeeding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<NotebookDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleSeedSamples = async () => {
    setSeeding(true);
    try {
      const now = new Date().toISOString();
      for (const nb of sampleNotebooks) {
        let totalPages = 0;
        for (const s of nb.sections) totalPages += s.pages.length;

        // Write notebook metadata FIRST
        const nbRef = push(ref(database, `users/${user.uid}/notebooks`));
        const nbId = nbRef.key!;
        await set(nbRef, {
          name: nb.name,
          description: nb.description,
          icon: nb.icon,
          color: nb.color,
          bgColor: nb.bgColor,
          sectionCount: nb.sections.length,
          pageCount: totalPages,
          createdAt: now,
          updatedAt: now,
        });

        // THEN write sections and pages (under the notebook node)
        for (const section of nb.sections) {
          const secRef = push(ref(database, `users/${user.uid}/notebooks/${nbId}/sections`));
          const secId = secRef.key!;

          await set(secRef, {
            name: section.name,
            description: section.description,
            pageCount: section.pages.length,
            order: nb.sections.indexOf(section),
            createdAt: now,
            updatedAt: now,
          });

          for (const page of section.pages) {
            const pageRef = push(ref(database, `users/${user.uid}/notebooks/${nbId}/sections/${secId}/pages`));
            await set(pageRef, {
              title: page.title,
              content: page.content,
              wordCount: page.content.split(/\s+/).filter(Boolean).length,
              order: section.pages.indexOf(page),
              createdAt: now,
              updatedAt: now,
            });
          }
        }
      }
      fetchNotebooks();
    } catch (err) {
      console.error("Error seeding samples:", err);
    }
    setSeeding(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget || !user) return;
    setDeleting(true);
    try {
      await remove(ref(database, `users/${user.uid}/notebooks/${deleteTarget.id}`));
      setDeleteTarget(null);
      fetchNotebooks();
    } catch (err) {
      console.error("Error deleting notebook:", err);
    }
    setDeleting(false);
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
                onClick={handleSeedSamples}
                disabled={seeding}
                className="px-5 py-2.5 bg-[#5b6ef5] text-white rounded-[10px] text-sm font-semibold hover:bg-[#4a5cd4] transition-colors flex items-center gap-2 mx-auto disabled:opacity-60"
              >
                {seeding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading Sample Notebooks...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Load Sample Notebooks
                  </>
                )}
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
                  <div key={notebook.id} className="relative group">
                    <Link
                      href={`/notebook/${notebook.id}`}
                      className="block bg-white rounded-[10px] border border-[#e5e7eb] p-5 hover:shadow-md hover:border-[#5b6ef5]/30 transition-all"
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
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteTarget(notebook);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-[8px] opacity-0 group-hover:opacity-100 hover:bg-red-50 text-[#99a1af] hover:text-red-500 transition-all"
                      title="Delete notebook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Sample Notebooks Button (when notebooks exist) */}
        {!fetching && filtered.length > 0 && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleSeedSamples}
              disabled={seeding}
              className="px-4 py-2 border border-[#e5e7eb] rounded-[10px] text-sm text-[#6a7282] hover:bg-white hover:border-[#5b6ef5] hover:text-[#5b6ef5] transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {seeding ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Load Sample Notebooks
                </>
              )}
            </button>
          </div>
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-[10px] w-full max-w-sm p-6 shadow-xl mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-lg font-bold text-[#101828]">Delete Notebook</h2>
            </div>
            <p className="text-sm text-[#6a7282] mb-6">
              Are you sure you want to delete <strong>&ldquo;{deleteTarget.name}&rdquo;</strong>? This will permanently remove all sections and pages inside it. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-[#e5e7eb] rounded-[10px] text-sm font-medium text-[#364153] hover:bg-[#f7f8fa] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-[10px] text-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
