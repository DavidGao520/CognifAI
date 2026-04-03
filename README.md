# CognifAI

An AI-powered note-taking web app designed for engineering students. CognifAI transforms messy lecture notes into structured study materials through four intelligent features: Restructure, Elaborate, Verify, and Question.

**Live Demo:** [cognifai-note.vercel.app](https://cognifai-note.vercel.app)

![CognifAI Landing](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20RTDB-orange?logo=firebase) ![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)

## Problem

Engineering students capture large volumes of dense information during lectures, resulting in fragmented, unstructured notes. Existing tools either overwhelm users with complex organizational features (Notion, Obsidian) or provide too little structure (Apple Notes). This creates an **activation barrier** — the cognitive cost of organizing messy notes is so high that students abandon the effort entirely.

## Solution

CognifAI provides an adaptive note-to-study experience with a two-panel layout:

- **Left Panel** — A clean, distraction-free text editor for capturing notes naturally
- **Right Panel (Ignite Panel)** — AI-powered learning tools that activate on demand, not automatically

### Core Features

| Feature | Description |
|---------|-------------|
| **Restructure** | Reorganizes fragmented bullet points into logical sections with clear headings |
| **Elaborate** | Expands vague notes with definitions, examples, and supporting context |
| **Verify** | Checks formulas and factual claims with confidence scores and corrections |
| **Question** | Generates practice questions across comprehension, application, and edge cases |

### Additional Features

- Email/password authentication with Firebase Auth
- Notebook, section, and page management (full CRUD)
- Auto-save editor with 1-second debounce
- Real-time word count and save status
- Sample notebooks with real physics, chemistry, and calculus content
- Responsive design optimized for 1440px desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Auth | Firebase Authentication |
| Database | Firebase Realtime Database |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- A Firebase project with Authentication (Email/Password) and Realtime Database enabled

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/DavidGao520/CognifAI.git
cd CognifAI/cognifai
npm install
```

2. **Configure environment variables**

Create a `.env.local` file in the `cognifai/` directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
```

3. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing / Auth page
│   ├── layout.tsx                  # Root layout with AuthProvider
│   ├── globals.css                 # Design tokens & global styles
│   ├── dashboard/page.tsx          # Notebooks dashboard
│   └── notebook/[id]/
│       ├── page.tsx                # Notebook sections view
│       └── [sectionId]/[pageId]/
│           └── page.tsx            # Note editor + Ignite panel
├── components/
│   ├── Sidebar.tsx                 # Left navigation sidebar
│   ├── NoteEditor.tsx              # Text editor with auto-save
│   └── IgnitePanel.tsx             # AI features panel (4 tabs)
├── context/
│   └── AuthContext.tsx              # Firebase auth state management
└── lib/
    └── firebase.ts                  # Firebase initialization
```

## Design

UI designs created in Figma and implemented with pixel-level accuracy. The design system uses Inter font, a purple-blue primary (#5b6ef5), and teal-green secondary (#3db9a4) color palette.

**Figma Prototype:** [View Design](https://www.figma.com/design/f2fL47KqSF2a5WqdOOFtYn/Cognif.ai--INFO-360-)

**Design Proposal:** [View Document](https://drive.google.com/file/d/1m2ITEVeNna1-VyEybinayfysSda26VGt/view)

**Pitch Video:** [Watch on YouTube](https://www.youtube.com/watch?v=p881J_vpSlM)

## Team

| Member | Role |
|--------|------|
| **David Gao** | Full-stack development, deployment |
| **Songling Ngo** | Figma design, feature prototyping, pitch video |
| **Hafsah Usman** | User research, usability testing, final design proposal |

Built for INFO 360 Design Methods — University of Washington

## License

This project is for educational purposes as part of the INFO 360 course at UW.
