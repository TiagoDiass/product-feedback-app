import { CommentRepository } from "../comment-repository";
import { Comment } from "@/domain/entities";

export class InMemoryCommentRepository implements CommentRepository {
  private comments: Map<string, Comment> = new Map();

  async create(comment: Comment): Promise<void> {
    this.comments.set(comment.id, comment);
  }

  async findById(id: string): Promise<Comment | null> {
    return this.comments.get(id) ?? null;
  }
}
