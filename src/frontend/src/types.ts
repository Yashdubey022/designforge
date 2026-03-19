export interface Question {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  tags: string[];
  category: string;
  description: string;
  requirements: string[];
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
}

export interface Attempt {
  id: string;
  questionId: number;
  questionTitle: string;
  notes: string;
  score: number;
  date: string;
  canvasData?: string;
}

export interface CanvasComponent {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color?: string;
}

export interface CanvasArrow {
  id: string;
  fromId: string;
  toId: string;
}

export type Page = "home" | "progress";
