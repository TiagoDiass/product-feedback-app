import {
  InMemoryCommentRepository,
  InMemoryFeedbackRepository,
  InMemoryUserRepository,
} from "@/domain/repositories/impl";
import { ReplyCommentUsecase } from "./reply-comment";
import {
  InternalServerError,
  UserNotFoundException,
  FeedbackNotFoundException,
  CommentNotFoundException,
} from "@/domain/exceptions";
import { User, Feedback, Comment } from "@/domain/entities";

describe("Usecase: ReplyComment", () => {
  it("replies to a comment", async () => {
    const commentRepository = new InMemoryCommentRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const replyComment = new ReplyCommentUsecase(
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

    const parentComment = new Comment({
      content: "Parent Comment Content",
      feedbackId: feedback.id,
      userId: user.id,
    });
    await commentRepository.create(parentComment);

    const result = await replyComment.execute({
      feedbackId: feedback.id,
      content: "Reply Comment Content",
      creatorId: user.id,
      parentCommentId: parentComment.id,
    });

    const savedReply = await commentRepository.findById(result.id);

    expect(result).toEqual(savedReply);
    expect(savedReply).toMatchObject({
      content: "Reply Comment Content",
      feedbackId: feedback.id,
      userId: user.id,
      parentCommentId: parentComment.id,
    });
    expect(savedReply?.id).toBeDefined();
    expect(savedReply?.createdAt).toBeDefined();
  });

  it("throws an error if the user does not exist", async () => {
    const commentRepository = new InMemoryCommentRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const replyComment = new ReplyCommentUsecase(
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

    const parentComment = new Comment({
      content: "Parent Comment Content",
      feedbackId: feedback.id,
      userId: "fake-user-id",
    });
    await commentRepository.create(parentComment);

    try {
      await replyComment.execute({
        feedbackId: feedback.id,
        content: "Reply Comment Content",
        creatorId: "non-existent-user-id",
        parentCommentId: parentComment.id,
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
    const replyComment = new ReplyCommentUsecase(
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

    const parentComment = new Comment({
      content: "Parent Comment Content",
      feedbackId: "fake-feedback-id",
      userId: user.id,
    });
    await commentRepository.create(parentComment);

    try {
      await replyComment.execute({
        feedbackId: "non-existent-feedback-id",
        content: "Reply Comment Content",
        creatorId: user.id,
        parentCommentId: parentComment.id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(FeedbackNotFoundException);
      expect((error as FeedbackNotFoundException).message).toBe(
        "Feedback not found"
      );
      expect((error as FeedbackNotFoundException).statusCode).toBe(404);
    }
  });

  it("throws an error if the parent comment does not exist", async () => {
    const commentRepository = new InMemoryCommentRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const replyComment = new ReplyCommentUsecase(
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

    try {
      await replyComment.execute({
        feedbackId: feedback.id,
        content: "Reply Comment Content",
        creatorId: user.id,
        parentCommentId: "non-existent-comment-id",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(CommentNotFoundException);
      expect((error as CommentNotFoundException).message).toBe(
        "Parent comment not found"
      );
      expect((error as CommentNotFoundException).statusCode).toBe(404);
    }
  });

  it("throws an error if the repository fails", async () => {
    const commentRepository = new InMemoryCommentRepository();
    const feedbackRepository = new InMemoryFeedbackRepository();
    const userRepository = new InMemoryUserRepository();
    const replyComment = new ReplyCommentUsecase(
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

    const parentComment = new Comment({
      content: "Parent Comment Content",
      feedbackId: feedback.id,
      userId: user.id,
    });
    await commentRepository.create(parentComment);

    vi.spyOn(commentRepository, "create").mockRejectedValue(new Error());

    try {
      await replyComment.execute({
        feedbackId: feedback.id,
        content: "Reply Comment Content",
        creatorId: user.id,
        parentCommentId: parentComment.id,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
      expect((error as InternalServerError).message).toBe(
        "Failed to reply to comment"
      );
      expect((error as InternalServerError).statusCode).toBe(500);
    }
  });
});
