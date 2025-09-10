import type { LearningPath } from "@/types/path"

export const PATHS: LearningPath[] = [
  {
    id: "react-basics",
    title: "React Basics",
    description: "Fundamentals of React: components, props, state, effects.",
    tags: ["react", "frontend", "beginner"],
    steps: [
      { id: "components", title: "Components & JSX", estMinutes: 20 },
      { id: "props", title: "Props & Composition", estMinutes: 15 },
      { id: "state", title: "State & Events", estMinutes: 20 },
      { id: "effects", title: "Effects & Lifecycle", estMinutes: 20 },
      { id: "lists-keys", title: "Lists & Keys", estMinutes: 15 },
    ],
  },
  {
    id: "typescript-essentials",
    title: "TypeScript Essentials",
    description: "Types, generics, narrowing, and React+TS patterns.",
    tags: ["typescript", "web", "beginner"],
    steps: [
      { id: "types", title: "Basic & Union Types", estMinutes: 20 },
      { id: "generics", title: "Generics & Inference", estMinutes: 25 },
      { id: "narrowing", title: "Narrowing & Guards", estMinutes: 20 },
      { id: "react-ts", title: "React + TS Patterns", estMinutes: 25 },
      { id: "tooling", title: "Tooling & TSConfig", estMinutes: 15 },
    ],
  },
  {
    id: "python-data",
    title: "Python for Data",
    description: "Data handling with Python: lists, dicts, files, and basics.",
    tags: ["python", "data", "beginner"],
    steps: [
      { id: "syntax", title: "Syntax & Data Types", estMinutes: 20 },
      { id: "collections", title: "Lists & Dicts", estMinutes: 20 },
      { id: "files", title: "Reading & Writing Files", estMinutes: 20 },
      { id: "venv", title: "Virtualenv & Packages", estMinutes: 15 },
      { id: "scripts", title: "Scripts & Modules", estMinutes: 20 },
    ],
  },
]
