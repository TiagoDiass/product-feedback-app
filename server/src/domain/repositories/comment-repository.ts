import { Comment } from "@/domain/entities";

export interface CommentRepository {
  create(comment: Comment): Promise<void>;
  findById(id: string): Promise<Comment | null>;
}
