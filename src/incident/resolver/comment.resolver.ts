import { Inject } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import UserLoader from 'src/user/loader/user.loader';
import { Comment as CommentEntity } from '../entity/comment.entity';

@Resolver('Comment')
export class IncidentLogResolver {
  constructor(
    @Inject(UserLoader)
    private readonly userLoader: UserLoader,
  ) {}

  @ResolveField()
  async user(@Parent() comment: CommentEntity) {
    return this.userLoader.getUsersLoader().load(comment.userId);
  }
}
