import { InMemoryFeedbackRepository } from "@/domain/repositories/impl";
import { UpdateFeedbackStatusUsecase } from "./update-feedback-status";
import {
  InternalServerError,
  FeedbackNotFoundException,
} from "@/domain/exceptions";
import { Feedback } from "@/domain/entities";

describe("Usecase: UpdateFeedbackStatus", () => {
  it("updates feedback status successfully", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const updateFeedbackStatus = new UpdateFeedbackStatusUsecase(
      feedbackRepository
    );

    const feedback = new Feedback({
      title: "Feedback Title",
      category: "feature",
      description: "Feedback Description",
      creatorId: "fake-user-id",
      status: "suggestion", // Initial status
    });
    await feedbackRepository.create(feedback);

    const result = await updateFeedbackStatus.execute({
      feedbackId: feedback.id,
      status: "planned",
    });

    expect(result).toMatchObject({
      id: feedback.id,
      title: "Feedback Title",
      category: "feature",
      description: "Feedback Description",
      creatorId: "fake-user-id",
      status: "planned", // Updated status
    });
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeDefined();
  });

  it("updates feedback status from suggestion to in-progress", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const updateFeedbackStatus = new UpdateFeedbackStatusUsecase(
      feedbackRepository
    );

    const feedback = new Feedback({
      title: "Another Feedback",
      category: "ui",
      description: "UI Improvement",
      creatorId: "fake-user-id",
      status: "suggestion",
    });
    await feedbackRepository.create(feedback);

    const result = await updateFeedbackStatus.execute({
      feedbackId: feedback.id,
      status: "in-progress",
    });

    expect(result.status).toBe("in-progress");
  });

  it("updates feedback status from in-progress to live", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const updateFeedbackStatus = new UpdateFeedbackStatusUsecase(
      feedbackRepository
    );

    const feedback = new Feedback({
      title: "Completed Feature",
      category: "enhancement",
      description: "Enhancement Description",
      creatorId: "fake-user-id",
      status: "in-progress",
    });
    await feedbackRepository.create(feedback);

    const result = await updateFeedbackStatus.execute({
      feedbackId: feedback.id,
      status: "live",
    });

    expect(result.status).toBe("live");
  });

  it("throws an error if the feedback does not exist", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const updateFeedbackStatus = new UpdateFeedbackStatusUsecase(
      feedbackRepository
    );

    try {
      await updateFeedbackStatus.execute({
        feedbackId: "non-existent-feedback-id",
        status: "planned",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(FeedbackNotFoundException);
      expect((error as FeedbackNotFoundException).message).toBe(
        "Feedback not found"
      );
      expect((error as FeedbackNotFoundException).statusCode).toBe(404);
    }
  });

  it("throws an error if the repository fails", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const updateFeedbackStatus = new UpdateFeedbackStatusUsecase(
      feedbackRepository
    );

    const feedback = new Feedback({
      title: "Feedback Title",
      category: "feature",
      description: "Feedback Description",
      creatorId: "fake-user-id",
      status: "suggestion",
    });
    await feedbackRepository.create(feedback);

    vi.spyOn(feedbackRepository, "updateStatus").mockRejectedValue(new Error());

    try {
      await updateFeedbackStatus.execute({
        feedbackId: feedback.id,
        status: "planned",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
      expect((error as InternalServerError).message).toBe(
        "Failed to update feedback status"
      );
      expect((error as InternalServerError).statusCode).toBe(500);
    }
  });
});
