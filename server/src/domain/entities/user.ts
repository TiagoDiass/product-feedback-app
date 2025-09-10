import { randomUUID } from "node:crypto";

export class User {
  id: string;
  name: string;
  username: string;
  password: string;
  pictureUrl: string;
  createdAt: string;

  constructor(
    name: string,
    username: string,
    password: string,
    pictureUrl: string,
    createdAt?: string,
    id?: string
  ) {
    this.id = id ?? randomUUID();
    this.name = name;
    this.username = username;
    this.password = password; // TODO: hash password later
    this.pictureUrl = pictureUrl;
    this.createdAt = createdAt ?? new Date().toISOString();
  }
}
