import { ApplicationError } from "./application-error";

export class InternalServerError extends ApplicationError {
  constructor(message: string) {
    super(message, 500);
    this.name = "InternalServerError";
  }
}
