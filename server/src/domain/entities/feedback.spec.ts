import { Feedback } from "./feedback";

describe("Entity: Feedback", () => {
  it("creates a feedback with all properties", () => {
    const feedback = new Feedback(
      "Feedback Title",
      "feature",
      "Feedback Description",
      "creator-id",
      10,
      "in-progress",
      "fake-uuid",
      "2021-01-01T00:00:00.000Z"
    );

    expect(feedback).toEqual({
      id: "fake-uuid",
      title: "Feedback Title",
      category: "feature",
      description: "Feedback Description",
      status: "in-progress",
      upvotes: 10,
      creatorId: "creator-id",
      createdAt: "2021-01-01T00:00:00.000Z",
    });
  });

  it("creates a feedback with default values if not provided", () => {
    const feedback = new Feedback(
      "Feedback Title",
      "feature",
      "Feedback Description",
      "creator-id"
    );

    expect(feedback).toEqual({
      id: expect.any(String),
      title: "Feedback Title",
      category: "feature",
      description: "Feedback Description",
      status: "suggestion",
      upvotes: 0,
      creatorId: "creator-id",
      createdAt: expect.any(String),
    });
  });
});
