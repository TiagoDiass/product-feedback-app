import { Feedback, FeedbackStatus } from "@/domain/entities";
import { FeedbackRepository } from "@/domain/repositories";
import {
  FeedbackNotFoundException,
  InternalServerError,
} from "@/domain/exceptions";

type UpdateFeedbackStatusUsecaseParams = {
  feedbackId: string;
  status: FeedbackStatus;
};

export class UpdateFeedbackStatusUsecase {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async execute(params: UpdateFeedbackStatusUsecaseParams): Promise<Feedback> {
    try {
      const feedback = await this.feedbackRepository.findById(
        params.feedbackId
      );
      if (!feedback) {
        throw new FeedbackNotFoundException();
      }

      await this.feedbackRepository.updateStatus(
        params.feedbackId,
        params.status
      );

      feedback.status = params.status;
      return feedback;
    } catch (error) {
      if (error instanceof FeedbackNotFoundException) {
        throw error;
      }
      throw new InternalServerError("Failed to update feedback status");
    }
  }
}
