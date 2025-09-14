import { InMemoryFeedbackRepository } from "@/domain/repositories/impl";
import { GetRoadmapUsecase } from "./get-roadmap";
import { InternalServerError } from "@/domain/exceptions";
import { Feedback } from "@/domain/entities";

describe("Usecase: GetRoadmap", () => {
  it("returns roadmap with feedbacks organized by status", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const getRoadmap = new GetRoadmapUsecase(feedbackRepository);

    const plannedFeedback1 = new Feedback({
      title: "Planned Feature 1",
      category: "feature",
      description: "Planned Description 1",
      creatorId: "user1",
      status: "planned",
    });

    const plannedFeedback2 = new Feedback({
      title: "Planned Feature 2",
      category: "ui",
      description: "Planned Description 2",
      creatorId: "user2",
      status: "planned",
    });

    const inProgressFeedback = new Feedback({
      title: "In Progress Feature",
      category: "enhancement",
      description: "In Progress Description",
      creatorId: "user3",
      status: "in-progress",
    });

    const liveFeedback = new Feedback({
      title: "Live Feature",
      category: "bug",
      description: "Live Description",
      creatorId: "user4",
      status: "live",
    });

    const suggestionFeedback = new Feedback({
      title: "Suggestion Feature",
      category: "feature",
      description: "Suggestion Description",
      creatorId: "user5",
      status: "suggestion", // Should not appear in roadmap
    });

    await Promise.all([
      feedbackRepository.create(plannedFeedback1),
      feedbackRepository.create(plannedFeedback2),
      feedbackRepository.create(inProgressFeedback),
      feedbackRepository.create(liveFeedback),
      feedbackRepository.create(suggestionFeedback),
    ]);

    const result = await getRoadmap.execute();

    expect(result.planned).toEqual([plannedFeedback1, plannedFeedback2]);
    expect(result["in-progress"]).toEqual([inProgressFeedback]);
    expect(result.live).toEqual([liveFeedback]);
  });

  it("returns empty arrays when no feedbacks exist for each status", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const getRoadmap = new GetRoadmapUsecase(feedbackRepository);

    const result = await getRoadmap.execute();

    expect(result).toEqual({
      planned: [],
      "in-progress": [],
      live: [],
    });
  });

  it("returns partial roadmap when only some statuses have feedbacks", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const getRoadmap = new GetRoadmapUsecase(feedbackRepository);

    const plannedFeedback = new Feedback({
      title: "Planned Feature",
      category: "feature",
      description: "Planned Description",
      creatorId: "user1",
      status: "planned",
    });

    const liveFeedback = new Feedback({
      title: "Live Feature",
      category: "ui",
      description: "Live Description",
      creatorId: "user2",
      status: "live",
    });

    await feedbackRepository.create(plannedFeedback);
    await feedbackRepository.create(liveFeedback);

    const result = await getRoadmap.execute();

    expect(result).toEqual({
      planned: [plannedFeedback],
      "in-progress": [],
      live: [liveFeedback],
    });
  });

  it("includes multiple feedbacks of the same status", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const getRoadmap = new GetRoadmapUsecase(feedbackRepository);

    const liveFeedback1 = new Feedback({
      title: "Live Feature 1",
      category: "feature",
      description: "Live Description 1",
      creatorId: "user1",
      status: "live",
    });

    const liveFeedback2 = new Feedback({
      title: "Live Feature 2",
      category: "ui",
      description: "Live Description 2",
      creatorId: "user2",
      status: "live",
    });

    const liveFeedback3 = new Feedback({
      title: "Live Feature 3",
      category: "enhancement",
      description: "Live Description 3",
      creatorId: "user3",
      status: "live",
    });

    await Promise.all([
      feedbackRepository.create(liveFeedback1),
      feedbackRepository.create(liveFeedback2),
      feedbackRepository.create(liveFeedback3),
    ]);

    const result = await getRoadmap.execute();

    expect(result.live).toEqual([liveFeedback1, liveFeedback2, liveFeedback3]);
    expect(result.planned).toEqual([]);
    expect(result["in-progress"]).toEqual([]);
  });

  it("throws an error if the repository fails", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const getRoadmap = new GetRoadmapUsecase(feedbackRepository);

    vi.spyOn(feedbackRepository, "findByStatusAndCategory").mockRejectedValue(
      new Error()
    );

    try {
      await getRoadmap.execute();
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
      expect((error as InternalServerError).message).toBe(
        "Failed to get roadmap"
      );
      expect((error as InternalServerError).statusCode).toBe(500);
    }
  });
});
