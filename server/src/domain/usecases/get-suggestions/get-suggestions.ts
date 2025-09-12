import { Feedback, FeedbackCategory } from "@/domain/entities";
import { FeedbackRepository } from "@/domain/repositories";
import { InternalServerError } from "@/domain/exceptions";

type GetSuggestionsUsecaseParams = {
  category?: FeedbackCategory;
};

export class GetSuggestionsUsecase {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async execute(params: GetSuggestionsUsecaseParams = {}): Promise<Feedback[]> {
    try {
      const feedbacks = await this.feedbackRepository.findByStatusAndCategory(
        "suggestion",
        params.category
      );

      return feedbacks;
    } catch (error) {
      throw new InternalServerError("Failed to get suggestions");
    }
  }
}
