import { Upvote } from "@/domain/entities";
import {
  UpvoteRepository,
  FeedbackRepository,
  UserRepository,
} from "@/domain/repositories";
import {
  UserNotFoundException,
  FeedbackNotFoundException,
  UpvoteAlreadyExistsException,
  InternalServerError,
} from "@/domain/exceptions";

type UpvoteFeedbackUsecaseParams = {
  feedbackId: string;
  userId: string;
};

export class UpvoteFeedbackUsecase {
  constructor(
    private readonly upvoteRepository: UpvoteRepository,
    private readonly feedbackRepository: FeedbackRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(params: UpvoteFeedbackUsecaseParams): Promise<Upvote> {
    try {
      const user = await this.userRepository.findById(params.userId);
      if (!user) {
        throw new UserNotFoundException("User not found");
      }

      const feedback = await this.feedbackRepository.findById(
        params.feedbackId
      );
      if (!feedback) {
        throw new FeedbackNotFoundException("Feedback not found");
      }

      const existingUpvote = await this.upvoteRepository.findByFeedbackAndUser(
        params.feedbackId,
        params.userId
      );
      if (existingUpvote) {
        throw new UpvoteAlreadyExistsException(
          "User has already upvoted this feedback"
        );
      }

      const upvote = new Upvote({
        feedbackId: params.feedbackId,
        userId: params.userId,
      });

      await this.upvoteRepository.create(upvote);
      await this.feedbackRepository.incrementUpvotesCount(params.feedbackId);

      return upvote;
    } catch (error) {
      if (
        error instanceof UserNotFoundException ||
        error instanceof FeedbackNotFoundException ||
        error instanceof UpvoteAlreadyExistsException
      ) {
        throw error;
      }
      throw new InternalServerError("Failed to upvote feedback");
    }
  }
}
