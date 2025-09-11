import { ApplicationError } from "./application-error";

export class UserNotFoundException extends ApplicationError {
  constructor(message: string = "User not found") {
    super(message, 404);
    this.name = "UserNotFoundException";
  }
}
