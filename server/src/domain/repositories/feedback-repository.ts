import { Feedback } from "@/domain/entities";

export interface FeedbackRepository {
  create(feedback: Feedback): Promise<void>;
  findById(id: string): Promise<Feedback | null>;
}
