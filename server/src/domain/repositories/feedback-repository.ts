import { Feedback } from "../entities/feedback";

export interface FeedbackRepository {
  create(feedback: Feedback): Promise<void>;
  findById(id: string): Promise<Feedback | null>;
}
