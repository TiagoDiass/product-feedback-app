import { Feedback } from "@/domain/entities";
import { FeedbackRepository } from "@/domain/repositories";
import { InternalServerError } from "@/domain/exceptions";

type RoadmapResponse = {
  planned: Feedback[];
  "in-progress": Feedback[];
  live: Feedback[];
};

export class GetRoadmapUsecase {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async execute(): Promise<RoadmapResponse> {
    try {
      const [planned, inProgress, live] = await Promise.all([
        this.feedbackRepository.findByStatusAndCategory("planned"),
        this.feedbackRepository.findByStatusAndCategory("in-progress"),
        this.feedbackRepository.findByStatusAndCategory("live"),
      ]);

      return {
        planned,
        "in-progress": inProgress,
        live,
      };
    } catch (error) {
      throw new InternalServerError("Failed to get roadmap");
    }
  }
}
