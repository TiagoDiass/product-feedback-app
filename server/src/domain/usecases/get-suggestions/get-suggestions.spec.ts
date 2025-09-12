import { InMemoryFeedbackRepository } from "@/domain/repositories/impl";
import { GetSuggestionsUsecase } from "./get-suggestions";
import { InternalServerError } from "@/domain/exceptions";
import { Feedback } from "@/domain/entities";

describe("Usecase: GetSuggestions", () => {
  it("gets all suggestions when no category filter is provided", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const getSuggestions = new GetSuggestionsUsecase(feedbackRepository);

    const suggestion1 = new Feedback({
      title: "Feature Suggestion",
      category: "feature",
      description: "Feature Description",
      creatorId: "user1",
      status: "suggestion",
    });

    const suggestion2 = new Feedback({
      title: "UI Suggestion",
      category: "ui",
      description: "UI Description",
      creatorId: "user2",
      status: "suggestion",
    });

    const plannedFeedback = new Feedback({
      title: "Planned Feature",
      category: "feature",
      description: "Planned Description",
      creatorId: "user3",
      status: "planned", // Not a suggestion
    });

    await feedbackRepository.create(suggestion1);
    await feedbackRepository.create(suggestion2);
    await feedbackRepository.create(plannedFeedback);

    const result = await getSuggestions.execute();

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Feature Suggestion",
          category: "feature",
          status: "suggestion",
        }),
        expect.objectContaining({
          title: "UI Suggestion",
          category: "ui",
          status: "suggestion",
        }),
      ])
    );
  });

  it("gets suggestions filtering by category", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const getSuggestions = new GetSuggestionsUsecase(feedbackRepository);

    const featureSuggestion = new Feedback({
      title: "Feature Suggestion",
      category: "feature",
      description: "Feature Description",
      creatorId: "user1",
      status: "suggestion",
    });

    const uiSuggestion = new Feedback({
      title: "UI Suggestion",
      category: "ui",
      description: "UI Description",
      creatorId: "user2",
      status: "suggestion",
    });

    const enhancementSuggestion = new Feedback({
      title: "Enhancement Suggestion",
      category: "enhancement",
      description: "Enhancement Description",
      creatorId: "user3",
      status: "suggestion",
    });

    await feedbackRepository.create(featureSuggestion);
    await feedbackRepository.create(uiSuggestion);
    await feedbackRepository.create(enhancementSuggestion);

    const result = await getSuggestions.execute({ category: "feature" });

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(featureSuggestion);
  });

  it("returns empty array when no suggestions exist", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const getSuggestions = new GetSuggestionsUsecase(feedbackRepository);

    const result = await getSuggestions.execute();

    expect(result).toEqual([]);
  });

  it("returns empty array when no suggestions match the category filter", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const getSuggestions = new GetSuggestionsUsecase(feedbackRepository);

    const featureSuggestion = new Feedback({
      title: "Feature Suggestion",
      category: "feature",
      description: "Feature Description",
      creatorId: "user1",
      status: "suggestion",
    });

    await feedbackRepository.create(featureSuggestion);

    const result = await getSuggestions.execute({ category: "bug" });

    expect(result).toEqual([]);
  });

  it("throws an error if the repository fails", async () => {
    const feedbackRepository = new InMemoryFeedbackRepository();
    const getSuggestions = new GetSuggestionsUsecase(feedbackRepository);

    vi.spyOn(feedbackRepository, "findByStatusAndCategory").mockRejectedValue(
      new Error()
    );

    try {
      await getSuggestions.execute();
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
      expect((error as InternalServerError).message).toBe(
        "Failed to get suggestions"
      );
      expect((error as InternalServerError).statusCode).toBe(500);
    }
  });
});
