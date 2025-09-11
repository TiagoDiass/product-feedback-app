import { ApplicationError } from "./application-error";

export class UpvoteNotFoundException extends ApplicationError {
  constructor() {
    super("Upvote not found", 404);
    this.name = "UpvoteNotFoundException";
  }
}
