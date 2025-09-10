import { randomUUID } from "node:crypto";

export type FeedbackCategory = "feature" | "ui" | "ux" | "enhancement" | "bug";
export type FeedbackStatus = "suggestion" | "planned" | "in-progress" | "live";

export class Feedback {
  id: string;
  title: string;
  category: FeedbackCategory;
  description: string;
  status: FeedbackStatus;
  upvotes: number;
  creatorId: string;
  createdAt: string;

  constructor(
    title: string,
    category: FeedbackCategory,
    description: string,
    creatorId: string,
    upvotes?: number,
    status?: FeedbackStatus,
    id?: string,
    createdAt?: string
  ) {
    this.id = id ?? randomUUID();
    this.title = title;
    this.category = category;
    this.description = description;
    this.creatorId = creatorId;
    this.upvotes = upvotes ?? 0;
    this.status = status ?? "suggestion";
    this.createdAt = createdAt ?? new Date().toISOString();
  }
}
