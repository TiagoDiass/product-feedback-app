import { Comment } from "@/domain/entities/comment";

export interface CommentRepository {
  create(comment: Comment): Promise<void>;
  findById(id: string): Promise<Comment | null>;
}
