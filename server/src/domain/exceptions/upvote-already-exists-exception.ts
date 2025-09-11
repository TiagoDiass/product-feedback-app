import { ApplicationError } from "./application-error";

export class UpvoteAlreadyExistsException extends ApplicationError {
  constructor() {
    super("User has already upvoted this feedback", 400);
    this.name = "UpvoteAlreadyExistsException";
  }
}
