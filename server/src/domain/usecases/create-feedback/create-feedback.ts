import { Feedback, FeedbackCategory } from "@/domain/entities";
import { FeedbackRepository, UserRepository } from "@/domain/repositories";
import {
  UserNotFoundException,
  InternalServerError,
} from "@/domain/exceptions";

type CreateFeedbackUsecaseParams = {
  title: string;
  content: string;
  category: FeedbackCategory;
  creatorId: string;
};

export class CreateFeedbackUsecase {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(params: CreateFeedbackUsecaseParams): Promise<Feedback> {
    try {
      const user = await this.userRepository.findById(params.creatorId);
      if (!user) {
        throw new UserNotFoundException("User not found");
      }

      const feedback = new Feedback({
        title: params.title,
        category: params.category,
        description: params.content,
        creatorId: params.creatorId,
      });

      await this.feedbackRepository.create(feedback);

      return feedback;
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      throw new InternalServerError("Failed to create feedback");
    }
  }
}
