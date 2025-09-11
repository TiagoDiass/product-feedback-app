import { ApplicationError } from "./application-error";

export class UpvoteAlreadyExistsException extends ApplicationError {
  constructor(message: string = "Upvote already exists") {
    super(message, 400);
    this.name = "UpvoteAlreadyExistsException";
  }
}
