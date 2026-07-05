# PeerY — Landing Page Design System & UI Specification

This document details the visual identity, typography, spacing, color tokens, animations, and bento components that make up the premium, interactive user interface of the PeerY landing page.

---

## 1. Visual Language & Aesthetics

PeerY utilizes a **Premium Developer Aesthetic** characterised by:
-   **Minimalist & Modern Layouts:** Clean light-theme interfaces utilizing a white/zinc base with rich, harmonized color accents.
-   **Glassmorphism & Depth:** Soft borders, subtle texturing (grid meshes), and backdrop filters (`backdrop-blur-xl`) that evoke depth.
-   **Micro-interactions:** Lightweight spring-based animations that make the page feel responsive, alive, and interactive.
-   **Editorial Details:** Hand-drawn underlines, handwritten notes, and monospace debug labels that ground the platform in its core developer identity.

---

## 2. Color System

PeerY uses a curated palette tailored to different sections and actions. Avoid using generic primaries.

### Core Brand & Neutrals

| Token | Hex Value | Tailwind Class | Description |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `#2563eb` | `bg-blue-600` / `text-blue-600` | Used for primary CTAs, links, and focus highlights. |
| **Deep Text** | `#09090b` | `text-zinc-950` | Default color for main headings and strong text. |
| **Muted Text** | `#71717a` | `text-zinc-500` | Sub-headings, meta descriptions, and secondary captions. |
| **Faint Text** | `#a1a1aa` | `text-zinc-400` | Monospace tags, labels, and window chromes. |
| **Grid Background**| Mesh | `grid-bg` | A subtle grid mesh design layered over secondary sections. |
| **Border Neutral** | `#e4e4e7` (80% Opacity) | `border-zinc-200/80` | Default border for cards, buttons, and input elements. |

### Journey & Category Highlights

To differentiate areas of the product, five distinct color schemes are used in elements like tags, icons, and gradients:

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  AI Learn    │   │  Connect     │   │  Build       │   │  Contribute  │   │  Grow        │
│  Blue        │   │  Emerald     │   │  Violet      │   │  Amber       │   │  Indigo      │
│  #2563eb     │   │  #059669     │   │  #7c3aed     │   │  #d97706     │   │  #4f46e5     │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

*   **AI Learning (Blue):** `#2563eb` | `text-blue-600`, `bg-blue-50`, `border-blue-100`
*   **Connecting (Emerald):** `#059669` | `text-emerald-600`, `bg-emerald-50`, `border-emerald-100`
*   **Building (Violet):** `#7c3aed` | `text-violet-600`, `bg-violet-50`, `border-violet-100`
*   **Contributing (Amber):** `#d97706` | `text-amber-600`, `bg-amber-50`, `border-amber-100`
*   **Growth (Indigo):** `#4f46e5` | `text-indigo-600`, `bg-indigo-50`, `border-indigo-100`

---

## 3. Typography Hierarchy

The typography structure uses contrasting weights and styles to establish a strong reading hierarchy.

*   **Display Headings:** Big, heavy title blocks.
    *   *Classes:* `text-5xl md:text-7xl lg:text-[80px] font-black tracking-tight leading-[1.03] text-zinc-950`
    *   *Usage:* Hero title.
*   **Section Titles:** Broad section dividers.
    *   *Classes:* `text-3xl md:text-4xl font-black tracking-tight text-zinc-950`
    *   *Usage:* Bento grids and testimonials header.
*   **Secondary Lead:** Descriptive subtitles.
    *   *Classes:* `text-lg md:text-xl text-zinc-500 font-light leading-relaxed`
    *   *Usage:* Underneath hero headings.
*   **Mono Labels:** Informative metadata or debug logs.
    *   *Classes:* `text-xs font-mono tracking-wider text-zinc-400`
    *   *Usage:* Versioning labels, steps counters.
*   **Handwritten Highlights:** Informative notes that break the grid.
    *   *Classes:* `font-handwriting text-2xl text-blue-600/75 tracking-wide`
    *   *Usage:* Contextual arrows and side comments (e.g. *"your co-founder might be here →"*).

---

## 4. Layout & Spacing

*   **Page Container:** All layouts reside within standard max-width boundaries:
    *   *Desktop:* `max-w-7xl mx-auto px-6 md:px-12`
    *   *Inner Content:* `max-w-5xl` or `max-w-[1200px]` depending on column densities.
*   **Section Spacing:** Generous breathing room:
    *   *Padding:* `pt-32 pb-24` or `py-32`
*   **Grid Systems:**
    *   Hero uses a balanced 2-column split (Typography & CTAs on left, Interactive Story Panel on right).
    *   Features use an asymmetrical 2x2 Bento grid with dynamic heights (`h-[450px]`) and generous borders (`rounded-[32px]` or `rounded-[36px]`).

---

## 5. Animations (Framer Motion)

PeerY implements micro-animations to enhance user experience:

### Spring-based Transitions
Smooth physical motion for layout transitions:
```typescript
const springTransition = {
  type: "spring" as const,
  stiffness: 320,
  damping: 30,
  mass: 0.8
};
```
*   *Usage:* Floating navbar. Upon scrolling past `40px`, the header morphs from a full-width flat panel (`w-full border-transparent bg-transparent`) into a centered pill (`max-w-3xl bg-white/70 backdrop-blur-xl border-zinc-200/80 rounded-full`).

### Hand-drawn SVG Path Underlines
SVG paths that write themselves when entering the viewport:
*   *Implementation:* `<motion.path d="..." initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeOut" }} />`
*   *Usage:* The animated blue loop underline beneath the word "online." in the hero title.

### Auto-cycling Story Panels
Framer Motion `AnimatePresence` handles switching panels sequentially:
*   *Parameters:* `initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -18, scale: 0.98 }}`
*   *Interval:* Loops through steps every 2800ms.

---

## 6. Components Breakdown

### 1. Floating Nav
*   **State Idle:** Wide spacing, transparent background, bold logo.
*   **State Scrolled:** Compact rounded pill, border, background overlay with glassmorphism blur. Hover effects include centered lines expanding outwards.

### 2. Bento Cards (Ecosystem Section)
*   **Card 1 (Structured Roadmaps):** Animates a vertical tree hierarchy (React → TypeScript → Backend) using color shifting blocks.
*   **Card 2 (AI Mentor):** Features a large background watermark ("AI") with a glowing blue dot (`shadow-[0_0_25px_rgba(37,99,235,0.8)]`) traversing a dashed path representing learning progression.
*   **Card 3 (Peer Matching):** Highlights bold black typography ("WE FIND THE OTHERS") with floating skill chips and a pulsing active user counter.
*   **Card 4 (Projects Pipeline):** Depicts a numerical stepper (1. Idea, 2. Team, 3. Build, 4. Ship) connected by horizontal progress bars, coupled with a pulsing green indicator.
