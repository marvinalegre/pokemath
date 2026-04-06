import type { ComponentType } from "react";

export interface Question {
  question_text: string;
  answer: string;
}

export interface QuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export interface QuestionType {
  id: string;
  generate: (params: unknown) => Question;
  validate: (question: Question, answer: string) => boolean;
  component: ComponentType<QuestionProps>;
}

const registry = new Map<string, QuestionType>();

export function registerQuestionType(type: QuestionType): void {
  registry.set(type.id, type);
}

export function getQuestionType(id: string): QuestionType | undefined {
  return registry.get(id);
}

export function getAllQuestionTypes(): QuestionType[] {
  return Array.from(registry.values());
}
