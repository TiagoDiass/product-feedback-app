import { randomUUID } from "node:crypto";

export class Comment {
  id: string;
  title: string;
  content: string;
  feedbackId: string;
  userId: string;
  createdAt: string;
  parentCommentId: string | null;

  constructor(
    title: string,
    content: string,
    feedbackId: string,
    userId: string,
    parentCommentId: string | null = null,
    createdAt?: string,
    id?: string
  ) {
    this.id = id ?? randomUUID();
    this.title = title;
    this.content = content;
    this.feedbackId = feedbackId;
    this.userId = userId;
    this.createdAt = createdAt ?? new Date().toISOString();
    this.parentCommentId = parentCommentId ?? null;
  }
}
