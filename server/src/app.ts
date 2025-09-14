import Fastify from "fastify";
import {
  InMemoryFeedbackRepository,
  InMemoryUserRepository,
} from "./domain/repositories/impl";
import {
  CreateFeedbackUsecase,
  CreateUserUsecase,
  GetSuggestionsUsecase,
} from "./domain/usecases";
import { UserController } from "./controllers/user-controller";
import { FeedbackController } from "./controllers/feedback-controller";
const fastify = Fastify({
  logger: true,
});

const userRepository = new InMemoryUserRepository();
const feedbackRepository = new InMemoryFeedbackRepository();

const createUserUsecase = new CreateUserUsecase(userRepository);
const userController = new UserController(createUserUsecase);

const createFeedbackUsecase = new CreateFeedbackUsecase(
  feedbackRepository,
  userRepository
);
const getSuggestionsUsecase = new GetSuggestionsUsecase(feedbackRepository);
const feedbackController = new FeedbackController(
  createFeedbackUsecase,
  getSuggestionsUsecase
);

fastify.post("/users", async (request, reply) => {
  return userController.createUser(request, reply);
});

fastify.post("/feedbacks", async (request, reply) => {
  return feedbackController.createFeedback(request, reply);
});

fastify.get("/feedbacks/suggestions", async (request, reply) => {
  return feedbackController.getSuggestions(request, reply);
});

const start = async () => {
  try {
    await fastify.listen({ port: 3333 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
