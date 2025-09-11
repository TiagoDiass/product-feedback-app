import { InMemoryUserRepository } from "@/domain/repositories/impl/in-memory-user-repository";
import { CreateUserUsecase } from "./create-user";
import {
  InternalServerError,
  UserAlreadyExistsException,
} from "@/domain/exceptions";
import { User } from "@/domain/entities/user";

describe("Usecase: CreateUser", () => {
  it("creates a user", async () => {
    const userRepository = new InMemoryUserRepository();
    const createUser = new CreateUserUsecase(userRepository);
    await createUser.execute({
      name: "John Doe",
      username: "john.doe",
      password: "password",
      pictureUrl: "https://example.com/picture.jpg",
    });

    const user = await userRepository.findByUsername("john.doe");

    expect(user).toMatchObject({
      name: "John Doe",
      username: "john.doe",
      password: "password",
      pictureUrl: "https://example.com/picture.jpg",
    });
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeDefined();
  });

  it("throws an error if the user already exists", async () => {
    const userRepository = new InMemoryUserRepository();
    const createUser = new CreateUserUsecase(userRepository);

    const user = new User({
      name: "John Doe",
      username: "john.doe",
      password: "password",
      pictureUrl: "https://example.com/picture.jpg",
    });

    await userRepository.create(user);

    try {
      await createUser.execute({
        name: "John Doe",
        username: "john.doe",
        password: "password",
        pictureUrl: "https://example.com/picture.jpg",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(UserAlreadyExistsException);
      expect(error.message).toBe("User already exists");
      expect(error.statusCode).toBe(400);
    }
  });

  it("throws an error if repository fails", async () => {
    const userRepository = new InMemoryUserRepository();
    const createUser = new CreateUserUsecase(userRepository);

    vi.spyOn(userRepository, "create").mockRejectedValue(new Error());

    try {
      await createUser.execute({
        name: "John Doe",
        username: "john.doe",
        password: "password",
        pictureUrl: "https://example.com/picture.jpg",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError);
      expect(error.message).toBe("Failed to create user");
      expect(error.statusCode).toBe(500);
    }
  });
});
