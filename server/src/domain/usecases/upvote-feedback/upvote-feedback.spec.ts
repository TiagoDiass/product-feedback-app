import {
  InMemoryUpvoteRepository,
  InMemoryFeedbackRepository,
  InMemoryUserRepository,
} from "@/domain/repositories/impl";
import { UpvoteFeedbackUsecase } from "./upvote-feedback";
import {
  InternalServerError,
  UserNotFoundException,
  FeedbackNotFoundException,
  UpvoteAlreadyExistsException,
} from "@/domain/exceptions";
import { User, Feedback, Upvote } from "@/domain/entities";

describe("Usecase: UpvoteFeedback", () => {
  it("upvotes a feedback", async () => {
    const upvoteRepository = new InMemoryUpvoteRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const upvoteFeedback = new UpvoteFeedbackUsecase(
      upvoteRepository,
      feedbackRepository,
      userRepository
    );

    const user = new User({
      name: "John Doe",
      username: "john.doe",
      password: "password",
      pictureUrl: "https://example.com/picture.jpg",
    });
    await userRepository.create(user);

    const feedback = new Feedback({
      title: "Feedback Title",
      category: "feature",
      description: "Feedback Description",
      creatorId: user.id,
    });
    await feedbackRepository.create(feedback);

    const result = await upvoteFeedback.execute({
      feedbackId: feedback.id,
      userId: user.id,
    });

    const savedUpvote = await upvoteRepository.findByFeedbackAndUser(
      feedback.id,
      user.id
    );
    const updatedFeedback = await feedbackRepository.findById(feedback.id);

    expect(result).toEqual(savedUpvote);
    expect(savedUpvote).toMatchObject({
      feedbackId: feedback.id,
      userId: user.id,
    });
    expect(savedUpvote?.id).toBeDefined();
    expect(savedUpvote?.createdAt).toBeDefined();
    expect(updatedFeedback?.upvotesCount).toBe(1);
  });

  it("throws an error if the user does not exist", async () => {
    const upvoteRepository = new InMemoryUpvoteRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const upvoteFeedback = new UpvoteFeedbackUsecase(
      upvoteRepository,
      feedbackRepository,
      userRepository
    );

    const feedback = new Feedback({
      title: "Feedback Title",
      category: "feature",
      description: "Feedback Description",
      creatorId: "non-existent-user-id",
    });
    await feedbackRepository.create(feedback);

    try {
      await upvoteFeedback.execute({
        feedbackId: feedback.id,
        userId: "non-existent-user-id",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UserNotFoundException);
      expect((error as UserNotFoundException).message).toBe("User not found");
      expect((error as UserNotFoundException).statusCode).toBe(404);
    }
  });

  it("throws an error if the feedback does not exist", async () => {
    const upvoteRepository = new InMemoryUpvoteRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const upvoteFeedback = new UpvoteFeedbackUsecase(
      upvoteRepository,
      feedbackRepository,
      userRepository
    );

    const user = new User({
      name: "John Doe",
      username: "john.doe",
      password: "password",
      pictureUrl: "https://example.com/picture.jpg",
    });
    await userRepository.create(user);

    try {
      await upvoteFeedback.execute({
        feedbackId: "non-existent-feedback-id",
        userId: user.id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(FeedbackNotFoundException);
      expect((error as FeedbackNotFoundException).message).toBe(
        "Feedback not found"
      );
      expect((error as FeedbackNotFoundException).statusCode).toBe(404);
    }
  });

  it("throws an error if the user has already upvoted the feedback", async () => {
    const upvoteRepository = new InMemoryUpvoteRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const upvoteFeedback = new UpvoteFeedbackUsecase(
      upvoteRepository,
      feedbackRepository,
      userRepository
    );

    const user = new User({
      name: "John Doe",
      username: "john.doe",
      password: "password",
      pictureUrl: "https://example.com/picture.jpg",
    });
    await userRepository.create(user);

    const feedback = new Feedback({
      title: "Feedback Title",
      category: "feature",
      description: "Feedback Description",
      creatorId: user.id,
    });
    await feedbackRepository.create(feedback);

    // Create an existing upvote
    const existingUpvote = new Upvote({
      feedbackId: feedback.id,
      userId: user.id,
    });
    await upvoteRepository.create(existingUpvote);

    try {
      await upvoteFeedback.execute({
        feedbackId: feedback.id,
        userId: user.id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UpvoteAlreadyExistsException);
      expect((error as UpvoteAlreadyExistsException).message).toBe(
        "User has already upvoted this feedback"
      );
      expect((error as UpvoteAlreadyExistsException).statusCode).toBe(400);
    }
  });

  it("throws an error if the repository fails", async () => {
    const upvoteRepository = new InMemoryUpvoteRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const upvoteFeedback = new UpvoteFeedbackUsecase(
      upvoteRepository,
      feedbackRepository,
      userRepository
    );

    const user = new User({
      name: "John Doe",
      username: "john.doe",
      password: "password",
      pictureUrl: "https://example.com/picture.jpg",
    });
    await userRepository.create(user);

    const feedback = new Feedback({
      title: "Feedback Title",
      category: "feature",
      description: "Feedback Description",
      creatorId: user.id,
    });
    await feedbackRepository.create(feedback);

    vi.spyOn(upvoteRepository, "create").mockRejectedValue(new Error());

    try {
      await upvoteFeedback.execute({
        feedbackId: feedback.id,
        userId: user.id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
      expect((error as InternalServerError).message).toBe(
        "Failed to upvote feedback"
      );
      expect((error as InternalServerError).statusCode).toBe(500);
    }
  });
});
