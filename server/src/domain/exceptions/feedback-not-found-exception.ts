import { ApplicationError } from "./application-error";

export class FeedbackNotFoundException extends ApplicationError {
  constructor(message: string = "Feedback not found") {
    super(message, 404);
    this.name = "FeedbackNotFoundException";
  }
}
