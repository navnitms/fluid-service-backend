import { Inject, Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Comment } from '../entity/comment.entity';
import { CommentService } from '../service/comment.service';

@Injectable({ scope: Scope.REQUEST })
export class IncidentCommentLoader {
  incidentCommentLoader: DataLoader<string, Comment[]>;
  constructor(
    @Inject(CommentService)
    private readonly incidentCommentService: CommentService,
  ) {
    this.incidentCommentLoader = new DataLoader<string, Comment[]>(
      this.getIncidentCommentsByIncidentIds,
    );
  }

  getIncidentCommentsByIncidentIds = async (incidentIds: readonly string[]) => {
    const incidentComments =
      await this.incidentCommentService.getCommentsByIncidentIds([
        ...incidentIds,
      ]);

    const incidentCommentsMap: { [key: string]: Comment[] } = {};

    incidentComments.forEach((incidentComment) => {
      if (!incidentCommentsMap[incidentComment.incidentId]) {
        incidentCommentsMap[incidentComment.incidentId] = [];
      }
      incidentCommentsMap[incidentComment.incidentId].push(incidentComment);
    });
    const response: Comment[][] = incidentIds.map(
      (incidentId) => incidentCommentsMap[incidentId],
    );
    return response;
  };
  public getIncidentCommentLoader(): DataLoader<string, Comment[]> {
    return this.incidentCommentLoader;
  }
}
