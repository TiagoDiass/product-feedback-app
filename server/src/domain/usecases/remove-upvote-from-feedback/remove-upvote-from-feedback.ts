import { UpvoteRepository, FeedbackRepository } from "@/domain/repositories";
import {
  UpvoteNotFoundException,
  InternalServerError,
} from "@/domain/exceptions";

type RemoveUpvoteFromFeedbackUsecaseParams = {
  feedbackId: string;
  userId: string;
};

export class RemoveUpvoteFromFeedbackUsecase {
  constructor(
    private readonly upvoteRepository: UpvoteRepository,
    private readonly feedbackRepository: FeedbackRepository
  ) {}

  async execute(params: RemoveUpvoteFromFeedbackUsecaseParams): Promise<void> {
    try {
      const existingUpvote = await this.upvoteRepository.findByFeedbackAndUser(
        params.feedbackId,
        params.userId
      );

      if (!existingUpvote) {
        throw new UpvoteNotFoundException();
      }

      await this.upvoteRepository.delete(params.feedbackId, params.userId);
      await this.feedbackRepository.decrementUpvotesCount(params.feedbackId);
    } catch (error) {
      if (error instanceof UpvoteNotFoundException) {
        throw error;
      }
      throw new InternalServerError("Failed to remove upvote from feedback");
    }
  }
}
