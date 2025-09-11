import { Comment } from "@/domain/entities";
import {
  CommentRepository,
  FeedbackRepository,
  UserRepository,
} from "@/domain/repositories";
import {
  UserNotFoundException,
  FeedbackNotFoundException,
  CommentNotFoundException,
  InternalServerError,
} from "@/domain/exceptions";

type ReplyCommentUsecaseParams = {
  feedbackId: string;
  content: string;
  creatorId: string;
  parentCommentId: string;
};

export class ReplyCommentUsecase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly feedbackRepository: FeedbackRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(params: ReplyCommentUsecaseParams): Promise<Comment> {
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

      const parentComment = await this.commentRepository.findById(
        params.parentCommentId
      );
      if (!parentComment) {
        throw new CommentNotFoundException("Parent comment not found");
      }

      const replyComment = new Comment({
        content: params.content,
        feedbackId: params.feedbackId,
        userId: params.creatorId,
        parentCommentId: params.parentCommentId,
      });

      await this.commentRepository.create(replyComment);

      return replyComment;
    } catch (error) {
      if (
        error instanceof UserNotFoundException ||
        error instanceof FeedbackNotFoundException ||
        error instanceof CommentNotFoundException
      ) {
        throw error;
      }
      throw new InternalServerError("Failed to reply to comment");
    }
  }
}
