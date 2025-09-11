import { Comment } from "@/domain/entities/comment";
import {
  CommentRepository,
  FeedbackRepository,
  UserRepository,
} from "@/domain/repositories";
import {
  UserNotFoundException,
  FeedbackNotFoundException,
  InternalServerError,
} from "@/domain/exceptions";

type AddCommentToFeedbackUsecaseParams = {
  feedbackId: string;
  content: string;
  creatorId: string;
};

export class AddCommentToFeedbackUsecase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly feedbackRepository: FeedbackRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(params: AddCommentToFeedbackUsecaseParams): Promise<Comment> {
    try {
      const user = await this.userRepository.findById(params.creatorId);
      if (!user) {
        throw new UserNotFoundException("User not found");
      }

      const feedback = await this.feedbackRepository.findById(
        params.feedbackId
      );
      if (!feedback) {
        throw new FeedbackNotFoundException("Feedback not found");
      }

      const comment = new Comment({
        content: params.content,
        feedbackId: params.feedbackId,
        userId: params.creatorId,
      });

      await this.commentRepository.create(comment);

      return comment;
    } catch (error) {
      if (
        error instanceof UserNotFoundException ||
        error instanceof FeedbackNotFoundException
      ) {
        throw error;
      }
      throw new InternalServerError("Failed to add comment to feedback");
    }
  }
}
