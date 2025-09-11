import { Feedback } from "@/domain/entities";

export interface FeedbackRepository {
  create(feedback: Feedback): Promise<void>;
  findById(id: string): Promise<Feedback | null>;
  incrementUpvotesCount(feedbackId: string): Promise<void>;
  decrementUpvotesCount(feedbackId: string): Promise<void>;
}
