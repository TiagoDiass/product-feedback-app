import { User } from "@/domain/entities/user";
import {
  InternalServerError,
  UserAlreadyExistsException,
} from "@/domain/exceptions";
import { UserRepository } from "@/domain/repositories/user-repository";

export type CreateUserUsecaseParams = {
  name: string;
  username: string;
  password: string;
  pictureUrl: string | null;
};

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: CreateUserUsecaseParams): Promise<void> {
    try {
      const existingUser = await this.userRepository.findByUsername(
        params.username
      );

      if (existingUser) {
        throw new UserAlreadyExistsException();
      }

      const user = new User({
        name: params.name,
        username: params.username,
        password: params.password,
        pictureUrl: params.pictureUrl,
      });

      await this.userRepository.create(user);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw error;
      }

      throw new InternalServerError("Failed to create user");
    }
  }
}
