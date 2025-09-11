import { FeedbackRepository } from "../feedback-repository";
import { Feedback } from "@/domain/entities/feedback";

export class InMemoryFeedbackRepository implements FeedbackRepository {
  private feedbacks: Map<string, Feedback> = new Map();

  async create(feedback: Feedback): Promise<void> {
    this.feedbacks.set(feedback.id, feedback);
  }

  async findById(id: string): Promise<Feedback | null> {
    return this.feedbacks.get(id) ?? null;
  }
}
