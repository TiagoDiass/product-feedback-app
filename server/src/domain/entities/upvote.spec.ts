import { Upvote } from "./upvote";

describe("Entity: Upvote", () => {
  it("creates an upvote with all properties", () => {
    const upvote = new Upvote({
      id: "fake-uuid",
      feedbackId: "feedback-id",
      userId: "user-id",
      createdAt: "2021-01-01T00:00:00.000Z",
    });

    expect(upvote).toEqual({
      id: "fake-uuid",
      feedbackId: "feedback-id",
      userId: "user-id",
      createdAt: "2021-01-01T00:00:00.000Z",
    });
  });

  it("creates an upvote with default values if not provided", () => {
    const upvote = new Upvote({
      feedbackId: "feedback-id",
      userId: "user-id",
    });

    expect(upvote).toEqual({
      id: expect.any(String),
      feedbackId: "feedback-id",
      userId: "user-id",
      createdAt: expect.any(String),
    });
  });
});
