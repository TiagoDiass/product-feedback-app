import { randomUUID } from "node:crypto";

type CreateCommentParams = {
  id?: string;
  title: string;
  content: string;
  feedbackId: string;
  userId: string;
  parentCommentId?: string | null;
  createdAt?: string;
};

export class Comment {
  id: string;
  title: string;
  content: string;
  feedbackId: string;
  userId: string;
  createdAt: string;
  parentCommentId: string | null;

  constructor({
    id,
    title,
    content,
    feedbackId,
    userId,
    parentCommentId,
    createdAt,
  }: CreateCommentParams) {
    this.id = id ?? randomUUID();
    this.title = title;
    this.content = content;
    this.feedbackId = feedbackId;
    this.userId = userId;
    this.createdAt = createdAt ?? new Date().toISOString();
    this.parentCommentId = parentCommentId ?? null;
  }
}
