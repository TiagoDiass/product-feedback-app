import {
  InMemoryUpvoteRepository,
  InMemoryFeedbackRepository,
  InMemoryUserRepository,
} from "@/domain/repositories/impl";
import { RemoveUpvoteFromFeedbackUsecase } from "./remove-upvote-from-feedback";
import {
  InternalServerError,
  UpvoteNotFoundException,
} from "@/domain/exceptions";
import { User, Feedback, Upvote } from "@/domain/entities";

describe("Usecase: RemoveUpvoteFromFeedback", () => {
  it("removes an upvote from a feedback", async () => {
    const upvoteRepository = new InMemoryUpvoteRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const removeUpvoteFromFeedback = new RemoveUpvoteFromFeedbackUsecase(
      upvoteRepository,
      feedbackRepository
    );

    const user = new User({
      name: "John Doe",
      username: "john.doe",
      password: "password",
      pictureUrl: "https://example.com/picture.jpg",
    });

    const feedback = new Feedback({
      title: "Feedback Title",
      category: "feature",
      description: "Feedback Description",
      creatorId: user.id,
      upvotesCount: 1,
    });
    await feedbackRepository.create(feedback);

    const existingUpvote = new Upvote({
      feedbackId: feedback.id,
      userId: user.id,
    });
    await upvoteRepository.create(existingUpvote);

    await removeUpvoteFromFeedback.execute({
      feedbackId: feedback.id,
      userId: user.id,
    });

    const removedUpvote = await upvoteRepository.findByFeedbackAndUser(
      feedback.id,
      user.id
    );
    const updatedFeedback = await feedbackRepository.findById(feedback.id);

    expect(removedUpvote).toBeNull();
    expect(updatedFeedback?.upvotesCount).toBe(0);
  });

  it("throws an error if the upvote does not exist", async () => {
    const upvoteRepository = new InMemoryUpvoteRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const removeUpvoteFromFeedback = new RemoveUpvoteFromFeedbackUsecase(
      upvoteRepository,
      feedbackRepository
    );

    try {
      await removeUpvoteFromFeedback.execute({
        feedbackId: "fake-feedback-id",
        userId: "fake-user-id",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UpvoteNotFoundException);
      expect((error as UpvoteNotFoundException).message).toBe(
        "Upvote not found"
      );
      expect((error as UpvoteNotFoundException).statusCode).toBe(404);
    }
  });

  it("throws an error if the repository fails", async () => {
    const upvoteRepository = new InMemoryUpvoteRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const removeUpvoteFromFeedback = new RemoveUpvoteFromFeedbackUsecase(
      upvoteRepository,
      feedbackRepository
    );

    const feedback = new Feedback({
      title: "Feedback Title",
      category: "feature",
      description: "Feedback Description",
      creatorId: "fake-user-id",
    });
    await feedbackRepository.create(feedback);

    const existingUpvote = new Upvote({
      feedbackId: feedback.id,
      userId: "fake-user-id",
    });
    await upvoteRepository.create(existingUpvote);

    vi.spyOn(upvoteRepository, "delete").mockRejectedValue(new Error());

    try {
      await removeUpvoteFromFeedback.execute({
        feedbackId: feedback.id,
        userId: "fake-user-id",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
      expect((error as InternalServerError).message).toBe(
        "Failed to remove upvote from feedback"
      );
      expect((error as InternalServerError).statusCode).toBe(500);
    }
  });
});
