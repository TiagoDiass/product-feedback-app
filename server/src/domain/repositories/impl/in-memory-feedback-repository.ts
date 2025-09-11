import { FeedbackRepository } from "../feedback-repository";
import { Feedback } from "@/domain/entities";

export class InMemoryFeedbackRepository implements FeedbackRepository {
  private feedbacks: Map<string, Feedback> = new Map();

  async create(feedback: Feedback): Promise<void> {
    this.feedbacks.set(feedback.id, feedback);
  }

  async findById(id: string): Promise<Feedback | null> {
    return this.feedbacks.get(id) ?? null;
  }

  async incrementUpvotesCount(feedbackId: string): Promise<void> {
    const feedback = this.feedbacks.get(feedbackId);
    if (feedback) {
      feedback.upvotesCount += 1;
      this.feedbacks.set(feedbackId, feedback);
    }
  }

  async decrementUpvotesCount(feedbackId: string): Promise<void> {
    const feedback = this.feedbacks.get(feedbackId);
    if (feedback) {
      feedback.upvotesCount = Math.max(0, feedback.upvotesCount - 1);
      this.feedbacks.set(feedbackId, feedback);
    }
  }
}
