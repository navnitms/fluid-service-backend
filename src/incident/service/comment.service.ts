import { Injectable, Logger } from '@nestjs/common';
import { DataSource, DeepPartial, In } from 'typeorm';
import { Comment } from '../entity/comment.entity';
import { CreateCommentInput, Pagination } from 'src/schema/graphql.schema';
import { v4 } from 'uuid';

@Injectable()
export class CommentService {
  private logger: Logger = new Logger(CommentService.name);

  constructor(private readonly dataSource: DataSource) {}

  async getCommentsByIncidentIds(ids: string[]): Promise<Comment[]> {
    return this.dataSource.getRepository(Comment).find({
      where: { incidentId: In(ids) },
    });
  }

  public async createComment(
    tenantId: string,
    userId: string,
    commentInput: CreateCommentInput,
  ): Promise<Comment> {
    const comment: DeepPartial<Comment> = {
      id: v4(),
      text: commentInput.text,
      incidentId: commentInput.incidentId,
      tenantId,
      userId,
    };
    const savedComment = await this.dataSource
      .getRepository(Comment)
      .save(comment);
    return savedComment;
  }

  async getCommentsByIncidentId(
    incidentId: string,
    pagination?: Pagination,
  ): Promise<Comment[]> {
    const query = this.dataSource
      .getRepository(Comment)
      .createQueryBuilder()
      .where('Comment.incidentId = :incidentId', { incidentId });
    if (pagination && pagination.offset) {
      query.offset(pagination.offset);
    }
    if (pagination && pagination.limit) {
      query.limit(pagination.limit);
    }
    return query.getMany();
  }
}
