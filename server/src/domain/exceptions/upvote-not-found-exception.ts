import { ApplicationError } from "./application-error";

export class UpvoteNotFoundException extends ApplicationError {
  constructor(message: string = "Upvote not found") {
    super(message, 404);
    this.name = "UpvoteNotFoundException";
  }
}
