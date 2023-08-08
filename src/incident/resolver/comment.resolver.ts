import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import UserLoader from 'src/user/loader/user.loader';
import { Comment as CommentEntity } from '../entity/comment.entity';
import { CommentService } from '../service/comment.service';
import { CreateCommentInput, Pagination } from 'src/schema/graphql.schema';

@Resolver('Comment')
export class CommentResolver {
  constructor(
    @Inject(CommentService)
    private readonly commentService: CommentService,
    @Inject(UserLoader)
    private readonly userLoader: UserLoader,
  ) {}

  @Query()
  getCommentsForIncident(
    @Args('incidentId') incidnetId: string,
    @Args('pagination') pagination: Pagination,
  ): Promise<CommentEntity[]> {
    return this.commentService.getCommentsByIncidentId(incidnetId, pagination);
  }

  @Mutation()
  createComment(
    @Args('input') commentInput: CreateCommentInput,
  ): Promise<CommentEntity> {
    return this.commentService.createComment(
      '2fc6cb8f-0a91-4d51-864a-aac61b2bd25b',
      '992a74e5-a01d-4a5a-8ba7-007bd12ebb04',
      commentInput,
    );
  }

  @ResolveField()
  async user(@Parent() comment: CommentEntity) {
    return this.userLoader.getUsersLoader().load(comment.userId);
  }
}
