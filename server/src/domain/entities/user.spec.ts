import { User } from "./user";

describe("Entity: User", () => {
  it("creates a user with all properties", () => {
    const user = new User({
      name: "John Doe",
      username: "john.doe",
      password: "password",
      pictureUrl: "https://example.com/picture.jpg",
      createdAt: "2021-01-01T00:00:00.000Z",
      id: "fake-uuid",
    });

    expect(user).toEqual({
      id: "fake-uuid",
      name: "John Doe",
      username: "john.doe",
      password: "password",
      pictureUrl: "https://example.com/picture.jpg",
      createdAt: "2021-01-01T00:00:00.000Z",
    });
  });

  it("creates a user with default values if not provided", () => {
    const user = new User({
      name: "John Doe",
      username: "john.doe",
      password: "password",
      pictureUrl: "https://example.com/picture.jpg",
    });

    expect(user).toEqual({
      id: expect.any(String),
      name: "John Doe",
      username: "john.doe",
      password: "password",
      pictureUrl: "https://example.com/picture.jpg",
      createdAt: expect.any(String),
    });
  });
});
