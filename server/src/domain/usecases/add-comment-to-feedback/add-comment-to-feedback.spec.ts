import { InMemoryFeedbackRepository } from "@/domain/repositories/impl/in-memory-feedback-repository";
import { InMemoryUserRepository } from "@/domain/repositories/impl/in-memory-user-repository";
import { InMemoryCommentRepository } from "@/domain/repositories/impl/in-memory-comment-repository";
import { AddCommentToFeedbackUsecase } from "./add-comment-to-feedback";
import {
  InternalServerError,
  UserNotFoundException,
  FeedbackNotFoundException,
} from "@/domain/exceptions";
import { User } from "@/domain/entities/user";
import { Feedback } from "@/domain/entities/feedback";

describe("Usecase: AddCommentToFeedback", () => {
  it("adds a comment to a feedback", async () => {
    const commentRepository = new InMemoryCommentRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const addCommentToFeedback = new AddCommentToFeedbackUsecase(
      commentRepository,
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

    const result = await addCommentToFeedback.execute({
      feedbackId: feedback.id,
      content: "Comment Content",
      creatorId: user.id,
    });

    const comment = await commentRepository.findById(result.id);

    expect(result).toEqual(comment);
    expect(comment).toMatchObject({
      content: "Comment Content",
      feedbackId: feedback.id,
      userId: user.id,
    });
    expect(comment?.id).toBeDefined();
    expect(comment?.createdAt).toBeDefined();
  });

  it("throws an error if the user does not exist", async () => {
    const commentRepository = new InMemoryCommentRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const addCommentToFeedback = new AddCommentToFeedbackUsecase(
      commentRepository,
      feedbackRepository,
      userRepository
    );

    const feedback = new Feedback({
      title: "Feedback Title",
      category: "feature",
      description: "Feedback Description",
      creatorId: "fake-user-id",
    });
    await feedbackRepository.create(feedback);

    try {
      await addCommentToFeedback.execute({
        feedbackId: feedback.id,
        content: "Comment Content",
        creatorId: "non-existent-user-id",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UserNotFoundException);
      expect((error as UserNotFoundException).message).toBe("User not found");
      expect((error as UserNotFoundException).statusCode).toBe(404);
    }
  });

  it("throws an error if the feedback does not exist", async () => {
    const commentRepository = new InMemoryCommentRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const addCommentToFeedback = new AddCommentToFeedbackUsecase(
      commentRepository,
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
      await addCommentToFeedback.execute({
        feedbackId: "non-existent-feedback-id",
        content: "Comment Content",
        creatorId: user.id,
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
    const commentRepository = new InMemoryCommentRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const addCommentToFeedback = new AddCommentToFeedbackUsecase(
      commentRepository,
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

    vi.spyOn(commentRepository, "create").mockRejectedValue(new Error());

    try {
      await addCommentToFeedback.execute({
        feedbackId: feedback.id,
        content: "Comment Content",
        creatorId: user.id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
      expect((error as InternalServerError).message).toBe(
        "Failed to add comment to feedback"
      );
      expect((error as InternalServerError).statusCode).toBe(500);
    }
  });
});
