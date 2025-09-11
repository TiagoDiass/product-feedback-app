import { ApplicationError } from "./application-error";

export class CommentNotFoundException extends ApplicationError {
  constructor(message: string = "Comment not found") {
    super(message, 404);
    this.name = "CommentNotFoundException";
  }
}
