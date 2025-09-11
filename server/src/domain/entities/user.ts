import { randomUUID } from "node:crypto";

export type CreateUserParams = {
  name: string;
  username: string;
  password: string;
  pictureUrl: string | null;
  createdAt?: string;
  id?: string;
};

export class User {
  id: string;
  name: string;
  username: string;
  password: string;
  pictureUrl: string | null = null;
  createdAt: string;

  constructor({
    name,
    username,
    password,
    pictureUrl,
    createdAt,
    id,
  }: CreateUserParams) {
    this.id = id ?? randomUUID();
    this.name = name;
    this.username = username;
    this.password = password; // TODO: hash password later
    this.pictureUrl = pictureUrl;
    this.createdAt = createdAt ?? new Date().toISOString();
  }
}
