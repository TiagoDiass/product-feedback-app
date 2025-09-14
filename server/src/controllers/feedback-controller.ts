import { FeedbackCategory } from "@/domain/entities";
import { UserNotFoundException } from "@/domain/exceptions";
import {
  CreateFeedbackUsecase,
  GetSuggestionsUsecase,
} from "@/domain/usecases";
import { FastifyRequest, FastifyReply } from "fastify";

export class FeedbackController {
  constructor(
    private readonly createFeedbackUsecase: CreateFeedbackUsecase,
    private readonly getSuggestionsUsecase: GetSuggestionsUsecase
  ) {}

  async createFeedback(request: FastifyRequest, reply: FastifyReply) {
    const { title, content, category, creatorId } = request.body as {
      title: string;
      content: string;
      category: FeedbackCategory;
      creatorId: string;
    };

    try {
      const feedback = await this.createFeedbackUsecase.execute({
        title,
        content,
        category,
        creatorId,
      });

      return reply.status(201).send(feedback);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  async getSuggestions(request: FastifyRequest, reply: FastifyReply) {
    const { category } = request.query as {
      category: FeedbackCategory;
    };

    try {
      const suggestions = await this.getSuggestionsUsecase.execute({
        category,
      });

      return reply.status(200).send(suggestions);
    } catch (error) {
      return reply.status(500).send({ message: "Internal server error" });
    }
  }
}
