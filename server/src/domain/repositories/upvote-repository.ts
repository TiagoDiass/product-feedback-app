import { Upvote } from "@/domain/entities";

export interface UpvoteRepository {
  create(upvote: Upvote): Promise<void>;
  delete(feedbackId: string, userId: string): Promise<void>;
  findByFeedbackAndUser(
    feedbackId: string,
    userId: string
  ): Promise<Upvote | null>;
}
