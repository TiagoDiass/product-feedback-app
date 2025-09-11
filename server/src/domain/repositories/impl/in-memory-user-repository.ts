import { UserRepository } from "../user-repository";
import { User } from "../../entities/user";

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async create(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByUsername(username: string): Promise<User | null> {
    return (
      Array.from(this.users.values()).find(
        (user) => user.username === username
      ) ?? null
    );
  }
}
