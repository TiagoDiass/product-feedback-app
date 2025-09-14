import { UserAlreadyExistsException } from "@/domain/exceptions";
import { CreateUserUsecase } from "@/domain/usecases";
import { FastifyReply, FastifyRequest } from "fastify";

export class UserController {
  constructor(private readonly createUserUsecase: CreateUserUsecase) {}

  async createUser(request: FastifyRequest, reply: FastifyReply) {
    const { name, username, password, pictureUrl } = request.body as {
      name: string;
      username: string;
      password: string;
      pictureUrl: string;
    };

    try {
      const user = await this.createUserUsecase.execute({
        name,
        username,
        password,
        pictureUrl,
      });

      return reply.status(201).send(user);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        return reply.status(400).send({ message: error.message });
      }
      return reply.status(500).send({ message: "Internal server error" });
    }
  }
}
