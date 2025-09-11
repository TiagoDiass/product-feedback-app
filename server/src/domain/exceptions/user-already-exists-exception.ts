import { ApplicationError } from "./application-error";

export class UserAlreadyExistsException extends ApplicationError {
  constructor() {
    super("User already exists", 400);
    this.name = "UserAlreadyExistsException";
  }
}
