import { randomUUID } from "node:crypto";

type CreateUpvoteParams = {
  id?: string;
  feedbackId: string;
  userId: string;
  createdAt?: string;
};

export class Upvote {
  id: string;
  feedbackId: string;
  userId: string;
  createdAt: string;

  constructor({ id, feedbackId, userId, createdAt }: CreateUpvoteParams) {
    this.id = id ?? randomUUID();
    this.feedbackId = feedbackId;
    this.userId = userId;
    this.createdAt = createdAt ?? new Date().toISOString();
  }
}
