import { FeedbackRepository } from "../feedback-repository";
import { Feedback, FeedbackStatus, FeedbackCategory } from "@/domain/entities";

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

  async updateStatus(
    feedbackId: string,
    status: FeedbackStatus
  ): Promise<void> {
    const feedback = this.feedbacks.get(feedbackId);
    if (feedback) {
      feedback.status = status;
      this.feedbacks.set(feedbackId, feedback);
    }
  }

  async findByStatusAndCategory(
    status: FeedbackStatus,
    category?: FeedbackCategory
  ): Promise<Feedback[]> {
    const allFeedbacks = Array.from(this.feedbacks.values());

    return allFeedbacks.filter((feedback) => {
      const matchesStatus = feedback.status === status;
      const matchesCategory = category ? feedback.category === category : true;
      return matchesStatus && matchesCategory;
    });
  }
}
