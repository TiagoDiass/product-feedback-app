import { ApplicationError } from "./application-error";

export class UserNotFoundException extends ApplicationError {
  constructor() {
    super("User not found", 404);
    this.name = "UserNotFoundException";
  }
}
