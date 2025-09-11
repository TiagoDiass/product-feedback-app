import { UpvoteRepository } from "../upvote-repository";
import { Upvote } from "@/domain/entities";

export class InMemoryUpvoteRepository implements UpvoteRepository {
  private upvotes: Map<string, Upvote> = new Map();

  async create(upvote: Upvote): Promise<void> {
    this.upvotes.set(upvote.id, upvote);
  }

  async delete(feedbackId: string, userId: string): Promise<void> {
    const upvoteToDelete = Array.from(this.upvotes.values()).find(
      (upvote) => upvote.feedbackId === feedbackId && upvote.userId === userId
    );

    if (upvoteToDelete) {
      this.upvotes.delete(upvoteToDelete.id);
    }
  }

  async findByFeedbackAndUser(
    feedbackId: string,
    userId: string
  ): Promise<Upvote | null> {
    return (
      Array.from(this.upvotes.values()).find(
        (upvote) => upvote.feedbackId === feedbackId && upvote.userId === userId
      ) ?? null
    );
  }
}
