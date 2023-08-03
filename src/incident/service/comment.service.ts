import { Injectable, Logger } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { Comment } from '../entity/comment.entity';

@Injectable()
export class CommentService {
  private logger: Logger = new Logger(CommentService.name);

  constructor(private readonly dataSource: DataSource) {}

  async getCommentsByIncidentId(ids: string[]): Promise<Comment[]> {
    return this.dataSource.getRepository(Comment).find({
      where: { incidentId: In(ids) },
    });
  }
}
