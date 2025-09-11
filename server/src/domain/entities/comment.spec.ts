import { Comment } from "./comment";

describe("Entity: Comment", () => {
  it("creates a comment with all properties", () => {
    const comment = new Comment(
      "Comment Title",
      "Comment Content",
      "feedback-id",
      "user-id",
      "fake-parent-commend-id",
      "2021-01-01T00:00:00.000Z",
      "fake-uuid"
    );

    expect(comment).toEqual({
      id: "fake-uuid",
      title: "Comment Title",
      content: "Comment Content",
      feedbackId: "feedback-id",
      userId: "user-id",
      createdAt: "2021-01-01T00:00:00.000Z",
      parentCommentId: "fake-parent-commend-id",
    });
  });

  it("creates a comment with default values if not provided", () => {
    const comment = new Comment(
      "Comment Title",
      "Comment Content",
      "feedback-id",
      "user-id"
    );

    expect(comment).toEqual({
      id: expect.any(String),
      title: "Comment Title",
      content: "Comment Content",
      feedbackId: "feedback-id",
      userId: "user-id",
      createdAt: expect.any(String),
      parentCommentId: null,
    });
  });
});
