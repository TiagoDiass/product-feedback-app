import {
  InMemoryFeedbackRepository,
  InMemoryUserRepository,
} from "@/domain/repositories/impl";
import { CreateFeedbackUsecase } from "./create-feedback";
import {
  InternalServerError,
  UserNotFoundException,
} from "@/domain/exceptions";
import { User } from "@/domain/entities";

describe("Usecase: CreateFeedback", () => {
  it("creates a feedback", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const createFeedback = new CreateFeedbackUsecase(
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

    const result = await createFeedback.execute({
      title: "Add dark mode",
      content: "It would be great to have a dark mode option",
      category: "feature",
      creatorId: user.id,
    });

    const feedback = await feedbackRepository.findById(result.id);

    expect(result).toEqual(feedback);

    expect(feedback).toMatchObject({
      title: "Add dark mode",
      category: "feature",
      description: "It would be great to have a dark mode option",
      creatorId: user.id,
      upvotes: 0,
      status: "suggestion",
    });
    expect(feedback?.id).toBeDefined();
    expect(feedback?.createdAt).toBeDefined();
  });

  it("throws an error if the user does not exist", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const createFeedback = new CreateFeedbackUsecase(
      feedbackRepository,
      userRepository
    );

    try {
      await createFeedback.execute({
        title: "Add dark mode",
        content: "It would be great to have a dark mode option",
        category: "feature",
        creatorId: "non-existent-user-id",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UserNotFoundException);
      expect((error as UserNotFoundException).message).toBe("User not found");
      expect((error as UserNotFoundException).statusCode).toBe(404);
    }
  });

  it("throws an error if the repository fails", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const createFeedback = new CreateFeedbackUsecase(
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

    vi.spyOn(feedbackRepository, "create").mockRejectedValue(new Error());

    try {
      await createFeedback.execute({
        title: "Add dark mode",
        content: "It would be great to have a dark mode option",
        category: "feature",
        creatorId: user.id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
      expect((error as InternalServerError).message).toBe(
        "Failed to create feedback"
      );
      expect((error as InternalServerError).statusCode).toBe(500);
    }
  });
});
