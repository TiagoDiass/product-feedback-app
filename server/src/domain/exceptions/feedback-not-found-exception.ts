import { ApplicationError } from "./application-error";

export class FeedbackNotFoundException extends ApplicationError {
  constructor() {
    super("Feedback not found", 404);
    this.name = "FeedbackNotFoundException";
  }
}
